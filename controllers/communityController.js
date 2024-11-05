const { CommunityModel } = require('../models/myModel');

exports.communityCreate = async (req, res) => {
  try {
    const { cn, description, location, gameList, privacy } = req.body;
    const photoPath = req.file ? req.file.path : null; // Get the file path from the uploaded file

    const community = new CommunityModel({
      cn,
      description,
      location,
      gameList,
      privacy,
      photo: photoPath // Store the path of the uploaded photo
    });

    // Save the document to the database
    await community.save();
    res.status(201).json({ message: 'new community has been created' });
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ message: 'Failed to create community', error });
  }
};