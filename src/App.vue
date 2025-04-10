<template>
  <div class="app">
    <h1>单词消消乐</h1>
    <GameMode v-if="!isGameRunning" />
    <template v-else>
      <SplitScreenGame v-if="currentMode === 'MULTI_PLAYER'" />
      <GameBoard v-else />
    </template>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import GameMode from './components/GameMode.vue'
import GameBoard from './components/GameBoard.vue'
import SplitScreenGame from './components/SplitScreenGame.vue'

export default {
  name: 'App',
  components: {
    GameMode,
    GameBoard,
    SplitScreenGame
  },
  setup() {
    const store = useStore()
    const isGameRunning = computed(() => store.state.isGameRunning)
    const currentMode = computed(() => store.state.currentMode)
    return {
      isGameRunning,
      currentMode
    }
  }
}
</script>

<style>
#app {
  margin: 0 auto;
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
  color: #409EFF;
}
</style>
