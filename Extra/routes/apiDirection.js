const express = require('express');
const routerDirection = express.Router();
const Direction = require('../models/questionsDirection');

//get questions from the DB
routerDirection.get('/questionsDirection', function(req,res,next){
    Direction.find().then(documents => {
        res.status(200).json({
            message: 'Questions fetched successfully',
            question: documents
        })
        console.log(documents);
    })
});

//post questions from the DB
routerDirection.post('/questionsDirection', function(req,res,next){
    Direction.create(req.body).then(function(questionsDirection){
        res.send(questionsDirection);
        console.log(questionsDirection);
    });
});


module.exports = routerDirection;