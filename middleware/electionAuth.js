const jwt = require('jsonwebtoken')
const path = require('path')
const {User} = require('../models')
require('dotenv').config({path:path.join('..','.env')});
require('dotenv').config({ debug: process.env.DEBUG })

const electionAuth = async (req,res,next)=>{
    try {
    const token = req.headers['x-auth-token']
        
    const verifyObj = jwt.verify(token,process.env.TOKEN_SECRET)
    
    const user = await User.findOne({where:{user_id:verifyObj.user.id}}) 
    if(!user){ 
        return res.json({authenticated:false})
    }
    req.user = user //{myUserNum:user.UserNum}
    next()
    } catch (error) {    
        return res.status(401).json({authenticated:false})
    }
}

module.exports = electionAuth