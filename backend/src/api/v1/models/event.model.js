const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    date: { type: String, required: true },
    duration: { type: String, required: true },
    hour: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String },
    club: { type: Schema.Types.ObjectId, ref: "Club", required: true }, // club id of the owner
    rsvp: [{ type: Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;