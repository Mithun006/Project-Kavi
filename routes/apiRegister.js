const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const College = require('../models/college');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//get student data from the db
router.get('/student', function(req,res,next){
    Student.find().then((documents) => {
        res.status(200).json({documents});
        console.log('Registrations fetched successfully');
    });
});

//get college names and _id
router.get('/registration',function(req,res,next){
    College.find({},{collegeName: 1, _id: 1}).then(doc => {
        res.status(201).json(doc)
        console.log(doc)
    });
});


//add a new student to the db
router.post('/studentRegister', async(req,res,next) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const student = new Student({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mailId: req.body.mailId,
                password: hashedPassword,
                contact: req.body.contact,
                degree: req.body.degree,
                department: req.body.department,
                graduatingYear: req.graduatingYear,
                collegeName: req.body.collegeName
            });
       student.save(function(err,result){
           if(err){
               console.log(err);
               res.status(409).json({
                   message: "E-Mail ID already exists. Try again with a different E-Mail ID"
               })
           }
           else {            
                const token = jwt.sign({
                    mailId: result.mailId,
                    _id: result._id},
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: 600}
                )

            const url = `http://localhost:4000/confirmation/${token}`

            const msg = {
                from: 'mithunsolomon@gmail.com',
                to: /*`${req.body.mailId}`*/ 'jyxxnkbgukilijlwcn@ttirv.net',
                subject: "Confirmation Mail: ",
                html: `<b>Hello ${req.body.firstName}, you have registered at PROJECT_KAVI.<br> Click on the following URL link to confirm your Mail Id: <a href = ${url}> ${url} </a> <br> <b>THIS URL EXPIRES IN 10 MINUTES.</b></b>`
            };

            sgMail.send(msg).then(() => {}, error => {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body)
                }
            });
            (async () => {
                try {
                  await sgMail.send(msg);
                  console.log("Mail sent");
                  res.status(201).json(`Confirmation mail expiring in 10 minutes is sent to ${req.body.mailId}. Please Confirm your Mail-ID`);
                } catch (error) {
                  console.error(error);
               
                  if (error.response) {
                    console.error(error.response.body)
                  }
                }
            })();
            
            // (async (_, {token}) => {
            //     try{
            //         const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            //         return true
            //     }
            //     catch(err){
            //         return false
            //     }
            // })();

        }    
    })}
    catch{
        res.status(500).json({
        message: "Registration Failed"
        });
    }

});


router.get('/confirmation/:token', async(req,res,next) => {
    console.log(req.params.token);
})



//add a new college/staff to the db
router.post('/collegeRegister', async(req,res,next) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const college = new College({
                collegeName: req.body.collegeName,
                staffName: req.body.staffName,
                mailId: req.body.mailId,
                password: hashedPassword,
                contact: req.body.contact, 
                testProgress: req.body.testProgress,
                leaderBoard: req.body.leaderBoard
            });
       college.save(function(err,result){
           if(err){
               console.log(err);
               res.status(409).json({
                   message: "E-Mail ID already exists. Try again with a different E-Mail ID"
               })
           }
           else {
                res.status(201).json({
                message: "Registration successful"
            });
            console.log(result);
           }
       });
    } catch{
        res.status(500).json({
            message: "Registration Failed"
        });
    }
});


//update a Student in the db
router.put('/student/:id', function(req,res,next){
    res.send({type:'PUT'});
});

//delete a student from the db
router.delete('/student/:id', function(req,res,next){
    student.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Registration DELETED'});
    });
});


module.exports = router;