const express = require("express");
const routerLeader = express.Router();
const checkAuth = require("../middleware/check-auth");

const Student = require("../models/student");

// Get leaderboard of a specific College (Requires: collegeId)
routerLeader.get("", checkAuth, function(req,res,next){
    Student.find({collegeId: req.body.collegeId},{overallScore: 1, firstName: 1, lastName: 1})
        .sort({overallScore: -1})
        .then(studentsList =>{
            console.log(studentsList)
            res.status(201).json(studentsList)
        })
})

module.exports = routerLeader;