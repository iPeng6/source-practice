<template>
  <div>
    <span>{{ label }}</span>
    <slot></slot>
    <div v-if="error" class="yl-input-error">{{ error }}</div>
  </div>
</template>

<script>
import Schema from "async-validator";

export default {
  name: "YlFormItem",
  inject: ["form"],
  props: {
    label: {
      type: String,
      default: "",
    },
    prop: {
      type: String,
    },
  },
  data() {
    return {
      error: "",
    };
  },
  methods: {
    validate() {
      const value = this.form.model[this.prop];
      const rule = this.form.rules[this.prop];

      const schema = new Schema({
        [this.prop]: rule,
      });

      return schema.validate({ [this.prop]: value }, (errors) => {
        if (errors) {
          this.error = errors[0].message;
        } else {
          this.error = "";
        }
      });
    },
  },
  mounted() {
    this.$on("validate", () => {
      this.validate().catch(() => {});
    });
  },
};
</script>

<style coped>
.yl-input-error {
  color: red;
}
</style>
