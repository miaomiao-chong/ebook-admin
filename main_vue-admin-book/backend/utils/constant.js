const env=require('./env')
const UPLOAD_PATH=env=='dev'?'E:\\Compressed\\nginx-1.21.1\\upload\\book':'/root/upload/admin-upload-ebook'
// const UPLOAD_PATH=env=='dev'?'1':'2'
module.exports={
  CODE_ERROR:-1,
  CODE_SUCCESS:0 ,
  CODE_TOKEN_EXPORED:-2,
  debug:true,
  PWD_SALT:'admin_imooc_node',
  PRIVATE_KEY:'admin', 
  JWT_EXPIRED:60*60,
  UPLOAD_PATH
}