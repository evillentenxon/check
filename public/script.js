const userVideo = document.getElementById('user-video');
const startCameraButton = document.getElementById('start-camera-btn');
const stopCameraButton = document.getElementById('stop-camera-btn');
const goLiveButton = document.getElementById('go-live-btn');

const state = { media: null }; // To store the media stream
const socket = io(); // Initialize Socket.IO

// Start Camera
startCameraButton.addEventListener('click', async () => {
    try {
        // Request access to the camera and microphone
        const media = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        state.media = media; // Save the media stream to state
        userVideo.srcObject = media; // Display the camera feed in the video element
        console.log('Camera started.');

        // Enable/disable buttons
        stopCameraButton.disabled = false;
        goLiveButton.disabled = false;
        startCameraButton.disabled = true;
    } catch (error) {
        console.error('Error accessing camera: ', error);
    }
});

// Stop Camera
stopCameraButton.addEventListener('click', () => {
    if (state.media) {
        // Stop all tracks to release the camera
        state.media.getTracks().forEach(track => track.stop());
        userVideo.srcObject = null; // Clear the video element
        state.media = null; // Reset the state
        console.log('Camera stopped.');

        // Enable/disable buttons
        stopCameraButton.disabled = true;
        goLiveButton.disabled = true;
        startCameraButton.disabled = false;
    } else {
        console.log('No camera is active.');
    }
});

// Go Live
goLiveButton.addEventListener('click', () => {
    if (state.media) {
        const mediaRecorder = new MediaRecorder(state.media, {
            mimeType: 'video/webm; codecs=vp8,opus', // Force WebM
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000
        });

        // Send binary data to the server
        mediaRecorder.ondataavailable = (ev) => {
            console.log('Binary Stream Available', ev.data);
            socket.emit('binarystream', ev.data);
        };

        mediaRecorder.start(100); // Start recording in 100ms intervals
        console.log('Live streaming started.');
    } else {
        console.log('No camera feed available to stream.');
    }
});
