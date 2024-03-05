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

const likePost = async (req, res) => {
    const user_id = req.user._id;
    const { id } = req.params;
    try {

        const post = await Post.findById(id);
        
        // const postAuthor = await User.findOne({ _id: post.user_id }).select("username pushToken")
        // const authUser = await User.findOne({ _id: user_id }).select("username")

        const isLiked = post.likes.includes(user_id);

        if (isLiked) {
            let index = post.likes.indexOf(user_id);
            if (index > -1) {
                post.likes.splice(index, 1);
            }
        } else {
            post.likes.push(user_id);
            // if (post.user_id !== user_id.toHexString()) {
            //     const notificationInfo = {
            //         token: postAuthor.pushToken,
            //         title: `${postAuthor.username}`,
            //         body: `@${authUser.username} liked your post`,
            //         data: { type: "liked", post_id: post._id }
            //     };
            //     await sendNotification(notificationInfo.token, notificationInfo.body, notificationInfo.title, notificationInfo.data);
            // }
        }

        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    getAllPostsByClub,
    deletePost,
    getStudentsFeed,
    likePost
}