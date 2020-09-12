const express = require("express");
const routerLearn = express.Router();
const checkAuth = require("../middleware/check-auth");
const Learn = require("../models/learn");
const Image = require("../models/image");
const upload = require('../middleware/upload');
const fs = require('fs');


// Post Learning Materials
routerLearn.post('', checkAuth, async function(req,res,next){
    try{
        await upload(req, res);
        await Learn.create(req.body).then(async material => {
            const url = req.protocol + '://' + req.get('host');
            const imagePathArray = new Array();
            if(req.files != null){
                for(let i = 0; i < req.files.length; i++){
                    await Image.create({image: url+ '/learnModuleImages/' + req.files[i].filename}).then(imageId => {            
                        imagePathArray.push(imageId._id)
                    })
                }
            }
            material.explanation.image = imagePathArray
            material.save();
            console.log(material);
            res.status(201).json({
                message: "Learning Material created successfully",
                material: material});
        })
    }catch(error){
        console.log(error);
        console.log("Sorry... Request cannot be processed. Try again later!!!")
        res.status(400).json("Sorry... Request cannot be processed. Try again later!!!")
    }
})


// Edit particular Learning Material (Required: Learn._id (_id of particular material))
routerLearn.put('/:id', checkAuth, async function(req,res,next){
    await upload(req, res);
    await Learn.findByIdAndUpdate(req.params.id, req.body, async function(err, updatedMaterial){
        if(err){
            console.log(err + "Request failed. Please, Try again later!...")
            return res.status(503).json({
                message: "Request failed. Please, Try again later!..."
            })
        }
        else if(updatedMaterial === null){
            console.log("Sorry... Material not found!!!")
            return res.status(404).json({
                message: "Sorry... Material not found!!!"
            })
        }
        else if(req.files != null){
            await Learn.findById(req.params.id).then(async (updatedMaterialImg) => {
                const url = req.protocol + '://' + req.get('host');
                for(let i = 0; i < req.files.length; i++){
                    await Image.create({image: url+ '/learnModuleImages/' + req.files[i].filename}).then(imageId => {            
                        updatedMaterialImg.explanation.image.push(imageId._id)
                    })
                }
                updatedMaterialImg.save()
                console.log(updatedMaterialImg)
                return res.status(201).json(updatedMaterialImg)
            })
        }
        console.log(updatedMaterial);
        res.status(201).json(updatedMaterial);
    })
})

// Get all Learning Material 
routerLearn.get('', checkAuth, function(req,res,next){
    try{
        Learn.find({},{_id: 1, topic: 1}).then(learnDocs => {
            console.log(learnDocs)
            res.status(201).json(learnDocs)
        })
    }catch{
        console.log("Sorry... Request cannot be processed. Try again later!!!")    
        res.status(400).json("Sorry... Request cannot be processed. Try again later!!!")
    }
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

// remove images from Leaern Material (Requires: Learn._id, Image._id, removeFiles: [])
routerLearn.delete('/deleteImage/:id', checkAuth, function(req,res,next){
    Learn.findById(req.params.id).populate('explanation.image').then(async (learnDoc) => {
        let removeFiles = req.body.removeFiles;
        if(learnDoc === null){
            console.log("Sorry... Resource not found!!!")
            return res.status(404).json("Sorry... Resource not found!!!")
        }
        else{
            const url = req.protocol + '://' + req.get('host') + '/';
            let imageArray = new Array()
            for(let i = 0; i < learnDoc.explanation.image.length; i++){
                removeFiles.forEach(element => {
                    let count = 0;
                    if(`${learnDoc.explanation.image[i]._id}` === element){
                        let path = learnDoc.explanation.image[i].image.split(url)
                        fs.unlink(path[1], function(err){
                            if(err){
                                console.log(err)
                                return res.status(400).json(err)
                            }
                        })
                        count++
                    }
                    if(count === 0)
                        imageArray.push(learnDoc.explanation.image[i]._id)
                });
            }
            await Image.findByIdAndRemove(removeFiles, function(err, docs){
                if(err){
                    console.log(err)
                    return res.status(400).json(err)
                }
            });
            learnDoc.explanation.image = imageArray;
            learnDoc.save();
            console.log(learnDoc)
            res.status(201).json({
                message: "Update successful",
                learnDoc: learnDoc
            })
        }
    })
})

module.exports = routerLearn;
