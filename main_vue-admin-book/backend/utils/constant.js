const env=require('./env')
const UPLOAD_PATH=env=='dev'?'E:/Compressed/nginx-1.21.1/upload':'/root/upload/admin-upload-ebook'
// const UPLOAD_PATH=env=='dev'?'1':'2'
const UPLOAD_URL=env=='dev'?'http://47.103.29.206a:8089/upload':'http://47.103.29.206:8089/upload'
module.exports={
  CODE_ERROR:-1,
  CODE_SUCCESS:0,
  CODE_TOKEN_EXPORED:-2,
  debug:true,
  PWD_SALT:'admin_imooc_node',
  PRIVATE_KEY:'admin', 
  JWT_EXPIRED:60*60*6,
  UPLOAD_PATH,
  UPLOAD_URL,
  MIME_TYPE_EPUB:'application/epub',

}