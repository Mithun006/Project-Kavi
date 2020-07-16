const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create question Schema and Models
const QuestionSchemaCodeDecode = new Schema({
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

const QuestionCodeDecode = mongoose.model('questionsCodeDecode',QuestionSchemaCodeDecode);
module.exports = QuestionCodeDecode;