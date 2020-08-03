const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

//create aTest Schema & Models
const aTestSchema = new Schema({
    testName: String,
	startTime: Date,
	closeTime: Date,
	maxMark: Number,
	createdOn: Date,
	highestScore: {type: Number, default: 0},
    averageScore: {type: Number, default: 0},
    leastScore: {type: Number, default: 99999},
	duration: Number,
	questions: [{question: {type: mongoose.Schema.Types.ObjectId, ref: 'testQuestions'},
				 mark: Number}]	
})

const ATest = mongoose.model('ATest', aTestSchema);
module.exports = ATest;