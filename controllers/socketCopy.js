const http = require('http');
const { spawn } = require('child_process');
const { Server: SocketIO } = require('socket.io');

// Create the HTTP server
const server = http.createServer();

// Create a Socket.IO instance
const io = new SocketIO(server);

// FFmpeg command options
const ffmpegOptions = [
  '-f', 'webm',
'-loglevel', 'verbose',
'-i', '-',
'-c:v', 'libx264',
'-preset', 'medium',         // Balanced preset for CPU usage
'-tune', 'zerolatency',
'-r', '24',                  // Lower frame rate to reduce resource load
'-g', '50',
'-vsync', '0',
'-copyts',
'-bufsize', '1000k',         // Buffer size increased for stability
'-crf', '25',                // Balance quality and bitrate
'-pix_fmt', 'yuv420p',
'-sc_threshold', '0',
'-profile:v', 'main',
'-level', '3.1',
'-c:a', 'aac',
'-b:a', '128k',
'-ar', '32000',
'-f', 'flv',
'rtmp://a.rtmp.youtube.com/live2/m24g-mzq8-651w-tt78-0bvu'
];

// Spawn FFmpeg process
const ffmpegProcess = spawn('ffmpeg', ffmpegOptions);

// Handle FFmpeg stdout and stderr
ffmpegProcess.stdout.on('data', (data) => {
  console.log(`FFmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on('data', (data) => {
  console.error(`FFmpeg stderr: ${data}`);
});

// Log FFmpeg process exit
ffmpegProcess.on('close', (code) => {
  console.log(`FFmpeg process exited with code ${code}`);
});

// Handle FFmpeg errors
ffmpegProcess.on('error', (err) => {
  console.error('FFmpeg process error:', err);
});

// Socket.IO handling
let bufferQueue = [];

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('binarystream', (chunk) => {
    try {
      // Accumulate binary chunks
      bufferQueue.push(chunk);

      // Write to FFmpeg when buffer reaches threshold
      if (bufferQueue.length > 5) {
        const buffer = Buffer.concat(bufferQueue);
        bufferQueue = []; // Clear the buffer

        // Write to FFmpeg stdin
        if (!ffmpegProcess.stdin.destroyed) {
          ffmpegProcess.stdin.write(buffer, (err) => {
            if (err) {
              console.error('Error writing to FFmpeg stdin:', err);
            }
          });
        } else {
          console.warn('FFmpeg stdin already destroyed, skipping write');
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

// Handle server shutdown gracefully
const shutdown = () => {
  console.log('Shutting down server...');
  if (!ffmpegProcess.killed) {
    ffmpegProcess.stdin.end(); // Signal FFmpeg to stop
    ffmpegProcess.kill('SIGTERM'); // Kill FFmpeg process
  }
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};  

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = { server, io };
