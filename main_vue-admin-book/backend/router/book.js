const express = require('express')
const router = express.Router()
const multer = require('multer')
const Book=require('../model/Book')
const { UPLOAD_PATH } = require('../utils/constant')
const Result=require('../model/Result')
router.post('/upload',
  multer({ dest: `${UPLOAD_PATH}\\book` }).single("file"),
  (req, res, next) => {
    // console.log("----------------");
    // console.log(req.file);
    if(!req.file||req.file.length==0){
      new Result('上传失败').fail(res)
    }else{
      const book=new Book(req.file)
      console.log(book);
      new Result('上传成功').success(res)
    }
  })

module.exports = router