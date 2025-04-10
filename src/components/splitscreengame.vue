<template>
  <div class="split-screen-container">
    <!-- 左侧玩家区域 -->
    <div class="player-section">
      <h3>{{ players[0] }}</h3>
      <div class="game-board">
        <GameBoard :playerIndex="0" @match="handleMatch" />
      </div>
    </div>

    <!-- 右侧玩家区域 -->
    <div class="player-section">
      <h3>{{ players[1] }}</h3>
      <div class="game-board">
        <GameBoard :playerIndex="1" @match="handleMatch" />
      </div>
    </div>

    <!-- 游戏结束弹窗 -->
    <div v-if="winner" class="game-over-modal">
      <div class="modal-content">
        <h2>游戏结束!</h2>
        <p>获胜者: {{ winner }}</p>
        <button @click="restartGame">重新开始</button>
        <button @click="backToMenu">返回菜单</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import GameBoard from './GameBoard.vue'

export default {
  name: 'SplitScreenGame',
  components: {
    GameBoard
  },
  setup() {
    const store = useStore()

    const players = computed(() => store.state.players)
    const winner = computed(() => store.getters.getWinningPlayer)

    const handleMatch = (playerIndex) => {
      const currentPairs = store.state.matchedPairs[playerIndex]
      store.commit('setMatchedPairs', { playerIndex, pairs: currentPairs + 1 })
    }

    const restartGame = () => {
      store.dispatch('initializeGame', {
        mode: 'MULTI_PLAYER',
        difficulty: store.state.difficulty,
        players: store.state.players
      })
    }

    const backToMenu = () => {
      store.dispatch('endGame')
    }

    return {
      players,
      winner,
      handleMatch,
      restartGame,
      backToMenu
    }
  }
}
</script>

<style scoped>
.split-screen-container {
  display: flex;
  width: 100%;
  position: relative;
}

.player-section {
  flex: 1;
  border: 1px solid #ccc;
}

.player-section h3 {
  text-align: center;
}

.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.modal-content button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #45a049;
}
</style>