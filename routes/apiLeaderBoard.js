const express = require("express");
const routerLeader = express.Router();
const checkAuth = require("../middleware/check-auth");

const Student = require("../models/student");

// Get leaderboard of a specific College (Requires: collegeId)
routerLeader.get("", checkAuth, function(req,res,next){
    Student.find({collegeId: req.body.collegeId},{overallScore: 1, firstName: 1, lastName: 1}).then(studentsList => {
        console.log(studentsList.sort().reverse())
        res.status(201).json(studentsList.sort().reverse());
    })
})

module.exports = routerLeader;