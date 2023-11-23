<template>
  <div id="app" class="p-5">
    <IncomeCalculator />
  </div>
</template>

<script>
import IncomeCalculator from './components/IncomeCalculator.vue';

export default {
  name: 'App',
  components: {
    IncomeCalculator
  }
}
</script>

<style lang="scss">
  @import '~bootstrap/dist/css/bootstrap.css';
  @import './scss/index.scss';

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: grey;
    min-height: 100vh;
  }
</style>
