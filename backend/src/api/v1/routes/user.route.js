const express = require("express");
const { searchClub, refreshUser, fetchClubProfileById, joinClub, setPushToken } = require('../controllers/user.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

// signup route
router.get('/search/:text', searchClub);
router.get('/refreshUser', refreshUser);
router.get('/getClubProfile/:id', fetchClubProfileById);
router.put("/joinClub/:club_id", joinClub);
//update pushToken
router.put("/setPushToken", setPushToken);

module.exports = router;