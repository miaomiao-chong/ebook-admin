const express = require('express')
const boom = require('boom')
const userRouter = require('../router/user')
const Result = require('../model/result')
const router = express.Router()
const jwtAuth = require('./jwt')
const { CODE_ERROR } = require('../utils/constant')
// const { Result } = require('_express-validator@6.12.1@express-validator')
router.get('/', (req, res, next) => {
  res.send("主页")
})
router.use(jwtAuth)
router.use('/user', userRouter)

// 接下来进行异常处理
router.use((req, res, next) => {
  // res.send()
  next(boom.notFound('接口不存在'))
})

router.use((err, req, res, next) => {
  console.log(err);
  console.log(res);
  if (err.code && err.code === 'credentials_required') {
    const { status = 401 } = err.code  // 这样写的意思是默认值为401
    new Result(null, 'token失效', {
      error: status,
      errorMsg: err.inner.message
    }).jwtError(res.status(status))   //res.status(status) 不写这个默认为500

  } else {
    const code = CODE_ERROR
    const msg = err.message
    const error = (err.output && err.output.statusCode) || 500
    const errorMsg = err.output && err.output.payload && err.output.payload.error
    new Result(null, msg, {
      code,
      msg,
      error,
      errorMsg

    }).fail(res.status(error))
    // res.status(error).json({

    // })
  }

})

module.exports = router