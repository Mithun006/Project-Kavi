const express = require('express');
const routerAgesPart = express.Router();
const AgesPart = require('../models/questionsAgesPart');
const checkAuth = require('../middleware/check-auth');

//get questions from the DB
routerAgesPart.get('/questionsAgesPart', function(req,res,next){
    AgesPart.find().then(documents => {
        res.status(200).json({
            message: 'Questions fetched successfully',
            question: documents
        })
        console.log(documents);
    })
});

//post questions from the DB
routerAgesPart.post('/questionsAgesPart', checkAuth, function(req,res,next){
    try{
        AgesPart.create(req.body).then(function(questionsAgesPart){
            res.send(questionsAgesPart);
            console.log(questionsAgesPart);
        });
    } catch {
        console.log(err);
    }
});



module.exports = routerAgesPart;