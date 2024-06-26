const Club = require('../models/club.model');
const Student = require('../models/student.model');
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const Notification = require("../models/notification.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { sendNotification } = require('../../../../pushNotification');

const UCCStudents = ["120432016@umail.ucc.ie",]

const createToken = (_id) => {
    // Keep user signed in for 30 days
    const payload = {
        _id,
        user_id: _id,
        iss: "https://pronto.getstream.io",
        sub: `user/${_id}`
    }
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '30d' })
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
        // if (!UCCStudents.includes(email)) throw Error(`Your email does not exist. Use a valid UCC email`);
        if (!isValidEmail(email)) throw Error('Must be a UCC email');
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
        let userWithoutPassword = { ...user._doc, token }
        delete userWithoutPassword.password;
        res.status(200).json(userWithoutPassword)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const refreshUser = async (req, res) => {
    let user = req.user;
    try {
        if (user.type === 'club') {
            user = await Club.findOne({ _id: user._id })
        } else if (user.type === 'student') {
            user = await Student.findOne({ _id: user._id })
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const updateProfile = async (req, res) => {
    let user = req.user;
    let body = req.body;
    try {
        if (user.type === 'club') {
            user = await Club.findOneAndUpdate({ _id: user._id }, { $set: { ...body } }, { new: true })
        } else if (user.type === 'student') {
            user = await Student.findOneAndUpdate({ _id: user._id }, { $set: { ...body } }, { new: true })
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const searchClub = async (req, res) => {
    const user_id = req.user._id;
    const { text } = req.params;
    try {
        // const authUser = await User.findOne({ _id: user_id }).select("blockedUsers")
        // const users = await User.find({
        //     $or: [{ name: new RegExp(text, 'i') }, { username: new RegExp(text, 'i') }],
        //     // Excludes users that are blocked and users that blocked you respevtively
        //     $and: [{ _id: { $nin: authUser.blockedUsers } }, { blockedUsers: { $ne: user_id } }]
        // }).select("name username avatar");
        const clubs = await Club.find({ name: new RegExp(text, 'i') }).select("name avatar members");
        res.status(200).json(clubs);
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const fetchClubProfileById = async (req, res) => {
    let club_id = req.params.id;
    try {
        const club = await Club.findOne({ _id: club_id });
        res.status(200).json({ profile: club });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
}

const joinClub = async (req, res) => {
    let user = req.user;
    const { club_id } = req.params;

    try {
        if (user.type !== "student") return;
        const student = await Student.findById({ _id: user._id });
        const club = await Club.findById(club_id);
        if (student.memberships.includes(club._id) || club.members.includes(student._id)) {
            let studentIndex = student.memberships.indexOf(club._id);
            let clubIndex = club.members.indexOf(student._id);
            if (studentIndex > -1 || clubIndex > -1) {
                student.memberships.splice(studentIndex, 1);
                club.members.splice(clubIndex, 1);
            }
        } else {
            club.members.push(student._id)
            student.memberships.push(club._id)
        }
        const updatedClub = await Club.findByIdAndUpdate(club._id, { members: club.members }, { new: true })
        const updatedStudent = await Student.findByIdAndUpdate(student._id, { memberships: student.memberships }, { new: true })
        res.status(200).json({ club: updatedClub, student: updatedStudent });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
}

const setPushToken = async (req, res) => {
    const user = req.user;
    const { token } = req.body;
    let student;
    try {
        if (user.type === "student") {
            student = await Student.findOneAndUpdate({ _id: user._id }, { pushToken: token })
        }
        res.status(200).json({ message: "Success" })
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}



const createAndSendNotification = async () => {
    const notificationInfo = {
        token: { data: "ddea9f2b8a778b0a1e84ca3bae27478426e648a7e5e94f052f23cb353ee62fe8", type: "ios" },
        title: `Hello`,
        body: `@started following you`,
        data: { type: 'following' }
    };
    await sendNotification(notificationInfo);
}

const acceptTerms = async (req, res) => {
    const user = req.user
    try {
        let updatedUser;
        if (user.type === "club") {
            updatedUser = await Club.findByIdAndUpdate({ _id: user._id }, { $set: { acceptedTerms: true } }, { new: true });
        } else if (user.type === "student") {
            updatedUser = await Student.findByIdAndUpdate({ _id: user._id }, { $set: { acceptedTerms: true } }, { new: true });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const updateNotificationsSettings = async (req, res) => {
    const user = req.user;
    const {
        newEvents,
        generalAnnouncements,
        newPosts,
        chatNotifications,
        liveStreamNotifications
    } = req.body;
    try {
        const updatedSettings = {
            notifications: {
                newEvents,
                announcements: generalAnnouncements,
                newPosts,
                chat: chatNotifications,
                liveStream: liveStreamNotifications
            }
        };

        const student = await Student.findByIdAndUpdate({ _id: user._id }, { $set: { settings: updatedSettings } }, { new: true });
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const deleteUser = async (req, res) => {
    let user = req.user;
    if (user.type !== "student") return;
    try {
        user = await Student.findOne({ _id: user._id });
        if (!user) return;
        const userComments = await Comment.find({ student: user._id });

        // Update clubs who have this student in their members array
        await Club.updateMany(
            {
                $or: [
                    { members: user._id },
                ],
            },
            {
                $pull: {
                    members: user._id,
                },
            }
        );

        // Update posts that have this user's ID in their likes array
        await Post.updateMany(
            { likes: user._id },
            { $pull: { likes: user._id } }
        );

        // Remove comments created by the user from posts' comments array
        await Post.updateMany(
            { comments: { $in: userComments.map(comment => comment._id) } },
            { $pull: { comments: { $in: userComments.map(comment => comment._id) } } }
        );

        // Delete User posts, comments and then the User
        await Comment.deleteMany({ student: user._id })
        await Notification.deleteMany({ student: user._id })
        await Student.findOneAndDelete({ _id: user.id })
        res.status(200).json({ message: 'Success' })
        console.log("Account Deleted Successfully");
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

module.exports = {
    createClubAdmin,
    createStudent,
    LogIn,
    searchClub,
    refreshUser,
    fetchClubProfileById,
    joinClub,
    setPushToken,
    acceptTerms,
    updateNotificationsSettings,
    deleteUser,
    updateProfile
}