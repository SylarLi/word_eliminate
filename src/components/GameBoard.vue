<template>
  <StatusBar :playerIndex="playerIndex" />
  <AudioManager ref="audioManager" />
  <button class="settings-button" @click="showSettings = true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.65.07-.97 0-.32-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 13.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/>
    </svg>
  </button>
  <SettingsPanel v-model:isVisible="showSettings" />
  <div class="game-board">
    <div v-if="isGameComplete && !isMultiPlayer" class="game-complete-modal">
      <div class="modal-content">
        <h2>恭喜完成!</h2>
        <p>用时: {{ elapsedTime }}秒</p>
        <div class="button-group">
          <button @click="restartGame" class="restart-button">再来一局</button>
          <button @click="quitGame" class="quit-button">退出游戏</button>
        </div>
      </div>
    </div>
    <div class="card-grid" :style="gridStyle">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card"
        :class="{ 'is-selected': card.isSelected, 'is-matched': card.isMatched, 'is-shaked': card.isShaked  }"
        :style="{ '--card-bg': card.background }"
        @click="selectCard(card)"
      >
          <div class="card-inner">
            <div class="card-front">{{ card.content }}</div>
            <div class="card-back"></div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import StatusBar from './StatusBar.vue'
import AudioManager from './AudioManager.vue'
import SettingsPanel from './SettingsPanel.vue'

