const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    uri: { type: String, required: true },
    caption: { type: String, required: true },
    type: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    club: { type: Schema.Types.ObjectId, ref: "Club", required: true }, // club id of the owner
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;