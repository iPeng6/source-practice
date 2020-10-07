export default {
  name: 'RouterView',
  render(h) {
    // 1. 拿到当前url 对应的组件
    const comp = this.$router.routeMap.get(this.$router.current)
    return h(comp)
  },
}
