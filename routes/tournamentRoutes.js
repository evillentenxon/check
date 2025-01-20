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
    getTournamentsByUser,
    lastTourId,
} = require("../controllers/tournamentController");

// Routes
router.post("/check-name", checkTournamentName);
router.post("/create", createTournament);
router.get("/tour-data/:tourId", tourData);
router.get("/lastTourId", lastTourId);//find last tournament
router.get("/all-tour/:userId", allTourData);
router.get('/view/:tournamentId', findTournament);
router.put('/update/:tournamentId', updateTournament);
router.post('/tournament/:id/addParticipant', addParticipants);//add participants through tournament id 
router.get('/tournament/:id/fetchPaticipants',fetchParticipants); //fetch particpants only of a tournament through tournament id
router.post('/maxPlayers',maxPlayers); 
router.get('/my-tournaments/:id',getTournamentsByUser); //fetch tournaments by user

module.exports = router;
