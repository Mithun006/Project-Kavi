const express = require('express');
const routerDevelopment = express.Router();
var moment = require('moment-timezone');
const Student = require('../models/student');
const EasyDocx = require('node-easy-docx')
const fs = require('fs')
var toJSON = require('plain-text-data-to-json');
const { json } = require('body-parser');



routerDevelopment.get('/dev', function(req,res,next){
    
    // var doc = fs.readFileSync('C:/Users/user/Desktop/Project/Questions/Text.txt', 'utf8')
    // var data = toJSON(doc)
    // // fs.writeFileSync('output.json', JSON.stringify(data, null, 2) + '\n')
    // console.log(data)

    const json = '"How": 42'
    var out = JSON.parse(json)
    console.log(out.How)
    

});


 

module.exports = routerDevelopment;
