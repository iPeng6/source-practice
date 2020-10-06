<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <YlForm :model="userinfo" :rules="rules" ref="form">
      <YlInputItem label="姓名" prop="username">
        <YlInput v-model="userinfo.username" placeholder="请输入姓名" />
      </YlInputItem>
      <YlInputItem label="密码" prop="password">
        <YlInput
          v-model="userinfo.password"
          type="password"
          placeholder="请输入密码"
        />
      </YlInputItem>
      <YlInputItem>
        <button @click="onSubmit">submit</button>
      </YlInputItem>
    </YlForm>
  </div>
</template>
<script>
import YlInput from "@/components/form/Input.vue";
import YlInputItem from "@/components/form/InputItem.vue";
import YlForm from "@/components/form/Form.vue";

export default {
  name: "App",
  components: {
    YlInput,
    YlInputItem,
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
          this.$message({ message: "fail", duration: 2000 });
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
