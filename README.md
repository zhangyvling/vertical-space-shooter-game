# 🚀 竖屏太空射击游戏 - 鼠标控制版

基于原版 [太空射击游戏](https://zhangyvling.github.io/space-shooter-game/) 修改，专为竖屏和鼠标控制优化。

## 🌟 游戏特点

### 🖥️ 竖屏显示
- 专为竖屏设计的游戏界面 (720×1280)
- 响应式布局，适配各种屏幕
- 全屏模式支持

### 🎮 鼠标控制
- 飞机完全跟随鼠标移动
- 在整个游戏屏幕内自由飞行
- 左键点击发射子弹
- 平滑的移动轨迹

### 🎯 游戏机制
- **多种敌机类型**：
  - 红色敌机：直线移动
  - 蓝色敌机：追踪玩家
  - 黄色敌机：快速移动
  - 橙色敌机：发射子弹
- **分数系统**：消灭敌机获得分数
- **等级系统**：每1000分升一级
- **生命系统**：3条生命，碰撞敌机减少

### ✨ 视觉效果
- 动态星空背景
- 飞机轨迹效果
- 粒子爆炸动画
- 渐变色彩主题

## 🕹️ 操作说明

| 操作 | 功能 |
|------|------|
| **移动鼠标** | 控制飞机飞行 |
| **左键点击** | 发射子弹 |
| **空格键** | 发射子弹 |
| **F键** | 切换全屏模式 |
| **ESC键** | 暂停/继续游戏 |
| **P键** | 暂停/继续游戏 |

## 🎮 游戏目标

1. **消灭敌机**：每种敌机提供不同分数
2. **避免碰撞**：与敌机碰撞会减少生命
3. **获得高分**：尽可能获得更高的分数
4. **提升等级**：每升一级增加飞机速度

## 📁 文件结构

```
vertical-space-shooter-game/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   └── game.js        # 游戏逻辑
├── server.py          # 本地服务器
└── README.md          # 说明文档
```

## 🚀 快速开始

### 在线游玩
访问：https://zhangyvling.github.io/vertical-space-shooter-game/

### 本地运行
1. 克隆仓库：
   ```bash
   git clone https://github.com/zhangyvling/vertical-space-shooter-game.git
   cd vertical-space-shooter-game
   ```

2. 使用Python启动本地服务器：
   ```bash
   python3 server.py
   ```

3. 在浏览器中打开：http://localhost:8080

### 直接打开
双击 `index.html` 文件在浏览器中打开（某些功能可能需要本地服务器）。

## 🔧 技术栈

- **HTML5**：页面结构
- **CSS3**：样式和动画
- **JavaScript**：游戏逻辑
- **Canvas API**：2D图形渲染
- **GitHub Pages**：静态部署

## 🎨 设计特色

### 色彩方案
- 主色调：`#4ecdc4` (青色)
- 强调色：`#ff6b6b` (红色), `#ffe66d` (黄色), `#ff8e53` (橙色)
- 背景：深蓝色渐变 (`#000428` → `#004e92`)

### 响应式设计
- 适配桌面和移动设备
- 竖屏优化布局
- 全屏模式支持

### 用户体验
- 直观的控制说明
- 实时游戏状态显示
- 游戏暂停和继续
- 游戏结束统计

## 📱 移动设备支持

虽然游戏主要设计为鼠标控制，但在移动设备上：
- 可以使用触摸控制（模拟鼠标）
- 响应式布局适配小屏幕
- 触摸发射子弹

## 🔄 基于原版的改进

| 功能 | 原版 | 本版本 |
|------|------|--------|
| **屏幕方向** | 横屏 | **竖屏** |
| **控制方式** | 键盘 | **鼠标** |
| **移动范围** | 限制 | **全屏自由移动** |
| **敌机类型** | 1种 | **4种** |
| **视觉效果** | 基础 | **增强（轨迹、粒子）** |
| **UI设计** | 简单 | **现代化** |

## 🐛 已知问题

1. **移动设备性能**：在低端设备上可能有性能问题
2. **触摸精度**：触摸控制不如鼠标精确
3. **浏览器兼容**：某些旧浏览器可能不支持部分功能

## 📈 未来计划

- [ ] 添加音效和背景音乐
- [ ] 实现触摸控制优化
- [ ] 添加更多敌机类型和Boss战
- [ ] 实现在线分数排行榜
- [ ] 添加游戏设置选项
- [ ] 支持游戏手柄控制

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目基于MIT许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 基于 [zhangyvling/space-shooter-game](https://github.com/zhangyvling/space-shooter-game) 修改
- 使用 [Font Awesome](https://fontawesome.com/) 图标
- 色彩方案来自 [Coolors](https://coolors.co/)

## 📞 联系

如有问题或建议，请通过GitHub Issues提交。

---

**开始游戏**：https://zhangyvling.github.io/vertical-space-shooter-game/

**祝你游戏愉快！** 🎮✨