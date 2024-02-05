const express = require("express");
const { createPost } = require('../controllers/post.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require authentication for all routes
router.use(requireAuth)

// signup route
router.post('/create', createPost)

module.exports = router;