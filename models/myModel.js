
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String
});

const UserModel= mongoose.model('users',userSchema);

module.exports = {UserModel};

  