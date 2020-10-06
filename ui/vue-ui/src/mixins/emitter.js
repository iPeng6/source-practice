export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && name !== componentName) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
      }

      if (parent) {
        parent.$emit(eventName, params);
      }
    },
  },
};
