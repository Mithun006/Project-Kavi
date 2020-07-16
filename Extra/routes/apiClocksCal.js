const express = require('express');
const routerClocksCal = express.Router();
const ClocksCal = require('../models/questionsClocksCal');

//get questions from the DB
routerClocksCal.get('/questionsClocksCal', function(req,res,next){
    ClocksCal.find().then(documents => {
        res.status(200).json({
            message: 'Questions fetched successfully',
            question: documents
        })
        console.log(documents);
    })
});

//post questions to the DB
routerClocksCal.post('/questionsClocksCal', function(req,res,next){
    ClocksCal.create(req.body).then(function(questionsClocksCal){
        res.send(questionsClocksCal);
        console.log(questionsClocksCal);
    })
})

module.exports = routerClocksCal;