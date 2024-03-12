const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clubSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, select: false, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    avatar: { type: String, default: "" },
    location: { type: String, trim: true, default: "" },
    type: {type: String, default: "club"},
    website: { type: String, default: "", trim: true },
    pushToken: { type: Object, default: {} },
    acceptedTerms: { type: Boolean, default: false },
    members: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    // rank: { type: Number } // Define the rank property
}, { timestamps: true });

// // Define a method to update the rank dynamically based on the number of members
// clubSchema.methods.updateRank = async function () {
//     const Club = this.model('Club');
//     const memberCount = await Club.countDocuments({ members: { $exists: true, $in: [this._id] } });
//     this.rank = memberCount + 1; // Assuming rank 1 is the club with the most members
//     await this.save();
// };

// // Hook into save to update rank automatically whenever a club is saved
// clubSchema.pre('save', async function (next) {
//     await this.updateRank();
//     next();
// });

// // Define a pre-hook to update the rank before any action is called on the club
// clubSchema.pre(['save', 'updateOne', 'findOneAndUpdate', 'find', 'findOne'], async function (next) {
//     try {
//         const memberCount = await this.model('Club').countDocuments({ members: { $exists: true, $ne: [] } });
//         this.rank = memberCount + 1; // Assuming rank 1 is the club with the most members
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;