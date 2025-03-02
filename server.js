const express = require('express')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const {sequelize} = require('./models')
const electionRoutes = require('./routes/electionRoutes')
const timerRoutes = require('./routes/timerRoutes')

const port = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(helmet.contentSecurityPolicy({
    directives: { 
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://ka-f.fontawesome.com','https://*.fontawesome.com'],
      scriptSrc: ["'self'", 'https://kit.fontawesome.com','https://ka-f.fontawesome.com','https://*.fontawesome.com'],
      styleSrc: [
        "'self'",
        'https://fonts.googleapis.com',
        'https://kit.fontawesome.com',
        'https://ka-f.fontawesome.com',
        'https://*.fontawesome.com',
        "'unsafe-inline'"
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com','https://ka-f.fontawesome.com','https://*.fontawesome.com',"'unsafe-inline'"],
      imgSrc: ["'self'", 'https://*.fontawesome', 'https://i.ibb.co','data:'],
      baseUri: ["'self'"],
    },
  })) 
app.use(xss())

app.use('/auth',authRoutes)

app.use('/election',electionRoutes)

app.use('/timer', timerRoutes)

app.use((err,req,res,next)=>{
    res.send({err}) 
})

app.listen(port,async()=>{ 
    await sequelize.authenticate()
    console.log("Database Connection Successful")
    console.log(`Server listening on port ${port}`)  
})    