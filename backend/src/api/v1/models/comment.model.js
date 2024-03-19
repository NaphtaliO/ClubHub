const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: { type: String, required: true, trim: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student" },
    club: { type: Schema.Types.ObjectId, ref: "Club" },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;