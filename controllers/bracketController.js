const Bracket = require('../models/createBracket');

// Create a new bracket
const createBracket = async (req, res) => {
  try {
    const { bracketType, numTeams, membersPerTeam } = req.body;
    const newBracket = new Bracket({ bracketType, numTeams, membersPerTeam });
    await newBracket.save();
    res.status(201).json({ message: 'Bracket created successfully!', data: newBracket });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bracket', error: error.message });
  }
};

// Get all brackets
const getBrackets = async (req, res) => {
  try {
    const brackets = await Bracket.find();
    res.status(200).json(brackets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brackets', error: error.message });
  }
};

// Delete a bracket
const deleteBracket = async (req, res) => {
  try {
    const { id } = req.params;
    await Bracket.findByIdAndDelete(id);
    res.status(200).json({ message: 'Bracket deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bracket', error: error.message });
  }
};

module.exports = { createBracket, getBrackets, deleteBracket };
