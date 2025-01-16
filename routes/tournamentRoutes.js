const express = require("express");
const router = express.Router();
const { checkTournamentName,
    createTournament,
    tourData,
    allTourData,
    findTournament,
    updateTournament,
    addParticipants,
    fetchParticipants,
    maxPlayers,
} = require("../controllers/tournamentController");

// Routes
router.post("/check-name", checkTournamentName);
router.post("/create", createTournament);
router.get("/tour-data", tourData);//find last tournament
router.get("/all-tour", allTourData);
router.get('/view/:tournamentId', findTournament);
router.put('/update/:tournamentId', updateTournament);
router.post('/tournament/:id/addParticipant', addParticipants);//add participants through tournament id 
router.get('/tournament/:id/fetchPaticipants',fetchParticipants); //fetch particpants only of a tournament through tournament id
router.post('/maxPlayers',maxPlayers); 

module.exports = router;
