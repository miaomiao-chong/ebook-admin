const express = require('express')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const Result = require('../model/result')
const router = express.Router()
const { login, findUser } = require('../service/user')
const {md5,decode} = require('../utils/index')
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')
router.post('/login',
  [
    body('username').isString().withMessage("用户名必须为字符串"),
    body('password').isString().withMessage("用户名必须为字符串")
  ],
  (req, res, next) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      let [{ msg }] = err.errors
      // console.log(msg);
      next(boom.badRequest(msg))
    } else {
      console.log(req.body);
      let { username, password } = req.body
      password = md5(`${password}${PWD_SALT}`)
      login(username, password).then((user) => {
        if (!user || user.length == 0) {
          new Result('登录失败').fail(res)
        } else {
          const token = jwt.sign(
            { username },
            PRIVATE_KEY,
            { expiresIn: JWT_EXPIRED }
          )
          new Result({ token }, '登录成功').success(res)
        }
      })
    }
  })

router.get('/info', (req, res, next) => {
  const decoded=decode(req)
  console.log({decoded});
  // res.send('user/info')
  if(decoded&&decoded.username){
    findUser(decoded.username).then((user) => {
      console.log(user);  //不需要处理异常，因为默认情况会抛给自定义异常处理
      if (user) {
        user.roles=[user.role]
        new Result(user, '用户信息查询成功').success(res)
      } else {
        new Result('用户信息查询失败').fail(res)
      }
    })
  }else{
    new Result('用户信息查询失败').fail(res)
  }
})
module.exports = router