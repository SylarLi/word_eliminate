<template>
  <div class="status-bar" :class="{ 'multi-player': isMultiPlayer }">
    <div class="timer">
        <span class="label">耗时：</span>
        <span class="value">{{ formattedTime }}</span>
      </div>
      <div class="progress">
        <span class="label">进度：</span>
        <span class="value">{{ matchedPairs[playerIndex] }}/{{ totalPairs }}</span>
      </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'StatusBar',
  props: {
    playerIndex: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const store = useStore()
    const currentTime = ref(0)
    const playerIndex = computed(() => props.playerIndex)
    let timer = null

    const totalPairs = computed(() => {
      const difficulty = store.state.difficulty
      return difficulty === 'EASY' ? 12 :
             difficulty === 'MEDIUM' ? 16 : 20
    })

    const matchedPairs = computed(() => store.state.matchedPairs)
    const players = computed(() => store.state.players)
    const isMultiPlayer = computed(() => store.state.currentMode === 'MULTI_PLAYER')

    const formattedTime = computed(() => {
      const seconds = Math.floor(currentTime.value / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    })

    const updateTimer = () => {
      if (store.state.isGameRunning && !store.state.isGameComplete) {
        currentTime.value = Date.now() - store.state.startTime
      }
    }

    onMounted(() => {
      timer = setInterval(updateTimer, 1000)
    })

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })

    return {
      matchedPairs,
      totalPairs,
      formattedTime,
      players,
      isMultiPlayer
    }
  }
}
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: safe center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.player-status {
  flex: 1;
  text-align: center;
  padding: 0 1rem;
}

.player-status h4 {
  margin: 0 0 0.5rem 0;
  color: #409EFF;
}

.timer,
.progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  font-size: 1.2rem;
  color: #333;
}
</style>