const mysql = require('mysql')
const config = require('./config')
const {debug}=require('../utils/constant')
const {isObject} =require('../utils/index')
function connect() {
  return mysql.createConnection({
    ...config
  })
}
function querySql(sql) {
  const conn = connect()
  debug&&console.log(sql)
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, results) => {
        if (err) {
          debug&&console.log("查询失败 原因："+JSON.stringify(err));
          reject(err)
        }
        debug&&console.log("查询成功 数据："+JSON.stringify(results));
        resolve(results)  
      })
    }
    catch (e) {
      reject(e)
    }
    finally {
      conn.end()
    }
  })
}

function queryOne(sql){
  return new Promise((resolve,reject)=>{
    querySql(sql).then((res)=>{
      if(res&&res.length>0){
        resolve(res[0])
      }else{
        resolve(null)
      }
    }).catch(err=>{
      reject(err)
    })
  })
}

function insert(model,tableName){
  // console.log("model",model);
  return new Promise((resolve,reject)=>{
    if(!isObject(model)){
      reject(new Error('插入数据库失败，插入数据非对象'))
    }else{
      const keys=[]
      const values=[]
      //拿到book对象的所有key 做一个遍历
      Object.keys(model).forEach(key=>{
        // 这个意思是看model有没有这个key,而不是往原型链上找
        if(model.hasOwnProperty(key)){
          keys.push(`\`${key}\``)
          values.push(`'${model[key]}'`)
        }
      })
      // 拼sql语句
      if(keys.length>0&&values.length>0){
        let sql=`insert into \`${tableName}\`(`
        const keysString=keys.join(',')
        const valuesString=values.join(',')
        sql=`${sql}${keysString}) values (${valuesString})`
        console.log("sql",sql)
        const conn=connect()
        try {
          conn.query(sql,(err,result)=>{
            if(err){
              reject(err)
            }else{
              resolve(result)
            }
          })
        } catch (error) {
          reject(error)
        }finally{
          conn.end()
        }
      }else{
        reject(new Error('对象中没有任何属性'))
      }
    }
  })
}
module.exports={querySql,queryOne,insert}