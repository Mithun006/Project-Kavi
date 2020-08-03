const express = require('express');
const routerScoreUpdate = express.Router();
const Student = require('../models/student');
const TestScore = require('../models/testScore');
const checkAuth = require('../middleware/check-auth');
const moment = require('moment-timezone');
const ATest = require('../models/aTest');
const CTest = require('../models/cTest');


//post Student aTest Score in the DB (id: studentId)
routerScoreUpdate.post('/aTestScoreUpdate', checkAuth, function(req,res,next){
    Student.findById(req.userData.userId).then((student => {
        TestScore.findById(student.testScore).then(testScore => {
            var aTestUpdate = req.body
            testScore.aTest.push(aTestUpdate)
            testScore.save(aTestUpdate)
            res.status(201).json("Test Submitted Successfully")
            console.log(testScore)
        });
    }));
});

//post Student cTest Score in the DB (id: studentId)
routerScoreUpdate.post('/cTestScoreUpdate', checkAuth, function(req,res,next){
    Student.findById(req.userData.userId).then((student => {
        TestScore.findById(student.testScore).then(testScore => {
            var cTestUpdate = req.body
            testScore.cTest.push(cTestUpdate)
            testScore.save(cTestUpdate)
            res.status(201).json("Test Submitted Successfully")
            console.log(testScore)
        });
    }));
});


//get Student aTest Score from the DB (id: studentId)
routerScoreUpdate.get('/aTestScore', checkAuth, function(req,res,next){
    TestScore.find({studentId: req.userData.userId}).then(testScore =>{
        res.status(200).json(testScore[0].aTest)
        console.log(testScore[0].aTest);
    }) 
});

//get Student cTest Score from the DB (id: studentId)
routerScoreUpdate.get('/cTestScore', checkAuth, function(req,res,next){
    TestScore.find({studentId: req.userData.userId}).then(testScore => {
        res.status(200).json(testScore[0].cTest)
        console.log(testScore[0].cTest);
    }) 
});


//update overall Test score to the Student collection when one attempts Practices and Tests (id: studentId)
routerScoreUpdate.put('/overallScoreUpdate', checkAuth, function(req,res,next){
    Student.findById(req.userData.userId).then((student => {
        var sum = req.body.score + student.overallScore
        student.overallScore = sum
        student.save(student.overallScore)
        console.log(student.overallScore)
        res.status(201).json(student.overallScore)
    }))
})


module.exports = routerScoreUpdate;