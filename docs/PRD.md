# 英文单词消消乐游戏 PRD

## 1. 产品概述
### 1.1 产品定位
一款纯前端的、面向高中生的英语单词学习游戏，通过消除配对的方式加深单词记忆和理解。

### 1.2 目标用户
- 主要用户：高中生（15-18岁）
- 次要用户：备考英语的其他年龄段用户

## 2. 核心功能

### 2.1 游戏模式选择
- 单人模式：专注于个人词汇学习和记忆
- 双人对战模式：增加竞技性和趣味性

### 2.2 游戏玩法
- 游戏界面呈现多个方块，每个方块包含中文或英文单词
- 玩家需要找出对应的中英文翻译进行配对消除
- 正确配对后方块消失
- 记录完成所有配对所需时间

### 2.3 计时系统
- 记录游戏开始到完成所有配对的总用时
- 不设置时间限制
- 在结算界面显示完成时间

## 3. 游戏特性

### 3.1 单人模式特性
1. 拼写训练
   - 配对成功后播放单词读音
   - 显示历史最快完成时间

### 3.2 双人对战特性
1. 实时对战
   - 在左右分屏中进行对战
   - 先完成所有配对者获胜

2. 对战机制
   - 实时显示对手进度
   - 胜负统计

### 3.3 游戏机制
1. 难度系统
   - 初级：12对单词
   - 中级：16对单词
   - 高级：20对单词，加入近义词干扰

### 3.4 本地存储功能
- 记录个人最高分

## 4. 技术需求

### 4.1 前端技术栈
- HTML5 + CSS3 + JavaScript
- Vue.js框架
- 响应式布局设计
- LocalStorage 数据存储

### 4.2 核心算法
- 单词随机分布算法
- 配对判定逻辑
- 计时器系统

## 5. 用户界面设计

### 5.1 界面布局
1. 主菜单界面
   - 游戏标题
   - 游戏模式选择（单人/双人）
   - 难度选择（初级/中级/高级）

2. 游戏界面
   - 顶部信息栏：已用时间
   - 中央游戏区：4x3/4x4/4x5网格布局
   - 单词卡片样式：圆角矩形、阴影效果
   - 右侧功能区：暂停、退出

3. 结算界面
   - 完成用时显示
   - 历史最快记录
   - 重玩/退出按钮

### 5.2 交互设计
1. 操作方式
   - 鼠标点击选择单词卡片
   - 支持触屏操作

2. 视觉反馈
   - 选中卡片高亮效果
   - 配对成功：卡片消失动画
   - 配对失败：卡片晃动动画
   - 连击提示特效

3. 音频反馈
   - 背景音乐（可调节音量）
   - 点击音效
   - 配对成功/失败音效
   - 单词发音（配对成功时）

## 6. 词汇系统设计

### 6.1 词库结构
1. 基础词库
   - 高中必修课本词汇（1500词）
   - 高考大纲词汇（3500词）
   - 分类标签：话题、词性、难度

2. 词汇分级
   - 初级：高频基础词汇
   - 中级：高中常用词汇
   - 高级：高考重点词汇

## 7. 技术实现细节

### 7.1 性能优化
1. 资源加载
   - 词库数据分片加载
   - 音频资源按需加载
   - 使用资源预加载

2. 渲染优化
   - 使用CSS3硬件加速
   - 优化动画性能
   - 减少DOM操作

### 7.2 兼容性要求
1. 浏览器支持
   - Chrome 80+
   - Firefox 75+
   - Safari 13+
   - Edge 80+

2. 设备适配
   - 响应式布局设计
   - 触屏设备支持
   - 最小屏幕尺寸：768x576

### 7.3 错误处理
1. 网络异常
   - 离线模式支持
   - 自动重试机制
   - 数据本地缓存

2. 运行异常
   - 异常日志记录
   - 自动恢复机制
   - 用户友好提示

## 8. 后续迭代计划
1. 优化动画效果
2. 增加音效系统
3. 支持自定义词库
4. 引入第三方词典API