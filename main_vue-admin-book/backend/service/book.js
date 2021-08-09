const Book = require('../model/Book')
const db = require('../db/index')
const _ =require('lodash')
function exists(book) {
  // return false
  const {title,author,publisher}=book
  const sql=`select * from book where title='${title}' and author='${author}' and publisher='${publisher}'`
  return db.queryOne(sql)
}
function removeBook(book) {
  if(book){
    // 删除相关文件（电子书文件，封面，解压后的文件）
    book.reset()
  }
}
async function insertContents(book) {
  const contents=book.getContents()
  console.log("contents123",contents);
  if(contents&&contents.length>0){
    for(let i=0;i<contents.length;i++){
      const content=contents[i]
      const _content=_.pick(content,[
        'fileName',
        'id',
        'href',
        'order',
        'level',
        'text',
        'label',
        'pid',
        'navId'
      ])
      console.log('_content',_content);
      await db.insert(_content,'contents')
    }
  }
}
function insertBook(book) {
  return new Promise(async(resolve, reject) => {
    try {
      // book一定要是Book对象的实例 可以避免某些参数不存在的情况
      // 如果是实例的话有个好处 能够保证那些参数都是完备的，
      // 不然的话随便传入一个book对象做insert的话可能会产生错误
      if (book instanceof Book) {
        // 判断电子书是否已经上传过了
        const result =await exists(book)
        console.log('res',result);
        if (result) {
          await removeBook(book)
          reject(new Error('电子书已存在'))
        } else {
          // 传入对象和表名 完成插入操作
          await db.insert(book.toDb(), 'book')
          // 插入电子书目录表
          await insertContents(book)
          resolve()
        }
      } else {
        reject(new Error('添加的图书对象不合法'))
      }
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = { insertBook }