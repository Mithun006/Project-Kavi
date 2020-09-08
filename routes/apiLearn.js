const express = require("express");
const routerLearn = express.Router();
const checkAuth = require("../middleware/check-auth");
const Learn = require("../models/learn");
const router = require("./apiRegister");
const { updateOne } = require("../models/learn");

// Post Learning Materials
routerLearn.post('', checkAuth, function(req,res,next){
    try{
        Learn.create(req.body).then(material => {
        console.log(material);
        res.status(201).json(material);
        })
    }catch{
        console.log("Sorry... Request cannot be processed. Try again later!!!")
        res.status(400).json("Sorry... Request cannot be processed. Try again later!!!")
    }
})

// Edit particular Learning Material (Required: Learn._id (_id of particular material))
routerLearn.put('/:id', checkAuth, async function(req,res,next){
    const filter = {_id: req.params.id};
    await Learn.updateOne(filter, req.body);
    Learn.findById(req.params.id).then(updatedMaterial => {
        if(updatedMaterial === null){
            console.log("Sorry... Material not found!!!")
            return res.status(404).json("Sorry... Material not found!!!")
        }
        console.log(updatedMaterial);
        res.status(201).json(updatedMaterial);
    })
})

// Get particular Learning Material (Required: Learn._id (_id of particular material))
routerLearn.get('/:id', checkAuth, function(req,res,next){
    Learn.findById(req.params.id).then(material => {
        if(material === null){
            console.log("Material not found!!!")
            return res.status(404).json("Material not found!!!")
        }
        console.log(material);
        res.status(200).json(material)
    })
})

// Delete particular Learning Material (Required: Learn._id (_id of particular material))
routerLearn.delete('/:id', checkAuth, function(req,res, next){
    const result = Learn.findOneAndRemove(req.params.id).then((doc) => {
        if(doc === null){
            console.log("Sorry... Material not found!!!")
            return res.status(404).json("Sorry... Material not found!!!")
        }
        console.log("Material deleted successfully");
        res.status(204).json("Material deleted successfully")
    })
})


module.exports = routerLearn;
