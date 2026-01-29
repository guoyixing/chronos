# Issues - Timeline Levels Control

## Known Gotchas

### 1. Hard-coded rowHeight * 3
**Locations**:
- timeline.service.ts:70 - drawHead() background height
- timeline.service.ts:376 - drawShadow() background height

**Fix**: Replace with `rowHeight * this.getEffectiveVisibleLevelCount()`

### 2. rowNum Calculation
**Problem**: 当前 rowNum 硬编码为 0, 1, 2
**Fix**: 使用 getEffectiveRowNumForLevel(level) 动态计算

### 3. Timeline reDraw() Missing
**Problem**: timeline 组件没有公共 reDraw() 方法
**Fix**: 在 timeline.component.ts 中添加 reDraw() 方法

### 4. Performance Risk
**Problem**: 秒级别在默认缩放下会导致百万次循环
**Solution**: isLevelEffectivelyVisible() 在绘制前检查阈值

## Timestamp: 2026-01-29T07:36:00Z
