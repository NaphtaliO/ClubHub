const { sendNotification } = require("../../../../pushNotification");
const Club = require("../models/club.model");
const Event = require("../models/event.model");
const Notification = require("../models/notification.model");
const Student = require("../models/student.model");

const createEvent = async (req, res) => {
    const user_id = req.user._id;
    const { end, start, summary, title, location } = req.body;
    try {
        const event = await Event.create({ end, start, summary, title, location, club: user_id })
        const club = await Club.findOne({ _id: user_id }).populate('members');
        club.members.forEach(async (member) => {
            const pushToken = member.pushToken;
            const notification = {
                token: pushToken,
                title: `New Event🎉 by ${club?.name}`,
                body: `${event.summary}`,
                data: { type: 'newEvent', event: event },
            }
            if (member.settings.notifications.newEvent) {
                sendNotification(notification);
            }
            await Notification.create({ title: notification.title, body: notification.body, data: notification.data, club: user_id, student: member._id })
        });
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

const rsvp = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { response } = req.body;
    if (user.type !== "student") return;
    try {
        let event = await Event.findOne({ _id: id });
        const rsvp = event.rsvp;
        if (response === "accept") {
            // If accepting and ID is neither in accepted nor declined, put it into accepted
            if (!rsvp.accepted.includes(user._id) && !rsvp.declined.includes(user._id)) {
                rsvp.accepted.push(user._id);
            } else if (rsvp.accepted.includes(user._id)) { // If ID is already in accepted, remove it
                rsvp.accepted.splice(rsvp.accepted.indexOf(user._id), 1);
            } else if (rsvp.declined.includes(user._id)) { // If ID is in declined, remove it from declined and put it into accepted
                rsvp.declined.splice(rsvp.declined.indexOf(user._id), 1);
                rsvp.accepted.push(user._id);
            }
        } else if (response === "decline") {
            // If declining and ID is neither in accepted nor declined, put it into declined
            if (!rsvp.accepted.includes(user._id) && !rsvp.declined.includes(user._id)) {
                rsvp.declined.push(user._id);
            } else if (rsvp.declined.includes(user._id)) { // If ID is already in declined, remove it
                rsvp.declined.splice(rsvp.declined.indexOf(user._id), 1);
            } else if (rsvp.accepted.includes(user._id)) { // If ID is in accepted, remove it from accepted and put it into declined
                rsvp.accepted.splice(rsvp.accepted.indexOf(user._id), 1);
                rsvp.declined.push(user._id);
            }
        }
        event = await Event.findOneAndUpdate({ _id: id }, { rsvp: rsvp }, { new: true });
        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
}

const deleteEvent = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    if (user.type !== "club") return;
    try {
        const event = await Event.findOneAndDelete({ _id: id });
        res.status(200).json(event)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}



module.exports = {
    createEvent,
    getAllEventsByClub,
    getAllStudentsEvents,
    deleteEvent,
    rsvp
}