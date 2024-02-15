const express = require("express");
const { searchClub } = require('../controllers/user.controller');
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

// signup route
router.get('/search/:text', searchClub);

module.exports = router;