const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Progress Schema & Models
const progressSchema = new Schema({
    studentId = {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    monthlyProgress: [{
        month: Number,
        sum: {type: Number, default: 0},
        nthEntry: {type: Number, default: 0},
        calculated: {type: Boolean, default: false},
        monthlyPercentage: {type: Number, default: 0},
        lastUpdate: Date
        }],
    weeklyProgress: [{
                    weekNumber: Number,
                    startDate: Date,
                    endDate: Date,
                    sum: {type: Number, default: 0},
                    nthEntry : {type: Number, default: 0},
                    calculated: {type: Boolean, default: false},
                    weeklyPercentage: {type: Number, default: 0},
                    lastUpdate: Date
        }],
    dailyProgress: [{
            date: Date,
            sum: {type: Number, default: 0},
            nthEntry: {type: Number, default: 0},
            calculated: {type: Boolean, default: false},
            dailyPercentage: {type: Number, default: 0}
        }],
});

module.exports = mongoose.model('Progress', progressSchema)