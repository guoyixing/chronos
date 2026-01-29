# 时间轴增加时分秒级别并添加工具栏控制面板

## TL;DR

> **Quick Summary**: 扩展时间轴组件支持时/分/秒级别，每个级别可独立显示/隐藏，并创建工具栏弹出控制面板进行可见性管理
> 
> **Deliverables**:
> - 扩展的 TimelineData 支持 levelVisibility 配置
> - 新增 drawHour(), drawMinute(), drawSecond() 方法
> - 智能自动隐藏过小单元格的逻辑
> - timeline-control 弹出面板组件 (triad: component/data/service)
> - DI 配置和注册
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7

---

## Context

### Original Request
1. 时间轴在年月日基础上增加时/分/秒三个级别
2. 每个级别（年/月/日/时/分/秒）支持独立显示/隐藏
3. 通过工具栏图标打开控制面板来控制级别可见性

### Interview Summary
**Key Discussions**:
- 默认可见性：通过 DataType.timeline.levelVisibility 配置控制
- 缩放处理：智能自动隐藏 - 当 dayWidth < 阈值时自动隐藏细粒度级别
- 控制面板：浮动面板，参考 lane-display 组件实现

**Research Findings**:
- `calculateTime()` 是核心绘制引擎，支持任意时间级别
- 当前 `rowHeight * 3` 硬编码在多处，需改为动态计算
- lane-display 使用 hide 状态 + open()/close() 方法控制面板

### Metis Review
**Identified Gaps** (addressed):
- 性能风险：添加最小单元格宽度阈值，跳过渲染 < textMinWidth 的单元格
- 向后兼容：levelVisibility 未配置时默认 year/month/day 可见
- 动态行数：需要更新所有 `rowHeight * 3` 硬编码位置

### Momus Review (Round 1)
**Critical Issues Addressed**:

#### 1. 智能自动隐藏阈值策略（性能关键）
**问题**：秒/分钟级别会导致 calculateTime() 循环爆炸（百万次迭代导致页面卡死）

**解决方案 - 级别启用阈值门控**：
```typescript
// 在 ChronosTimelineData 中添加最小像素宽度阈值
readonly levelMinWidth: Record<string, number> = {
    year: 0,      // 年始终可绘制
    month: 0,     // 月始终可绘制  
    day: 0,       // 日始终可绘制
    hour: 2,      // 至少 2px/小时 才绘制 (dayWidth >= 48)
    minute: 1,    // 至少 1px/分钟 才绘制 (dayWidth >= 1440)
    second: 1     // 至少 1px/秒 才绘制 (dayWidth >= 86400)
};

// 在 ChronosTimelineService 中添加有效可见性检查
isLevelEffectivelyVisible(level: string): boolean {
    // 用户手动开关 AND 缩放允许
    if (!this._data.levelVisibility[level]) return false;
    
    const unitMs = this.getLevelUnitMs(level);
    const unitWidthPx = this._data.dayWidth * (unitMs / oneDayMillisecond);
    return unitWidthPx >= this._data.levelMinWidth[level];
}

getLevelUnitMs(level: string): number {
    switch(level) {
        case 'year': return 365 * oneDayMillisecond;
        case 'month': return 30 * oneDayMillisecond;
        case 'day': return oneDayMillisecond;
        case 'hour': return oneHourMillisecond;
        case 'minute': return oneMinuteMillisecond;
        case 'second': return oneSecondMillisecond;
    }
}
```

**有效可见性公式**：`effectiveVisible = userVisible && (unitWidthPx >= levelMinWidth[level])`

**阈值计算依据**：
- hour: `dayWidth / 24` → 需要 `dayWidth >= 48` 才有 2px/小时
- minute: `dayWidth / 1440` → 需要 `dayWidth >= 1440` 才有 1px/分钟
- second: `dayWidth / 86400` → 需要 `dayWidth >= 86400` 才有 1px/秒

**行为**：自动隐藏不回写 levelVisibility（面板仍显示用户设置状态），仅影响渲染

#### 2. timeline-control → timeline 重绘调用链
**问题**：timeline 没有公共 reDraw() 方法

**解决方案 - 在 ChronosTimelineComponent 中添加 reDraw() 方法**：
```typescript
// 在 src/component/timeline/timeline.component.ts 中添加
reDraw(): void {
    this.data.layer?.destroyChildren();
    this.service.draw();
}
```

**调用链**：
1. `timeline-control.service.ts` 中注入 `ChronosTimelineComponent`
2. 点击级别开关时：
   ```typescript
   // 在 ChronosTimelineControlService 构造函数中注入
   constructor(
       @inject(TYPES.ChronosTimelineControlData) data: ChronosTimelineControlData,
       @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent,
       @inject(TYPES.ChronosTimelineComponent) timeline: ChronosTimelineComponent
   ) {
       this._data = data;
       this._window = window;
       this._timeline = timeline;
   }
   
   // 在 drawTextGroup() 的点击回调中
   text.on('click', () => {
       this._timeline.data.levelVisibility[level] = !this._timeline.data.levelVisibility[level];
       text.fill(this._timeline.data.levelVisibility[level] ? data.text.hoverColor : data.text.color);
       this._timeline.reDraw();
   });
   ```

#### 3. 不创建新图层的实现要点
**问题**：BaseComponent.init() 默认会创建新 layer

**解决方案 - 覆盖 init() 复用 window layer**：
```typescript
// 在 timeline-control.component.ts 中
init() {
    // 不调用 super.init() 以避免创建新 layer
    this.data.layer = this.service.setLayer();
}

// 在 timeline-control.service.ts 中
setLayer() {
    return this._window.data.layer;
}
```

