<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button
          v-loading="loading"
          style="margin-left: 10px"
          type="success"
          @click="showHelp"
        >
          显示帮助
        </el-button>
        <el-button v-loading="loading" type="warning" @click="edit">
          <!-- 点击编辑 -->
          {{ isEdit == true ? "点击编辑" : "点击添加" }}
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <EbookUpload
              @onError="handleError"
              @onExceed="handleExceed"
              @beforeUpload="beforeUpload"
              @onSuccess="handleSuccess"
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
                  <el-form-item :label-width="labelWidth" label="作者：">
                    <el-input
                      v-model="postForm.author"
                      placeholder="作者"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="出版社：">
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
                  <el-form-item :label-width="labelWidth" label="语言：">
                    <el-input
                      v-model="postForm.language"
                      placeholder="语言"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="根文件：">
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
                  <el-form-item :label-width="labelWidth" label="文件路径：">
                    <el-input
                      v-model="postForm.filePath"
                      placeholder="文件路径"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="解压路径：">
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
                  <el-form-item :label-width="labelWidth" label="封面路径：">
                    <el-input
                      v-model="postForm.coverPath"
                      placeholder="封面路径"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="文件名称：">
                    <el-input
                      v-model="postForm.originalname"
                      placeholder="文件名称"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label-width="labelWidth" label="封面：">
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
                  <el-form-item :label-width="labelWidth" label="目录：">
                    <div
                      v-if="postForm.contents && postForm.contents.length > 0"
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
const defaultForm = {
  status: "draft",
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
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      labelWidth: "110px",
    };
  },
  computed: {},
  created() {},
  methods: {
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        originalname,
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
        originalname,
        contents,
        filename,
        coverPath,
        filePath,
        unzipPath,
      };
    },
    handleSuccess(data) {
      console.log(data);
      console.log("上传成功");
      // 将data传入setData当中
      // setData:更新表单数据
      this.setData(data);
    },
    handleError(file, filelist) {},
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
  .preview-img{
    width: 200px;
    height:250px
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
