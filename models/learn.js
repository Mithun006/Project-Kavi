const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Learn Schema & Models
const LearnSchema = new Schema({
    topic: {type: mongoose.Schema.Types.ObjectId, ref: "Topic"},
    introduction: [ String ],
    keyPoints: {
        brief: String,
        points:[ String ]
    },
    types: {
        brief: String,
        types: [{
            brief: String,
            typesOfType: [String]
        }],
    },
    formula: [{
        type: String,
        formula: String,
        explain: String
    }],
    explanation: [{
        type: String,
        brief: String,
        formula: String,
        example: [{
            question: String,
            solution: [{
                formula: String,
                solution: String
            }],
            shortcut: String
        }]
    }]
})


const Learn = mongoose.model('Learn',LearnSchema);
module.exports = Learn
