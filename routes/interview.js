const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Interview = require("../models/interview");
const routerInterview = express.Router();


// Create company specific material
routerInterview.post('', checkAuth, function(req,res,next){
    try{
        Interview.create(req.body).then(companySpecificDoc => {
            console.log(companySpecificDoc);
            res.status(201).json(companySpecificDoc);
        })

    }catch{
        console.log("Sorry, the request cannot be processed. Try again, later!!!");
        res.status(400).json("Sorry, the request cannot be processed. Try again, later!!!");
    }
})

// Edit particular Interview Document (Required: Interview._id (_id of particular interview doc))
routerInterview.put('/:id', checkAuth, async function(req,res,next){
    const filter = {_id: req.params.id};
    await Interview.updateOne(filter, req.body);
    Learn.findById(req.params.id).then(updatedDoc => {
        if(updatedDoc === null){
            console.log("Sorry... Resource not found!!!")
            return res.status(404).json("Sorry... Resource not found!!!")
        }
        console.log(updatedDoc);
        res.status(201).json(updatedDoc);
    })
})

// get all company specific material
routerInterview.get('', checkAuth, function(req,res,next){
    Interview.find({}, {company: 1, _id: 1, testDuration: 1}).then(companySpecificDoc => {
        if(companySpecificDoc === null){
            console.log("Sorry... Resource not found!!!");
            return res.status(404).json("Sorry... Resource not found!!!");
        }
        console.log(companySpecificDoc);
        res.status(200).json(companySpecificDoc);
    })
})

// get particular company specific material with id (Required: Interview._id)
routerInterview.get('/:id', checkAuth, function(req,res,next){
    Interview.findById(req.params.id).then(companySpecificDoc => {
        if(companySpecificDoc === null){
            console.log("Sorry... Resource not found!!!");
            return res.status(404).json("Sorry... Resource not found!!!");
        }
        console.log(companySpecificDoc);
        res.status(200).json(companySpecificDoc);
    })
})

// get particular company specific test with id (Required: Interview._id, Interview.test)




module.exports = routerInterview;