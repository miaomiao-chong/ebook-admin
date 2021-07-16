const express=require('express')
const boom=require('boom')
const userRouter=require('../router/user')
const router=express.Router()
const {CODE_ERROR}=require('../utils/constant')
router.get('/',(req,res,next)=>{
  res.send("主页")
})

router.use('/user',userRouter)

// 接下来进行异常处理
router.use((req,res,next)=>{
  // res.send()
  next(boom.notFound('接口不存在'))
})

router.use((err,req,res,next)=>{
  // res.send(error)
  const code=CODE_ERROR
  const msg=err.message
  const error=(err.output&&err.output.statusCode)||500
  const errorMsg=err.output&&err.output.payload&&err.output.payload.error

  res.status(error).json({
    code,
    msg,
    error,
    errorMsg
  })
})

module.exports=router