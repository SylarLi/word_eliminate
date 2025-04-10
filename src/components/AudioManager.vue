<template>
  <div class="audio-manager">
    <!-- 音频元素 -->
    <audio ref="bgmPlayer" loop preload="auto"></audio>
    <div ref="sfxPool" class="sfx-pool">
      <!-- 音效池将在这里动态创建音频元素 -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AudioManager',
  setup() {
    const store = useStore()
    const bgmPlayer = ref(null)
    const sfxPool = ref(null)
    const bgmVolume = ref(store.state.bgmVolume)
    const sfxVolume = ref(store.state.sfxVolume)
    const poolSize = 8 // 音效池大小
    const audioPool = ref([]) // 存储音频实例的数组

    // 音效文件路径
    const audioFiles = {
      bgm: './assets/audio/bgm.wav',
      bgm_multi: './assets/audio/bgm_multi.wav',
      cardFlip: './assets/audio/card_flip.ogg',
      matchSuccess: './assets/audio/match_success.wav',
      matchFail: './assets/audio/match_fail.mp3',
    }

    // 初始化音效池
    const initAudioPool = () => {
      for (let i = 0; i < poolSize; i++) {
        const audio = new Audio()
        audio.preload = 'auto'
        audio.volume = sfxVolume.value
        audio.dataset.inUse = 'false'
        audioPool.value.push(audio)
        sfxPool.value.appendChild(audio)
      }
    }

    // 获取可用的音频实例
    const getAvailableAudio = () => {
      // 首先查找未在使用的实例
      let audio = audioPool.value.find(a => a.dataset.inUse === 'false')
      if (audio) return audio

      // 如果所有实例都在使用中，找到已经播放完成的实例
      audio = audioPool.value.find(a => a.ended)
      if (audio) return audio

      // 如果没有可用实例，返回池中第一个实例（循环使用）
      return audioPool.value[0]
    }

    // 播放背景音乐
    const playBGM = (type) => {
      if (bgmPlayer.value) {
        bgmPlayer.value.src = audioFiles[type]
        bgmPlayer.value.volume = bgmVolume.value
        bgmPlayer.value.play()
      }
    }

    // 暂停背景音乐
    const pauseBGM = () => {
      if (bgmPlayer.value) {
        bgmPlayer.value.pause()
      }
    }

    // 播放音效
    const playSFX = (type) => {
      if (audioFiles[type]) {
        const audio = getAvailableAudio()
        audio.src = audioFiles[type]
        audio.volume = sfxVolume.value
        audio.dataset.inUse = 'true'
        
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // 播放成功
          }).catch(error => {
            console.error('播放音效失败:', error)
            audio.dataset.inUse = 'false'
          })
        }

        // 音频播放结束后标记为可用
        audio.onended = () => {
          audio.dataset.inUse = 'false'
        }
      }
    }

    // 设置音量
    const setVolume = (type, volume) => {
      if (type === 'bgm') {
        bgmVolume.value = volume
        if (bgmPlayer.value) bgmPlayer.value.volume = volume
      } else if (type === 'sfx') {
        sfxVolume.value = volume
        // 更新所有音效实例的音量
        audioPool.value.forEach(audio => {
          audio.volume = volume
        })
      }
    }

    onMounted(() => {
      // 初始化音频播放器
      if (bgmPlayer.value) bgmPlayer.value.volume = bgmVolume.value
      if (sfxPool.value) {
        initAudioPool()
      }
    })

    // 监听store中的音量变化
    watch(() => store.state.bgmVolume, (newVolume) => {
      setVolume('bgm', newVolume)
    })

    watch(() => store.state.sfxVolume, (newVolume) => {
      setVolume('sfx', newVolume)
    })

    onUnmounted(() => {
      // 清理音频资源
      if (bgmPlayer.value) bgmPlayer.value.pause()
      // 停止并清理所有音效实例
      audioPool.value.forEach(audio => {
        audio.pause()
        audio.src = ''
      })
      audioPool.value = []
    })

    return {
      playBGM,
      pauseBGM,
      playSFX,
      setVolume,
      sfxPool,
      bgmPlayer,
      audioPool
    }
  }
}
</script>

<style scoped>
.audio-manager {
  display: none; /* 隐藏音频元素 */
}
</style>