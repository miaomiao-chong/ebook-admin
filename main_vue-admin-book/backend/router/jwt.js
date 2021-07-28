const expressJwt=require('express-jwt')
const {PRIVATE_KEY} =require('../utils/constant')
const jwtAuth=expressJwt({
  secret: PRIVATE_KEY,  // 签名的密钥 或 PublicKey
  algorithms:['HS256'],
  credentialsRequired:true
}).unless({
  path: ['/user/login', '/']  // 指定路径不经过 Token 解析
})
module.exports=jwtAuth
