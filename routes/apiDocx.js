const express = require('express');
const routerDocx = express.Router();
const multer = require('multer');
const fs = require('fs');
const TestQuestions = require('../models/testQuestions');

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
    if(file.mimetype === 'application/msword' || file.mimetype === 'text/plain' || file.mimetype === 'application/vnd.ms-word.document.macroenabled.12' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/json'){
        cb(null, true)
    }
    else{
        cb('Upload FAILED...! Upload only MS Word/Text file', false)       
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
    let matchAll = data.matchAll(/[0-9]\)\s(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n(.*)\r\n/g)
    matchAll = Array.from(matchAll)
    // let ques = matchAll[0]
    // console.log(ques[0])
    // console.log("Topic: "+topic[1])
    let quesArray = new Array()
    
        for(let i = 0; i < matchAll.length; i++){
        let ques = matchAll[i]
        var testQuestion =  new TestQuestions({
            topic: topic[1],
            question: ques[1],
            option1: ques[2],
            option2: ques[3],
            option3: ques[4],
            option4: ques[5],
            option5: ques[6],
            answer: ques[7]
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
