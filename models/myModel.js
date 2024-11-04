
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    photo: String  // Field to store the photo file path
});

const UserModel= mongoose.model('users',userSchema);

module.exports = {UserModel};
