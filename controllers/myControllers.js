const { UserModel } = require('../models/myModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpStore = {}; // Store OTPs temporarily

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'romangautam71399@gmail.com',
    pass: 'xeqe ckow vyyr jzal'
  }
});

exports.postData = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Create a new user document
    const user = new UserModel({
      username,
      email
    });

    // Save the document to the database
    await user.save();
    res.status(201).json({ message: 'User saved successfully', user });
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
    res.json({ message: 'OTP verified successfully'});
    delete otpStore[email];  // Optionally remove OTP after verification
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
}