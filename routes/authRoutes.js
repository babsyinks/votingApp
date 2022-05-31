const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {User} = require('../models')
//const {Egca} = require('../model/model')
//const electionAuth = require('../middleware/electionAuth')
const permittedAuth = require('../middleware/permittedAuth')
require('dotenv').config();
const Router = express.Router()
Router.use(express.json())
//checkidentity
Router.post('/register',async (req,res)=>{
    try {
        let{username,password} = req.body
        if(!username || !password){
            return res.status(400).json({error:"provide username and password!"})
        }
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
        const user = await User.create({username,password})
        const token = jwt.sign({user:{id:user.dataValues.user_id}},process.env.TOKEN_SECRET,{expiresIn:24*60*60*1000})
        res.status(200).json({token})
    } catch (error) {
        res.json({error:error.message})
    }
})
//emal_phone
Router.post('/login',async(req,res)=>{
    try {
        const{username,password} = req.body
        if(!username || !password){
            return res.status(400).json({error:"Provide Username and Password"})
        }
        const user = await User.findOne({where:{username}})
        const checkPassword = await bcrypt.compare(password,user.password)
        if(!checkPassword){
        return res.status(401).json({error:"Wrong Username or Password"})
        }
        const token = jwt.sign({user:{id:user.dataValues.user_id}},process.env.TOKEN_SECRET,{expiresIn:24*60*60*1000})
        res.status(200).json({token})
    } catch (error) {
        return res.status(401).json({error:"Wrong Username or Password"})
    }
})

Router.get('/admin/login',permittedAuth(['babsyinks','admin']),(req,res)=>{
     res.json({authenticated:true})
})

module.exports = Router