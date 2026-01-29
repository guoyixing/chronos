# Draft: 时间轴增加时分秒级别并添加工具栏控制面板

## Requirements (confirmed)
- 时间轴在年月日基础上增加时/分/秒三个级别
- 每个级别（年/月/日/时/分/秒）支持独立显示/隐藏
- 默认显示：年、月、日；默认隐藏：时、分、秒
- 通过工具栏图标打开控制面板
- 控制面板显示6个开关，点击切换对应级别
- 点击面板外部关闭面板

## Technical Decisions
- 遵循现有 triad 模式（component/data/service）
- 复用 `calculateTime()` 方法绘制时/分/秒
- 参考 `lane-display` 组件实现弹出面板
- 实现 `ToolbarPlugRegister` 接口注册到工具栏
- 新建 `timeline-control` 子目录存放控制面板组件

## Research Findings

### Timeline Drawing Pattern
- `calculateTime(rowNum, getNextTime, getText, textUnit, updateTextX)` 是核心绘制引擎
- 当前3行：year(row 0), month(row 1), day(row 2)
- Y坐标：`coordinate.y + startOffSet.y + rowHeight * rowNum`
- 宽度计算：`toNextTimeMs * (dayWidth / oneDayMillisecond)`
- 表头固定3行高度 `rowHeight * 3`，需要改为动态计算

### Popup Panel Pattern (lane-display)
- `toolbar()` 返回 `ChronosToolPlug(name, graphics, callback)`
- `hide` 状态控制可见性
- `open()`: `hide=false` + `draw()`
- `close()`: `hide=true` + `graphics.destroy()`
- 面板使用 `Konva.Group` + `Konva.Rect` 背景 + 内容

### DI Binding Pattern
- Data: `toConstantValue` (单例)
- Service/Component: `.to()` 
- 绑定 `TYPES.ToolbarPlugRegister` 注册工具栏插件
- 需要在 `inversify.config.ts` 添加新 TYPES
- 在 `chronos.ts` 添加新 Config

## Open Questions
- (已解决) 时分秒的时间宽度计算：使用 `dayWidth` 按比例计算
- (已解决) 默认可见性：通过 DataType.timeline.levelVisibility 配置控制
- (已解决) 缩放处理：智能自动隐藏 - 当 dayWidth < 阈值时自动隐藏细粒度级别
- (已解决) 控制面板形式：浮动面板，参考 lane-display 实现

## User Decisions
1. **默认可见性**: 通过 `DataType.timeline.levelVisibility` 配置控制
   - 不提供时默认: year=true, month=true, day=true, hour=false, minute=false, second=false
2. **缩放处理**: 智能自动隐藏
   - 需要计算每个级别的最小可显示 dayWidth 阈值
   - hour: ~1.67px/hour (40/24)
   - minute: ~0.028px/minute
   - second: ~0.0005px/second
   - 当单元格宽度 < textMinWidth 时自动跳过渲染
3. **控制面板**: 浮动面板，参考 lane-display 组件

## Scope Boundaries
- INCLUDE: 时间轴扩展、控制面板组件、DI配置、智能自动隐藏逻辑
- EXCLUDE: 其他组件修改、测试文件（项目无测试）、周/季度级别、动画效果、本地存储
