const express = require('express');
const routerProgress = express.Router();
const Student = require('../models/student');
const TestScore = require('../models/testScore');
const ATest = require('../models/aTest');
const CTest = require('../models/cTest')
var dateArr = new Array();
var scoreArr = new Array()       // -----------CHANGE THE SCORE INTO PERCENTAGE, PERFORM AVERAGE AND ADD IT TO THE SCOREARR ----------------
var sum = 0;
var conflict = new Boolean();


//get daily progress (id: studentId)
routerProgress.get('/daily/:id', function(req,res,next){
    Student.findById(req.params.id).then(student => {
        TestScore.findById(student.testScore).then(testScore => {
            dateArr = []
            scoreArr = []
            for(var i = 0; i < testScore.aTest.length; i++){
                // Identify if a date has already been added to the dateArr[] and scoreArr[]
                conflict = false
                var date1 = new String(testScore.aTest[i].startTime.getDate())
                date1 = date1.concat('-', new String(testScore.aTest[i].startTime.getMonth()+1), '-', new String(testScore.aTest[i].startTime.getYear()+1900))
                dateArr.forEach(element => {
                    if(element === date1)
                        conflict = true
                });
                if(conflict === true)  
                    continue
                dateArr.push(date1)
                sum = testScore.aTest[i].score
                // Compare every date in aTest array with aTest array and cTest array (Adds dates that are present commonly in aTest & cTest and that are present only in aTest)
                for(var j = i+1; j < testScore.aTest.length; j++){
                    var date2 = new String(testScore.aTest[j].startTime.getDate())
                    date2 = date2.concat('-', new String(testScore.aTest[j].startTime.getMonth()+1), '-', new String(testScore.aTest[j].startTime.getYear()+1900))
                    if(date1 === date2)
                        sum = sum + ((testScore.aTest[j].score/ATest.findOne({ id: `${testScore.aTest[j].testId}`}).populate('maxMark'))*100)
                }
                for(var k = 0; k < testScore.cTest.length; k++){
                    var date2 = new String(testScore.cTest[k].startTime.getDate())
                    date2 = date2.concat('-', new String(testScore.cTest[k].startTime.getMonth()+1), '-', new String(testScore.cTest[k].startTime.getYear()+1900))
                    if(date1 === date2)
                        sum = sum + ((testScore.cTest[k].score/CTest.findOne({ id: `${testScore.cTest[k].testId}`}).populate('maxMark'))*100)
                }
                scoreArr.push(sum)
            }
            // Adding the date and score that is present ONLY in cTest
            for(var i = 0;  i < testScore.cTest.length; i++){
                conflict = false
                var date1 = new String(testScore.cTest[i].startTime.getDate())
                date1 = date1.concat('-', new String(testScore.cTest[i].startTime.getMonth()+1), '-', new  String(testScore.cTest[i].startTime.getYear()+1900))
                dateArr.forEach(element => {
                    if(element === date1)
                        conflict = true
                });
                if(conflict === true)
                    continue
                dateArr.push(date1)
                scoreArr.push((testScore.cTest[i].score/CTest.findOne({ id: `${testScore.cTest[i].testId}`}).populate('maxMark'))*100)
            }
            console.log(dateArr)
            console.log(scoreArr)
            res.status(201).json({
                dateArr: dateArr,
                scoreArr: scoreArr
            })
        })
    })
})


//get monthly progress (id: studentId)
routerProgress.get('/monthly/:id', function(req,res,next){
    Student.findById(req.params.id).then(student => {
        TestScore.findById(student.testScore).then(testScore => {
            dateArr = []
            scoreArr = []
            for(var i = 0; i < testScore.aTest.length; i++){
                conflict = false
                var date1 = testScore.aTest[i].startTime.getMonth()+1
                dateArr.forEach(element => {
                    if(element === date1)
                        conflict = true
                });
                if(conflict === true)  
                    continue
                dateArr.push(date1)
                sum = testScore.aTest[i].score
                for(var j = i+1; j < testScore.aTest.length; j++){
                    var date2 = testScore.aTest[j].startTime.getMonth()+1
                    if(date1 === date2)
                        sum = sum + testScore.aTest[j].score
                }
                for(var k = 0; k < testScore.cTest.length; k++){
                    var date2 = testScore.cTest[k].startTime.getMonth()+1
                    if(date1 === date2)
                        sum = sum + testScore.cTest[k].score
                }
                scoreArr.push(sum)
            }
            for(var i = 0;  i < testScore.cTest.length; i++){
                conflict = false
                var date1 = testScore.cTest[i].startTime.getMonth()+1
                dateArr.forEach(element => {
                    if(element === date1)
                        conflict = true
                });
                if(conflict === true)
                    continue
                dateArr.push(date1)
                scoreArr.push(testScore.cTest[i].score)
            }
            console.log(dateArr)
            console.log(scoreArr)
            res.status(201).json({
                monthArr: dateArr,
                scoreArr: scoreArr
            })
        })
    })
})

