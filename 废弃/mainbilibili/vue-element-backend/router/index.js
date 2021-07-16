const express=require('express')
const router=express.Router()
const userInfo=require('./user')
const {CODE_ERROR}=require('../utils/constant')
const boom=require('boom')
router.get('/',(req,res,next)=>{
  res.send('主页')
})

router.use('/user',userInfo)

router.use((req,res,next)=>{
  next(boom.notFound('找不到页面'))
})

router.use((error,req,res,next)=>{
  // const err=error
  // console.log(err);
  const code=CODE_ERROR
  const msg=error.message
  const err=(error.output&&error.output.statusCode)||500
  const errorMsg=(error.output&&error.output.payload&&error.output.payload.error)

  res.status(err).json({
    code,
    msg,
    err,
    errorMsg
  })
})

module.exports=router
