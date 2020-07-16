const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create TestQuestions Schema & Models
const testQuestionsSchema = new  Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'College'},
    topic: String,
    question: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    option5: String,
    answer: String
})

module.exports = mongoose.model('TestQuestions', testQuestionsSchema);