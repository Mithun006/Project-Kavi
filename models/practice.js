const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Practice Schema & Models
const PracticeSchema = new Schema({
    topic: String,
    message: String,
    difficulty: String,
    status: {type: String, default: 'Unsolved'},
    ques: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    option5: String,
    answer: String
})

const Practice = mongoose.model('Practice', PracticeSchema);
module.exports = Practice;