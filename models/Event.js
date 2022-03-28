const mongoose =require('mongoose');



const eventSchema = new mongoose.Schema({
    title: String,
    subject: String,

    
});

module.exports = mongoose.model('Event', eventSchema);