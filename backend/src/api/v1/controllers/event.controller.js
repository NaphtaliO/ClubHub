const Event = require("../models/event.model");
const Student = require("../models/student.model");

const createEvent = async (req, res) => {
    const user_id = req.user._id;
    const { end, start, summary, title } = req.body;
    try {
        const event = await Event.create({ end, start, summary, title, club: user_id })
        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const getAllEventsByClub = async (req, res) => {
    const user_id = req.user._id;
    try {
        const event = await Event.find({ club: user_id })
        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const getAllStudentsEvents = async (req, res) => {
    const user = req.user;
    if (user.type !== "student") return;
    try {
        const student = await Student.findById(user._id);
        if (!student) {
            res.status(400).json({ message: "Student not found" });
            return;
        }
        const clubIds = student.memberships;
        const events = await Event.find({ club: { $in: clubIds } });
        res.status(200).json(events)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

module.exports = {
    createEvent,
    getAllEventsByClub,
    getAllStudentsEvents
}