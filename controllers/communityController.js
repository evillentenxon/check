const { CommunityModel } = require('../models/myModel');

exports.communityCreate = async (req, res) => {
    try {
      const { cn, description, location } = req.body;

      const community = new CommunityModel({
        cn,
        description,
        location
      });
  
      // Save the document to the database
      await community.save();
      res.status(201).json({message: 'new community has been created'});
      console.log("Community saved successfully");
    } catch (error) {
    console.error('Error creating community:', error);
      res.status(500).json({ message: 'Failed to create community', error });
    }
  };