参考：`lane-display.component.ts:76-78` 和 `lane-display.service.ts:176-178`

#### 4. ChronosTimelineControlDataType 完整定义
```typescript
export type ChronosTimelineControlDataType = {
    startOffSetPct?: { xPct: number, yPct: number }  // 相对窗口的百分比位置
    width?: number                                    // 面板宽度，默认 150
    height?: number                                   // 面板高度，默认 200
    hide?: boolean                                    // 初始隐藏状态，默认 true
    backgroundColor?: string                          // 背景色，默认 'white'
    borderColor?: string                              // 边框色，默认 '#EBEBEB'
    border?: number                                   // 边框宽度，默认 1
    margin?: number                                   // 内边距，默认 20
    radius?: number                                   // 圆角，默认 10
    shadow?: ShadowConfigType                         // 阴影配置
    text?: {
        fontSize?: number                             // 字体大小，默认 14
        fontFamily?: string                           // 字体，默认 'Calibri'
        color?: string                                // 正常颜色，默认 '#4F4F54'
        hoverColor?: string                           // 激活颜色，默认 '#359EE8'
        marginBottom?: number                         // 行间距，默认 8
    }
}

// 构造函数默认值
constructor(context: Context, data?: ChronosTimelineControlDataType) {
    super(context);
    this.width = data?.width ?? 150;
    this.height = data?.height ?? 200;
    this.hide = data?.hide ?? true;
    // ... 其他参考 lane-display.data.ts:83-121
    
    // startOffSet 位置计算 - 参考 lane-display 模式
    const window = context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
    if (data?.startOffSetPct) {
        this.startOffSet = {
            x: window.data?.width * data.startOffSetPct.xPct,
            y: window.data?.height * data.startOffSetPct.yPct
        };
    } else {
        // 默认位置：右上角 (70% x, 15% y)
        this.startOffSet = {
            x: window.data?.width * 0.7,
            y: window.data?.height * 0.15
        };
    }
}
```

**Resize 行为**：不需要实现 ResizeListener（面板位置是初始化时计算的固定值，与 lane-display 行为一致）

#### 5. 可观察验收补充
见下方 Verification Strategy 更新

---

## Work Objectives

### Core Objective
扩展 Chronos 时间轴组件，支持6个时间级别（年/月/日/时/分/秒）的独立显示控制，并提供工具栏弹出控制面板进行可见性管理。

### Concrete Deliverables
- `src/component/timeline/timeline.data.ts` - 添加 levelVisibility 配置
- `src/component/timeline/timeline.service.ts` - 添加 drawHour/Minute/Second 方法
- `src/component/timeline/control/timeline-control.component.ts` - 控制面板组件
- `src/component/timeline/control/timeline-control.data.ts` - 控制面板数据
- `src/component/timeline/control/timeline-control.service.ts` - 控制面板服务
- `src/config/timeline-control.inversify.ts` - DI 配置
- `src/config/inversify.config.ts` - 新增 TYPES 符号
- `src/chronos.ts` - 注册新配置

### Definition of Done
- [ ] `npm run build` 成功，无错误
- [ ] `npm run type-check` 通过，无类型错误
- [ ] `npm run lint` 通过，无 lint 错误
- [ ] 开发服务器启动无控制台错误
- [ ] 时间轴可显示6个级别
- [ ] 控制面板可打开/关闭，切换可见性生效

### Must Have
- 遵循 triad 模式 (component/data/service)
- 复用 calculateTime() 核心引擎
- 支持运行时切换级别可见性
- 智能自动隐藏过小单元格（性能优化）
- 向后兼容现有 DataType.timeline 配置

### Must NOT Have (Guardrails)
- ❌ 不添加周/季度等其他级别
- ❌ 不添加显示/隐藏动画效果
- ❌ 不添加 localStorage 持久化
- ❌ 不修改 calculateTime() 核心签名
- ❌ 不修改 getXByTime() / getTimeByX() 方法
- ❌ 不创建新图层 - 使用现有图层模式

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (项目无测试套件)
- **User wants tests**: Manual-only
- **Framework**: none

### Automated Verification

Each TODO includes executable verification:

**Build/Lint/Type Check** (Bash):
```bash
npm run build     # Assert: Exit code 0
npm run type-check # Assert: Exit code 0
npm run lint      # Assert: Exit code 0
```

**Visual Verification** (Playwright browser):
```
1. Navigate to http://localhost:5173 (demo page)
2. Verify timeline renders correctly
3. Click toolbar timeline-control button
4. Verify control panel appears with 6 toggles
5. Toggle levels and verify timeline redraws
6. Screenshot evidence saved to .sisyphus/evidence/
```

### Performance & Auto-Hide Verification (CRITICAL)

**验收场景 1：默认缩放下开启 second 不会卡死**
```
1. Navigate to http://localhost:5173
2. Note current dayWidth (demo default ~40px)
3. Open timeline-control panel
4. Click "秒" toggle to enable
5. Assert: Page remains responsive (no freeze > 2 seconds)
6. Assert: Timeline still shows only 3 rows (second auto-hidden due to threshold)
7. Assert: "秒" text in panel shows hoverColor (user enabled) but second row not rendered
8. Screenshot: .sisyphus/evidence/second-auto-hidden-default-zoom.png
```

