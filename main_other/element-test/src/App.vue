<template>
  <div id="app">
    <!-- validate-on-rule-change当rules发生变化会立即进行校验 -->
    <el-form
      :inline='false'
      :model="data"
      :rules="rules"
      ref="form"
      :validate-on-rule-change="false"
      status-icon
     style="width:500px"
     label-width="100px"
     label-position="right"
     label-suffix=":"
     disabled
    >
      <!-- 注意这里的prop没加： -->
      <el-form-item
        label="审批人"
        prop="user"
        :error="error"
        :validate-status="status"
   
      >
        <el-input v-model="data.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="data.region" placeholder="活动区域" style="width:100%">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">查询</el-button>
        <el-button type="primary" @click="addRule">点我添加校验规则</el-button>
        <!-- <el-button type="success" @click="showSuccess">成功校验</el-button> -->
        <!-- <el-button type="danger" @click="showError">失败校验</el-button> -->
        <!-- <el-button type="warning" @click="showValidating">校验中</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    // const userValidator = (rule, value, callback) => {
    //   // rule :当前校验规则，value:输入的值 ，
    //   if (value.length > 3) {
    //     callback();
    //   } else {
    //     callback(new Error("用户名长度必须大于3"));
    //   }
    // };
    return {
      //这个data是表单的数据源 通过model进行绑定
      error: "",
      status: "",
      data: {
        user: "sam",
        region: "区域二",
      },
      rules: {
        user: [
          { required: true, trigger: "change", message: "用户名必须录入" }, // blur
          // { validator: userValidator, trigger: "change" },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      console.log(this.data);
      // if (!this.data.user) {
      //   this.$message.error("aaa");
      this.$refs.form.validate((res, err) => {
        console.log(res, err);
      });
    },
    addRule() {
      const userValidator = (rule, value, callback) => {
        if (value.length > 3) {
          callback();
        } else {
          callback(new Error("用户名长度必须大于3"));
        }
      };
      const newRule = [
        // 拼接校验规则
        ...this.rules.user,
        { validator: userValidator, trigger: "change" },
      ];
      // this.rules = Object.assign({}, this.rules, { user: newRule });  这是老师的
      // 我认为还可以这样写
      //  this.rules = Object.assign({}, { user: newRule });
      // 或者下面这样
      this.rules = { user: newRule };
      //  this.rules.user.push(newRule)   //这个不行，因为watch监听不到user的变化  只能监听rules本身的变化
    },

    showError() {
      this.status = "error";
      this.error = "用户名输入有误";
    },
    showSuccess() {
      this.status = "success";
      this.error = "";
    },
    showValidating() {
      this.status = "validating";
      this.error = "";
    },
  },
};
</script>