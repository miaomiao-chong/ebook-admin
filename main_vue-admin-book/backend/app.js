const express=require('express')
const router=require('./router')
const app=express()
const cors=require('cors')

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/',router)

app.listen(18082,()=>{
  console.log("http://localhost:18082");
})