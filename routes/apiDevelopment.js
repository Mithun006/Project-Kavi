const express = require('express');
const routerDevelopment = express.Router();
const TestQuestions = require('../models/testQuestions');
const router = require('./apiRegister');
const ATest = require('../models/aTest');

routerDevelopment.post('/dev/:id', function(req,res,next){
    ATest.findById(req.params.id).then(aTest =>{
        console.log(aTest)
        aTest.closeTime = req.body.date
    })
    ATest.findById(req.params.id).then(aTest => {
        console.log(aTest.closeTime)
    })
});

module.exports = routerDevelopment;
