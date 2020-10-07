export default {
  name: 'RouterLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  render(h) {
    //<a href="#/about">about</a>
    return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
  },
}
