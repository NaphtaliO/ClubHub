const express = require("express");
const { createNotification } = require('../controllers/notification.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require authentication for all routes
router.use(requireAuth)

// signup route
router.post('/create', createNotification);

module.exports = router;