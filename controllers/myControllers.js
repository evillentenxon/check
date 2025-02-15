const { UserModel } = require('../models/myModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpStore = {}; // Store OTPs temporarily
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

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

  try {
    // Check if email already exists in the database
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in memory with email as key
    otpStore[email] = otp;

    // Send OTP email
    await transporter.sendMail({
      from: 'romangautam71399@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in otpSend controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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
      res.status(200).json({ message: 'Login successful', username: user.username, photo: user.photo, userId: user._id, email: user.email });
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


// Check Email & Send Reset Link
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '2m' });
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 120 * 1000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    //gmail transporter is defined at the top of the file
    await transporter.sendMail({
      from: 'romangautam71399@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 minute.</p>`,
    });

    res.status(200).json({ message: 'Reset link sent successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }
};

//verify token and reset password 
exports.passwordReset = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    console.log(req.body);

    // Check if all fields are provided
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Check if token matches
    if (user.resetToken !== token) {
      return res.status(400).json({ message: 'Invalid token', success: false });
    }

    // Check if token has expired (optional, if you store token expiry time)
    if (user.tokenExpiry && user.tokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Token expired', success: false });
    }

    // Update user password and clear token fields
    user.password = newPassword;
    user.resetToken = undefined; // Clear token after successful password reset
    user.tokenExpiry = undefined; // Optional, clear token expiry as well

    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
