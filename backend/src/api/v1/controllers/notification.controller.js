const { sendNotification } = require("../../../../pushNotification");
const Club = require("../models/club.model");
const Notification = require("../models/notification.model");

const createNotification = async (req, res) => {
    const user = req.user;
    const { body, data } = req.body;
    if (user.type !== "club") return;
    try {
        const club = await Club.findOne({ _id: user._id })
            .populate('members');
        club.members.forEach(async (member) => {
            const pushToken = member.pushToken;
            const notification = {
                token: pushToken,
                title: `Notification from ${club.name}`,
                body: body,
                data: data,
            }
            sendNotification(notification);
            await Notification.create({ title: notification.title, body, data, club: user._id, student: member._id })
        });

        res.status(200).json({ message: 'Notification Sent' })
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

module.exports = {
    createNotification
}