# 英文单词消消乐游戏系统设计

## 1. 系统架构概述

### 1.1 整体架构
系统采用前端MVC架构，分为以下五个核心子系统：
- 游戏模式选择系统
- 游戏核心系统
- 计时系统
- 音效系统
- UI渲染系统

### 1.2 技术栈选择
- 前端框架：Vue.js 3.0
- 状态管理：Vuex
- UI组件库：Element Plus
- 音频处理：Howler.js
- 本地存储：LocalStorage

## 2. 子系统详细设计

### 2.1 游戏模式选择系统

#### 2.1.1 类图
```
GameModeManager
- currentMode: GameMode
- difficulty: DifficultyLevel
+ selectMode(mode: GameMode): void
+ selectDifficulty(level: DifficultyLevel): void
+ initializeGame(): void

Enum GameMode {
  SINGLE_PLAYER,
  MULTI_PLAYER
}

Enum DifficultyLevel {
  EASY,    // 12 pairs
  MEDIUM,  // 16 pairs
  HARD     // 20 pairs
}
```

#### 2.1.2 状态图
```
[初始状态] -> 选择游戏模式 -> [模式已选] -> 选择难度级别 -> [配置完成] -> 开始游戏
```

### 2.2 游戏核心系统

#### 2.2.1 类图
```
GameCore
- wordPairs: WordPair[]
- selectedCards: Card[]
- matchedPairs: number
+ initializeGame(difficulty: DifficultyLevel): void
+ selectCard(card: Card): void
+ checkMatch(): boolean
+ isGameComplete(): boolean

WordPair
- english: string
- chinese: string
- isMatched: boolean

Card
- content: string
- isSelected: boolean
- isMatched: boolean
+ flip(): void
+ match(): void
```

#### 2.2.2 时序图
```
Player -> Card: selectCard()
Card -> GameCore: notifySelection()
GameCore -> GameCore: checkMatch()
GameCore -> Card: updateState()
GameCore -> TimerSystem: updateIfComplete()
```

### 2.3 计时系统

#### 2.3.1 类图
```
TimerSystem
- startTime: number
- endTime: number
- isRunning: boolean
+ start(): void
+ stop(): void
+ getElapsedTime(): number
+ saveRecord(time: number): void
+ getBestRecord(): number
```

#### 2.3.2 状态图
```
[停止] -> start() -> [计时中] -> stop() -> [已完成] -> saveRecord() -> [记录已保存]
```

### 2.4 音效系统

#### 2.4.1 类图
```
AudioManager
- bgMusic: Sound
- sfx: Map<string, Sound>
+ playBackgroundMusic(): void
+ stopBackgroundMusic(): void
+ playEffect(type: SoundType): void
+ setVolume(volume: number): void

Enum SoundType {
  CLICK,
  MATCH,
  MISMATCH,
  VICTORY
}
```

### 2.5 UI渲染系统

#### 2.5.1 类图
```
UIRenderer
- gameBoard: GameBoard
- statusBar: StatusBar
+ renderBoard(cards: Card[]): void
+ updateStatus(time: number, pairs: number): void
+ showAnimation(type: AnimationType): void

GameBoard
- layout: Layout
+ arrangeCards(cards: Card[]): void
+ updateCardState(card: Card): void  // 更新卡片选中和匹配状态

StatusBar
- currentTime: number
- matchedPairs: number
+ updateTime(time: number): void
+ updateProgress(pairs: number): void
```

#### 2.5.2 卡片显示
- 所有卡片内容直接显示，无需翻转
- 选中卡片时显示高亮效果
- 匹配成功的卡片显示完成状态

## 3. 系统交互流程

### 3.1 游戏初始化流程
1. GameModeManager接收用户选择的游戏模式和难度
2. GameCore根据难度初始化单词对和卡片
3. UIRenderer初始化游戏界面布局
4. TimerSystem准备计时
5. AudioManager加载音频资源

### 3.2 游戏进行流程
1. 用户点击卡片触发Card.flip()
2. GameCore处理卡片选择逻辑
3. 检查配对结果并通知AudioManager播放相应音效
4. UIRenderer更新界面显示
5. TimerSystem持续更新计时

### 3.3 游戏结算流程
1. GameCore检测到所有配对完成
2. TimerSystem停止计时并保存记录
3. AudioManager播放胜利音效
4. UIRenderer显示结算界面

## 4. 数据流设计

### 4.1 本地存储结构
```typescript
interface GameRecord {
  mode: GameMode;
  difficulty: DifficultyLevel;
  time: number;
  date: string;
}

interface GameSettings {
  volume: number;
  language: string;
}
```

### 4.2 状态管理
使用Vuex管理以下状态：
- 当前游戏模式和难度
- 游戏进行状态
- 已匹配的单词对数量
- 计时器状态
- 音频设置

## 5. 错误处理机制

### 5.1 游戏状态异常
- 实现游戏状态自动保存
- 提供手动重置功能
- 异常状态下自动回到主菜单

### 5.2 资源加载失败
- 实现资源加载重试机制
- 提供离线词库支持
- 使用默认音效替代加载失败的音频