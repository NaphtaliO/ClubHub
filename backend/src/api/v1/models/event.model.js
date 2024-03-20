const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    summary: { type: String },
    location: { type: String },
    club: { type: Schema.Types.ObjectId, ref: "Club", required: true }, // club id of the owner
    rsvp: {
        accepted: [{ type: Schema.Types.ObjectId, ref: "Student" }],
        declined: [{ type: Schema.Types.ObjectId, ref: "Student" }]
    },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;