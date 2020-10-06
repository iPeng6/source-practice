import Vue from "vue";
import App from "./App.vue";
import Message from "@/components/message";

Vue.config.productionTip = false;

Vue.prototype.$message = Message;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
