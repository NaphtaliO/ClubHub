const Post = require("../models/post.model");


const createPost = async (req, res) => {
    const user_id = req.user._id;
    const { uri, caption, type } = req.body;
    try {
        const post = await Post.create({ uri, caption, type, club: user_id })
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({ error: e.message })
        console.log(error.message);
    }
}

module.exports = {
    createPost
}