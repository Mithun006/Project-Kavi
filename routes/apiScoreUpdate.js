const express = require('express');
const routerScoreUpdate = express.Router();
const Student = require('../models/student');
const TestScore = require('../models/testScore');
const testScore = require('../models/testScore');

//post Student aTest Score in the DB (id: studentId)
routerScoreUpdate.post('/aTestScoreUpdate/:id', function(req,res,next){
    Student.findById(req.params.id).then((student => {
        TestScore.findById(student.testScore).then(testScore => {
            var aTestUpdate = req.body
            testScore.aTest.push(aTestUpdate)
            testScore.save(aTestUpdate)
            res.status(201)
            res.end()
            console.log(testScore)
        });
    }));
});

//post Student cTest Score in the DB (id: studentId)
routerScoreUpdate.post('/cTestScoreUpdate/:id', function(req,res,next){
    Student.findByIdAndUpdate(req.params.id, req.body, {new : true}).then((student => {
        TestScore.findById(student.testScore).then(testScore => {
            var cTestUpdate = req.body
            testScore.cTest.push(cTestUpdate)
            testScore.save(cTestUpdate)
            res.status(201)
            res.end()
            console.log(testScore)
        });
    }));
});


//get Student aTest Score from the DB (id: studentId)
routerScoreUpdate.get('/aTestScore/:id', function(req,res,next){
    TestScore.find({studentId: req.params.id}).then(testScore =>{
        res.status(200).json(testScore[0].aTest)
        console.log(testScore[0].aTest);
    }) 
});

//get Student cTest Score from the DB (id: studentId)
routerScoreUpdate.get('/cTestScore/:id', function(req,res,next){
    TestScore.find({studentId: req.params.id}).then(testScore => {
        res.status(200).json(testScore[0].cTest)
        console.log(testScore[0].cTest);
    }) 
});


//update overall Test score to the Student collection when one attempts Practices and Tests (id: studentId)
routerScoreUpdate.put('/overallScoreUpdate/:id', function(req,res,next){
    Student.findById(req.params.id).then((student => {
        var sum = req.body.score + student.overallScore
        student.overallScore = sum
        student.save(student.overallScore)
        console.log(student.overallScore)
        res.status(201).json(student.overallScore)
    }))
})


module.exports = routerScoreUpdate;