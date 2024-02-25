const Post = require("../models/post.model");
const Student = require("../models/student.model");

const createPost = async (req, res) => {
    const user_id = req.user._id;
    const { uri, caption, type } = req.body;
    try {
        const post = await Post.create({ uri, caption, type, club: user_id })
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const getAllPostsByClub = async (req, res) => {
    const user = req.user;
    if (user.type !== "club") return;
    try {
        const { page, limit } = req.query;
        const skip = (page) * limit;
        const posts = await Post.find({ club: user._id })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        res.status(200).json(posts)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

const getStudentsFeed = async (req, res) => {
    const user = req.user;
    if (user.type !== "student") return;
    try {
        const student = await Student.findById(user._id);
        if (!student) {
            res.status(400).json({ message: "Student not found" });
            return;
        }
        const clubIds = student.memberships;
        const { page, limit } = req.query;
        const skip = (page) * limit
        const posts = await Post.find({ club: { $in: clubIds } })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        res.status(200).json(posts)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

//delete a single post
const deletePost = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id;

    try {
        let post = await Post.findOne({ _id: id })

        // if (user_id.toString() === post.user.toString()) {

        //Delete the post
        post = await Post.findOneAndDelete({ _id: id })
        console.log(post);

        if (!post) {
            return res.status(400).json({ error: 'No such post' })
        }
        //Delete all comments associated with this post
        // await Comment.deleteMany({ post_id: id })
        // Remove post Id from Users favourites
        // await User.updateMany({ favourites: id },
        //     { $pull: { favourites: id }, }
        // );

        res.status(200).json(post);
        // }
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

module.exports = {
    createPost,
    getAllPostsByClub,
    deletePost,
    getStudentsFeed
}