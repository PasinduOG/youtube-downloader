# 🎬 YouTube Video Downloader 🎵

> 📥 A vibrant web application that allows you to download YouTube videos and audio in various formats and qualities.

<div align="center">
  
[![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-3C873A?style=for-the-badge&logo=node.js)](https://nodejs.org/en/)
[![Uses Express](https://img.shields.io/badge/Uses-Express.js-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Built with Bootstrap](https://img.shields.io/badge/Built%20with-Bootstrap-7952B3?style=for-the-badge&logo=bootstrap)](https://getbootstrap.com/)
[![Powered by Socket.io](https://img.shields.io/badge/Powered%20by-Socket.io-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

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

- 🖥️ **Frontend**: 
  - ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) HTML5
  - ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) CSS3
  - ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) JavaScript
  - ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white) Bootstrap 5
  
- ⚙️ **Backend**: 
  - ![Node.js](https://img.shields.io/badge/Node.js-3C873A?style=flat&logo=node.js&logoColor=white) Node.js
  - ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) Express.js
  
- 🔌 **Real-time Communication**: 
  - ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white) Socket.io
  
- 📹 **Video Processing**: 
  - youtube-dl-og

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- ![Node.js](https://img.shields.io/badge/Node.js-3C873A?style=flat&logo=node.js&logoColor=white) [Node.js](https://nodejs.org/) (v14 or higher)
- ![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white) npm (comes with Node.js)

## 📥 Installation

1. 📂 Clone the repository:
   ```bash
   git clone https://github.com/yourusername/youtube-downloader.git
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
2. 🔍 Click "Get Info" to fetch video details
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

## 📜 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ by Pasindu Madhuwantha (Pasindu OG)

- ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white) GitHub: [PasinduOG](https://github.com/PasinduOG)
- ![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=white) YouTube: [Pasindu OG](https://youtube.com/@pasindu_og_dev)

## 🙏 Acknowledgments

- 🎬 This project uses [youtube-dl-og](https://www.npmjs.com/package/youtube-dl-og) for YouTube video processing
- 🎨 UI designed with [Bootstrap 5](https://getbootstrap.com/)
- 🔣 Icons by [Bootstrap Icons](https://icons.getbootstrap.com/)
- 🔔 Notifications by [SweetAlert2](https://sweetalert2.github.io/)

<div align="center">
  
### 🌟 Star this repository if you find it useful! 🌟

</div>
