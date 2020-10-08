<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <div @click="$store.commit('add')">
      commit count:{{ $store.state.count }}
    </div>
    <div @click="$store.dispatch('add')">
      dispatch count:{{ $store.state.count }}
    </div>

    <div>getter doubleCount: {{ $store.getters.doubleCount }}</div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
