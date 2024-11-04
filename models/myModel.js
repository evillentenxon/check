
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    photo: String  // Field to store the photo file path
});

const communitySchema= new mongoose.Schema({
    cn: String,
    description: String,
    location: String
});

const UserModel= mongoose.model('users',userSchema);
const CommunityModel= mongoose.model('community',communitySchema);

module.exports = {UserModel, CommunityModel};
