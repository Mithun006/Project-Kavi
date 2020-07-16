const express = require('express');
const routerPractice = express.Router();
const Practice = require('../models/practice');
const Student = require('../models/student');
var solved = [];
var pQuestionsIds = [];
var unsolved = [];

//Get Practice Questions from the DB
routerPractice.get('/practice', function(req,res,next){
    Practice.find().then((practiceQuestions => {
        res.status(200).json({practiceQuestions});
        console.log(practiceQuestions);
    }));
});


//Get Practice Questions ID, Topic, Message, Difficulty, Solved & Unsolved using Student Id from the Practice collection
routerPractice.get('/practiceId/:id', function(req,res,next){
   Practice.find({}, {_id: 1, topic: 1, message: 1, difficulty: 1}).then((documents) => {
        Student.findById(req.params.id).then((studentProfile) => {
            solved = studentProfile.practicedQuestions;
    
        documents.forEach((e1) => {
            pQuestionsIds.push(e1._id);
        });
        pQuestionsIds.forEach((e1) => solved.forEach((e2) => {
            if(e1.equals(e2)){
                return
            }
            else{ 
                unsolved.push(e1) 
            }
        }));
        res.status(201).json({
            documents: documents,
            solved: solved,
            unsolved: unsolved
        })
        console.log(documents)
        console.log(solved)
        console.log(unsolved)
    })});
});


//Post Practice Questions to the DB
routerPractice.post('/practiceQuestions', function(req,res,next){
    Practice.create(req.body).then(function(practiceQuestions){
        res.status(201).json({
            message: "Question posted successful"
             });
        console.log(practiceQuestions);
    })
})

//Get Practice Questions based on ID from the DB
routerPractice.get('/:id', function(req,res,next){
    Practice.findById(req.params.id).then((practiceQuestions => {
        res.status(200).json({practiceQuestions});
        console.log(practiceQuestions);
    }));
});

//Update Practice Questions based on ID from the DB
routerPractice.put('/:id', function (req,res,next){
    Practice.findByIdAndUpdate(req.params.id, req.body, function(err, practiceQuestion){
        if(err){
            res.status(503).json({
                message: "Request failed. Please, Try again later!..."
            })
        }
        else{
            Practice.findById(req.params.id).then((practiceQuestion) => {
                res.status(201).json(practiceQuestion)
            })
        }
    });
});


module.exports = routerPractice;