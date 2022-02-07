const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: String,
    pass: String
},{timestamps: true}); //memudahkan proses update dan delete

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');