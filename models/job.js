const mongoose =require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String,
    subject: String,
   
});

module.exports = mongoose.model('job', jobSchema);