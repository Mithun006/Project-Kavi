const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Image Models & Schema 
const ImageSchema = new Schema({
    image: String
});


const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;