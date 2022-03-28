const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('utilisateur', utilisateurSchema);