const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Student Schema & Models
const StudentSchema = new Schema({
    firstName: {
        type: String,
        required: [true,'First Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    mailId: {
        type: String,
        required: [true, 'E Mail-ID is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    contact: Number,
    degree: String,
    department: String,
    graduatingYear: Date,
    profilePicture: String,
    isVerified: {type: Boolean, default: false},
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    collegeName:{ type: String},
    practicedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Practice' }],
    overallScore: {type: Number, default: 0},
    testScore: {type: mongoose.Schema.Types.ObjectId, ref: 'TestScore'},
    progress: {type: mongoose.Schema.Types.ObjectId, ref: 'Progress'}
})


const Student = mongoose.model('Student',StudentSchema);
module.exports = Student; 