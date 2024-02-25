const express = require("express");
const { createEvent, getAllEventsByClub, getAllStudentsEvents } = require('../controllers/event.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require authentication for all routes
router.use(requireAuth)

// signup route
router.post('/create', createEvent);
router.get('/getAllByClub', getAllEventsByClub);
router.get('/getAllStudentsEvents', getAllStudentsEvents);

module.exports = router;