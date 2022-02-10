const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: String,
    kode: String,
    pass: String
},{timestamps: true}); //memudahkan proses update dan delete

mongoose.model('User', userSchema); //model name, schema name

module.exports = mongoose.model('User');