const { UserModel } = require('../models/myModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpStore = {}; // Store OTPs temporarily
const multer = require('multer');
const path = require('path');
const axios = require('axios');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'romangautam71399@gmail.com',
    pass: 'fyui omda qdcb azlp'
  }
});

exports.postData = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const photoPath = req.file ? req.file.path : null; // Get the file path from the uploaded file

    // Create a new user document with photo path
    const user = new UserModel({
      email,
      username,
      password,
      photo: photoPath  // Store the path of the photo
    });

    // Save the document to the database
    await user.save();
    res.sendFile('success.html', { root: 'public' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save user', error });
  }
};

exports.otpSend = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP in memory with email as key
  otpStore[email] = otp;

  // Send OTP email
  try {
    await transporter.sendMail({
      from: 'romangautam71399@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    });
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP' });
  }
}

// Endpoint for verifying OTP
exports.otpVerify = async (req, res) => {
  const { email, otp } = req.body;
  // const testOtp= '123456';
  if (otpStore[email] === otp) {
    // if (testOtp === otp) {
    res.json({ message: 'OTP verified successfully' });
    delete otpStore[email];  // Optionally remove OTP after verification
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    // If user not found
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (password == user.password) {
      // Password matches, allow user to log in
      res.status(200).json({ message: 'Login successful', username: user.username, photo: user.photo, userId: user._id });
    } else {
      // Password does not match
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}


//fetch latest news
exports.news = async (req, res) => {
  try {
    // console.log("Making API request to NewsAPI...");

    // Make request to third-party API
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'esports',
        language: 'en',
        sortBy: 'popularity',
        apiKey: 'd3c06d565ea54631898aee2d4fc75e7c',
      },
    });

    res.status(200).json(response.data); // Send the API response to the client
  } catch (error) {
    console.error("Error fetching esports news:", error.message);
    console.error("Error Details:", {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
    });

    res.status(500).json({ error: "Failed to fetch esports news." });
  }
};

//fetch all countries of the world
exports.countries = async (req, res) => {
  try {
    // Make request to the external countries API
    const response = await axios.get('https://restcountries.com/v3.1/all');

    // Send the data from the response as the API's response
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    
    // If there's an error, send a failure response
    res.status(500).json({ error: 'Failed to fetch countries.' });
  }
};
