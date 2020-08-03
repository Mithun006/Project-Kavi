const express = require('express');
const routerPracticedQuestionsUpdate = express.Router();
const Student = require('../models/student');
const checkAuth = require('../middleware/check-auth');

//post Practiced Questions IDs in the DB // College/Admin
routerPracticedQuestionsUpdate.post('/:id', function(req,res,next){
    Student.findById(req.params.id).then((student => {
        student.practicedQuestions.push(req.body.practicedQuestions);
        student.save(req.body.practicedQuestions);
        res.status(201).json(student);
        console.log(student);
    }));
});

//get Practiced Questions IDs from the DB 
    routerPracticedQuestionsUpdate.get('/practice', checkAuth, function(req,res,next){
        Student.findById(req.userData.userId).then((student => {
            res.status(200).json(student.practicedQuestions);
            console.log(student.practicedQuestions);
        }))
    })

module.exports = routerPracticedQuestionsUpdate;