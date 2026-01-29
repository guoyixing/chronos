# Decisions - Timeline Levels Control

## Design Decisions

### 1. Default Visibility
**Decision**: year/month/day=true, hour/minute/second=false
**Reason**: 向后兼容现有行为

### 2. Smart Auto-Hide Strategy
**Decision**: 使用 levelMinWidth 阈值 + isLevelEffectivelyVisible()
**Reason**: 防止秒/分钟级别导致 calculateTime() 循环爆炸（百万次迭代）

### 3. Panel Position
**Decision**: 默认右上角 (70% x, 15% y)
**Reason**: 参考 lane-display，避免遮挡时间轴

### 4. No ResizeListener
**Decision**: timeline-control 不实现 ResizeListener
**Reason**: 面板位置是初始化时固定的，与 lane-display 一致

### 5. Layer Reuse
**Decision**: timeline-control 复用 window.data.layer
**Reason**: 避免创建新图层，保持架构一致性

### 6. Icon Choice
**Decision**: 时钟图标（圆形 + 时针分针）
**Reason**: 直观表示时间控制

## Timestamp: 2026-01-29T07:36:00Z
