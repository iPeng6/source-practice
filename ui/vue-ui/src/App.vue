<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <YLForm :model="userinfo" :rules="rules" ref="form">
      <YLInputItem label="姓名" prop="username">
        <YLInput v-model="userinfo.username" placeholder="请输入姓名" />
      </YLInputItem>
      <YLInputItem label="密码" prop="password">
        <YLInput
          v-model="userinfo.password"
          type="password"
          placeholder="请输入密码"
        />
      </YLInputItem>
      <YLInputItem>
        <button @click="onSubmit">submit</button>
      </YLInputItem>
    </YLForm>
  </div>
</template>
<script>
import YLInput from "@/components/form/YLInput.vue";
import YLInputItem from "@/components/form/YLInputItem.vue";
import YLForm from "@/components/form/YLForm.vue";

export default {
  name: "App",
  components: {
    YLInput,
    YLInputItem,
    YLForm,
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
          alert("submit");
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
