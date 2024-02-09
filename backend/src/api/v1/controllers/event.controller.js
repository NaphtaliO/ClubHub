const Event = require("../models/event.model");

const createEvent = async (req, res) => {
    const user_id = req.user._id;
    const { date, title, location, hour, duration } = req.body;
    try {
        const event = await Event.create({ date, title, location, hour, duration, club: user_id })
        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: e.message })
        console.log(error.message);
    }
}

module.exports = {
    createEvent
}