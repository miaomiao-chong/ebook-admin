const { MIME_TYPE_EPUB, UPLOAD_URL, UPLOAD_PATH } = require('../utils/constant')
const fs = require('fs')
const Epub = require('../utils/epub')
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
    this.filename = filename  // 无后缀的文件名
    // 写相对路径，为了兼容不同的场景 因为在服务端和客户端他的绝对路径是不一样
    this.path = `/book/${filename}${suffix}` // epub文件相对路径
    this.filePath = this.path    // 起一个别名  电子书相对路径
    this.unzipPath = `/unzip/${filename}`  // 解压后相对路径
    this.url = url     // epub文件下载链接
    this.title = ''   // 标题或书名，解析后生成 
    this.author = ''
    this.publisher = ''    // 出版社
    this.contents = []    // 目录
    this.cover = ''     // 封面图片url
    this.coverPath = ''
    this.category = -1    // 分类id
    this.categoryText = ''  // 分类名称
    this.language = ''    // 语种
    this.unzipUrl = unzipUrl   // 解压后的文件夹链接
    this.originalname = originalname  // 原始名

  }
  createBookFromData() {
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
                const coverPath = `${UPLOAD_PATH}/img/${this.filename}.${suffix}`
                const coverUrl = `${UPLOAD_URL}/img/${this.filename}.${suffix}`
                // 把buffer写入到磁盘当中
                console.log(coverPath);
                fs.writeFileSync(coverPath, file, 'binary')
                this.coverPath = `/img/${this.filename}.${suffix}`
                this.cover = coverUrl
           
                resolve(this)
              }
            }
            console.log("cover",cover);
            epub.getImage(cover, handleGetImage)
            
          }
        }
      })
      epub.parse()
    })
  }
}
module.exports = Book