<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button style="margin-left: 10px" type="success" @click="showHelp">
          显示帮助
        </el-button>
        <el-button v-loading="loading" type="warning" @click="submitForm">
          <!-- 点击编辑 -->
          {{ isEdit == true ? "点击编辑" : "点击添加" }}
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <EbookUpload
              :file-list="fileList"
              @onError="handleError"
              @onExceed="handleExceed"
              @beforeUpload="beforeUpload"
              @onSuccess="handleSuccess"
              @onRemove="handleRemove"
            />
          </el-col>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
              >
                书名
              </MDinput>
            </el-form-item>
            <div>
              <el-row>
                <el-col :span="12" class="form-item-author">
                  <el-form-item
                    :label-width="labelWidth"
                    label="作者："
                    prop="author"
                  >
                    <el-input
                      v-model="postForm.author"
                      placeholder="作者"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label-width="labelWidth"
                    label="出版社："
                    prop="publisher"
                  >
                    <el-input
                      v-model="postForm.publisher"
                      placeholder="出版社"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    :label-width="labelWidth"
                    label="语言："
                    prop="language"
                  >
                    <el-input
                      v-model="postForm.language"
                      placeholder="语言"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label-width="labelWidth"
                    label="根文件："
                    prop="rootFile"
                  >
                    <el-input
                      v-model="postForm.rootFile"
                      placeholder="根文件"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    :label-width="labelWidth"
                    label="文件路径："
                    prop="filePath"
                  >
                    <el-input
                      v-model="postForm.filePath"
                      placeholder="文件路径"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label-width="labelWidth"
                    label="解压路径："
                    prop="unzipPath"
                  >
                    <el-input
                      v-model="postForm.unzipPath"
                      placeholder="解压路径"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    :label-width="labelWidth"
                    label="封面路径："
                    prop="coverPath"
                  >
                    <el-input
                      v-model="postForm.coverPath"
                      placeholder="封面路径"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label-width="labelWidth"
                    label="文件名称："
                    prop="originalName"
                  >
                    <el-input
                      v-model="postForm.originalName"
                      placeholder="文件名称"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    :label-width="labelWidth"
                    label="封面："
                    prop="cover"
                  >
                    <a
                      v-if="postForm.cover"
                      :href="postForm.cover"
                      target="_blank"
                    >
                      <img :src="postForm.cover" class="preview-img" />
                    </a>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    :label-width="labelWidth"
                    label="目录："
                    prop="contents"
                  >
                    <div
                      v-if="contentsTree && contentsTree.length > 0"
                      class="contents-wrapper"
                    >
                      <el-tree
                        :data="contentsTree"
                        @node-click="onContentClick"
                      />
                    </div>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import Warning from "./Warning";
import EbookUpload from "@/components/EbookUpload";
import { createBook, getBook,updateBook } from "@/api/book";
const defaultForm = {
  status: "draft",
  title: "",
  author: "",
  publisher: "",
  language: "",
  rootFile: "",
  cover: "",
  originalName: "",
  url: "",
  filename: "",
  coverPath: "",
  filePath: "",
  unzipPath: "",
};
const fields = {
  title: "书名",
  author: "作者",
  publisher: "出版社",
  language: "语言",
};

export default {
  name: "Detail",
  components: {
    MDinput,
    Sticky,
    Warning,
    EbookUpload,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log(rule);
      if (value === "" || value.length == 0) {
        callback(new Error(fields[rule.field] + "必须填写"));
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      labelWidth: "110px",
      contentsTree: [],
      fileList: [],
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
      },
      // loading: false,
    };
  },
  created() {
    if (this.isEdit) {
      console.log(this.$route.params);
      const fileName = this.$route.params.fileName;
      this.getBookData(fileName);
    }
  },
  computed: {},

  methods: {
    getBookData(fileName) {
      getBook(fileName).then((response) => {
        console.log(response);
        this.setData(response.data);
      });
    },
    onContentClick(data) {
      // console.log(data)
      if (data.text) {
        window.open(data.text);
      }
    },
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm);
      this.contentsTree = []; // 消除目录
      this.fileList = []; // 标题
      this.$refs.postForm.resetFields();
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        originalName,
        url,
        contents,
        contentsTree,
        filename,
        coverPath,
        filePath,
        unzipPath,
      } = data;
      this.postForm = {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        filename,
        coverPath,
        filePath,
        unzipPath,
      };
      this.contentsTree = contentsTree;
      this.fileList=[{name:originalName}]
    },
    submitForm() {
      this.$refs.postForm.validate((valid, fields) => {
        // 通过验证
        // console.log(valid, fields);
        if (valid) {
          // const book=Object.assign({},this.postForm)
          const book = { ...this.postForm };
          // 无用的字段删除，让提交的体积变小点
          // delete book.contents;
          delete book.contentsTree;
          // console.log(book);
          // console.log(this.isEdit);
          if (!this.isEdit) {
            // 新增电子书
            createBook(book)
              .then((response) => {
                console.log(response);
                const { msg } = response;
                console.log(msg);
                this.$notify({
                  title: "操作成功",
                  message: msg,
                  type: "success",
                  duration: 2000,
                });
                // this.postForm = Object.assign({}, defaultForm);
                this.setDefault();
              })
              .catch((err) => {});
          } else {
            // 编辑模式(更新)
            updateBook(book).then((response)=>{
              console.log(response);
            })
          }
        } else {
          // 标题必须填写
          console.log(fields[Object.keys(fields)[0]][0].message);
          const message = fields[Object.keys(fields)[0]][0].message;
          this.$message({
            message,
            type: "error",
          });
        }
      });
    },
    handleSuccess(data) {
      console.log(data);
      console.log("上传成功");
      // 将data传入setData当中
      // setData:更新表单数据
      this.setData(data);
    },
    handleRemove(file) {
      console.log("remove");
      // this.postForm = defaultForm;
      // this.postForm = Object.assign({}, defaultForm);
      this.setDefault();
    },
    handleError(file, fileList) {},
    beforeUpload(file) {
      // console.log(file)
    },
    // handleExceed(){
    //   console.log("测试子传父");
    // }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }
  .preview-img {
    width: 200px;
    height: 250px;
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
