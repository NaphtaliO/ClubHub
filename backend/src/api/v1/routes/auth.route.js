const express = require("express");
const { createClubAdmin, LogIn } = require('../controllers/user.controller');

const router = express.Router();

// signup route
router.post('/admin/signup', createClubAdmin)
router.post('/login', LogIn)

module.exports = router;