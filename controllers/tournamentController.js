const Tournament = require("../models/tournamentDb");

// Check if Tournament Name is Already Taken
const checkTournamentName = async (req, res) => {
  try {
    const { tournamentName } = req.body;

    // Validate input
    if (!tournamentName) {
      return res.status(400).json({ message: "Tournament name is required." });
    }

    // Check for existing tournament name
    const existingName = await Tournament.findOne({ tournamentName });
    if (existingName) {
      return res.status(200).json({ success: false, message: "Tournament name is already taken." });
    }

    res.status(200).json({ success: true, message: "Tournament name is available." });
  } catch (error) {
    console.error("Error checking tournament name:", error);
    res.status(500).json({ success: false, message: "Failed to check tournament name." });
  }
};

const createTournament = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { tournamentName, tournamentUrl, startDate, game, region, status } = req.body;

    console.log("Received game value:", game);

    // Validate required fields
    if (!tournamentName || !tournamentUrl || !startDate || !game || !region || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const allowedGames = [
        "PUBG",
        "FREEFIRE",
        "FORTNITE",
        "COD",
        "CLASH ROYALE",
        "COUNTER-STRIKE 2",
        "CYBERPUNK 2077",
        "GTA SAN ANDRES",
        "POKEMON GO",
        "COC",
     ];
    
    if (!allowedGames.includes(game)) {
      return res.status(400).json({
        message: `Invalid game selected. Allowed games are: ${allowedGames.join(", ")}.`,
      });
    }
    

    // Check for duplicate tournament name
    const existingName = await Tournament.findOne({ tournamentName });
    if (existingName) {
      return res.status(400).json({ message: "Tournament name is already taken." });
    }

    // Check for duplicate tournament URL
    const existingTournament = await Tournament.findOne({ tournamentUrl });
    if (existingTournament) {
      return res.status(400).json({ message: "Tournament URL must be unique." });
    }

    // Create a new tournament instance
    const tournament = new Tournament({
      tournamentName,
      tournamentUrl,
      startDate: new Date(startDate),
      game,
      region,
      status,
    });

    // Save tournament to MongoDB
    const savedTournament = await tournament.save();
    console.log("Saved Tournament:", savedTournament);

    res.status(201).json({
      message: "Tournament created successfully!",
      data: savedTournament,
    });
  } catch (error) {
    console.error("Error in createTournament:", error);

    // Handle specific errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", details: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate tournament URL." });
    }

    res.status(500).json({
      message: "Failed to create tournament.",
      error: error.message,
    });
  }
};

//find the latest tournament
const tourData = async (req, res) => {
  try {
    // Fetch the last tournament (sorted by _id in descending order)
    const tournament = await Tournament.findOne().sort({ _id: -1 }); // Sort by _id in descending order and fetch the first one
    
    if (!tournament) {
      return res.status(404).json({ message: "No tournament found" });
    }
    
    res.json(tournament); // Return the last tournament in JSON format
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    res.status(500).json({ message: "Error fetching tournaments" });
  }
};

//find all tournaments
const allTourData = async (req, res) => {
  try {
    // Fetch all tournaments
    const tournaments = await Tournament.find();

    if (!tournaments || tournaments.length === 0) {
      return res.status(404).json({ message: "No tournaments found" });
    }

    res.json(tournaments); // Return all tournaments in JSON format
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    res.status(500).json({ message: "Error fetching tournaments" });
  }
};



//find tournament by ID
const findTournament = async (req, res) => {
  const tournamentId = req.params.tournamentId; // Extract ID from request parameter
  try {
    // Find the tournament by ID in the database
    const tournament = await Tournament.findById(tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Send the tournament data back as response
    res.json({ tournament });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//update tournament
const updateTournament = async (req, res) => {
  const tournamentId = req.params.tournamentId;  // Extract tournament ID from the URL
  const { tournamentName, tournamentUrl, startDate, game, region, status } = req.body; // Get the data from the request body

  try {
    // Find the tournament by ID and update it
    const updatedTournament = await Tournament.findByIdAndUpdate(
      tournamentId, 
      {
        tournamentName, 
        tournamentUrl, 
        startDate, 
        game, 
        region, 
        status
      }, 
      { new: true }  // This option returns the updated document instead of the original
    );

    if (!updatedTournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.status(200).json({ tournament: updatedTournament }); // Send back the updated tournament
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating tournament' });
  }
};

//add participant
const addParticipants= async (req, res) => {
  const { id } = req.params;
  const { userId, username } = req.body;

  // Validate request body
  if (!userId || !username) {
      return res.status(400).json({ message: 'userId and username are required.' });
  }

  try {
      // Find the tournament by ID
      const tournament = await Tournament.findById(id);

      if (!tournament) {
          return res.status(404).json({ message: 'Tournament not found.' });
      }

      // Check if the user is already a participant
      const isAlreadyParticipant = tournament.participants.some(
          (participant) => participant.userId.toString() === userId
      );

      if (isAlreadyParticipant) {
          return res.status(400).json({ message: 'User is already a participant.' });
      }

      // Add participant to the tournament
      tournament.participants.push({ userId, username });

      // Save the updated tournament
      await tournament.save();

      res.status(200).json({
          message: 'Participant added successfully.',
          tournament,
      });
  } catch (error) {
      console.error('Error adding participant:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
};

// API to fetch participants 
const fetchParticipants = async (req, res) => {
  const tournamentId = req.params.id; // Extract tournament ID from URL
  // const {tournamentId}= req.body;

  try {
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Return the list of participants as-is, without joining with the Users collection
    res.status(200).json({
      message: 'Participants fetched successfully',
      participants: tournament.participants,
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports= {
  checkTournamentName,
  createTournament,
  tourData,
  allTourData,
  findTournament,
  updateTournament,
  addParticipants,
  fetchParticipants,
};
