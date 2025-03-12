require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const route = require('./route')
 
app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization']
  })); 
  

app.get('/api',(req, res)=>{ 
    res.json({
       success: true,
       message: "Your api seted successfull"
    })
})

app.use('/get',route) 

const PORT = process.env.PORT || 5000   
app.listen(PORT, ()=>{
    console.log(`App run successfull on port ${PORT}`)
})  