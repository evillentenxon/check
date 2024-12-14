const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postDataRoutes = require('./routes/myRoutes');
const path = require('path');
const { server } = require('./controllers/socket'); // Import the HTTP server from socket.js

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://romangautam71399:BouRRJ6oe8VedNjq@cluster1.9zper.mongodb.net/gamingorbit", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

// Use routes defined in postData.js
app.use('/postData', postDataRoutes);

// Attach Express app to the HTTP server
server.on('request', app);

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
