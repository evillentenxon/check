const express = require("express");
const router = express.Router();
const { checkTournamentName, createTournament,tourData, allTourData, findTournament, updateTournament} = require("../controllers/tournamentController");

// Routes
router.post("/check-name", checkTournamentName);
router.post("/create", createTournament);
router.get("/tour-data",tourData);
router.get("/all-tour",allTourData);
router.get('/view/:tournamentId',findTournament);
router.put('/update/:tournamentId',updateTournament);

module.exports = router;
