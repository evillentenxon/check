const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const { Server: SocketIO } = require('socket.io');
const postDataRoutes = require('./routes/myRoutes');
const tournamentRoutes= require('./routes/tournamentRoutes');

const app = express();
const server = http.createServer(app);
// const io = new SocketIO(server);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.resolve('./public')));
app.use('/uploads', express.static(path.resolve('./uploads')));

// MongoDB connection
mongoose
  .connect("mongodb+srv://romangautam71399:DsqyCC1hQMH2biAP@cluster1.9zper.mongodb.net/gamingorbit?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

// Route setup
app.use('/postData', postDataRoutes);
app.use('/tour', tournamentRoutes);

// FFmpeg command options
const ffmpegOptions = [
    '-f', 'webm',              // Specify WebM as the input format
    '-loglevel', 'verbose',    // Enable verbose logging for debugging
    '-i', '-',                 // Input from stdin
    '-c:v', 'libx264',         // Video codec
    '-preset', 'ultrafast',    // Low-latency preset
    '-tune', 'zerolatency',    // For streaming use cases
    '-r', '25',                // Frame rate
    '-g', '50',                // GOP size
    '-keyint_min', '25',       // Minimum GOP size
    '-crf', '25',              // Constant Rate Factor
    '-pix_fmt', 'yuv420p',     // Pixel format
    '-sc_threshold', '0',      // Scene change threshold
    '-profile:v', 'main',      // H.264 profile
    '-level', '3.1',           // H.264 level
    '-c:a', 'aac',             // Audio codec
    '-b:a', '128k',            // Audio bitrate
    '-ar', '32000',            // Audio sample rate
    '-f', 'flv',               // Output format
    '-loglevel', 'debug',      // Debug logging for FFmpeg
    `rtmp://a.rtmp.youtube.com/live2/0pvz-y29h-df7w-1j7h-0yw7` // RTMP URL
];
  
// FFmpeg process
const ffmpegProcess = spawn('ffmpeg', ffmpegOptions);

ffmpegProcess.stdout.on('data', (data) => console.log(`FFmpeg stdout: ${data}`));
ffmpegProcess.stderr.on('data', (data) => console.error(`FFmpeg stderr: ${data}`));
ffmpegProcess.on('close', (code) => console.log(`FFmpeg process exited with code ${code}`));
ffmpegProcess.on('error', (err) => console.error('FFmpeg process error:', err));

const io = new SocketIO(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: ['GET', 'POST'],        // Allowed HTTP methods
        credentials: true,               // Allow cookies or authentication headers
    },
});


// Socket.IO handling
let bufferQueue = [];

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('binarystream', (chunk) => {
        try {
            bufferQueue.push(chunk);
            if (bufferQueue.length > 5) {
                const buffer = Buffer.concat(bufferQueue);
                bufferQueue = [];
                if (!ffmpegProcess.stdin.destroyed) {
                    ffmpegProcess.stdin.write(buffer, (err) => {
                        if (err) console.error('Error writing to FFmpeg stdin:', err);
                    });
                } else {
                    console.warn('FFmpeg stdin destroyed, skipping write');
                }
            }
        } catch (err) {
            console.error('Error processing binary stream:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down server...');
    if (!ffmpegProcess.killed) {
        ffmpegProcess.stdin.end();
        ffmpegProcess.kill('SIGTERM');
    }
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
