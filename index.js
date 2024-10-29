const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postDataRoutes = require('./routes/myRoutes');

const app = express();
app.use(express.json()); // For parsing application/json
app.use(cors());

// Connect to MongoDB directly without dotenv
mongoose.connect("mongodb+srv://romangautam71399:BouRRJ6oe8VedNjq@cluster1.9zper.mongodb.net/gamingorbit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));



// Use routes defined in postData.js
app.use('/postData', postDataRoutes);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
