const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const validator = require('validator');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: { type: String, required: true, trim: true }, 
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, select: false, required: true, trim: true },
    mobile: { type: String, default: null, trim: true },
    bio: { type: String, default: null, trim: true },
    avatar: { type: String, default: null },
    website: { type: String, default: null, trim: true },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    pushToken: { type: Object, default: {} },
    totpSecret: { type: String, required: true, select: false },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    acceptedTerms: { type: Boolean, default: false },
}, { timestamps: true });

// //static signup method
// userSchema.statics.signup = async function (name, email, username, password, totpSecret) {
//     //validation
//     if (!name || !email || !username || !password) {
//         throw Error('All fields must be filled')
//     }
//     if (!validator.isEmail(email)) {
//         throw Error('Email is not valid')
//     }
//     if (!validator.isStrongPassword(password, [{ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 }])) {
//         throw Error('Password must be 8 characters, 1 uppercase, number and symbol')
//     }
//     const emailExists = await this.findOne({ email });
//     const usernameExists = await this.findOne({ username });

//     if (emailExists) {
//         throw Error('Email exists')
//     }

//     if (usernameExists) {
//         throw Error('Username exists')
//     }

//     //password hashing
//     //10 the higher the value the longer it takes hacker to hack
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     const user = await this.create({ name, email, username, password: hash, totpSecret });

//     const authUser = await this.findById(user._id);
//     return authUser;
// }

// userSchema.statics.login = async function (email, password) {
//     //validation
//     if (!email || !password) {
//         throw Error('All fields must be filled')
//     }


//     //const user = await this.findOne({ email });
//     // login with either email or username
//     const user = await this.findOne({
//         $or: [
//             { email: email },
//             { username: email }
//         ]
//     })
//     //Because select is false for password in user schema we have to manually select the 
//     //password with select to be able to compare them
//     //Then we return the the user without the password at the end
//     if (!user) {
//         throw Error('Incorrect email')
//     }
//     const authUser = await this.findById(user._id).select('+password')


//     //Matching password. Comparing the passwords to see if they match
//     const match = await bcrypt.compare(password, authUser.password);

//     if (!match) {
//         throw Error('Incorrect password')
//     }

//     return user;
// }

// userSchema.statics.updateUserProfile = async function (id, name, bio, website, avatar) {
//     if (website === "") {
//         null
//     } else {
//         if (!validator.isURL(website)) {
//             throw Error("Website must be a valid URL")
//         }
//     }

//     // if (!website.startsWith("https://")) {
//     //     throw Error('Website must start with "https://"')
//     // }


//     const user = await this.findByIdAndUpdate({ "_id": id }, { "$set": { "name": name, "bio": bio, "website": website, "avatar": avatar } }, { new: true });

//     return user;
// }

// userSchema.statics.changePassword = async function (id, password) {

//     if (!password) {
//         throw Error('Field must be filled')
//     }
//     if (!validator.isStrongPassword(password, [{ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 }])) {
//         throw Error('Password must be 8 characters, 1 uppercase, number and symbol')
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const user = await this.findByIdAndUpdate(id, { $set: { password: hash } })

//     return user;
// }

// userSchema.statics.forgotPassword = async function (email, password) {
//     if (!password) {
//         throw Error("Field must be filled");
//     }

//     if (!validator.isStrongPassword(password, [{ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 },])) {
//         throw Error(
//             "Password must be 8 characters, 1 uppercase, number and symbol"
//         );
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const user = await this.findOneAndUpdate({ email: email }, { $set: { password: hash } });

//     if (!user) return;

//     return user;
// };

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;