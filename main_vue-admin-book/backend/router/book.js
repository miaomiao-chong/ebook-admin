const express = require('express')
const router = express.Router()
const multer = require('multer')
const { UPLOAD_PATH } = require('../utils/constant')
const Result=require('../model/result')
router.post('/upload',
  multer({ dest: UPLOAD_PATH }).single("file"),
  (req, res, next) => {
    // console.log("----------------");
    // console.log(req.file);
    if(!req.file||req.file.length==0){
      new Result('上传失败').fail(res)
    }else{
      new Result('上传成功').success(res)
    }
  })

module.exports = router