const express = require('express')
const router = express.Router()
const multer = require('multer')
const Book = require('../model/Book')
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../model/Result')
const boom = require('boom')
router.post('/upload',
  multer({ dest: `${UPLOAD_PATH}/book` }).single("file"),
  (req, res, next) => {
    // console.log("----------------");
    // console.log(req.file);
    if (!req.file || req.file.length == 0) {
      new Result('上传失败').fail(res)
    } else {
      const book = new Book(req.file)
      book.parse().then(book => {
        console.log("book:",book);
        new Result(book,'上传成功').success(res)
      }).catch(err => {
        console.log("upload", err);
        // 告诉前端发生了解析异常
        next(boom.badImplementation(err))
      })
    }
  })

module.exports = router