const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utils/constant')
const fs = require('fs')
const Epub = require('../utils/epub')
const xml2js = require('xml2js').parseString
class Book {
  constructor(file, data) {
    if (file) {
      this.createBookFromFile(file)
    } else {
      this.createBookFromData(data)
    }
  }
  createBookFromFile(file) {
    console.log("createBookFromFile", file);
    const {
      destination,
      filename,
      mimetype = MIME_TYPE_EPUB,
      path,
      originalname
    } = file
    // 电子书的文件后缀名
    const suffix = mimetype === MIME_TYPE_EPUB ? '.epub' : ''
    // 电子书原有路径
    const oldBookPath = path    // 原有路径
    // 电子书新路径
    const bookPath = `${destination}/${filename}${suffix}` //新路径 
    // 生成文件下载路径 通过这个下载路径就可以快速的下载到电子书
    // 电子书的下载URL
    const url = `${UPLOAD_URL}/book/${filename}${suffix}`
    // 生成电子书解压文件夹 文件夹以文件名命名
    // 电子书解压后的文件夹路径
    const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`
    // 这个url路径会在电子书阅读的时候使用到它
    // 电子书解压后的文件夹URL
    const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`
    // 如果不存在unzipPath,就去创建
    if (!fs.existsSync(unzipPath)) {
      // 不存在的话迭代创建文件夹
      fs.mkdirSync(unzipPath, { recursive: true })
    }
    // 判断当前电子书是否存在 如果存在且新的电子书不存在的情况下 
    // 调用rename对文件夹重命名的方法，把oldBookPath和bookPath传入实现重命名
    if (fs.existsSync(oldBookPath)) {
      fs.renameSync(oldBookPath, bookPath)
    }
    this.fileName = filename  // 无后缀的文件名
    // 写相对路径，为了兼容不同的场景 因为在服务端和客户端他的绝对路径是不一样
    this.path = `/book/${filename}${suffix}` // epub文件相对路径
    this.filePath = this.path    // 起一个别名  电子书相对路径
    this.unzipPath = `/unzip/${filename}`  // 解压后相对路径
    this.url = url     // epub文件下载链接
    this.title = ''   // 标题或书名，解析后生成 
    this.author = ''
    this.publisher = ''    // 出版社
    this.contents = []    // 目录
    this.contentsTree = []
    this.cover = ''     // 封面图片url
    this.coverPath = ''
    this.category = -1    // 分类id
    this.categoryText = ''  // 分类名称
    this.language = ''    // 语种
    this.unzipUrl = unzipUrl   // 解压后的文件夹链接
    this.originalName = originalname  // 原始名

  }
  createBookFromData(data) {
    // data里的字段需要与数据库字段做映射
    // console.log(69,data);
    this.fileName = data.fileName
    this.cover = data.coverPath
    this.title = data.title
    this.author = data.author
    this.publisher = data.publisher
    this.bookId = data.fileName
    this.language = data.language
    this.rootFile = data.rootFile
    this.originalName = data.originalName
    this.path = data.filePath
    this.filePath = data.filePath
    this.unzipPath = data.unzipPath
    this.coverPath = data.coverPath
    this.createUser = data.username
    this.createDt = new Date().getTime()
    this.updateDt = new Date().getTime()
    //为0 表示是默认图书，否则代表来自于互联网（1）
    this.updateType = data.updateType === 0 ? data.updateType : 1
    this.category = data.category || 99
    this.categoryText = data.categoryText || '自定义'
    this.contents=data.contents||[]
  }
  parse() {
    return new Promise((resolve, reject) => {
      const bookPath = `${UPLOAD_PATH}${this.filePath}`
      // 如果不存在文件路径 抛出错误
      if (!fs.existsSync(bookPath)) {
        reject(new Error('电子书不存在'))
      }
      // 创建个实例
      const epub = new Epub(bookPath)
      // error回调，判断解析过程中有没有出现异常
      epub.on('error', err => {
        reject(err)
      })
      // end事件表示电子书成功解析
      epub.on('end', err => {
        if (err) {
          reject(err)
        } else {
          // console.log("epub+ ", epub.manifest);
          const {
            language,
            creator,
            creatorFileAs,
            title,
            cover,
            publisher
          } = epub.metadata

          if (!title) {
            reject(new Error('图书标记为空'))
          } else {
            this.title = title
            this.language = language || 'en'   // 不存在默认为英文
            this.author = creator || creatorFileAs || 'unknown'
            this.publisher = publisher || 'unknown'
            this.rootFile = epub.rootFile
            const handleGetImage = (err, file, mimetype) => {
              // console.log(err, file, mimetype);
              if (err) {
                reject(err)
              } else {
                // 需要整个电子书解析完之后再调用resolve,而不是直接调完getImage就resolve，
                //因为getImage可能出错，调完resolve再调reject逻辑就会出现问题
                const suffix = mimetype.split('/')[1]
                const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
                const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`
                // 把buffer写入到磁盘当中
                // console.log(coverPath);
                fs.writeFileSync(coverPath, file, 'binary')
                this.coverPath = `/img/${this.fileName}.${suffix}`
                this.cover = coverUrl
                resolve(this)
              }
            }
            try {
              this.unzip() // 解压电子书
              this.parseContents(epub)
                .then(({ chapters, chapterTree }) => {
                  this.contents = chapters
                  this.contentsTree = chapterTree
                  epub.getImage(cover, handleGetImage) // 获取封面图片
                })
                .catch(err => reject(err)) // 解析目录
            } catch (error) {
              reject(error)
            }
          }
        }
      })
      epub.parse()
    })
  }
  unzip() {
    const AdmZip = require('adm-zip')
    const zip = new AdmZip(Book.genPath(this.path))
    // zip对象的api extractAllTo()  含义是将路径下的文件进行解压，
    // 解压以后把它放到一个新的路径下  第二个参数：是否进行覆盖
    zip.extractAllTo(Book.genPath(this.unzipPath), true)
  }
  parseContents(epub) {
    function getNcxFilePath() {
      const spine = epub && epub.spine

      const ncx = spine.toc && spine.toc.href
      const id = spine.toc && spine.toc.id
      const manifest = epub && epub.manifest
      // console.log("spine", spine.toc, ncx, id, manifest[id].href);
      if (ncx) {
        return ncx
      } else {
        // 这个一定会存在的，因为这是电子书的目录
        return manifest[id].href
      }
    }

    function findParent(array, level = 0, pid = '') {
      return array.map(item => {
        item.level = level
        item.pid = pid
        if (item.navPoint && item.navPoint.length) {
          item.navPoint = findParent(item.navPoint, level + 1, item['$'].id)
        } else if (item.navPoint) {
          item.navPoint.level = level + 1
          item.navPoint.pid = item['$'].id
        }
        return item
      })
    }
    function flatten(array) {
      return [].concat(...array.map(item => {
        // 如果包含的是数组
        if (item.navPoint && item.navPoint.length > 0) {
          // 合并
          return [].concat(item, ...flatten(item.navPoint))
        } else if (item.navPoint) {
          // 如果是个对象
          return [].concat(item, item.navPoint)
        }
        return item
      }))
    }
    const ncxFilePath = Book.genPath(`${this.unzipPath}/${getNcxFilePath()}`)
    // console.log(ncxFilePath);
    if (fs.existsSync(ncxFilePath)) {
      return new Promise((resolve, reject) => {
        const xml = fs.readFileSync(ncxFilePath, 'utf-8')
        const fileName = this.fileName
        // 第一个参数：buffer 第二个参数：配置 第三个：回调
        xml2js(xml, {
          explicitArray: false,
          ignoreAttrs: false
        }, function (err, result) {
          if (err) {
            reject(err)
          } else {
            // console.log(result)
            const navMap = result.ncx.navMap
            // console.log(JSON.stringify(navMap));
            if (navMap.navPoint && navMap.navPoint.length > 0) {
              //  目录存在的情况 对目录进行解析
              navMap.navPoint = findParent(navMap.navPoint)
              const newNavMap = flatten(navMap.navPoint)
              //false 赋值了一份新的数组，不会改变原来的值
              // console.log(newNavMap === navMap.navPoint);
              // 解析
              const chapters = []
              epub.flow.forEach((chapter, index) => {
                if (index + 1 > newNavMap.length) {
                  // flow里面的信息超过目录信息 就return
                  return
                } else {
                  // 没有超过的时候
                  // 拿到目录信息
                  const nav = newNavMap[index]
                  // 增加个属性（章节url）
                  chapter.text = `${UPLOAD_URL}/unzip/${fileName}/${chapter.href}`
                  if (nav && nav.navLabel) {
                    chapter.label = nav.navLabel.text || ''
                  } else {
                    chapter.label = ''
                  }
                  chapter.level = nav.level
                  chapter.pid = nav.pid
                  chapter.navId = nav['$'].id
                  chapter.fileName = fileName
                  chapter.order = index + 1
                  chapters.push(chapter)
                  // console.log(chapters);
                }
              })
              const chapterTree = []
              chapters.forEach(c => {
                // 我们前面已经定义过label属性并赋值了 
                c.children = []
                //没有识别出pid时说明是一级目录
                if (c.pid === '') {
                  chapterTree.push(c)
                } else {
                  // pid不为空，说明有parent 先要找到parent
                  const parent = chapters.find(_ =>
                    // 如果一样，就找到了parent
                    _.navId === c.pid
                  )
                  parent.children.push(c)

                }
              })
              // console.log("257chapterTree",chapterTree);
              // this.contentsTree=chapterTree

              // console.log(epub.flow);
              resolve({ chapters, chapterTree })
            } else {
              reject(new Error('目录解析失败，目录树为0'))
            }
          }
        })
      })
    } else {
      throw new Error('目录对应的资源文件不存在')
    }
  }
  toDb() {
    return {
      fileName: this.fileName,
      cover: this.cover,
      title: this.title,
      author: this.author,
      publisher: this.publisher,
      bookId: this.bookId,
      language: this.language,
      rootFile: this.rootFile,
      originalName: this.originalName,
      filePath: this.filePath,
      unzipPath: this.unzipPath,
      coverPath: this.coverPath,
      createUser: this.createUser,
      createDt:this.createDt,
      updateDt: this.updateDt,
      updateType:this.updateType,
      category: this.category,
      categoryText: this.categoryText
    }
  }
  // 可以联想一下java里的get set方法
  getContents(){
    return this.contents
  }
  // 删除相关文件
  reset(){
    // console.log("fileName",this.fileName);
    if(Book.pathExists(this.filePath)){
      console.log("删除文件");
      fs.unlinkSync(Book.genPath(this.filePath))
    }
    if(Book.pathExists(this.coverPath)){
      console.log("删除封面");
      fs.unlinkSync(Book.genPath(this.coverPath))
    }
    if(Book.pathExists(this.unzipPath)){
      console.log("删除解压路径");
      fs.rmdirSync(Book.genPath(this.unzipPath),{recursive:true})
    }
  }
  // 生成静态方法，获得绝对路径
  static genPath(path) {
    if (!path.startsWith('/')) {
      path = `/${path}`
    }
    return `${UPLOAD_PATH}${path}`
  }
  static genCoverUrl(book){
    const {cover}=book
    if(cover){
      if(cover.startsWith('/')){
        return `${UPLOAD_URL}${cover}`
      }else{
        return `${UPLOAD_URL}/${cover}`
      }
    }else{
      return null
    }
  }
  static getContentsTree(contents){
    const contentsTree = []
    contents.forEach(c => {
      // 我们前面已经定义过label属性并赋值了 
      c.children = []
      //没有识别出pid时说明是一级目录
      if (c.pid === '') {
        contentsTree.push(c)
      } else {
        // pid不为空，说明有parent 先要找到parent
        const parent = contents.find(_ =>
          // 如果一样，就找到了parent
          _.navId === c.pid
        )
        parent.children.push(c)

      }
    })
    return contents
  }
  // 判断路径是否存在静态方法
  static pathExists(path){
    if(path.startsWith(UPLOAD_PATH)){
      return fs.existsSync(path)
    }else{
      return fs.existsSync(Book.genPath(path))
    }
  }

 
}


module.exports = Book