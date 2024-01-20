const Club = require('../models/club.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const validator = require('validator');

const createToken = (_id) => {
    // Keep user signed in for 30 days
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '5d' })
}

const createClubAdmin = async (req, res) => {
    const { name, email, username, password, avatar } = req.body;
    try {
        const emailExists = await Club.findOne({ email });
        if (emailExists) throw Error('Email exists');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await Club.create({ name, email, username, password: hash, avatar });
        const user = await Club.findOne({ email })
        const token = createToken(user._id);
        console.log({ ...user._doc, ...token });
        res.status(200).json({ ...user._doc, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const LogIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) throw Error('All fields must be fields');
        const user = await Club.findOne({ email })
        if (!user) throw Error('Incorrect email');
        const authUser = await Club.findById(user._id).select('+password')
        const match = await bcrypt.compare(password, authUser.password);
        if (!match) throw Error('Incorrect password');
        // create token
        const token = createToken(user._id);
        res.status(200).json({ ...user._doc, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const createStudent = async (req, res) => {
    const { name, email, username, password } = req.body;
    try {
        const user = await User.signup(name, email, username, password, totpSecret)
        //create token
        const token = createToken(user._id);
        res.status(200).json({ ...user._doc, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

module.exports = {
    createClubAdmin,
    createStudent,
    LogIn
}