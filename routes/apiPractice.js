const express = require('express');
const routerPractice = express.Router();
const Practice = require('../models/practice');
const Student = require('../models/student');
const checkAuth = require('../middleware/check-auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const Image = require('../models/image');
const uploadFilesMiddleware = require('../middleware/upload');
var solved = [];
// var pQuestionsIds = [];
// var unsolved = [];


//Same as that of the get('/practice') in apiPractice.js
//Get Practice Questions ID, Topic, Message, Difficulty, Solved & Unsolved using Student Id from the Practice collection
routerPractice.get('/practice', checkAuth, function(req,res,next){
   Practice.find({}, {_id: 1, topic: 1, message: 1, difficulty: 1}).then((documents) => {
        Student.findById(req.userData.userId).then((studentProfile) => {
            var solved = studentProfile.practicedQuestions;
            var pQuestionsIds = new Array()
            var unsolved = new Array()
    
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
        })
    });
});


//Post Practice Questions to the DB //College or Admin (Require: imageCountArray)
routerPractice.post('/practiceQuestions',checkAuth, async function(req,res,next){
    try{
        await upload(req, res);
        const url = req.protocol + '://' + req.get('host');
        const imagePathArray = new Array();
        const imageArrayCount = 2
        for(let i = 0; i < imageArrayCount; i++){
            await Image.create({image: url+ '/learnModuleImages/' + req.files[i].filename}).then(imageId => {            
                imagePathArray.push(imageId._id)
            })
        }
        await Practice.create(req.body).then(practiceQuestions => {
            practiceQuestions.image = imagePathArray
            practiceQuestions.save();
            res.status(201).json({
                message: "Question posted successful"
                });
            console.log(practiceQuestions);
        })
    }catch(error){
        console.log(error);
        console.log("Sorry... Request cannot be processed. Try again later!!!")
        res.status(400).json("Sorry... Request cannot be processed. Try again later!!!")
    }
})

//Get Practice Questions based on ID from the DB (id: practiceQuestionId)
routerPractice.get('/practice/:id', checkAuth, function(req,res,next){
    Practice.findById(req.params.id).then((practiceQuestions => {
        res.status(200).json({practiceQuestions});
        console.log(practiceQuestions);
    }));
});

//Update Practice Questions based on ID from the DB //College or Admin
routerPractice.put('/:id', checkAuth, async function (req,res,next){
    await upload(req, res);
    console.log(req.files);
    Practice.findByIdAndUpdate(req.params.id, req.body, function(err, practiceQuestion){
        if(err){
            console.log("Request failed. Please, Try again later!...")
            return res.status(503).json({
                message: "Request failed. Please, Try again later!..."
            })
        }
        else if(practiceQuestion === null){
            console.log("Sorry... Resource not found!!!")
            return res.status(404).json({
                message: "Sorry... Resource not found!!!"
            })
        }
        else{
            Practice.findById(req.params.id).then((practiceQuestion) => {
                practiceQuestions.solution.image.push(req.file.path)
                practiceQuestions.save()
                console.log(practiceQuestion)
                res.status(201).json(practiceQuestion)
            })
        }
    });
});

// remove images from practice doc (Requires: Practice._id, Image._id, removeFiles: [])
routerPractice.delete('/:id', checkAuth, function(req,res,next){
    Practice.findById(req.params.id).populate('image').then(async (practiceQuestion) => {
        let removeFiles = req.body.removeFiles;
        // await Image.findByIdAndRemove(removeFiles, function(err, docs){
        //     if(err){
        //         console.log(err)
        //         return res.status(400).json(err)
        //     }
        // });
        // const url = req.protocol + '://' + req.get('host') + '/';
        // for(let i = 0; i < removeFiles.length; i++){
        //     let path = practiceQuestion.image[i].image.split(url)
        //     fs.unlink(path[1], function(err){
        //         if(err){
        //             console.log(err)
        //             return res.status(400).json(err)
        //         }
        //     })
        // }
        let imageArray = new Array()
        for(let i = 0; i < practiceQuestion.image.length; i++){
            removeFiles.forEach(element => {
                let count = 0;
                if(`${practiceQuestion.image[i]._id}` === element){
                    count++
                }
                if(count === 0)
                    imageArray.push(practiceQuestion.image[i]._id)
            });
        }
        console.log(removeFiles)
        console.log(imageArray)
        practiceQuestion.image.pop();
    })
})


module.exports = routerPractice;