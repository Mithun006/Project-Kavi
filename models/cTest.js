const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

//create cTest Schema & Models
const cTestSchema = new Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'College'},
    testName: String,
    startTime: Date,
    closeTime: Date,
    maxMark: Number,
    createdOn: Date,
    highestScore: {type: Number, default: 0},
    averageScore: {type: Number, default: 0},
    leastScore: {type: Number, default: 99999},
    duration: Number,
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'TestQuestions',
                mark: Number}]
})

const CTest = mongoose.model('CTest', cTestSchema);
module.exports = CTest;