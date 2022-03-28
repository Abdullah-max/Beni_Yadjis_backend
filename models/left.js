const mongoose =require('mongoose');
const commentSchema =new mongoose.Schema({
    comment: {
        type: String,
    }
});
const leftSchema =new mongoose.Schema({
    title: String,
    subject: String,
    comments: [commentSchema]
});

module.exports = mongoose.model('left', leftSchema);