**验收场景 2：放大到阈值以上后 second 可见**
```
1. Continue from scenario 1 (second enabled in levelVisibility)
2. Use scale controls to zoom in significantly (increase dayWidth to ~100000)
3. Assert: Timeline now shows second row
4. Assert: Second cells are visible and readable
5. Screenshot: .sisyphus/evidence/second-visible-high-zoom.png
```

**验收场景 3：级别切换后 timeline 正确重绘**
```
1. Navigate to http://localhost:5173
2. Open timeline-control panel
3. Toggle "日" off
4. Assert: Timeline redraws with 2 rows (year, month only)
5. Toggle "日" on, "时" on
6. Assert: Timeline shows 4 rows (if zoom allows hour)
7. Screenshot: .sisyphus/evidence/level-toggle-redraw.png
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Extend TimelineData with levelVisibility
└── Task 5: Create timeline-control triad files (skeleton)

Wave 2 (After Wave 1):
├── Task 2: Add helper methods for dynamic row calculation
├── Task 3: Add drawHour/drawMinute/drawSecond methods
└── Task 6: Create DI configuration

Wave 3 (After Wave 2):
└── Task 4: Modify draw()/drawHead() for conditional rendering

Wave 4 (After Wave 3):
└── Task 7: Register in chronos.ts and integrate

Critical Path: Task 1 → Task 2 → Task 3 → Task 4 → Task 7
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4 | 5 |
| 2 | 1 | 3, 4 | 5, 6 |
| 3 | 1, 2 | 4 | 6 |
| 4 | 1, 2, 3 | 7 | None |
| 5 | None | 6, 7 | 1 |
| 6 | 5 | 7 | 2, 3 |
| 7 | 4, 6 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Dispatch |
|------|-------|---------------------|
| 1 | 1, 5 | `delegate_task(category="quick", load_skills=[], run_in_background=true)` |
| 2 | 2, 3, 6 | dispatch parallel after Wave 1 |
| 3 | 4 | depends on 2, 3 |
| 4 | 7 | final integration |

---

## TODOs

- [x] 1. 扩展 TimelineData 添加 levelVisibility 配置

  **What to do**:
  - 在 `ChronosTimelineData` 类中添加 `levelVisibility` 属性
  - 在 `ChronosTimelineDataType` 类型中添加对应类型定义
  - 在构造函数中初始化默认值
  - 类型定义：
    ```typescript
    levelVisibility: {
        year: boolean;
        month: boolean;
        day: boolean;
        hour: boolean;
        minute: boolean;
        second: boolean;
    }
    ```
  - 默认值：`{ year: true, month: true, day: true, hour: false, minute: false, second: false }`

  **Must NOT do**:
  - 不修改其他现有属性
  - 不更改构造函数签名

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 单文件修改，添加属性和类型定义
  - **Skills**: `[]`
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 5)
  - **Blocks**: Tasks 2, 3, 4
  - **Blocked By**: None

  **References**:
  - `src/component/timeline/timeline.data.ts:10-113` - ChronosTimelineData 类定义
  - `src/component/timeline/timeline.data.ts:119-135` - ChronosTimelineDataType 类型定义
  - `src/component/lane/display/lane-display.data.ts:38` - hide 属性作为参考模式

  **Acceptance Criteria**:
  ```bash
  npm run type-check
  # Assert: Exit code 0, no errors
  
  npm run lint
  # Assert: Exit code 0
  ```

  **Commit**: YES
  - Message: `feat(timeline): add levelVisibility config for time level control`
  - Files: `src/component/timeline/timeline.data.ts`
  - Pre-commit: `npm run type-check`

---

- [x] 2. 添加动态行数计算和智能隐藏辅助方法

  **What to do**:
  - 在 `ChronosTimelineData` 中添加常量和辅助方法
  - 实现逻辑：
    ```typescript
    // 级别顺序和标签
    readonly levelOrder = ['year', 'month', 'day', 'hour', 'minute', 'second'] as const;
    readonly levelLabels: Record<typeof this.levelOrder[number], string> = { 
        year: '年', month: '月', day: '日', hour: '时', minute: '分', second: '秒' 
    };
    
    // 每个级别的最小像素宽度阈值（低于此值时自动隐藏）
    readonly levelMinWidth: Record<typeof this.levelOrder[number], number> = {
        year: 0,      // 年始终可绘制
        month: 0,     // 月始终可绘制  
        day: 0,       // 日始终可绘制
        hour: 2,      // 至少 2px/小时 才绘制
        minute: 1,    // 至少 1px/分钟 才绘制
        second: 1     // 至少 1px/秒 才绘制
    };
    
    getVisibleLevelCount(): number {
        return this.levelOrder.filter(level => this.levelVisibility[level]).length;
    }
    
    getRowNumForLevel(level: typeof this.levelOrder[number]): number {
        let rowNum = 0;
        for (const l of this.levelOrder) {
            if (l === level) return rowNum;
            if (this.levelVisibility[l]) rowNum++;
        }
        return -1;
    }
    
    getLevelLabels(): string[] {
        return this.levelOrder
            .filter(level => this.levelVisibility[level])
            .map(level => this.levelLabels[level]);
    }
    ```

  **Must NOT do**:
  - 不修改现有方法
  - 不改变类继承关系

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 添加几个辅助方法，逻辑简单
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 1)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 3, 4
  - **Blocked By**: Task 1

  **References**:
  - `src/component/timeline/timeline.data.ts` - Task 1 添加的 levelVisibility
  - `src/component/timeline/timeline.service.ts:132-133` - 当前 rowNum 使用模式

  **Acceptance Criteria**:
  ```bash
  npm run type-check
  # Assert: Exit code 0
  
  npm run lint
  # Assert: Exit code 0
  ```

  **Commit**: NO (groups with Task 3)

---

- [x] 3. 添加 drawHour/drawMinute/drawSecond 方法和有效可见性检查

  **What to do**:
  - 在 `ChronosTimelineService` 中添加时间常量：
    ```typescript
    const oneHourMillisecond = 3600000;   // 1小时毫秒数
    const oneMinuteMillisecond = 60000;   // 1分钟毫秒数
    const oneSecondMillisecond = 1000;    // 1秒毫秒数
    ```
  
  - 添加有效可见性检查方法（**性能关键 - 防止循环爆炸**）：
    ```typescript
    /**
     * 获取级别的时间单位毫秒数
     */
    private getLevelUnitMs(level: string): number {
        switch(level) {
            case 'year': return 365 * oneDayMillisecond;
            case 'month': return 30 * oneDayMillisecond;
            case 'day': return oneDayMillisecond;
            case 'hour': return oneHourMillisecond;
            case 'minute': return oneMinuteMillisecond;
            case 'second': return oneSecondMillisecond;
            default: return oneDayMillisecond;
        }
    }
    
    /**
     * 检查级别是否有效可见（用户开启 AND 缩放允许）
     * 这是防止性能问题的关键检查
     */
    isLevelEffectivelyVisible(level: string): boolean {
        if (!this._data.levelVisibility[level as keyof typeof this._data.levelVisibility]) {
            return false;
        }
        const unitMs = this.getLevelUnitMs(level);
        const unitWidthPx = this._data.dayWidth * (unitMs / oneDayMillisecond);
        return unitWidthPx >= this._data.levelMinWidth[level as keyof typeof this._data.levelMinWidth];
    }
    
    /**
     * 获取有效可见的级别数量（用于动态计算行数）
     */
    getEffectiveVisibleLevelCount(): number {
        return this._data.levelOrder.filter(level => this.isLevelEffectivelyVisible(level)).length;
    }
    ```
  
  - 添加 `drawHour()` 方法：
    ```typescript
    drawHour() {
        if (!this.isLevelEffectivelyVisible('hour')) return;  // 使用有效可见性检查
        const rowNum = this.getEffectiveRowNumForLevel('hour');
        if (rowNum < 0) return;
        
        const getNextTime = (time: Date) => {
            const next = new Date(time);
            next.setHours(next.getHours() + 1, 0, 0, 0);
            return next;
        };
        const getText = (time: Date) => time.getHours();
        
        this.calculateTime(rowNum, getNextTime, getText, "时",
            (text, width, isMoveRight) => this.updateTimeX(text, width, isMoveRight))
    }
    ```
  
  - 添加辅助方法 `getEffectiveRowNumForLevel()`：
    ```typescript
    /**
     * 获取级别在有效可见级别中的行号
     */
    private getEffectiveRowNumForLevel(level: string): number {
        let rowNum = 0;
        for (const l of this._data.levelOrder) {
            if (l === level) return this.isLevelEffectivelyVisible(l) ? rowNum : -1;
            if (this.isLevelEffectivelyVisible(l)) rowNum++;
        }
        return -1;
    }
    ```
  
  - 类似实现 `drawMinute()` 和 `drawSecond()`

  **Must NOT do**:
  - 不修改 calculateTime() 签名
  - 不改变现有 drawYear/Month/Day 逻辑（这些不需要阈值检查）

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 添加多个方法，包含关键的性能保护逻辑
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 2)
  - **Parallel Group**: Wave 2 (after Task 2)
  - **Blocks**: Task 4
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `src/component/timeline/timeline.service.ts:161-200` - drawDay() 实现模式
  - `src/component/timeline/timeline.service.ts:235-302` - calculateTime() 核心引擎
  - `src/component/timeline/timeline.service.ts:14` - oneDayMillisecond 常量定义

  **Acceptance Criteria**:
  ```bash
  npm run type-check
  # Assert: Exit code 0
  
  npm run lint
  # Assert: Exit code 0
  ```

  **Commit**: YES
  - Message: `feat(timeline): add drawHour/drawMinute/drawSecond with auto-hide threshold`
  - Files: `src/component/timeline/timeline.data.ts`, `src/component/timeline/timeline.service.ts`
  - Pre-commit: `npm run type-check`

---

- [x] 4. 修改 draw()/drawHead() 支持条件渲染并添加 reDraw() 方法

  **What to do**:
  
  - **在 timeline.component.ts 中添加 reDraw() 方法**（供 timeline-control 调用）:
    ```typescript
    /**
     * 重绘时间轴（供外部调用）
     */
    reDraw(): void {
        this.data.layer?.destroyChildren();
        this.service.draw();
    }
    ```
    位置：`src/component/timeline/timeline.component.ts` 在 `resizeListen()` 方法后添加
  
  - **修改 draw() 方法**，使用有效可见性检查：
    ```typescript
    draw(): void {
        this.drawShadow()
        // 使用有效可见性检查（考虑缩放阈值）
        if (this.isLevelEffectivelyVisible('year')) this.drawYear()
        if (this.isLevelEffectivelyVisible('month')) this.drawMonth()
        if (this.isLevelEffectivelyVisible('day')) this.drawDay()
        if (this.isLevelEffectivelyVisible('hour')) this.drawHour()
        if (this.isLevelEffectivelyVisible('minute')) this.drawMinute()
        if (this.isLevelEffectivelyVisible('second')) this.drawSecond()
        this.drawHead()
    }
    ```
  
  - **修改 drawHead() 方法**，动态渲染可见级别标签：
    ```typescript
    drawHead() {
        const data = this._data;
        const coordinate = this._data.context.drawContext.getFixedCoordinate();
        
        // 使用有效可见级别数量
        const visibleCount = this.getEffectiveVisibleLevelCount();
        // 获取有效可见级别的标签
        const labels = this._data.levelOrder
            .filter(level => this.isLevelEffectivelyVisible(level))
            .map(level => this._data.levelLabels[level]);
        
        const x = coordinate.x + data.startOffSet.x;
        let y = coordinate.y + data.startOffSet.y;
        
        // 修改 height 为动态计算
        const background = new Konva.Rect({
            x: x,
            y: y,
            width: data.headWidth,
            height: data.rowHeight * visibleCount,  // 原: data.rowHeight * 3
            fill: 'white',
            shadowColor: data.shadow.color,
            shadowBlur: data.shadow.blur,
            shadowOffset: data.shadow.offset,
            shadowOpacity: data.shadow.opacity,
            cornerRadius: data.radius,
            prefectDrawEnabled: false
        });
        data.layer?.add(background);
        
        labels.forEach((text, index) => {
            // ... 其余逻辑与原实现类似，只是使用 labels 数组
        });
    }
    ```
  
  - **修改 drawShadow() 方法**，使用有效可见级别数量：
    ```typescript
    drawShadow() {
        const data = this._data;
        // ...
        const background = new Konva.Rect({
            // ...
            height: data.rowHeight * this.getEffectiveVisibleLevelCount(),  // 原: data.rowHeight * 3
            // ...
        });
        // ...
    }
    ```
  
  - **修改 drawYear/Month/Day 使用有效可见性和动态 rowNum**：
    ```typescript
    drawYear() {
        if (!this.isLevelEffectivelyVisible('year')) return;
        const rowNum = this.getEffectiveRowNumForLevel('year');
        if (rowNum < 0) return;
        // ... 其余不变
        this.calculateTime(rowNum, getNextTime, getText, "年", ...)
    }
    ```

  **Must NOT do**:
  - 不修改 calculateTime() 核心逻辑
  - 不添加动画效果
  - 不改变 Konva 图形结构

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 多处修改，需要仔细协调
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 2, 3)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 1, 2, 3

  **References**:
  - `src/component/timeline/timeline.component.ts:41-45` - resizeListen() 方法（在其后添加 reDraw）
  - `src/component/timeline/timeline.service.ts:45-51` - draw() 方法
  - `src/component/timeline/timeline.service.ts:56-116` - drawHead() 方法
  - `src/component/timeline/timeline.service.ts:364-385` - drawShadow() 方法
  - `src/component/timeline/timeline.service.ts:70` - `height: data.rowHeight * 3` 硬编码位置
  - `src/component/timeline/timeline.service.ts:376` - `height: data.rowHeight * 3` 另一处硬编码

  **Acceptance Criteria**:
  ```bash
  npm run type-check
  # Assert: Exit code 0
  
  npm run lint
  # Assert: Exit code 0
  
  npm run build
  # Assert: Exit code 0, dist/chronos.js created
  ```
  
  **Visual Verification** (Playwright):
  ```
  1. Navigate to http://localhost:5173
  2. Verify timeline renders with default 3 rows (year/month/day)
  3. Screenshot: .sisyphus/evidence/task-4-timeline-default.png
  ```

  **Commit**: YES
  - Message: `feat(timeline): implement conditional rendering with effective visibility`
  - Files: `src/component/timeline/timeline.component.ts`, `src/component/timeline/timeline.service.ts`
  - Pre-commit: `npm run build`

---

- [x] 5. 创建 timeline-control 组件 triad 文件（完整实现）

  **What to do**:
  - 创建目录 `src/component/timeline/control/`
  
  - **创建 `timeline-control.data.ts`**（完整定义）:
    ```typescript
    import {injectable} from "inversify";
    import {ComponentData} from "../../component-data.interface";
    import {ShadowConfigType, ShadowType} from "../../../core/common/type/shadow.type";
    import Konva from "konva";
    import {Context} from "../../../core/context/context";
    import {ChronosWindowComponent} from "../../window/window.component";
    import {TYPES} from "../../../config/inversify.config";

    /**
     * 时间轴控制面板-组件数据
     */
    @injectable()
    export class ChronosTimelineControlData extends ComponentData {
        graphics: Konva.Group | undefined
        startOffSet: { x: number, y: number }
        width: number
        height: number
        hide: boolean
        backgroundColor: string
        borderColor: string
        border: number
        radius: number
        shadow: ShadowType
        text: {
            fontSize: number,
            fontFamily: string,
            color: string,
            hoverColor: string,
            marginBottom: number
        }
        margin: number

        constructor(context: Context, data?: ChronosTimelineControlDataType) {
            super(context);
            this.width = data?.width ?? 150;
            this.height = data?.height ?? 200;
            this.hide = data?.hide ?? true;
            this.backgroundColor = data?.backgroundColor ?? 'white';
            this.borderColor = data?.borderColor ?? '#EBEBEB';
            this.radius = data?.radius ?? 10;
            this.border = data?.border ?? 1;
            this.margin = data?.margin ?? 20;
            this.shadow = {
                color: data?.shadow?.color ?? 'black',
                blur: data?.shadow?.blur ?? 10,
                offset: {
                    x: data?.shadow?.offset?.x ?? 0,
                    y: data?.shadow?.offset?.y ?? 0
                },
                opacity: data?.shadow?.opacity ?? 0.2
            };
            this.text = {
                fontSize: data?.text?.fontSize ?? 14,
                fontFamily: data?.text?.fontFamily ?? 'Calibri',
                color: data?.text?.color ?? '#4F4F54',
                hoverColor: data?.text?.hoverColor ?? '#359EE8',
                marginBottom: data?.text?.marginBottom ?? 8
            };
            
            // 位置计算 - 参考 lane-display 模式
            const window = context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
            if (data?.startOffSetPct) {
                this.startOffSet = {
                    x: window.data?.width * data.startOffSetPct.xPct,
                    y: window.data?.height * data.startOffSetPct.yPct
                };
            } else {
                // 默认位置：右上角 (70% x, 15% y)
                this.startOffSet = {
                    x: window.data?.width * 0.7,
                    y: window.data?.height * 0.15
                };
            }
        }
    }

    export type ChronosTimelineControlDataType = {
        startOffSetPct?: { xPct: number, yPct: number }
        width?: number
        height?: number
        hide?: boolean
        backgroundColor?: string
        borderColor?: string
        border?: number
        margin?: number
        radius?: number
        shadow?: ShadowConfigType
        text?: {
            fontSize?: number,
            fontFamily?: string,
            color?: string,
            hoverColor?: string,
            marginBottom?: number
        }
    }
    ```
  
  - **创建 `timeline-control.component.ts`**（覆盖 init 避免新 layer）:
    ```typescript
    import {inject, injectable} from "inversify";
    import {BaseComponent} from "../../component.interface";
    import {Lifecycle} from "../../../core/lifecycle/lifecycle";
    import {StageDragListener} from "../../../core/event/event";
    import {TYPES} from "../../../config/inversify.config";
    import {ChronosTimelineControlData} from "./timeline-control.data";
    import {ChronosTimelineControlService} from "./timeline-control.service";
    import {ChronosToolPlug, ToolbarPlugRegister} from "../../toolbar/toolbar-plug.component";
    import {ButtonType} from "../../../core/common/type/button.type";
    import Konva from "konva";

    /**
     * 时间轴控制面板-组件
     */
    @injectable()
    export class ChronosTimelineControlComponent 
        extends BaseComponent<ChronosTimelineControlData, ChronosTimelineControlService>
        implements Lifecycle, StageDragListener, ToolbarPlugRegister {

        name = () => "timeline-control"

        constructor(
            @inject(TYPES.ChronosTimelineControlData) data: ChronosTimelineControlData,
            @inject(TYPES.ChronosTimelineControlService) service: ChronosTimelineControlService
        ) {
            super(data, service);
        }

        /**
         * 工具栏插件注册 - 时钟图标
         */
        toolbar(): ChronosToolPlug {
            const graphics = (button: ButtonType) => {
                const r = button.stroke.length / 2;
                // 时钟图标 SVG path
                const path = `
                    M0 ${-r}
                    A${r} ${r} 0 1 1 0 ${r}
                    A${r} ${r} 0 1 1 0 ${-r}
                    M0 0 L0 ${-r * 0.6}
                    M0 0 L${r * 0.4} 0
                `;
                return new Konva.Path({
                    x: 0,
                    y: 0,
                    data: path,
                    stroke: this.data.hide ? button.stroke.color : button.stroke.hoverColor,
                    strokeWidth: button.stroke.width,
                    lineJoin: 'round',
                    lineCap: 'round',
                });
            };

            const callback = (graphics: Konva.Path, button: ButtonType) => {
                graphics.stroke(this.data.hide ? button.stroke.hoverColor : button.stroke.color);
                this.data.hide ? this.service.open() : this.service.close();
            };

            return new ChronosToolPlug("时间轴控制", graphics, callback);
        }

        /**
         * 舞台拖拽监听 - 保持面板位置
         */
        stageDragListen(): void {
            !this.data.hide && this.service.keepPos();
        }

        /**
         * 初始化 - 覆盖默认实现以复用 window layer（不创建新 layer）
         */
        init() {
            // 不调用 super.init() 以避免 applyLayer 创建新图层
            this.data.layer = this.service.setLayer();
        }

        start() {
            !this.data.hide && super.start();
        }

        order(): number {
            return 9998;  // 在 lane-display (9999) 之前
        }
    }
    ```
  
  - **创建 `timeline-control.service.ts`**（包含 timeline 重绘集成）:
    ```typescript
    import {ComponentService} from "../../component-service.interface";
    import {inject, injectable} from "inversify";
    import {ChronosTimelineControlData} from "./timeline-control.data";
    import {ChronosWindowComponent} from "../../window/window.component";
    import {ChronosTimelineComponent} from "../timeline.component";
    import {TYPES} from "../../../config/inversify.config";
    import Konva from "konva";

    /**
     * 时间轴控制面板-组件服务
     */
    @injectable()
    export class ChronosTimelineControlService implements ComponentService {

        private _data: ChronosTimelineControlData;
        private _window: ChronosWindowComponent;
        private _timeline: ChronosTimelineComponent;

        constructor(
            @inject(TYPES.ChronosTimelineControlData) data: ChronosTimelineControlData,
            @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent,
            @inject(TYPES.ChronosTimelineComponent) timeline: ChronosTimelineComponent
        ) {
            this._data = data;
            this._window = window;
            this._timeline = timeline;
        }

        draw(): void {
            const data = this._data;
            const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
            
            const group = new Konva.Group({
                x: data.startOffSet.x + fixedCoordinate.x,
                y: data.startOffSet.y + fixedCoordinate.y,
            });

            // 绘制背景
            const background = new Konva.Rect({
                x: 0,
                y: 0,
                width: data.width,
                height: data.height,
                fill: data.backgroundColor,
                stroke: data.borderColor,
                strokeWidth: data.border,
                cornerRadius: data.radius,
                shadowColor: data.shadow.color,
                shadowBlur: data.shadow.blur,
                shadowOffset: data.shadow.offset,
                shadowOpacity: data.shadow.opacity,
                listening: false,
            });
            group.add(background);

            // 绘制6个级别开关
            const textGroup = this.drawTextGroup();
            group.add(textGroup);

            this._data.graphics = group;
            this._data.layer?.add(group);
        }

        /**
         * 绘制文本开关组
         */
        private drawTextGroup(): Konva.Group {
            const data = this._data;
            const levels = this._timeline.data.levelOrder;
            const labels = this._timeline.data.levelLabels;
            
            const textGroup = new Konva.Group({
                x: data.margin,
                y: data.margin,
            });

            levels.forEach((level, index) => {
                const isVisible = this._timeline.data.levelVisibility[level];
                const text = new Konva.Text({
                    x: 0,
                    y: index * (data.text.marginBottom + data.text.fontSize),
                    text: labels[level],
                    fontSize: data.text.fontSize,
                    fontFamily: data.text.fontFamily,
                    fill: isVisible ? data.text.hoverColor : data.text.color,
                });
                
                // 点击切换可见性并触发 timeline 重绘
                text.on('click', () => {
                    this._timeline.data.levelVisibility[level] = 
                        !this._timeline.data.levelVisibility[level];
                    text.fill(this._timeline.data.levelVisibility[level] 
                        ? data.text.hoverColor 
                        : data.text.color);
                    // 调用 timeline 的 reDraw 方法
                    this._timeline.reDraw();
                });
                
                textGroup.add(text);
            });

            return textGroup;
        }

        close() {
            this._data.hide = true;
            this._data.graphics?.destroy();
        }

        open() {
            this._data.hide = false;
            this.draw();
        }

        /**
         * 获取图层 - 复用 window layer
         */
        setLayer() {
            return this._window.data.layer;
        }

        /**
         * 保持定位（拖拽时）
         */
        keepPos() {
            const data = this._data;
            const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
            data.graphics?.x(data.startOffSet.x + fixedCoordinate.x);
            data.graphics?.y(data.startOffSet.y + fixedCoordinate.y);
        }
    }
    ```

  **Must NOT do**:
  - 不调用 super.init()（会创建新图层）
  - 不添加动画效果

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 创建3个新文件，包含完整实现
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Tasks 6, 7
  - **Blocked By**: None

  **References**:
  - `src/component/lane/display/lane-display.component.ts:76-78` - init() 覆盖模式
  - `src/component/lane/display/lane-display.service.ts:176-178` - setLayer() 模式
  - `src/component/lane/display/lane-display.service.ts:145-149` - 文本点击切换模式
  - `src/component/toolbar/toolbar-plug.component.ts:8-44` - ChronosToolPlug 类

  **Acceptance Criteria**:
  ```bash
  npm run type-check
  # Assert: Exit code 0
  
  # Verify files exist (Windows compatible)
  dir src\component\timeline\control\
  # Assert: 3 .ts files exist (timeline-control.component.ts, timeline-control.data.ts, timeline-control.service.ts)
  ```

  **Commit**: YES
  - Message: `feat(timeline-control): create timeline-control component with full implementation`
  - Files: `src/component/timeline/control/*.ts`
  - Pre-commit: `npm run type-check`

---

- [x] 6. 创建 DI 配置文件

  **What to do**:
  - 创建 `src/config/timeline-control.inversify.ts`:
    ```typescript
    import {Container} from "inversify";
    import {DataType} from "./data.type";
    import {Context} from "../core/context/context";
    import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
    import {StageDragListener} from "../core/event/event";
    import {ToolbarPlugRegister} from "../component/toolbar/toolbar-plug.component";
    import {ChronosTimelineControlData} from "../component/timeline/control/timeline-control.data";
    import {ChronosTimelineControlService} from "../component/timeline/control/timeline-control.service";
    import {ChronosTimelineControlComponent} from "../component/timeline/control/timeline-control.component";

    export class TimelineControlConfig {
        constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
            const context = chronosContainer.get<Context>(TYPES.Context);
            const controlData = new ChronosTimelineControlData(context, data.timelineControl);
            
            chronosContainer.bind<ChronosTimelineControlData>(TYPES.ChronosTimelineControlData)
                .toConstantValue(controlData);
            chronosContainer.bind<ChronosTimelineControlService>(TYPES.ChronosTimelineControlService)
                .to(ChronosTimelineControlService);
            chronosContainer.bind<ChronosTimelineControlComponent>(TYPES.ChronosTimelineControlComponent)
                .to(ChronosTimelineControlComponent);
            
            chronosContainer.bind<StageDragListener>(TYPES.StageDragListener)
                .to(ChronosTimelineControlComponent);
            chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister)
                .to(ChronosTimelineControlComponent);
            
            bindComponent(chronosContainer, ChronosTimelineControlComponent);
            bindLifecycle(chronosContainer, ChronosTimelineControlComponent);
        }
    }
    ```
  - 在 `src/config/inversify.config.ts` 中添加 TYPES:
    ```typescript
    //组件-时间轴控制面板
    ChronosTimelineControlData: Symbol.for("ChronosTimelineControlData"),
    ChronosTimelineControlService: Symbol.for("ChronosTimelineControlService"),
    ChronosTimelineControlComponent: Symbol.for("ChronosTimelineControlComponent"),
    ```
  - 在 `src/config/data.type.ts` 中添加类型:
    ```typescript
    import {ChronosTimelineControlDataType} from "../component/timeline/control/timeline-control.data";
    // ...
    "timelineControl"?: ChronosTimelineControlDataType,
    ```

  **Must NOT do**:
  - 不修改现有 TYPES 符号
  - 不改变绑定顺序规则

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 遵循现有模式创建配置
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 5)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: Task 5

  **References**:
  - `src/config/lane-display.inversify.ts` - 完整配置参考
  - `src/config/inversify.config.ts:112-115` - TYPES 添加位置参考
  - `src/config/data.type.ts:17-35` - DataType 定义

  **Acceptance Criteria**:
  ```bash
  npm run type-check
  # Assert: Exit code 0
  
  npm run lint
  # Assert: Exit code 0
  ```

  **Commit**: NO (groups with Task 7)

---

- [ ] 7. 注册到 chronos.ts 并集成

  **What to do**:
  - 在 `src/chronos.ts` 中导入并注册 TimelineControlConfig:
    ```typescript
    import {TimelineControlConfig} from "./config/timeline-control.inversify";
    
    // 在 constructor 中，TimelineConfig 之后添加:
    //时间轴控制面板
    new TimelineControlConfig(this.chronosContainer, rootHtml, data)
    ```
  - 位置：在 `TimelineConfig` 和 `JumpTimelineConfig` 之间

  **Must NOT do**:
  - 不改变其他配置顺序
  - 不删除现有配置

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 单文件添加导入和实例化
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (final integration)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Tasks 4, 6

  **References**:
  - `src/chronos.ts:64-66` - TimelineConfig 注册位置
  - `src/chronos.ts:23` - LaneDisplayConfig 导入参考
  - `src/chronos.ts:78` - LaneDisplayConfig 实例化参考

  **Acceptance Criteria**:
  ```bash
  npm run build
  # Assert: Exit code 0, dist/chronos.js created
  
  npm run lint
  # Assert: Exit code 0
  ```
  
  **Visual Verification** (Playwright):
  ```
  # 基础集成验证
  1. Start dev server: npm run dev
  2. Navigate to http://localhost:5173
  3. Verify page loads without console errors
  4. Find toolbar with timeline-control button (clock icon)
  5. Click timeline-control button
  6. Verify control panel appears with 6 level toggles (年/月/日/时/分/秒)
  7. Toggle "时" on
  8. Verify timeline still shows 3 rows (hour auto-hidden at default zoom)
  9. Toggle "时" off
  10. Screenshot: .sisyphus/evidence/task-7-basic-integration.png
  
  # 性能验证 - 默认缩放下开启 second 不卡死
  11. Open timeline-control panel
  12. Click "秒" toggle to enable
  13. Assert: Page remains responsive (no freeze > 2 seconds)
  14. Assert: Timeline still shows 3 rows (second auto-hidden)
  15. Screenshot: .sisyphus/evidence/task-7-second-auto-hidden.png
  
  # 重绘验证
  16. Toggle "日" off
  17. Assert: Timeline redraws with 2 rows (year, month only)
  18. Toggle "日" on
  19. Assert: Timeline shows 3 rows again
  20. Screenshot: .sisyphus/evidence/task-7-level-toggle-redraw.png
  ```

  **Commit**: YES
  - Message: `feat(timeline-control): integrate timeline-control component into Chronos`
  - Files: `src/chronos.ts`, `src/config/timeline-control.inversify.ts`, `src/config/inversify.config.ts`, `src/config/data.type.ts`
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(timeline): add levelVisibility config` | timeline.data.ts | `npm run type-check` |
| 3 | `feat(timeline): add drawHour/Minute/Second methods` | timeline.data.ts, timeline.service.ts | `npm run type-check` |
| 4 | `feat(timeline): implement conditional rendering` | timeline.service.ts | `npm run build` |
| 5 | `feat(timeline-control): create component triad` | control/*.ts | `npm run type-check` |
| 7 | `feat(timeline-control): integrate into Chronos` | chronos.ts, inversify files | `npm run build` |

---

## Success Criteria

### Verification Commands
```bash
npm run type-check  # Expected: Exit code 0
npm run lint        # Expected: Exit code 0
npm run build       # Expected: Exit code 0, creates dist/chronos.js
npm run dev         # Expected: Dev server starts on localhost:5173
```

### Final Checklist
- [ ] 所有 "Must Have" 功能已实现
- [ ] 所有 "Must NOT Have" 均已避免
- [ ] `npm run build` 成功
- [ ] `npm run lint` 无错误
- [ ] 时间轴默认显示年/月/日
- [ ] 控制面板可打开/关闭
- [ ] 切换级别可见性后时间轴正确重绘
- [ ] 默认缩放下开启 second 不会卡死（自动隐藏生效）
- [ ] 高缩放下 hour/minute/second 可正常显示
- [ ] timeline-control 复用 window layer（未创建新图层）
- [ ] 面板点击切换正确调用 timeline.reDraw()
