const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create testProgress Schema & Models
const testProgressSchema = new Schema({
    testId: {type: mongoose.Schema.Types.ObjectId, ref: 'CTest'},
	testName: String,
	score: [{
			studentName: String,
			studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
			score: Number
			}]
});

//create leaderBoard Schema & Models
const leaderBoardSchema = new Schema({
    studentName: String,
    studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    score: Number
});

//create College Schema & Models
const CollegeSchema = new Schema({
    collegeName: {type: String, required: true},
	staffName: {type: String, required: true},
	mailId: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    contact: Number,
	premium: Boolean,
	studentRecords:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
	testProgress: [{ type: testProgressSchema }],
    leaderBoard: [{ type: leaderBoardSchema }]
})

const College = mongoose.model('College',CollegeSchema);
module.exports = College;