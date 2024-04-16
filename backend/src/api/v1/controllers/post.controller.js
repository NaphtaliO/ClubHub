const { sendNotification } = require("../../../../pushNotification");
const Club = require("../models/club.model");
const Comment = require("../models/comment.model");
const Notification = require("../models/notification.model");
const Post = require("../models/post.model");
const Student = require("../models/student.model");

const createPost = async (req, res) => {
    const user_id = req.user._id;
    const { uri, caption, type } = req.body;
    try {
        const post = await Post.create({ uri, caption, type, club: user_id });
        const club = await Club.findOne({ _id: user_id }).populate('members');
        club.members.forEach(async (member) => {
            const pushToken = member.pushToken;
            const notification = {
                token: pushToken,
                title: `${club?.name}`,
                body: 'New Post🎉',
                data: { type: 'newPost', post: post },
            }
            if (member.settings.notifications.newPosts) {
                sendNotification(notification);
            }
            await Notification.create({ title: notification.title, body: notification.body, data: notification.data, club: user_id, student: member._id })
        });
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

const fetchClubProfilePostsById = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    if (user.type !== "student") return;
    try {
        const student = await Student.findById(user._id);
        if (!student) {
            res.status(400).json({ message: "Student not found" });
            return;
        }
        const { page, limit } = req.query;
        const skip = (page) * limit
        const posts = await Post.find({ club: id })
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

        if (!post) {
            return res.status(400).json({ error: 'No such post' })
        }
        //Delete all comments associated with this post
        await Comment.deleteMany({ post: id })
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
    const { id } = req.params; // passed as parameter
    try {
        // Fetch post by ID
        const post = await Post.findById(id);
        const isLiked = post.likes.includes(user_id);
        // if post is liked meaning the user_id is in post.likes array
        // unlike the post by removing the id
        if (isLiked) {
            let index = post.likes.indexOf(user_id);
            if (index > -1) {
                post.likes.splice(index, 1);
            }
        } else {
            // else if the post is not liked like it by pushing the user_id into the array
            post.likes.push(user_id);
        }
        // respond with the updated post
        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
};

const fetchRecommendations = async (req, res) => {
    const user = req.user;
    if (user.type !== "student") return;
    try {
        // Fetch current student's details
        const student = await Student.findById(user._id);
        if (!student) {
            res.status(400).json({ message: "Student not found" });
            return;
        }
        // Find similar students
        const similarStudents = await Student.find({
            memberships: { $in: student.memberships },
            _id: { $ne: student._id } // Exclude current student
        });

        // Retrieve posts from clubs of similar students
        const clubIds = similarStudents.map(student => student.memberships).flat();
        const { page, limit } = req.query;
        const skip = (page) * limit
        let recommendedPosts = await Post.find({ club: { $in: clubIds }, type: { $ne: "video" } }) // exclude videos, UI too complicated for now
            .skip(skip) // for pagination
            .limit(parseInt(limit)) // Limit the number of posts for pagination
            .sort({ createdAt: -1 }); // Sort by most recent

        // If no recommended posts found,
        // Student just joined for example
        // fetch any image posts and sort by most recent
        if (recommendedPosts.length === 0) {
            recommendedPosts = await Post.find({ type: { $ne: "video" } })
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });
        }
        res.status(200).json(recommendedPosts)
    } catch (error) {
        res.status(400).json({ error: error.message })
        console.log(error.message);
    }
}

module.exports = {
    createPost,
    getAllPostsByClub,
    deletePost,
    getStudentsFeed,
    likePost,
    fetchClubProfilePostsById,
    fetchRecommendations
}