const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  tournamentName: { type: String, required: true, trim: true },
  tournamentUrl: { type: String, required: true, unique: true, trim: true },
  startDate: { type: Date, required: true },
  game: { 
    type: String, 
    required: true, 
    enum: [
      "PUBG", 
      "FREEFIRE", 
      "FORTNITE", 
      "COD", 
      "CLASH ROYALE", 
      "COUNTER-STRIKE 2", 
      "CYBERPUNK 2077", 
      "GTA SAN ANDRES", 
      "POKEMON GO", 
      "COC"
    ] 
  },
  region: { type: String, required: true, trim: true },
  status: { type: String, enum: ["Public", "Private"], required: true },
  participants: [
            {
              userId: { 
                type: mongoose.Schema.Types.ObjectId, // Reference to a user collection
                ref: 'Users', 
                required: true 
              },
              username: { type: String, required: true, trim: true },  
        }],
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;