const express = require('express')
const {Timer} = require('../models')
const permittedAuth = require('../middleware/permittedAuth')
const Router = express.Router()

Router.use(express.json())  

Router.post('/set',permittedAuth(['babsyinks','admin']),async(req,res)=>{
    try {
        const timer = await Timer.findAll()
        if(timer.length === 0){
           await Timer.create(req.body) 
        }
        else{
            const timerObj = timer[0]
            timerObj.set(req.body)
            await timerObj.save()
        }
        res.json({message:'timer set'})  
    } catch (error) {
        res.json({message:error.message})
    }

})


Router.get('/cancel',permittedAuth(['babsyinks','admin']),async (req,res)=>{
    try {
        const timer = await Timer.findAll()
        const timerObj = timer[0]
        timerObj.set({startDate:null,endDate:null})
        await timerObj.save()
        res.json({message:'timer cancelled'})  
    } catch (error) {
        res.json({message:error.message})
    }    
})

Router.get('/cancelStart',async (req,res)=>{
    try {
        const timer = await Timer.findAll()
        const timerObj = timer[0]
        timerObj.set({startDate:null})
        await timerObj.save()
        res.json({message:'timer cancelled'})  
    } catch (error) {
        res.json({message:error.message})
    }    
})

Router.get('/status',async(req,res)=>{
    try {
        const electionTimer = await Timer.findAll()
        let electionObj
        if(electionTimer.length === 0 ){
            electionObj = {isEmpty:true}
        }
        else if(electionTimer[0].dataValues.startDate === null && electionTimer[0].dataValues.endDate === null){
            electionObj = {startDate:null,endDate:null}
        }
        else{
            electionObj = {startDate:new Date(electionTimer[0].dataValues.startDate).getTime(),endDate:new Date(electionTimer[0].dataValues.endDate).getTime()}
        }
        res.json(electionObj)  
    } catch (error) {
        res.json({message:error.message})
    }
})

Router.get('/end',async(req,res)=>{
    try {
        const timer = await Timer.findAll()
        const timerObj = timer[0]
        timerObj.set({endDate:null})
        await timerObj.save()
        res.json({message:'election over'})  
    } catch (error) {
        res.json({message:error.message})
    }
})
module.exports = Router