const express = require("express");
const { createEvent, getAllEventsByClub, getAllStudentsEvents, deleteEvent, rsvp } = require('../controllers/event.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require authentication for all routes
router.use(requireAuth)

// signup route
router.post('/create', createEvent);
router.delete('/delete/:id', deleteEvent);
router.get('/getAllByClub', getAllEventsByClub);
router.get('/getAllStudentsEvents', getAllStudentsEvents);
router.put('/rsvp/:id', rsvp);

module.exports = router;