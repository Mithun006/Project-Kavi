const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create File Models & Schema
const fileSchema = new Schema({
    question: [{
        ques: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        option5: String,
        answer: String
    }]
})

const File = mongoose.model('File', fileSchema);
module.exports = File;