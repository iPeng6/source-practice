import Vue from 'vue'
import YlMessage from './Message.vue'

const MessageConstructor = Vue.extend(YlMessage)

const Message = function(options) {
  if (typeof options === 'string') {
    options = {
      message: options,
    }
  }
  const instance = new MessageConstructor({
    propsData: {
      message: options.message,
      duration: options.duration,
    },
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
}

export default Message
