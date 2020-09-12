const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Interview Module Model & Schema
const InterviewSchema = new Schema({
    company: String,
    testDuration: Number,
    syllabus: [{type: mongoose.Schema.Types.ObjectId, ref: "Topic"}],
    test: [{type: mongoose.Schema.Types.ObjectId, ref: "AdminCustomisedQuestions"}]
});


const Interview = mongoose.model('Interview', InterviewSchema);
module.exports = Interview;