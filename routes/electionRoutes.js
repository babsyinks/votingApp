const axios = require('axios');
const FormData = require('form-data');
const express = require('express')
const path = require('path')
const sharp = require('sharp')
const multer = require('multer')
const fs = require('fs')
const permittedAuth = require('../middleware/permittedAuth')
const electionAuth = require('../middleware/electionAuth')
const {Votes} = require('../models') 
const {Contestants} = require('../models')
const {Timer} = require('../models')
require('dotenv').config({path:path.join('..','.env')});
const Router = express.Router()
Router.use(express.json())  
 
const upload = multer({
    limits:{fileSize:1000000 },
    fileFilter(req,file,cb){    
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
       return cb(new Error("invalid image format."))
    }
    cb(undefined,true)
       },
       onError : function(err, next) {
        console.log('error', err);
        next(err);
      }
    })  

Router.post('/contestants',upload.single('picture'),async(req,res)=>{
    let filePath
    const fileName = req.file.originalname
    try {
        const{surname,firstName,post,manifesto} = req.body  
        await sharp(req.file.buffer).resize({width:300,height:300}).toFile(`${fileName}`)
        filePath = path.join(__dirname,'..',fileName) 
        console.log('API Key:', `"${process.env.IMGBB_API_KEY}"`);
        const resp = await imgbbUploader(`${process.env.IMGBB_API_KEY}`,filePath)
        console.log('after imgbb req')
        fs.unlink(filePath,(err)=>{
            if(err){
                console.log(err.message)
            }
        })
        const contestant = {surname,firstname:firstName,position:post,manifesto,picture:resp.display_url}
        await Contestants.create(contestant)
            res.json({message:'success'})
    } catch (error) {
        console.log(error)
        fs.unlink(filePath,(err)=>{
            if(err){
                console.log(err.message)
            }
        })
        const errMsg = error.response ? error.response.data : error.message
        console.error('Error:', errMsg);
        res.status(500).json({ error: errMsg });
    }
})

Router.get('/details',electionAuth,async(req,res)=>{
    const user = req.user

    const allContestants =  await Contestants.findAll()
    const allElections = await Votes.findAll()

    
    if(allContestants.length === 0){
     return res.status(404).send({message:'There Is Currently No Election.'})
    }
    else{
        const positionRank = {"president":0,"vice president":1,"general secretary":2,"assistant general secretary":3,
        "national treasurer":4,"national financial secretary":5,"national social welfare officer":6,
        "national public relations officer":7,"national legal adviser":8,"national internal auditor":9,"chief whip":10}

        const arrOfVotes = new Array(Object.keys(positionRank).length).fill(null)
        
        for(let obj of allContestants){
            let pos = arrOfVotes[positionRank[obj.dataValues.position.toLowerCase()]]
            //check if position obj is already inserted
           if(!pos){
            const myObj = {}
            const contestant = {}
            myObj.allVotes = allElections
                             .filter(v=>v.dataValues.position === obj.dataValues.position)
                             .map(fv=>fv.dataValues.user_id)

            myObj.position = obj.dataValues.position   
            myObj.contestants = []
            console.log(myObj)
            const contestantVote = allElections
            .filter(v=>v.dataValues.contestant_id === obj.dataValues.contestant_id)
            .map(fv=>fv.dataValues.user_id)
            
            contestant.votes = contestantVote
            const {dataValues} = await Contestants.findOne({where:{contestant_id:obj.dataValues.contestant_id}})
            contestant.contestant_id = dataValues.contestant_id
            contestant.surname = dataValues.surname
            contestant.firstname = dataValues.firstname
            contestant.manifesto = dataValues.manifesto
            contestant.picture = dataValues.picture

            myObj.contestants.push(contestant)
            arrOfVotes[positionRank[obj.dataValues.position.toLowerCase()]] = myObj
           } 
           else{
               //since pos is inserted push a new contestant in votes array under the given position category
            if(!pos.contestants.find(v=>v.contestant_id === obj.dataValues.contestant_id)){
            const contestant = {}

            //everyone that voted for a particular contestant
            const contestantVote = allElections
            .filter(v=>v.dataValues.contestant_id === obj.dataValues.contestant_id)
            .map(fv=>fv.dataValues.user_id)
            
            contestant.votes = contestantVote
            const {dataValues} = await Contestants.findOne({where:{contestant_id:obj.dataValues.contestant_id}})
            contestant.contestant_id = dataValues.contestant_id
            contestant.surname = dataValues.surname
            contestant.firstname = dataValues.firstname
            contestant.manifesto = dataValues.manifesto
            contestant.picture = dataValues.picture

            arrOfVotes[positionRank[obj.dataValues.position.toLowerCase()]].contestants.push(contestant)
            }
           }
        }
        
        const totalVotes = arrOfVotes.filter(v=>v !== null)
        res.json({electObj:totalVotes,myId:user.user_id})
    }
})

Router.patch('/vote',electionAuth,async(req,res)=>{
    try {
        
        const{myId,contestantId,position} = req.body

        await Votes.create({user_id:myId,contestant_id:contestantId,position})
        const allElections = await Votes.findAll()
   
        const allVotes = allElections
                                    .filter(v=>v.dataValues.position === position)
                                    .map(fv=>fv.dataValues.user_id)

        
        const contestantVotes = allElections
                                            .filter(v=>v.dataValues.contestant_id === contestantId)
                                            .map(fv=>fv.dataValues.user_id)
        res.json({allVotes,contestantVotes})        
    } catch (error) {
        res.status(400).send({message:error.message})
    }

})


Router.delete('/delete',permittedAuth(['babsyinks','admin']),async (req,res)=>{
    try {
        await Votes.destroy({truncate:true})
        await Timer.destroy({truncate:true})
        res.json({message:'success'})
    } catch (error) {
        res.status(500).json({error:"delete operation failed!"}) 
    }
   
})

module.exports = Router
