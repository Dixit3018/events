const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name:{ type:String, required:[true, "Name is Required"]},
    email:{ type:String, required:[true, "Email is Required"]},
    subject:{ type:String, required:[true, "Subject is Required"]},
    message:{ type:String, required:[true, "Message is Required"]}
},{
    timestamps:true
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;