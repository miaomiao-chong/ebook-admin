const Book = require('../model/Book')
const db = require('../db/index')
const _ = require('lodash')
function exists(book) {
  // return false
  const { title, author, publisher } = book
  const sql = `select * from book where title='${title}' and author='${author}' and publisher='${publisher}'`
  return db.queryOne(sql)
}
function removeBook(book) {
  if (book) {
    // 删除相关文件（电子书文件，封面，解压后的文件）
    book.reset()
  }
}
async function insertContents(book) {
  const contents = book.getContents()
  // console.log("contents123", contents);
  if (contents && contents.length > 0) {
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i]
      const _content = _.pick(content, [
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
      // console.log('_content', _content);
      await db.insert(_content, 'contents')
    }
  }
}
function insertBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      // book一定要是Book对象的实例 可以避免某些参数不存在的情况
      // 如果是实例的话有个好处 能够保证那些参数都是完备的，
      // 不然的话随便传入一个book对象做insert的话可能会产生错误
      if (book instanceof Book) {
        // 判断电子书是否已经上传过了
        const result = await exists(book)
        // console.log('res', result);
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
function updateBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      if (book instanceof Book) {
        // 获取book对象
        console.log("更改后book", book);
        const result = await getBook(book.fileName)
        console.log("result", result);
        if (result) {
          const model = book.toDb()
          await db.update(model, 'book', `where fileName='${book.fileName}'`)
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
function getBook(fileName) {
  // resolve(fileName)
  // console.log("70",fileName);
  return new Promise(async (resolve, reject) => {
    const bookSql = `select * from book where fileName='${fileName}'`
    const contentsSql = `select * from contents where fileName='${fileName}' order by \`order\``
    const book = await db.querySql(bookSql)
    const contents = await db.querySql(contentsSql)
    if (book) {
      book[0].cover = Book.genCoverUrl(book[0])
      book[0].contentsTree = Book.getContentsTree(contents)
      // console.log("aaaaa",book[0]);
      resolve(book[0])
    } else {
      reject(new Error('电子书不存在'))
    }

  })

}
async function getCategory() {
  const sql = `select * from category order by category asc`
  const result = await db.querySql(sql)
  console.log("result", result);
  const categoryList = []
  result.forEach(item => {
    categoryList.push({
      label: item.categoryText,
      value: item.category,
      num: item.num
    })
  })
  return categoryList
}
async function listBook(query) {
  // console.log(query);
  const {
    // 默认值page=1,pageSize=20
    category, author, title, page = 1, pageSize = 20, sort
  } = query
  // 偏移多少个数据量，page=0 offset=0查询第1个  
  // page=1 offset=20 查询第21个
  const offset = (page - 1) * pageSize
  let bookSql = `select * from book`
  let where = 'where'

  // where  第二个参数 ：key  第三个：value
  category && (where = db.and(where, "category", category))
  title && (where = db.andLike(where, 'title', title))
  author && (where = db.andLike(where, 'author', author))
  if (where !== 'where') {
    bookSql = `${bookSql} ${where}`
  }
  if (sort) {
    // symbol:第一个字符
    const symbol = sort[0]
    const colunm = sort.slice(1, sort.length)
    const order = symbol === '+' ? 'asc' : 'desc'
    bookSql = `${bookSql} order by \`${colunm}\` ${order}`
  }
  bookSql = `${bookSql} limit ${pageSize} offset ${offset}`
  const list = await db.querySql(bookSql)

  // return new Promise((resolve,reject)=>{
  //   resolve(list)
  // })
  return { list }
}
module.exports = { listBook, insertBook, getBook, updateBook, getCategory }