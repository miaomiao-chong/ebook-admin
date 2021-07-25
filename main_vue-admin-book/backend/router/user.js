const express=require('express')
const Result=require('../model/result')
const router=express.Router()

router.post('/login',(req,res)=>{
  console.log(req.body);
  const {username,password}=req.body
  new Result('登录成功').success(res)
})

router.get('/info',(req,res,next)=>{
  res.send('user/info')
})




module.exports=router