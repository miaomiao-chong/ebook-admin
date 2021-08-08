const crypto=require('crypto')
const jwt=require('jsonwebtoken')
const {PRIVATE_KEY}=require('../utils/constant')

function isObject(o){
  return Object.prototype.toString.call(o)==='[object Object]'
}
function md5(s){
  return crypto.createHash('md5').update(String(s)).digest('hex')
}

function decode(req){
  let token=req.get('authorization')
  if(token.indexOf('Bearer')===0){
    token=token.replace('Bearer ','')
  }
  return jwt.verify(token,PRIVATE_KEY)
}
module.exports={md5,decode,isObject}