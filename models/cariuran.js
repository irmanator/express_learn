const mongoose = require('mongoose');
const { Schema } = mongoose;

const carIuranSchema = new Schema({
//   _id:  String, // String is shorthand for {type: String}
  blok: String,
  no: String,
  kk: String,
  iuran: {
    periode: String,
    tanggal: Date,
    jumlah: Number,
    petugas: String,
    setor: Date
  }}
, {timestamps: true});

mongoose.model('CarIuran', carIuranSchema);

module.exports = mongoose.model('CarIuran');