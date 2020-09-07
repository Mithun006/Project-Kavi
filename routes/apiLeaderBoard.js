const express = require("express");
const routerLeader = express.Router();
const checkAuth = require("../middleware/check-auth");

const Student = require("../models/student")

// Get leaderboard of a specific College (Requires: collegeId)
routerLeader.get('', checkAuth, function(req,res,next){
    Student.find({collegeId: req.body.collegeId}, {overallScore: 1, firstName: 1, lastName: 1})
        .sort({overallScore: -1})
        .then(studentsList =>{
            console.log(studentsList)
            res.status(201).json(studentsList)
        })
})

// Get Ranksheet for a specific cTest (Requires: _id(cTest))
routerLeader.get('/rankSheet/cTest', checkAuth, function(req,res,next){
    Student.find({collegeId: req.body.collegeId}, {_id: 1, firstName: 1, lastName: 1}).populate('testScore').then(studentsList =>{
        let rankSheet = new Array()
        studentsList.forEach(value =>{
            value.testScore.cTest.forEach(element => {
                if(element.testId.equals(req.body.cTest)){
                    rankSheet.push({
                        score: element.score,
                        studentId: value._id,
                        firstName: value.firstName,
                        lastName: value.lastName
                    })
                }
            });
        });
        console.log(rankSheet.sort(function(a,b){return a.score - b.score}).reverse())
        res.status(201).json(rankSheet.sort(function(a,b){return a.score - b.score}).reverse())
    })            
});

// Get Ranksheet for a specific cTest (Requires: _id(cTest))
routerLeader.get('/rankSheet/aTest', checkAuth, function(req,res,next){
    Student.find({collegeId: req.body.collegeId}, {_id: 1, firstName: 1, lastName: 1}).populate('testScore').then(studentsList =>{
        let rankSheet = new Array()
        studentsList.forEach(value =>{
            value.testScore.aTest.forEach(element => {
                if(element.testId.equals(req.body.aTest)){
                    rankSheet.push({
                        score: element.score,
                        studentId: value._id,
                        firstName: value.firstName,
                        lastName: value.lastName
                    })
                }
            });
        });
        console.log(rankSheet.sort(function(a,b){return a.score - b.score}).reverse())
        res.status(201).json(rankSheet.sort(function(a,b){return a.score - b.score}).reverse())
    })            
});


module.exports = routerLeader;
