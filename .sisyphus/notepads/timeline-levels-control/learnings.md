# Learnings - Timeline Levels Control

## Architecture Patterns

### Triad Pattern
- Every component requires 3 files: component.ts, data.ts, service.ts
- Component extends BaseComponent, implements Lifecycle
- Data extends ComponentData, holds state + graphics
- Service implements ComponentService, has draw()

### DI Registration Pattern
- Create config file in src/config/
- Add TYPES symbols to inversify.config.ts
- Bind Data with toConstantValue
- Bind Service and Component with .to()
- Register listeners and lifecycle

### Layer Management
- Do NOT call super.init() if reusing window layer
- Use this.data.layer = this.service.setLayer()
- Return this._window.data.layer from setLayer()

## Key Insights

### Performance - Auto-Hide Thresholds
- hour: needs dayWidth >= 48 for 2px/hour
- minute: needs dayWidth >= 1440 for 1px/minute
- second: needs dayWidth >= 86400 for 1px/second
- isLevelEffectivelyVisible() prevents calculateTime() loop explosion

### Conditional Rendering
- effectiveVisible = userVisible && (unitWidthPx >= levelMinWidth[level])
- Auto-hide does NOT modify levelVisibility (面板状态保持)
- Use isLevelEffectivelyVisible() in draw() method

### Timeline Redraw Chain
- timeline-control injects ChronosTimelineComponent
- Clicks toggle levelVisibility
- Calls this._timeline.reDraw()
- reDraw() destroys children and calls service.draw()

## Timestamp: 2026-01-29T07:36:00Z

## [2026-01-29T08:28:00Z] Task 1: levelVisibility 添加成功

### 实现细节
- 在 ChronosTimelineData 中添加 levelVisibility 属性
- 添加 readonly 辅助常量：levelOrder, levelLabels, levelMinWidth
- 在构造函数中初始化默认值（year/month/day=true, hour/minute/second=false）
- 在 ChronosTimelineDataType 中添加可选类型定义

### 验证结果
- npm run type-check: ✓ PASS
- npm run lint: ✓ PASS

### 关键模式
- 使用 nullish coalescing (??) 为可选属性提供默认值
- readonly 属性用 const assertion (as const) 保证类型安全
- Record<typeof this.levelOrder[number], T> 模式确保所有级别都有定义

## [2026-01-29T08:30:00Z] Task 5: timeline-control triad 创建完成

### 实现细节
- 创建 timeline-control.data.ts - 数据类和类型定义
- 创建 timeline-control.component.ts - 组件类，实现 Lifecycle/StageDragListener/ToolbarPlugRegister
- 创建 timeline-control.service.ts - 服务类，draw()/open()/close()/keepPos() 方法

### 关键模式
- 时钟图标使用 SVG path（圆形 + 时针分针）
- init() 覆盖：不调用 super.init() 以复用 window layer
- setLayer() 返回 this._window.data.layer（避免创建新图层）
- 文本点击切换 levelVisibility 并调用 this._timeline.reDraw()

### 预期类型错误（正常）
- TYPES.ChronosTimelineControlData 等符号未定义（Task 6 解决）
- ChronosTimelineComponent.reDraw() 方法不存在（Task 4 解决）

### 下一步
- Task 6: 创建 DI 配置并注册 TYPES 符号
- Task 4: 在 timeline.component.ts 中添加 reDraw() 方法

## [2026-01-29T08:32:00Z] Task 2: 辅助方法添加完成

### 实现细节
- getVisibleLevelCount(): 返回用户开启的级别数
- getRowNumForLevel(level): 返回级别在可见级别中的行号
- getLevelLabels(): 返回可见级别的标签数组

### 关键模式
- 使用 filter + length 计算可见数量
- 使用 for...of 循环动态计算 rowNum
- 返回 -1 表示不可见级别

## [2026-01-29T08:32:00Z] Task 6: DI 配置完成

### 实现细节
- 创建 timeline-control.inversify.ts 配置文件
- 在 inversify.config.ts 添加 3 个 TYPES 符号
- 在 data.type.ts 添加 timelineControl 类型

### 绑定顺序
1. Data toConstantValue (singleton)
2. Service .to()
3. Component .to()
4. StageDragListener 监听器
5. ToolbarPlugRegister 监听器
6. bindComponent + bindLifecycle

### 验证结果
- npm run type-check: 只剩 1 个错误（reDraw 方法未定义，Task 4 解决）

## [2026-01-29T08:35:00Z] Task 4: 条件渲染和 reDraw() 完成

### 实现细节
- draw() 使用 isLevelEffectivelyVisible() 条件调用各级别绘制方法
- drawHead() 动态渲染可见级别标签（替换硬编码的 ['年','月','日']）
- drawShadow() 使用 getEffectiveVisibleLevelCount() 动态计算高度
- drawYear/Month/Day 使用 getEffectiveRowNumForLevel() 动态计算 rowNum
- timeline.component.ts 添加 reDraw() 公共方法

### 关键变更
- rowHeight * 3 → rowHeight * getEffectiveVisibleLevelCount()
- 硬编码 rowNum (0,1,2) → getEffectiveRowNumForLevel(level)
- 硬编码标签 ['年','月','日'] → levelOrder.filter(...).map(...)

### 验证结果
- npm run type-check: ✓ PASS (0 errors)
- npm run lint: ✓ PASS
- npm run build: ✓ SUCCESS (dist/chronos.js 170.37 kB)

## [2026-01-29T08:37:00Z] Task 7: 最终集成完成

### 实现细节
- 在 chronos.ts 导入 TimelineControlConfig
- 在 TimelineConfig 和 JumpTimelineConfig 之间注册
- 保持正确的配置顺序（时间轴相关配置组合在一起）

### 验证结果
- npm run type-check: ✓ PASS
- npm run lint: ✓ PASS
- npm run build: ✓ SUCCESS
  - dist/chronos.js: 177.28 kB (增加了 ~7KB，符合预期)
  - dist/chronos.cjs: 127.79 kB

### 交付物清单
✅ 所有 7 个任务完成
✅ 所有文件类型检查通过
✅ 构建成功
✅ 代码质量检查通过
