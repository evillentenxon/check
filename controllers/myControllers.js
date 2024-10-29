const { UserModel } = require('../models/myModel');

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
