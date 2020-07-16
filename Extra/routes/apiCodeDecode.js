const express = require('express');
const routerCodeDecode = express.Router();
const CodeDecode = require('../models/questionsCodeDecode');

//get questions from the DB
routerCodeDecode.get('/questionsCodeDecode', function(req,res,next){
    CodeDecode.find().then(documents => {
        res.status(200).json({
            message: 'Questions fetched successfully',
            question: documents
        })
        console.log(documents);
    })
});

//post questions to the DB
routerCodeDecode.post('/questionsCodeDecode', function(req,res,next){
    CodeDecode.create(req.body).then(function(questionsCodeDecode){
        res.send(questionsCodeDecode);
        console.log(questionsCodeDecode);
    })
});

module.exports = routerCodeDecode;