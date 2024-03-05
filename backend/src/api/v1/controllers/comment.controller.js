const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const createComment = async (req, res) => {
    const user_id = req.user._id;
    const { comment, post_id } = req.body;
    try {
        const commentObject = await Comment.create({ comment, post: post_id, user_id })
        const post = await Post.findById({ _id: post_id })

        post.comments.push(commentObject._id)

        await Post.findByIdAndUpdate(post_id, { comments: post.comments }, { new: true })
        res.status(200).json(commentObject)
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createComment
}