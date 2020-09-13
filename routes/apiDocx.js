const express = require('express');
const routerDocx = express.Router();
const multer = require('multer');
const fs = require('fs');
const TestQuestions = require('../models/testQuestions');
const { emitKeypressEvents } = require('readline');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './docx');
    },
    filename: function(req, file, cb){
        cb(null, 'uploadedFile.json')
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'text/plain'){
        cb(null, true)
    }
    else{
        cb('Upload FAILED...! Upload only Plain text file (.txt)', false)       
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});



routerDocx.post('/docx', upload.single('docx'), function(req,res,next){
    let filePath = req.file.path
    let data = fs.readFileSync(filePath, 'utf8')
    let topic = data.match(/Topic\:\s(.*)\r\n/m)
    let matchAll = data.matchAll(/[0-9]\)\s(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\nCorrect Option\:\s(.*)\r\n/g)
    matchAll = Array.from(matchAll)
    // let ques = matchAll[0]
    // console.log(ques[0])
    // console.log("Topic: "+topic[1])
    let quesArray = new Array()
    
        for(let i = 0; i < matchAll.length; i++){
        let ques = matchAll[i]
        let ans = 0
        if(ques[6] ==='A')
            ans = 2
        else if(ques[6] === 'B')
            ans = 3
        else if(ques[6] === 'C')
            ans = 4
        else if(ques[6] === 'D')
            ans = 5
        var testQuestion =  new TestQuestions({
            topic: topic[1],
            question: ques[1],
            option1: ques[2],
            option2: ques[3],
            option3: ques[4],
            option4: ques[5],
            answer: ques[ans]
        })
        quesArray.push(testQuestion)
    }
    console.log(quesArray)
    
    TestQuestions.insertMany(quesArray).then(() => {
        console.log("Questions successfully saved to DB")
    })
    res.status(201).json({
        message: "Questions successfully saved to DB"})
});
            
module.exports = routerDocx