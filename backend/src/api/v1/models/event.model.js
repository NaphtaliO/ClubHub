const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    location: { type: String },
    club: { type: Schema.Types.ObjectId, ref: "Club", required: true }, // club id of the owner
    rsvp: [{ type: Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;