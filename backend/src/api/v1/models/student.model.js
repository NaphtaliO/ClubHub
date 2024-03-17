const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: { type: String, required: true, trim: true }, 
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, select: false, required: true, trim: true },
    bio: { type: String, default: '', trim: true },
    avatar: { type: String, default: '' },
    type: { type: String, default: "student" },
    website: { type: String, default: '', trim: true },
    memberships: [{ type: Schema.Types.ObjectId, ref: "Club" }],
    favourites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    pushToken: { type: Object, default: {} },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    acceptedTerms: { type: Boolean, default: false },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;