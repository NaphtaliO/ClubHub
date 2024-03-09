const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: Object, default: {}, required: true },
    club: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true }
}, { timestamps: true });

notificationSchema.pre('find', function (next) {
    this.populate('club', 'name avatar');
    next();
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;