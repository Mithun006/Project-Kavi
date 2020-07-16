const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create question Scheme & Models
const QuestionSchemaDirection = new Schema({
    question: {
        type: String,
        required: true 
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: true
    },
    option4: {
        type: String,
        required: true
    },
    option5: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const QuestionDirection = mongoose.model('questionsDirection',QuestionSchemaDirection);
module.exports = QuestionDirection;