// get weekly progress (id: studentId)
routerProgress.get('/weekly/:id', function(req,res,next){
    Student.findById(req.params.id).then(student => {
        TestScore.findById(student.testScore).then(testScore => {

            // Defining required varibales, constants and arrays
            var dFactor = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
            var firstEntry = new Array();
            var secondEntry = new Array();
            var weekStartDate = new Number();
            var weekStartMonth = new Number();
            var weekStartYear = new Number();
            var weekStartDay = new Number();
            var weekEndDate = new Number();
            var weekEndMonth = new Number();
            var weekEndYear = new Number();
            var week = new Number();
            var continueIteration = new Boolean(true);
            const today = new Date();
            var filteredFirstArr = new Array();
            var filteredSecondArr = new Array();
            dateArr = []
            scoreArr = []

            // Finding whether aTest or cTest has the 1st testScore attended
            if(testScore.aTest[0].startTime.getYear()+1900 < testScore.cTest[0].startTime.getYear()+1900){
                firstEntry = testScore.aTest
                secondEntry = testScore.cTest
            }
            else if(testScore.aTest[0].startTime.getYear()+1900 === testScore.cTest[0].startTime.getYear()+1900){
                if(testScore.aTest[0].startTime.getMonth()+1 < testScore.cTest[0].startTime.getMonth()+1){
                    firstEntry = testScore.aTest
                    secondEntry = testScore.cTest
                }
                else if(testScore.aTest[0].startTime.getMonth()+1 === testScore.cTest[0].startTime.getMonth()+1){
                    if(testScore.aTest[0].startTime.getDate() <= testScore.cTest[0].startTime.getDate()){
                        firstEntry = testScore.aTest
                        secondEntry = testScore.cTest
                    }
                }
                else{
                    firstEntry = testScore.cTest
                    secondEntry = testScore.aTest
                }
            }   
            else{ 
                firstEntry = testScore.cTest
                secondEntry = testScore.aTest
            }

            
            // Iterating to get the week and filter all the dates that fall in that week
            // Initialize weekStartDate
                weekStartDate = firstEntry[0].startTime.getDate()
                weekStartMonth = firstEntry[0].startTime.getMonth() + 1
                weekStartYear = firstEntry[0].startTime.getYear()+1900
                weekStartDay = firstEntry[0].startTime.getDay()
            for(var i = 0; continueIteration; i++){
                // Find the either Leap Year or not and update the dFactor Array
                if(weekStartYear % 4 === 0){
                    if(weekStartYear % 100 === 0){
                        if(weekStartYear % 400 === 0)
                            dFactor[1] = 29
                        else    
                            dFactor[1] = 28
                    }
                    else   
                        dFactor[1] = 29
                }
                else
                    dFactor[1] = 28
                // Determining the weekEndDate
                var sum = 0
                filteredFirstArr = []
                filteredSecondArr = []
                if(i === 0)
                    week = 1
                else week++
                if(i === 0){
                    var addToGetWeekEnd =  6 - weekStartDay
                    weekEndDate = (weekStartDate + addToGetWeekEnd) % dFactor[weekStartMonth-1]
                }
                else
                    weekEndDate = (weekStartDate + 6) > dFactor[weekStartMonth-1]?(weekStartDate + 6) % dFactor[weekStartMonth-1]:weekStartDate + 6
                if((weekStartDate+6) > dFactor[weekStartMonth-1])
                    weekEndMonth = (weekStartMonth + 1) % 12
                else    
                    weekEndMonth = weekStartMonth
                if((weekStartMonth + 1) > 12)
                    weekEndYear = (weekStartYear + 1)
                else 
                    weekEndYear = weekStartYear    

                // Filtering out the dates falling in current week
                firstEntry.filter(value => {
                    if(((value.startTime.getYear()+1900) >= weekStartYear) && ((value.startTime.getYear()+1900) <= weekEndYear)){
                        if(((value.startTime.getMonth()+1 >= weekStartMonth) && (value.startTime.getMonth()+1 <= weekEndMonth)) || ((value.startTime.getMonth()+2 % 12) === 1)){
                            if(((value.startTime.getDate() >= weekStartDate ) && (value.startTime.getDate() <= weekEndDate)) || (((value.startTime.getDate() + (6 - value.startTime.getDay())) % dFactor[value.startTime.getMonth()]) <= 7)){
                                filteredFirstArr.push(value.score)
                            }
                        } 
                    }
                })
                secondEntry.filter(value => {
                    if(((value.startTime.getYear()+1900) >= weekStartYear) && ((value.startTime.getYear()+1900) <= weekEndYear)){
                        if(((value.startTime.getMonth()+1 >= weekStartMonth) && (value.startTime.getMonth()+1 <= weekEndMonth)) || ((value.startTime.getMonth()+2 % 12) === 1)){
                            if(((value.startTime.getDate() >= weekStartDate ) && (value.startTime.getDate())) || (((value.startTime.getDate() + (6 - value.startTime.getDay())) % dFactor[value.startTime.getMonth()]) <= 7)){
                                filteredSecondArr.push(value.score)
                            }
                        } 
                    }
                })

                sum = sum + (filteredFirstArr.length === 0? 0:filteredFirstArr.reduce((a,b) => a+b)) + (filteredSecondArr.length === 0? 0:filteredSecondArr.reduce((a,b) => a+b))

                dateArr.push(week)
                scoreArr.push(sum)

                weekStartDate = (weekEndDate + 1) > dFactor[weekEndMonth-1]? (weekEndDate + 1) % dFactor[weekEndMonth-1]:(weekEndDate + 1)
                weekStartMonth = (weekEndDate + 1) > dFactor[weekEndMonth-1]? ((weekEndMonth + 1) % 12): weekEndMonth
                weekStartYear = (weekStartMonth === 1)? weekEndYear+1:(weekEndYear)
                
                //Determining the end of the iteration
                if((today.getYear()+1900) < weekStartYear)
                    continueIteration = false
                else if((today.getYear()+1900) === weekStartYear && (today.getMonth()+1) < weekStartMonth)
                    continueIteration = false
                else if(((today.getYear()+1900) === weekStartYear) && ((today.getMonth()+1) === weekStartMonth) && (today.getDate() < weekStartDate))
                    continueIteration = false
                else
                    continueIteration = true
            }
            res.status(201).json({
                weekArr: dateArr,
                scoreArr: scoreArr
            })
        })
    })
})


module.exports = routerProgress;