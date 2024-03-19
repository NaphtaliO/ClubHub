const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const createComment = async (req, res) => {
    const user_id = req.user._id;
    const { comment, post_id, student, club } = req.body;
    try {
        const commentObject = await Comment.create({ comment, post: post_id, student, club })
        const post = await Post.findById({ _id: post_id })

        post.comments.push(commentObject._id)

        await Post.findByIdAndUpdate(post_id, { comments: post.comments }, { new: true })
        res.status(200).json(commentObject)
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message })
    }
}

const getComments = async (req, res) => {
    const user_id = req.user._id;
    const { id } = req.params;
    try {
        const comments = await Comment.find({ post: id })
            .populate('student', 'name avatar')
            .populate('club', 'name avatar')
            .sort({ createdAt: -1 })
        res.status(200).json(comments)
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
}

const deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const commentObject = await Comment.findOneAndDelete({ _id: id });
        // Remove comment id from post
        let post_id = commentObject.post;
        const post = await Post.findById({ _id: post_id }).select("comments");
        if (!post) return;
        const commentIndex = post.comments.indexOf(commentObject._id);
        if (commentIndex !== -1) {
            // Remove the comment ID from the array
            post.comments.splice(commentIndex, 1);
            // Save the updated post
            post.save();
        }
        res.status(200).json(commentObject);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createComment,
    getComments,
    deleteComment
}