<template>
  <div class="game-mode-selector">
    <h2>选择游戏模式</h2>
    <el-radio-group v-model="selectedMode" class="mode-group">
      <el-radio-button label="SINGLE_PLAYER">单人模式</el-radio-button>
      <el-radio-button label="MULTI_PLAYER">双人对战</el-radio-button>
    </el-radio-group>

    <h2>选择难度</h2>
    <el-radio-group v-model="selectedDifficulty" class="difficulty-group">
      <el-radio-button label="EASY">简单 (12对)</el-radio-button>
      <el-radio-button label="MEDIUM">中等 (16对)</el-radio-button>
      <el-radio-button label="HARD">困难 (20对)</el-radio-button>
    </el-radio-group>

    <div class="start-button">
      <el-button type="primary" @click="startGame" :disabled="!canStart">
        开始游戏
      </el-button>
      <el-button @click="openWordLibraryEditor">
        编辑词库
      </el-button>
    </div>
  </div>
  <WordLibraryEditor v-model:isVisible="showEditor" @close="showEditor = false" />
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import WordLibraryEditor from './WordLibraryEditor.vue'

export default {
  name: 'GameMode',
  components: {
    WordLibraryEditor
  },
  setup() {
    const store = useStore()
    const selectedMode = ref(null)
    const selectedDifficulty = ref(null)
    const showEditor = ref(false)
    const openWordLibraryEditor = () => {
      showEditor.value = true
    }

    const canStart = computed(() =>
      selectedMode.value && selectedDifficulty.value
    )

    const startGame = () => {
      store.dispatch('initializeGame', {
        mode: selectedMode.value,
        difficulty: selectedDifficulty.value,
        players: ["Player A", "Player B"]
      })
    }

    return {
      selectedMode,
      selectedDifficulty,
      canStart,
      startGame,
      showEditor,
      openWordLibraryEditor
    }
  }
}
</script>

<style scoped>
.game-mode-selector {
  text-align: center;
  padding: 2rem;
}

.mode-group,
.difficulty-group {
  margin: 1rem 0;
}

.start-button {
  margin-top: 2rem;
}
</style>