<template>
  <div>
    <input v-bind="$attrs" @input="onInput" @blur="onBlur" />
  </div>
</template>

<script>
import emitter from "../../mixins/emitter";

export default {
  name: "YLInput",
  mixins: [emitter],
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);
    },
    onBlur() {
      this.dispatch("YLInputItem", "validate");
    },
  },
};
</script>

<style lang="scss" scoped></style>
