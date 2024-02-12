const Club = require('../models/club.model');
const Student = require('../models/student.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const createToken = (_id) => {
    // Keep user signed in for 30 days
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '30d' })
}

const isValidEmail = (email) => {
    var regex = /^[a-zA-Z0-9._%+-]+@umail\.ucc\.ie$/;
    return regex.test(email);
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
        res.status(200).json({ ...user._doc, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const createStudent = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // validation
        if (!name || !email || !password) throw Error('All fields must be filled');
        if (!validator.isEmail(email)) throw Error('Email is not valid');
        if (!isValidEmail(email)) throw Error('Must be a UCC email')
        if (!validator.isStrongPassword(password, [{ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 }])) {
            throw Error('Password must be 8 characters, 1 uppercase, number and symbol')
        }
        const emailExists = await Student.findOne({ email });
        const clubExists = await Club.findOne({ email });
        if (emailExists || clubExists) throw Error('Email exists');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await Student.create({ name, email, password: hash })
        //create token
        const token = createToken(user._id);
        console.log({ ...user._doc, token });
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
        let user;
        const club = await Club.findOne({ email })
        const student = await Student.findOne({ email })
        // if (!club && !student) throw Error('Incorrect email');
        if (club) {
            user = await Club.findById(club._id).select('+password')
        } else if (student) {
            user = await Student.findById(student._id).select('+password')
        } else {
            throw Error('Incorrect email');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw Error('Incorrect password');
        // create token
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