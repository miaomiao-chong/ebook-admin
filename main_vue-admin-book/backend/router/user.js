const express = require('express')
const Result = require('../model/result')
const router = express.Router()
const login = require('../service/login')
const md5=require('../utils/index')
const {PWD_SALT}=require('../utils/constant')
router.post('/login', (req, res) => {
  console.log(req.body);
  let { username, password } = req.body
  password=md5(`${password}${PWD_SALT}`)
  login(username, password).then((user) => {
    if (!user || user.length == 0) {
      new Result('登录失败').fail(res)
    } else {
      new Result('登录成功').success(res)
    }
  })

})

router.get('/info', (req, res, next) => {
  res.send('user/info')
})




module.exports = router