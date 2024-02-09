const express = require("express");
const { createEvent } = require('../controllers/event.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require authentication for all routes
router.use(requireAuth)

// signup route
router.post('/create', createEvent)

module.exports = router;