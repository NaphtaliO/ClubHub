const express = require("express");
const { createComment } = require('../controllers/comment.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require authentication for all routes
router.use(requireAuth)

// signup route
router.post('/create', createComment);

module.exports = router;