import { createStore } from 'vuex'

export default createStore({
  state: {
    currentMode: null,
    difficulty: null,
    matchedPairs: [0, 0],
    isGameRunning: false,
    bgmVolume: 0.3,
    sfxVolume: 0.9,
    language: 'zh',
    startTime: 0,
    players: [],
    winner: null
  },
  mutations: {
    setGameMode(state, mode) {
      state.currentMode = mode
    },
    setDifficulty(state, difficulty) {
      state.difficulty = difficulty
    },
    setMatchedPairs(state, { playerIndex, pairs }) {
      state.matchedPairs[playerIndex] = pairs
    },
    setPlayers(state, players) {
      state.players = players
    },
    setWinner(state, winner) {
      state.winner = winner
    },
    setGameRunning(state, isRunning) {
      state.isGameRunning = isRunning
    },
    setStartTime(state, startTime) {
      state.startTime = startTime
    },
    setVolume(state, { type, volume }) {
      if (type === 'bgm') {
        state.bgmVolume = volume
      } else if (type === 'sfx') {
        state.sfxVolume = volume
      }
    },
    setLanguage(state, language) {
      state.language = language
    }
  },
  actions: {
    initializeGame({ commit }, { mode, difficulty, players }) {
      commit('setGameMode', mode)
      commit('setDifficulty', difficulty)
      commit('setMatchedPairs', { playerIndex: 0, pairs: 0 })
      if (mode === 'MULTI_PLAYER') {
        commit('setMatchedPairs', { playerIndex: 1, pairs: 0 })
        commit('setPlayers', players)
      }
      commit('setWinner', null)
      commit('setGameRunning', true)
      commit('setStartTime', Date.now())
    },
    endGame({ commit }) {
      commit('setGameRunning', false)
    }
  },
  getters: {
    isGameComplete: state => {
      const totalPairs = state.difficulty === 'EASY' ? 12 :
                        state.difficulty === 'MEDIUM' ? 16 : 20
      return state.matchedPairs.some(pairs => pairs === totalPairs)
    },
    getWinningPlayer: state => {
      if (!state.winner && state.currentMode === 'MULTI_PLAYER') {
        const totalPairs = state.difficulty === 'EASY' ? 12 :
                          state.difficulty === 'MEDIUM' ? 16 : 20
        const winnerIndex = state.matchedPairs.findIndex(pairs => pairs === totalPairs)
        return winnerIndex !== -1 ? state.players[winnerIndex] : null
      }
      return state.winner
    }
  }
})