<template>
  <div class="upload-container">
    <el-upload
      :multiple="false"
      :show-file-list="true"
      class="uploader"
      drag
      :file-list="fileList"
      :disabled="disabled"
      limit="1"
      :action="action"
      :headers="headers"
      :accept="application / epub + zip"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      :on-success="onSuccess"
      :on-error="onError"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'EbookUpload',
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  methods: {
    onSuccess(response, file, fileList) {
      console.log(response)
      if (response.code != 0) {
        this.$emit('onError', file, fileList)
      } else {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }
    },
    onExceed() {
      this.$message({
        type: 'warning',
        message: '一次只能上传一本电子书'
      })
      this.$emit('onExceed')
    },
    beforeUpload(file) {
      // console.log(file)
      this.$emit('beforeUpload', file)
    },
    onError(err, file, fileList) {
      console.log('上传失败')
      console.log('err')
      this.$message({
        type: 'error',
        message: '上传失败，请重新上传'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .uploader {
    width: 100%;
    float: left;
  }
}
</style>
