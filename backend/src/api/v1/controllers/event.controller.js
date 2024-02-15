const Event = require("../models/event.model");

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

module.exports = {
    createEvent,
    getAllEventsByClub
}