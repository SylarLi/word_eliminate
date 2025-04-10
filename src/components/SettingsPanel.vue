<template>
  <div class="settings-panel" v-if="isVisible">
    <div class="settings-overlay" @click="close"></div>
    <div class="settings-content">
      <h2>设置</h2>
      <div class="settings-group">
        <div class="volume-control">
          <label>背景音乐音量</label>
          <div class="slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model="bgmVolume"
              @input="updateBGMVolume"
            />
            <span class="volume-value">{{ Math.round(bgmVolume * 100) }}%</span>
          </div>
        </div>
        <div class="volume-control">
          <label>音效音量</label>
          <div class="slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model="sfxVolume"
              @input="updateSFXVolume"
            />
            <span class="volume-value">{{ Math.round(sfxVolume * 100) }}%</span>
          </div>
        </div>
      </div>
      <div class="button-group">
        <button class="quit-button" @click="quitGame">退出游戏</button>
        <button class="close-button" @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SettingsPanel',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'update:isVisible'],
  setup(props, { emit }) {
    const store = useStore()
    const bgmVolume = ref(store.state.bgmVolume || 0.3)
    const sfxVolume = ref(store.state.sfxVolume || 0.9)

    const updateBGMVolume = () => {
      store.commit('setVolume', { type: 'bgm', volume: bgmVolume.value })
    }

    const updateSFXVolume = () => {
      store.commit('setVolume', { type: 'sfx', volume: sfxVolume.value })
    }

    const close = () => {
      emit('update:isVisible', false)
      emit('close')
    }

    const quitGame = () => {
      store.dispatch('endGame')
      store.commit('setGameMode', null)
      store.commit('setDifficulty', null)
      emit('update:isVisible', false)
    }

    return {
      bgmVolume,
      sfxVolume,
      updateBGMVolume,
      updateSFXVolume,
      close,
      quitGame
    }
  }
}
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.settings-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.settings-content {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 90%;
  z-index: 1;
}

.settings-content h2 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.settings-group {
  margin-bottom: 1.5rem;
}

.volume-control {
  margin-bottom: 1rem;
}

.volume-control label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider-container input[type="range"] {
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
}

.slider-container input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #409EFF;
  cursor: pointer;
  transition: background .2s;
}

.slider-container input[type="range"]::-webkit-slider-thumb:hover {
  background: #66b1ff;
}

.volume-value {
  min-width: 3em;
  text-align: right;
  color: #606266;
}

.button-group {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.close-button, .quit-button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.close-button {
  background-color: #409EFF;
  color: white;
}

.close-button:hover {
  background-color: #66b1ff;
}

.quit-button {
  background-color: #f56c6c;
  color: white;
}

.quit-button:hover {
  background-color: #e64242;
}
</style>