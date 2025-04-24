document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const searchForm = document.getElementById('searchForm');
    const videoUrl = document.getElementById('videoUrl');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const videoDetails = document.getElementById('videoDetails');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const videoUploader = document.getElementById('videoUploader');
    const videoDuration = document.getElementById('videoDuration');
    const videoDescription = document.getElementById('videoDescription');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadStatus = document.getElementById('downloadStatus');
    const filesSection = document.getElementById('filesSection');
    const filesContainer = document.getElementById('filesContainer');
    const filesLoading = document.getElementById('filesLoading');
    const noFilesMessage = document.getElementById('noFilesMessage');
    const refreshFilesBtn = document.getElementById('refreshFilesBtn');
    const downloadProgressContainer = document.getElementById('downloadProgressContainer');
    const downloadProgressBar = document.getElementById('downloadProgressBar');
    const downloadPercentage = document.getElementById('downloadPercentage');
    const themeToggler = document.getElementById('themeToggler');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    const downloaderSection = document.getElementById('downloaderSection');
    const downloadAnotherBtn = document.getElementById('downloadAnotherBtn');

    // Check if download was completed in previous session
    if (localStorage.getItem('downloadComplete')) {
        // Clear the flag
        localStorage.removeItem('downloadComplete');
        
        // Make sure search form is visible and video details are hidden when page reloads
        searchForm.classList.remove('d-none');
        videoDetails.classList.add('d-none');
        videoUrl.value = ''; // Clear the URL input
    }

    // Handle "Download Another Video" button click
    downloadAnotherBtn.addEventListener('click', function() {
        // Show the search form
        searchForm.classList.remove('d-none');
        
        // Hide video details
        videoDetails.classList.add('d-none');
        
        // Clear the URL input
        videoUrl.value = '';
        
        // Hide download status
        downloadStatus.classList.add('d-none');
        
        // Optionally scroll to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Theme management
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.body.classList.add('dark-mode');
            lightIcon.classList.add('d-none');
            darkIcon.classList.remove('d-none');
        } else {
            document.body.classList.remove('dark-mode');
            lightIcon.classList.remove('d-none');
            darkIcon.classList.add('d-none');
        }
    }
    
    function toggleTheme() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            lightIcon.classList.remove('d-none');
            darkIcon.classList.add('d-none');
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            lightIcon.classList.add('d-none');
            darkIcon.classList.remove('d-none');
        }
        
        // Update file icon colors when theme changes
        updateFileIconColors();
    }
    
    // Update all file icons to match the current theme
    function updateFileIconColors() {
        const fileIcons = document.querySelectorAll('.file-icon');
        if (document.body.classList.contains('dark-mode')) {
            fileIcons.forEach(icon => {
                icon.classList.remove('text-dark');
                icon.classList.add('text-light');
            });
        } else {
            fileIcons.forEach(icon => {
                icon.classList.remove('text-light');
                icon.classList.add('text-dark');
            });
        }
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                        lightIcon.classList.add('d-none');
                        darkIcon.classList.remove('d-none');
                    } else {
                        document.body.classList.remove('dark-mode');
                        lightIcon.classList.remove('d-none');
                        darkIcon.classList.add('d-none');
                    }
                }
            });
    }
    
    // Initialize theme on load
    initializeTheme();
    
    // Theme toggle button event
    themeToggler.addEventListener('click', toggleTheme);

    // Socket.io connection
    const socket = io();
    let socketId = null;

    socket.on('connect', () => {
        socketId = socket.id;
        console.log('Connected to WebSocket server, ID:', socketId);
    });

    socket.on('download_progress', (progress) => {
        updateProgressBar(progress);
    });

    // Active tab tracking
    let activeTab = 'video';

    // Initialize downloaded files list
    loadFiles();

    // Handle video search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = videoUrl.value.trim();
        
        if (!url) {
            showAlert('Please enter a YouTube URL', 'danger');
            return;
        }
        
        fetchVideoInfo(url);
    });

    // Handle download button click
    downloadBtn.addEventListener('click', function() {
        const url = videoUrl.value.trim();
        
        if (!url) {
            showAlert('No YouTube URL provided', 'danger');
            return;
        }
        
        downloadVideo(url);
    });

    // Handle refresh files button click
    refreshFilesBtn.addEventListener('click', function() {
        loadFiles();
    });

    // Handle tab switches
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('click', function(e) {
            const targetTab = e.target.getAttribute('data-bs-target').replace('#', '').replace('-options', '');
            activeTab = targetTab;
        });
    });

    // Fetch video information
    async function fetchVideoInfo(url) {
        try {
            // Show loading spinner
            loadingSpinner.classList.remove('d-none');
            videoDetails.classList.add('d-none');
            
            // Fetch video info from API
            const response = await fetch(`/api/video-info?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch video info');
            }
            
            const videoInfo = await response.json();
            
            // Update UI with video details
            videoThumbnail.src = `https://img.youtube.com/vi/${getVideoId(url)}/maxresdefault.jpg`;
            videoTitle.textContent = videoInfo.title;
            videoUploader.textContent = `Uploaded by ${videoInfo.author.name}`;
            
            // Format duration
            const duration = parseInt(videoInfo.lengthSeconds);
            videoDuration.textContent = formatDuration(duration);
            
            // Set description (truncate if too long)
            const description = videoInfo.description || 'No description available';
            videoDescription.textContent = description.length > 500 ? description.substring(0, 500) + '...' : description;
            
            // Hide loading spinner and show video details
            loadingSpinner.classList.add('d-none');
            videoDetails.classList.remove('d-none');
            
            // The downloader section now contains the video details, so we don't need to hide it
            // Instead, hide the search form to make a cleaner interface
            searchForm.classList.add('d-none');
            
        } catch (error) {
            loadingSpinner.classList.add('d-none');
            showAlert(`Error: ${error.message}`, 'danger');
        }
    }

    // Download video
    async function downloadVideo(url) {
        try {
            // Get selected quality
            let quality = 'HIGHEST';
            let audioOnly = false;
            
            if (activeTab === 'video') {
                const qualityRadios = document.getElementsByName('quality');
                for (const radio of qualityRadios) {
                    if (radio.checked) {
                        quality = radio.value;
                        break;
                    }
                }
            } else if (activeTab === 'audio') {
                audioOnly = true;
            }
            
            // Show download status and reset progress bar
            downloadStatus.textContent = 'Downloading... ';
            downloadStatus.classList.remove('d-none', 'bg-success');
            downloadStatus.classList.add('bg-danger');
            
            // Add spinner to download status
            const statusSpinner = document.createElement('span');
            statusSpinner.className = 'spinner-grow spinner-grow-sm ms-1';
            statusSpinner.setAttribute('role', 'status');
            statusSpinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
            downloadStatus.appendChild(statusSpinner);
            
            downloadBtn.disabled = true;
            
            // Show progress bar
            downloadProgressContainer.classList.remove('d-none');
            downloadProgressBar.style.width = '0%';
            downloadProgressBar.setAttribute('aria-valuenow', '0');
            downloadPercentage.textContent = '0%';
            
            // Send download request
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url, quality, audioOnly, socketId })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Download failed');
            }
            
            const result = await response.json();
            
            // Show success status and remove spinner
            downloadStatus.textContent = 'Success!';
            downloadStatus.classList.remove('bg-danger');
            downloadStatus.classList.add('bg-success');
            
            // Complete the progress bar
            updateProgressBar(100);
            
            // Reload files list
            loadFiles();
            
            // Set flag that download is complete
            localStorage.setItem('downloadComplete', 'true');
            
            // Re-enable download button, show "Download Another Video" button, and hide progress after delay
            setTimeout(() => {
                downloadBtn.disabled = false;
                downloadProgressContainer.classList.add('d-none');
                
                // Show the "Download Another Video" button
                downloadAnotherBtn.classList.remove('d-none');
                
                // Show alert about successful download
                showAlert('Download completed successfully!', 'success');
            }, 1000);
            
        } catch (error) {
            // Remove spinner from download status in case of error
            downloadStatus.textContent = 'Failed';
            downloadStatus.classList.remove('bg-warning');
            downloadStatus.classList.add('bg-danger');
            downloadBtn.disabled = false;
            downloadProgressContainer.classList.add('d-none');
            showAlert(`Download error: ${error.message}`, 'danger');
        }
    }

    // Load downloaded files
    async function loadFiles() {
        try {
            filesSection.classList.remove('d-none');
            filesLoading.classList.remove('d-none');
            noFilesMessage.classList.add('d-none');
            
            // Clear existing files
            const filesList = filesContainer.querySelectorAll('.file-item');
            filesList.forEach(item => item.remove());
            
            // Fetch files from API
            const response = await fetch('/api/files');
            const data = await response.json();
            
            filesLoading.classList.add('d-none');
            
            if (!data.files || data.files.length === 0) {
                noFilesMessage.classList.remove('d-none');
                return;
            }
            
            // Render files
            data.files.forEach(file => {
                const fileItem = createFileItem(file);
                filesContainer.appendChild(fileItem);
            });
            
        } catch (error) {
            filesLoading.classList.add('d-none');
            showAlert(`Error loading files: ${error.message}`, 'danger');
        }
    }

    // Create file item element
    function createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'col-12 col-md-6 col-lg-4 file-item';
        
        const isVideo = file.name.endsWith('.mp4');
        const isAudio = file.name.endsWith('.mp3');
        
        let fileIcon = 'bi-file-earmark-play';
        if (isVideo) fileIcon = 'bi-film';
        if (isAudio) fileIcon = 'bi-music-note-beamed';
        
        // Add theme-specific icon class
        const iconColorClass = document.body.classList.contains('dark-mode') ? 'text-light' : 'text-dark';
        
        fileItem.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi ${fileIcon} fs-3 me-2 file-icon ${iconColorClass}"></i>
                        <h6 class="mb-0 text-truncate" title="${file.name}">${file.name}</h6>
                    </div>
                    <p class="mb-0 text-muted small">Size: ${formatSize(file.size)}</p>
                    <p class="mb-0 text-muted small">Created: ${formatDate(file.createdAt)}</p>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between">
                    <a href="${file.path}" class="btn btn-sm btn-outline-primary" download>
                        <i class="bi bi-download"></i> Download
                    </a>
                    <button class="btn btn-sm btn-outline-danger delete-file" data-filename="${file.name}">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        
        // Add delete event listener
        fileItem.querySelector('.delete-file').addEventListener('click', function() {
            const filename = this.getAttribute('data-filename');
            deleteFile(filename);
        });
        
        return fileItem;
    }

    // Delete a file
    async function deleteFile(filename) {
        try {
            // Use SweetAlert2 for confirmation
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to delete "${filename}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });
            
            // If user clicked Cancel, stop here
            if (!result.isConfirmed) {
                return;
            }
            
            const response = await fetch(`/api/files/${encodeURIComponent(filename)}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete file');
            }
            
            // Reload files
            loadFiles();
            showAlert(`File "${filename}" deleted successfully`, 'success');
            
        } catch (error) {
            showAlert(`Error deleting file: ${error.message}`, 'danger');
        }
    }

    // Helper Functions
    function getVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    function formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    function showAlert(message, type) {
        // Map standard alert types to SweetAlert2 icons
        const iconMap = {
            'success': 'success',
            'danger': 'error',
            'warning': 'warning',
            'info': 'info'
        };
        
        // Use the mapped icon or question as default
        const icon = iconMap[type] || 'question';
        
        // Show SweetAlert2 notification
        Swal.fire({
            icon: icon,
            title: type.charAt(0).toUpperCase() + type.slice(1),
            text: message,
            timer: 5000,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
        });
    }

    // Update progress bar with download progress
    function updateProgressBar(progress) {
        // Handle both object format from socket and direct percentage number
        let percent = 0;
        
        if (typeof progress === 'object' && progress.percent !== undefined) {
            percent = Math.round(progress.percent);
        } else if (typeof progress === 'number') {
            percent = Math.round(progress);
        }
        
        // Ensure percent is within valid range
        percent = Math.max(0, Math.min(100, percent));
        
        // Update DOM elements
        downloadProgressContainer.classList.remove('d-none');
        downloadProgressBar.style.width = `${percent}%`;
        downloadProgressBar.setAttribute('aria-valuenow', percent);
        downloadPercentage.textContent = `${percent}%`;
    }
});