const mongoose = require('mongoose');

const resetPassword = new mongoose.Schema({
    user_id: {type:String, required: [true, "User Id required"]},
    token: {type:String, required: [true, "Token required"]}
})

const ResetPassword = mongoose.model('ResetPassword', resetPassword);
module.exports = ResetPassword;