const express = require('express');
const routerDocx = express.Router();
const multer = require('multer');
const fs = require('fs');
const TestQuestions = require('../models/testQuestions');
const utf8 = require('utf8');

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


// routerDocx.post('/docx', upload.single('docx'), function(req,res,next){
//         var filePath = req.file.path;

//      const easyDocx = new EasyDocx({
//         path: 'C:/Users/user/Desktop/Project/REST_API_PLAYLIST/docx/uploadedFile.docx'
//         })
//         easyDocx.parseDocx().then(data => {
//             for(var i = 0; i < data.length-1; i = i+1){
//                 var content = new String()
//                 for(var j = 1; j < data[i].items.length-1; j++){
//                     content = content.concat(data[i].items[j].text)
//                 }
//                 console.log(content)
//             }
//             // console.log(data)
//             res.json(data)
//         })
//         .catch(err => {
//             console.error(err)
//         })
// })


/*routerDocx.post('/docx', upload.single('docx'), function(req,res,next){
    let filePath = req.file.path
    fs.readFile(filePath, (err, data) => {
        if(err){
            console.log(err)
            res.send(err)
        }
        let student = JSON.parse(data)
        
        for(let i = 1; i < student.length; i = i+7){
            let ques = student[i].match(/@/)
            console.log(ques)
            // var testQuestion = new TestQuestions({
            //     topic: student[0],
            //     createdBy: null,
            //     question: student[i],
            //     option1: student[i+1],
            //     option2: student[i+2],
            //     option3: student[i+3],
            //     option4: student[i+4],
            //     option5: student[i+5],
            //     answer: student[i+6]
            // })            
            // // testQuestion.save(function(err, question){
            // //     if(err){
            // //         console.log(err)
            // //         res.send(err)
            // //     }
            // //     console.log(question)
            // //     res.status(201).json(question)

            // // })
            // testQuestion.save()
            // console.log(testQuestion)
        }
    })
})
*/


routerDocx.post('/docx', upload.single('docx'), function(req,res,next){
    let filePath = req.file.path
    let data = fs.readFileSync(filePath, 'utf8')
    let topic = data.match(/Topic\:\s(.*)\r\n/m)
    let matchAll = data.matchAll(/[0-9]\)\s(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n[A-Z]\)(.*)\r\n(.*)\r\n/g)
    matchAll = Array.from(matchAll)
    let ques = matchAll[0]
    console.log(ques[0])
    console.log("Topic: "+topic[1])
    let quesArray = new Array()
    
    async ()=> {for(let i = 0; i < matchAll.length; i++){
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
       
        await testQuestion.save()
        quesArray.push(testQuestion)
        }
    }
    // var testQuestion =  new TestQuestions({
    //     topic: topic[1],
    //     question: ques[1],
    //     option1: ques[2],
    //     option2: ques[3],
    //     option3: ques[4],
    //     option4: ques[5],
    //     option5: ques[6],
    //     answer: ques[7]
    // })
    // testQuestion.save()

});
            
            
            
            
            // // Read all questions
// routerDocx.post('/docx', upload.single('docx'), function(req,res,next){
    //     let filePath = req.file.path
    //     let data = fs.readFileSync(filePath, 'utf8')
    //         let matchAll = data.matchAll(/[0-9]\)\s(.*)\r\n/g)
    //         matchAll = Array.from(matchAll)
    //         // let ques = matchAll[14]
    //         // console.log(ques[1])
    //         for(let i = 0; i < matchAll.length; i++){
        //             let ques = matchAll[i]
        //             console.log(ques[1])
        //         }
        // });
        
module.exports = routerDocx