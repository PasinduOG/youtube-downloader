const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const youtube = require('youtube-dl-og');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;

const DOWNLOADS_DIR = path.join(__dirname, 'downloads');

if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
    console.log(`Created downloads directory: ${DOWNLOADS_DIR}`);
}

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/downloads', express.static(DOWNLOADS_DIR));

app.get('/api/video-info', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!youtube.isValidYoutubeUrl(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const videoInfo = await youtube.getVideoInfo(url);
        res.json(videoInfo);
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ error: error.message || 'Failed to get video information' });
    }
});

app.post('/api/download', async (req, res) => {
    try {
        const { url, quality, audioOnly, socketId } = req.body;
        const socket = socketId ? io.sockets.sockets.get(socketId) : null;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!youtube.isValidYoutubeUrl(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Get video info to get the title for the filename
        const videoInfo = await youtube.getVideoInfo(url);
        const sanitizedTitle = videoInfo.title.replace(/[^\w\s]/g, '_');

        let outputPath;
        let downloadOptions = {};

        if (audioOnly) {
            // Audio only download
            outputPath = path.join(DOWNLOADS_DIR, `${sanitizedTitle}_audio.mp3`);
            downloadOptions = {
                audioOnly: true,
                output: outputPath
            };
        } else {
            // Video download
            outputPath = path.join(DOWNLOADS_DIR, `${sanitizedTitle}_${quality}.mp4`);
            
            // Set format option based on quality
            let formatOption;
            switch (quality) {
                case 'HIGHEST':
                    formatOption = 'bestvideo+bestaudio/best';
                    break;
                case 'HIGH':
                    formatOption = 'bestvideo[height<=720]+bestaudio/best[height<=720]/best';
                    break;
                case 'MEDIUM':
                    formatOption = 'bestvideo[height<=480]+bestaudio/best[height<=480]/best';
                    break;
                case 'LOW':
                    formatOption = 'bestvideo[height<=360]+bestaudio/best[height<=360]/best';
                    break;
                default:
                    formatOption = 'bestvideo+bestaudio/best';
            }

            downloadOptions = {
                quality: quality,
                format: 'mp4',
                output: outputPath,
                formatOption: formatOption
            };
        }

        // Add progress callback for WebSocket updates
        downloadOptions.onProgress = (progress) => {
            if (socket) {
                socket.emit('download_progress', {
                    percent: progress.percent,
                    transferred: progress.transferred,
                    total: progress.total,
                    speed: progress.speed
                });
            }
        };

        // Start the download process
        const result = await youtube.downloadVideo(url, downloadOptions);

        // Send the download result
        res.json({
            success: true,
            filename: path.basename(result.filePath),
            title: result.title,
            downloadUrl: `/downloads/${path.basename(result.filePath)}`
        });
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({ error: error.message || 'Failed to download video' });
    }
});

app.get('/api/files', (req, res) => {
    try {
        if (!fs.existsSync(DOWNLOADS_DIR)) {
            return res.json({ files: [] });
        }
        
        const files = fs.readdirSync(DOWNLOADS_DIR)
            .filter(file => !file.startsWith('.'))
            .map(file => {
                const filePath = path.join(DOWNLOADS_DIR, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    path: `/downloads/${file}`,
                    size: stats.size,
                    createdAt: stats.birthtime
                };
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
        res.json({ files });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ error: error.message || 'Failed to list files' });
    }
});

app.delete('/api/files/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        
        // Security check to ensure we're only deleting from downloads directory
        const filePath = path.join(DOWNLOADS_DIR, filename);
        const normalizedDownloadsDir = path.normalize(DOWNLOADS_DIR);
        const normalizedFilePath = path.normalize(filePath);
        
        if (!normalizedFilePath.startsWith(normalizedDownloadsDir)) {
            return res.status(400).json({ error: 'Invalid file path' });
        }
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        fs.unlinkSync(filePath);
        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: error.message || 'Failed to delete file' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});