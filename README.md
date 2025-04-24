# 🎬 YouTube Video Downloader 🎵

> 📥 A vibrant web application that allows you to download YouTube videos and audio in various formats and qualities.

<div align="center">
  
[![My Skills](https://skillicons.dev/icons?i=nodejs,express,bootstrap,js)](https://skillicons.dev)

</div>

## ✨ Features

- 🎥 Download YouTube videos in various qualities (360p, 480p, 720p, or highest available)
- 🎵 Extract audio from YouTube videos as MP3
- 📊 Real-time download progress tracking
- 📋 View detailed video information before downloading
- 📁 Manage downloaded files directly in the application
- 🎨 Clean and responsive user interface
- 🚀 Fast and efficient downloading process
- 🔒 Simple and secure local storage of files

## 🛠️ Technologies Used

<div align="center">

### 🖥️ Frontend
  
[![My Skills](https://skillicons.dev/icons?i=html,css,js,bootstrap)](https://skillicons.dev)

### ⚙️ Backend
  
[![My Skills](https://skillicons.dev/icons?i=nodejs,express)](https://skillicons.dev)

### 🔌 Real-time Communication
  
[![My Skills](https://skillicons.dev/icons?i=socketio)](https://skillicons.dev)

### 📹 Video Processing
  
[![My Skills](https://skillicons.dev/icons?i=nodejs,npm)](https://skillicons.dev)
- youtube-dl-og

</div>

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- <img src="https://skillicons.dev/icons?i=nodejs" width="20" height="20" /> [Node.js](https://nodejs.org/) (v14 or higher)
- <img src="https://skillicons.dev/icons?i=npm" width="20" height="20" /> npm (comes with Node.js)

## 📥 Installation

1. 📂 Clone the repository:
   ```bash
   git clone https://github.com/PasinduOG/youtube-downloader.git
   cd youtube-downloader
   ```

2. 📦 Install dependencies:
   ```bash
   npm install
   ```

3. 🚀 Start the server:
   ```bash
   npm start
   ```

4. 🌐 Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## 🎮 Usage

1. 📋 Paste a YouTube video URL into the input field
2. 🔍 Click "Download" to fetch video details
3. ⚙️ Select your preferred download options:
   - For video: Choose quality (Highest, High, Medium, Low)
   - For audio: Select the Audio tab
4. 📥 Click "Download" button
5. ⏳ Monitor download progress with the progress bar
6. 📁 Access downloaded files in the "Downloaded Files" section

## 💻 Development

To start the server in development mode with automatic restarts:

```bash
npm run dev
```

## 🗂️ Project Structure

```
youtube-downloader/
├── downloads/        # 📂 Downloaded videos and audio
├── public/           # 🌐 Frontend files
│   ├── js/           # 📜 JavaScript files
│   │   └── app.js    # 🧠 Main frontend logic
│   └── index.html    # 📄 Main HTML file
├── server.js         # ⚙️ Express server and API endpoints
└── package.json      # 📦 Project configuration and dependencies
```

## 🔌 API Endpoints

- 🔍 `GET /api/video-info?url=YOUTUBE_URL` - Get video information
- 📥 `POST /api/download` - Download video or audio
- 📋 `GET /api/files` - List downloaded files
- 🗑️ `DELETE /api/files/:filename` - Delete a file

## 🔄 Recent Updates

### Version 3.0.0 (April 2025)
- 🚀 Significantly improved download speed with optimized processing
- 🔒 Enhanced security with path normalization and validation
- 🎨 Redesigned user interface with improved dark mode support
- 📱 Added new responsive design for better mobile experience
- ✨ Added "Download Another Video" button for better UX
- 🛠️ Updated all dependencies to the latest versions
- 🔄 Improved file management with better error handling
- 🌐 Added social media integration with Facebook link

### Version 2.0.0 (February 2024)
- ✨ Added dark mode support with system preference detection
- 🚀 Improved download speed and reliability
- 🔧 Enhanced error handling and user feedback
- 📱 Better mobile responsiveness
- 🛠️ Updated dependencies to latest versions

### Version 1.5.0 (December 2023)
- ⚡ Implemented Socket.io for real-time download progress
- 🎨 Redesigned user interface with Bootstrap 5
- 📊 Added detailed progress tracking with percentage and speed
- 🔍 Improved video info display with more details

### Version 1.0.0 (October 2023)
- 🎬 Initial release with basic download functionality
- 🎵 Support for video and audio downloads
- 📁 File management system

## 📜 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ by Pasindu Madhuwantha (Pasindu OG)

<div align="center">
  
[![My Skills](https://skillicons.dev/icons?i=github)](https://github.com/PasinduOG)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@pasindu_og_dev)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/pasindu.og.dev)

</div>

## 🙏 Acknowledgments

<div align="center">
  
[![My Skills](https://skillicons.dev/icons?i=nodejs,bootstrap)](https://skillicons.dev)

</div>

- 🎬 This project uses [youtube-dl-og](https://www.npmjs.com/package/youtube-dl-og) for YouTube video processing
- 🎨 UI designed with [Bootstrap 5](https://getbootstrap.com/)
- 🔣 Icons by [Bootstrap Icons](https://icons.getbootstrap.com/)
- 🔔 Notifications by [SweetAlert2](https://sweetalert2.github.io/)

<div align="center">
  
### 🌟 Star this repository if you find it useful! 🌟

</div>
```
