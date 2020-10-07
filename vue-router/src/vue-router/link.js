export default {
  name: 'RouterLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  render(h) {
    if (this.$router._options.mode == 'history') {
      //<a href="/about">about</a>
      const handler = (e) => {
        e.preventDefault()

        window.history.pushState({}, null, this.to)
        this.$router.current = this.to
      }

      return h(
        'a',
        {
          attrs: { href: this.to },
          on: {
            click: handler,
          },
        },
        this.$slots.default
      )
    } else {
      //<a href="#/about">about</a>
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    }
  },
}
