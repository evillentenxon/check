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
} = require("../controllers/tournamentController");

// Routes
router.post("/check-name", checkTournamentName);
router.post("/create", createTournament);
router.get("/tour-data", tourData);
router.get("/all-tour", allTourData);
router.get('/view/:tournamentId', findTournament);
router.put('/update/:tournamentId', updateTournament);
router.post('/tournament/:id/addParticipant', addParticipants);//add participants through tournament id 
router.get('/tournament/:id/fetchPaticipants',fetchParticipants); //fetch particpants only of a tournament through tournament id

module.exports = router;
