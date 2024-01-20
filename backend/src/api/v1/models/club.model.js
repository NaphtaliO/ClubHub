const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clubSchema = new Schema({
    name: { type: String, required: true, trim: true },
    // username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, select: false, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    avatar: { type: String, default: "" },
    type: {type: String, default: "club"},
    website: { type: String, default: "", trim: true },
    pushToken: { type: Object, default: {} },
    acceptedTerms: { type: Boolean, default: false },
}, { timestamps: true });

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;