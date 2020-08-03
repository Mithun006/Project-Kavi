const express = require('express');
const routerLogin = express.Router();
const Student = require('../models/student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



//Student login post request
routerLogin.post('/studentLogin', async (req,res,next) => {
    Student.findOne({mailId: req.body.mailId}, function(err, userData){
        try{
            if(userData === null)
            {
                console.log("Invalid E-mail ID");
                return res.status(401).json({
                    message: "Invalid E-mail ID" 
                });
            }
            else{
                try {
                    if ( bcrypt.compareSync(req.body.password, userData.password)) {
                        const token = jwt.sign(
                            {mailId: userData.mailId, userId: userData._id},    
                            'secrete_this_should_be_longer', 
                            {expiresIn: '3h'})  
                        console.log("LOGIN SUCCESSFUL");
                        return res.status(200).json({ 
                            message: "LOGIN SUCCESSFUL",
                            token: token,
                            expiresIn: 3600,
                            studentId: userData._id
                        })
                    }
                    else {
                        return res.status(401).json({ message: 'Invalid Password'})
                    }
                }
                catch{
                    console.log(err)
                }
            }
        }   catch{
                console.log(err);
                return res.status(500).send(err)
            }
    });
});

//College login post request
routerLogin.post('/collegeLogin', async (req,res,next) => {
    Student.findOne({mailId: req.body.mailId}, function(err, userData){
        try{
            if(userData === null)
            {
                console.log("Invalid E-mail ID");
                return res.status(401).json({
                    message: "Invalid E-mail ID" 
                });
            }
            else{
                try {
                    if ( bcrypt.compareSync(req.body.password, userData.password)) {
                        const token = jwt.sign(
                            {mailId: userData.mailId, userId: userData._id},    
                            'secrete_this_should_be_longer', 
                            {expiresIn: '1h'})  
                        console.log(userData);
                        return res.status(200).json({ 
                            message: "LOGIN SUCCESSFUL",
                            token: token,
                            expiresIn: 3600,
                            collegeName: userData.collegeName,
                            staffName: userData.staffName,
                            mailId: userData.mailId,
                            contact: userData.contact,
                            premium: userData.premium,
                            studentRecords: userData.studentRecords,
                            testProgess: userData.testProgess,
                            leaderBoard: userData.leaderBoard
                        })
                    }
                    else {
                        return res.status(401).json({ message: 'Invalid Password'})
                    }
                }
                catch{
                    console.log(err)
                }
            }
        }   catch{
                console.log(err);
                return res.status(500).send(err)
            }
    });
});



module.exports = routerLogin;