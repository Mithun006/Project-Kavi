const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './profileImages');
    },
    filename: function(req, file, cb){
        cb(null, req.params.id + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else{
        cb('Upload FAILED...! Upload only JPEG/PNG file', false)       
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const routerStudentDashboard = express.Router();
const Student = require('../models/student');


//Get Student Profile from DB
routerStudentDashboard.get('/profile', checkAuth, function(req,res,next){
    Student.findById(req.userData.userId).then((studentProfile => {
        res.status(200).json({
        practicedQuestions: studentProfile.practicedQuestions,
        firstName: studentProfile.firstName,
        lastName: studentProfile.lastName,
        mailId: studentProfile.mailId,
        aTest: studentProfile.aTest,
        cTest: studentProfile.cTest
        });
    }));
});


//Edit Student Profile from Student Collection
routerStudentDashboard.put('/profile/:id', upload.single('profilePicture'), function(req, res, next){
    Student.findByIdAndUpdate(req.params.id, req.body, function(err,studentProfile){
        if(err) {
            res.status(503).json({
                message: "Request failed. Please, Try again later!..."
            })
        }
        else{
            Student.findById(req.params.id).then(studentProfile => {
            res.status(201).json(studentProfile);
            })
        }
    });
});


//Upload Profile Picture to the DB
routerStudentDashboard.post('/profilePicture/:id', upload.single('profilePicture'), (req,res,next) => {
    Student.findById(req.params.id).then((studentProfile => {
        studentProfile.profilePicture= req.file.path;
        studentProfile.save();
        res.status(201).json('Profile picture uploaded successfully!...');
        console.log(req.file)
    }))
}); 


module.exports = routerStudentDashboard;