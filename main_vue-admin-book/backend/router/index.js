const express = require('express')
const boom = require('boom')
const userRouter = require('../router/user')
const bookRouter = require('../router/book')
const router = express.Router()
const jwtAuth = require('./jwt')
const {UPLOAD_PATH}=require('../utils/constant')
const { CODE_ERROR } = require('../utils/constant')
const Result = require('../model/Result')

router.use(jwtAuth)
router.get('/', (req, res, next) => {
  res.send("主页")
})

router.use('/user', userRouter)
router.use('/book', bookRouter)
// 接下来进行异常处理
router.use((req, res, next) => {
  // res.send()
  next(boom.notFound('接口不存在'))
})

router.use((err, req, res, next) => {
  // res.send(error)
  console.log({ err });
  if (err.code === 'credentials_required') {

    const msg = err.inner.message
    // new Result(null,msg,{code:err.code}).jwtError(res.status(401))
    console.log("----------");
    new Result(null, "token失效", { code: err.status, errorMsg: msg }).jwtError(res.status(401))
  } else {
    const code = CODE_ERROR
    const msg = err.message
    const error = (err.output && err.output.statusCode) || 500
    const errorMsg = err.output && err.output.payload && err.output.payload.error

    res.status(error).json({
      code,
      msg,
      error,
      errorMsg
    })
  }
})

module.exports = router