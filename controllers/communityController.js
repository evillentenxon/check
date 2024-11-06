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

exports.topCommunities= async(req,res)=>{
  try {
    // Fetch all communities from the database
    const communities = await CommunityModel.find();
    
    // Respond with the retrieved communities
    res.status(200).json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Failed to retrieve communities', error });
  }
}

// commController.js
exports.communityDetails = async (req, res) => {
  try {
    const { communityId } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(communityId)) {
    //   return res.status(400).json({ error: 'Invalid community ID format' });
    // }

    const community = await CommunityModel.findById(communityId);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json({ data: community });
  } catch (error) {
    console.error('Error fetching community details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
