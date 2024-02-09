const express = require("express");
const { createClubAdmin, LogIn, createStudent } = require('../controllers/user.controller');

const router = express.Router();

// signup route
router.post('/admin/signup', createClubAdmin);
router.post('/login', LogIn);
router.post('/signup', createStudent);

module.exports = router;