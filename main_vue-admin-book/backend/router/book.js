const express = require('express')
const router = express.Router()
const multer = require('multer')
const Book = require('../model/Book')
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../model/Result')
const boom = require('boom')
const { decode } = require('../utils/index')
const bookService = require('../service/book')

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
        console.log("book:", book);
        new Result(book, '上传成功').success(res)
      }).catch(err => {
        console.log("upload", err);
        // 告诉前端发生了解析异常
        next(boom.badImplementation(err))
      })
    }
  })

router.post('/create', (req, res, next) => {
  const decoded = decode(req)
  // 解出jwt
  // console.log(decoded);
  // 前端传入的信息
  console.log(req.body);
  if (decoded && decoded.username) {
    // book.username=decoded.username
    req.body.username = decoded.username
  }
  const book = new Book(null, req.body)
  bookService.insertBook(book).then(() => {
    new Result('添加成功').success(res)
  }).catch((err) => {
    // console.log(err);
    // 错误与前端联动 
    next(boom.badImplementation(err))
  })
  console.log(book)
})
module.exports = router