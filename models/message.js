const mongoose =require('mongoose');

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    textmsg: String,
});

module.exports = mongoose.model('message', messageSchema);