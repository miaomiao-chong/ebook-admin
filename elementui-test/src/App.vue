<!--  -->
<template>
<<<<<<< HEAD
  <div>
    <el-form
      style="width:500px"
      :model="formData"
      ref="formValidator"
      :rules="rules"
      label-width="80px"
      :inline="false"
      size="normal"
      label-position="right"
      label-suffix=":"
      status-icon=""
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="地区" size="normal">
        <el-select
          v-model="formData.rigion"
          value-key=""
          placeholder="请选择城市"
          clearable
          filterable
        >
          <el-option value="shanghai">上海</el-option>
          <el-option value="beijing">北京</el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button type="primary" @click="addRule"
          >点击新创建一个校验状态</el-button
        >
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
=======
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <p>
        If Element is successfully added to this project, you'll see an
        <code v-text="'<el-button>'"></code>
        below
      </p>
      <el-button>el-button</el-button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
>>>>>>> a8e66481a444b9105ea6e3c0988f435996c47ab4
  </div>
</template>

<script>
export default {
<<<<<<< HEAD
  data() {
    const nameValidate = (rule, value, callback) => {
      if (value.length <= 3) {
        callback(new Error("用户名不能小于3"));
      } else {
        callback();
      }
    };

    return {
      formData: {
        name: "123456",
        rigion: "上海",
      },
      rules: {
        name: [
          { required: true, message: "用户名不能为空", trigger: "change" },
          {
            validator: nameValidate,
            message: "用户名不能小于3",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      // this.$message.success("提交成功")
      // if(!this.formData.name){
      //   console.log("用户名为空");
      //   this.$message.warning("失败")
      // }else{
      //    this.$message.success("提交成功")
      this.$refs.formValidator.validate((a, err) => {
        console.log(a, err);
      });
      console.log(this.formData);
    },

    addRule() {
      const nameValidate2 = (rule, value, callback) => {
        if (value.length >= 6) {
          callback(new Error("用户名不能大于6"));
        } else {
          callback();
        }
      };
      const newRule = [
        ...this.rules.name,
        {
          validator: nameValidate2,
          message: "用户名不能大于6",
          trigger: "change",
        },
      ];
      this.rules = { name: newRule };
    },
  },

  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style lang='scss' scoped>
// @import "assets/style/global";
</style>
=======
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


>>>>>>> a8e66481a444b9105ea6e3c0988f435996c47ab4
