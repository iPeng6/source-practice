<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <YlForm :model="userinfo" :rules="rules" ref="form">
      <YlFormItem label="姓名" prop="username">
        <YlInput v-model="userinfo.username" placeholder="请输入姓名" />
      </YlFormItem>
      <YlFormItem label="密码" prop="password">
        <YlInput
          v-model="userinfo.password"
          type="password"
          placeholder="请输入密码"
        />
      </YlFormItem>
      <YlFormItem>
        <button @click="onSubmit">submit</button>
      </YlFormItem>
    </YlForm>
  </div>
</template>
<script>
import YlInput from "@/components/form/Input.vue";
import YlFormItem from "@/components/form/FormItem.vue";
import YlForm from "@/components/form/Form.vue";

export default {
  name: "App",
  components: {
    YlInput,
    YlFormItem,
    YlForm,
  },
  data() {
    return {
      userinfo: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "姓名必填" }],
        password: [{ required: true, message: "密码必填" }],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$message("success");
        } else {
          this.$message({ message: "fail" });
        }
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
