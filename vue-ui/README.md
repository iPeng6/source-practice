# vue-ui

参考 ElementUI

- [x] Form
  - [x] FormItem
  - [x] InputItem
- [x] Message

要点总结

## Form

1. 多层级组件通信

   1. 父 -> 子 `provide / inject` 这里直接将整个 Form 实例传下去
      ```js
      // Form.vue
      provide() {
        return {
          form: this,
        };
      }
      // FormItem.vue
      inject: ["form"],
      ```
   2. 子 -> 父 `$parent` 向上查找，这里实现了一个 dispatch 的 mixin，根据组件名称找到对应组件派发事件

      ```js
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
      ```

## Message

弹框要脱离根实例，挂载到 body 上，所以需要单独实例化自定义挂载

1. 实例化组件
   ```js
   const MessageConstructor = Vue.extend(YlMessage);
   const instance = new MessageConstructor({...});
   ```
2. 自定义挂载 拿到 dom
   ```js
   instance.$mount(); // 空参数不会立即挂载 但可以拿到 $el
   document.body.appendChild(instance.$el);
   ```
