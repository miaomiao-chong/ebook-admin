const express = require("express")
const app=express()

const router=require('./router')

app.use('/',router)

app.listen(3000,()=>{
  console.log("开启在3000端口了");
})