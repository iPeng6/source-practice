<template>
  <div>
    <input v-bind="$attrs" @input="onInput" @blur="onBlur" />
  </div>
</template>

<script>
export default {
  name: "YLInput",
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);
    },
    onBlur() {
      this.$parent.$emit("validate");
    },
  },
};
</script>

<style lang="scss" scoped></style>
