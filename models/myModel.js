
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    photo: String,  // Field to store the photo file path
    role: {
        type:String,
        default: "user"
    }
});

const communitySchema= new mongoose.Schema({
    cn: String,
    description: String,
    location: String,
    gameList: String,
    privacy: String,
    photo: String  // Field to store the photo file path
});

const messageSchema= new mongoose.Schema({
    name: String,
    email: String,
    contact_no: String,
    message: String,
})

const UserModel= mongoose.model('users',userSchema);
const CommunityModel= mongoose.model('community',communitySchema);
const ContactModel= mongoose.model('messages',messageSchema);

module.exports = {UserModel, CommunityModel, ContactModel};
