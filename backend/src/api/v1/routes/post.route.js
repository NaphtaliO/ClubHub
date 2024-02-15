const express = require("express");
const { createPost, getAllPostsByClub, deletePost } = require('../controllers/post.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require authentication for all routes
router.use(requireAuth)

// signup route
router.post('/create', createPost)
router.get('/getPostsByClub', getAllPostsByClub)
router.delete('/deletePost/:id', deletePost)

module.exports = router;