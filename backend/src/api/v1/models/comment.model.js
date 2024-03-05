const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: { type: String, required: true, trim: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: String, required: true }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;