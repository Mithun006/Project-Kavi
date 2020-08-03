const express = require('express');
const multer = require('multer');
const fs = require('fs')
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './profileImages');
    },
    filename: function(req, file, cb){
        cb(null, req.userData.userId + '.jpeg')
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
    /*limits: {
        fileSize: 1024 * 1024 * 5
    },*/
    fileFilter: fileFilter
});

const routerStudentDashboard = express.Router();
const Student = require('../models/student');
const College = require('../models/college');


//Get Student Profile from DB
routerStudentDashboard.get('/profile', checkAuth, function(req,res,next){
    Student.findById(req.userData.userId, {firstName: 1, lastName: 1, mailId: 1, contact: 1, degree: 1, department: 1, graduatingYear: 1, collegeId: 1}).then(studentProfile => {
        College.findById(studentProfile.collegeId).then(college => {
            res.status(201).json({
                studentProfile: studentProfile,
                collegeName: college.collegeName
            });
            console.log(studentProfile);
        });;
    });
});


//Edit Student Profile from Student Collection
routerStudentDashboard.put('/profileUpdate', checkAuth, function(req, res, next){
    Student.findByIdAndUpdate(req.userData.userId, req.body, function(err,studentProfile){
        if(err) {
            res.status(503).json({
                message: "Request failed. Please, Try again later!..."
            })
        }
        else{
            Student.findById(req.userData.userId, {firstName: 1, lastName: 1, mailId: 1, contact: 1, degree: 1, department: 1, graduatingYear: 1, collegeId: 1}).then(studentProfile => {
                College.findById(studentProfile.collegeId).then(college => {
                    res.status(201).json({
                        studentProfile: studentProfile,
                        collegeName: college.collegeName
                    });
                    console.log(studentProfile);
                });
            })
        };
    });
});


//Upload/Edit Student profilePicture
routerStudentDashboard.put('/profilePictureUpdate', checkAuth, upload.single('profilePicture'), (req,res,next) =>{
    Student.findByIdAndUpdate(req.userData.userId).then((studentProfile => {
        studentProfile.profilePicture = req.file.path;
        studentProfile.save();
        res.status(201).json('Profile picture updated successfully!...');
        console.log(req.file)
    }))
})

//Remove student profilePicture
routerStudentDashboard.delete('/profilePictureRemove', checkAuth, function(req,res,next){
    Student.findById(req.userData.userId).then(studentProfile => {
        fs.unlink(studentProfile.profilePicture, function(err){
            if(err){
                res.json('No profile picture exists')
                console.log('No profile picture exists')
            }
            else{
                res.json('Profile Picture removed successfully')
                console.log('Profile Picture removed successfully')
            }
        })
        studentProfile.profilePicture = ""
    })
})


module.exports = routerStudentDashboard;