export default {
  name: 'GameBoard',
  components: {
    StatusBar,
    AudioManager,
    SettingsPanel
  },
  props: {
    playerIndex: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const store = useStore()
    const cards = ref([])
    const selectedCards = ref([])
    const showSettings = ref(false)
    const elapsedTime = ref(0)
    const formattedTime = computed(() => {
      const seconds = Math.floor(currentTime.value / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    })

    const isMultiPlayer = computed(() => store.state.currentMode === 'MULTI_PLAYER')
    const isGameComplete = computed(() => store.getters.isGameComplete)
    watch(isGameComplete, (newVal) => {
      if (newVal) {
        const time = Date.now() - store.state.startTime
        const seconds = Math.floor(time / 1000)
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        elapsedTime.value = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
        // 停止背景音乐并播放胜利音效
        audioManager.value?.pauseBGM()
        audioManager.value?.playSFX('victory')
      }
    })

    const restartGame = () => {
      store.dispatch('initializeGame', {
        mode: store.state.currentMode,
        difficulty: store.state.difficulty,
        players: store.state.players
      })
      initializeCards()
      elapsedTime.value = 0
    }

    const calculateGrid = () => {
      return Math.ceil(Math.sqrt(cards.value.length))
    }

    const gridStyle = computed(() => {
      const gridSize = calculateGrid()
      const minSize = Math.min(window.innerWidth, window.innerHeight * 0.65)
      var cardSize = Math.floor(minSize / gridSize)
      const gap = `10px`
      const padding = `10px`
      
      // if (store.state.currentMode == 'MULTI_PLAYER') cardSize *= 0.7
      var totalWidth = (cardSize + 10) * gridSize - 10
      const totalHeight = totalWidth      
      
      return {
        gridTemplateColumns: `repeat(${gridSize}, ${cardSize}px)`,
        width: `${totalWidth}px`,
        height: `${totalHeight}px`,
        gap,
        padding
      }
    })

    // 修改initializeCards方法
    const initializeCards = async () => {
      const text = await window.electron.ipcRenderer.invoke('get-word-library')
      const pairs = store.state.difficulty === 'EASY' ? 12 :
                   store.state.difficulty === 'MEDIUM' ? 16 : 20
      
      // 从词库文件加载单词对
      // const response = await fetch('./assets/words/word_library.txt')
      // if (!response.ok) {
      //   throw new Error('无法加载词库文件')
      // }
      // const text = await response.text()
      const allLines = text.split('\n').filter(line => line.trim() !== '')
      
      // 解析单词对，忽略中英文中间的空格
      const wordPairs = allLines.map(line => {
        const [english, chinese] = line.split('@').map(s => s.trim())
        if (!english || !chinese) {
          throw new Error('词库文件格式错误')
        }
        return { english, chinese }
      })
    
      // 检查词库是否足够
      if (wordPairs.length < pairs) {
        throw new Error(`词库中只有${wordPairs.length}个单词对，但需要${pairs}个`)
      }
    
      // 使用Fisher-Yates洗牌算法随机打乱单词对
      for (let i = wordPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[wordPairs[i], wordPairs[j]] = [wordPairs[j], wordPairs[i]]
      }
    
      // 选择前pairs个单词对
      const selectedPairs = wordPairs.slice(0, pairs)
    
      // 使用Set来记录已选单词，确保不重复
      const selectedWords = new Set()
      for (const pair of selectedPairs) {
        if (selectedWords.has(pair.english)) {
          throw new Error('词库中存在重复单词')
        }
        selectedWords.add(pair.english)
      }

      const generateRandomGradient = () => {
        const hue = Math.floor(Math.random() * 360)
        return `linear-gradient(145deg, hsl(${hue}, 70%, 90%), hsl(${hue}, 70%, 85%))`
      }

      const allCards = []
      var index = 0;
      selectedPairs.forEach(pair => {
        const gradient = generateRandomGradient()
        allCards.push(
          { index: index, content: pair.english, isSelected: false, isMatched: false, background: gradient },
          { index: index, content: pair.chinese, isSelected: false, isMatched: false, background: gradient }
        )
        index++;
      })
    
      // 随机打乱卡片顺序
      cards.value = allCards.sort(() => Math.random() - 0.5)
    }

    const audioManager = ref(null)

    const selectCard = (card) => {
      if (card.isMatched || selectedCards.value.length >= 2) return
      audioManager.value?.playSFX('cardFlip')
      card.isSelected = !card.isSelected
      if (card.isSelected) {
        selectedCards.value.push(card)
      }
      else {
        selectedCards.value = []
      }

      if (selectedCards.value.length === 2) {
        setTimeout(checkMatch, 100)
      }
    }

    const checkMatch = () => {
      const [card1, card2] = selectedCards.value
      if (isMatch(card1, card2)) {
        audioManager.value?.playSFX('matchSuccess')
        card1.isMatched = true
        card2.isMatched = true
        var pairs = store.state.matchedPairs[props.playerIndex];
        store.commit('setMatchedPairs', { playerIndex: props.playerIndex, pairs: pairs + 1 })
      } else {
        audioManager.value?.playSFX('matchFail')
        // 添加抖动效果
        card1.isShaked = true;
        card2.isShaked = true;
        setTimeout(() => {
          card1.isShaked = false;
          card2.isShaked = false;
        }, 300);
      }
      card1.isSelected = false
      card2.isSelected = false
      selectedCards.value = []
    }

    const isMatch = (card1, card2) => {
      return card1.index === card2.index
    }

    onMounted(() => {
      initializeCards()
      audioManager.value?.playBGM(isMultiPlayer.value ? 'bgm_multi' : 'bgm')
    })

    const quitGame = () => {
      store.dispatch('endGame')
      store.commit('setGameMode', null)
      store.commit('setDifficulty', null)
    }

    return {
      cards,
      gridStyle,
      selectCard,
      isGameComplete,
      elapsedTime,
      restartGame,
      quitGame,
      isMultiPlayer,
      audioManager,
      showSettings
    }
  }
}
</script>

<style scoped>
.game-complete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.restart-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.restart-button:hover {
  background-color: #3aa876;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.quit-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.quit-button:hover {
  background-color: #e64242;
}

.game-board {
  padding: 1rem;
  width: 100%;
  display: flex;
  align-items: safe center;
  justify-content: safe center;
  line-height: 1.2;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.settings-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.2s;
}

.settings-button:hover {
  transform: rotate(30deg);
}

.settings-button svg {
  color: #409EFF;
}

.card-grid {
  display: grid;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 8px;
}

.card {
  aspect-ratio: 1;
  cursor: pointer;
  border: 1px solid #409EFF;
  border-radius: clamp(2px, 0.5vw, 4px);
  display: flex;
  /* animation: fadeIn 0.3s ease-out; */
  align-items: center;
  background: var(--card-bg);
  justify-content: center;
  font-size: clamp(1rem, 2vw, 1.2rem);
  padding: 0.5em;
  white-space: normal;
  transition: box-shadow 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible; /* 修改overflow为visible */
  padding: 0.2rem;
}

.card:active {
  transform: scale(0.95);
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card.is-selected {
  border-color: #409EFF;
  transform: scale(0.9);
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
  z-index: 1;
  animation: pulse 1s infinite;
}

.card.is-matched {
  border-color: #67C23A;
  opacity: 0.9;
  box-shadow: 0 0 10px rgba(103, 194, 58, 0.3);
  animation: flip 0.6s ease-out forwards;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  min-height: 20px; /* 确保最小高度 */
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: safe center;
  justify-content: safe center;
  line-height: 1.2;
  z-index: 2;
}

.card-front {
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  font-size: clamp(0.8rem, calc(0.6rem + 1vw), 1.2rem);
  word-break: break-word;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.3;
  overflow-wrap: break-word;
  max-height: 100%;
  overflow: hidden;
}

.card-back {
  transform: rotateY(180deg);
  background: repeating-linear-gradient(
    45deg,
    rgba(103, 194, 58, 0.1),
    rgba(103, 194, 58, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px
  ) !important;
}

.card.is-matched .card-inner {
  transform: rotateY(180deg);
}

@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
    background: var(--card-bg);
  }
  100% {
    transform: rotateY(180deg);
  }
}

.card.is-shaked {
  animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-2px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(2px, 0, 0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgb(64, 160, 255);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>