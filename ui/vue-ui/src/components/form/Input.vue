<template>
  <div>
    <input v-bind="$attrs" @input="onInput" @blur="onBlur" />
  </div>
</template>

<script>
import emitter from "../../mixins/emitter";

export default {
  name: "YlInput",
  mixins: [emitter],
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);
    },
    onBlur() {
      this.dispatch("YlInputItem", "validate");
    },
  },
};
</script>

<style lang="scss" scoped></style>
