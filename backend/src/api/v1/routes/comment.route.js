const express = require("express");
const { createComment, getComments, deleteComment } = require('../controllers/comment.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require authentication for all routes
router.use(requireAuth)

router.post('/create', createComment);
router.get('/getComments/:id', getComments);
router.delete('/delete/:id', deleteComment);

module.exports = router;