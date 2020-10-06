<template>
  <div class="yl-message">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "YlMessage",
  data() {
    return {
      message: "",
      timer: null,
    };
  },
  methods: {
    startTimer() {
      this.timer = setTimeout(() => {
        this.close();
      }, this.duration || 1000);
    },
    clearTimer() {
      this.timer && clearTimeout(this.timer);
      this.timer = null;
    },
    close() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
  },
  mounted() {
    this.startTimer();
  },
  destroyed() {
    this.clearTimer();
  },
};
</script>

<style scoped>
.yl-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 300px;
  height: 50px;
  line-height: 50px;
  padding: 0 16px;
  background: #ddd;
}
</style>
