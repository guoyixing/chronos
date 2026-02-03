# Chronos: Business/Style Data Separation

## TL;DR

> **Quick Summary**: Refactor 17 component data files to separate business data from style data using TypeScript intersection types, maintaining full backward compatibility for the external API while enabling future theming capabilities.
> 
> **Deliverables**:
> - 17 data files with separated `BusinessType` + `StyleType` definitions
> - Updated `src/config/data.type.ts` with new structured types
> - Backward-compatible merged types preserved
> - Documentation of property classification
> 
> **Estimated Effort**: Medium (2-3 days)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 1 (Foundation) → Tasks 2-5 (Parallel Data Files) → Task 6 (API Update) → Task 7 (Verification)

---

## Context

### Original Request
Separate business data from style data in all 17 component data classes. Business data (ids, names, times, domain logic) should be distinct from style data (colors, fonts, margins, visual properties).

### Interview Summary
**Key Requirements**:
- Full backward compatibility for external API (users can pass same config shape)
- Enable future theming capabilities
- Minimize breaking changes to service/component code

**Research Findings**:
- TypeScript intersection types (`BusinessType & StyleType`) preserve API compatibility
- Current pattern uses `??` operator for merging user input with defaults
- MUI/Chakra use centralized themes, but inline split is lower risk for this codebase
- All 21 data files follow consistent triad pattern

### Self-Conducted Gap Analysis
**Identified Gaps** (addressed):
- Nested style objects (shadow, button) → Split at property level, keep nested types as-is
- Shared types (ShadowType, ButtonType) → Already style-focused, no changes needed
- Node-entry.data.ts is mostly business → Apply pattern consistently for uniformity

---

## Work Objectives

### Core Objective
Separate business data from style data in all component data types while maintaining the existing external API contract and enabling future theming capabilities.

### Concrete Deliverables
- 17 refactored `*.data.ts` files with `BusinessType` + `StyleType` + merged `DataType`
- Updated `src/config/data.type.ts` exposing optional structured types
- Property classification documentation in code comments

### Definition of Done
- [ ] `npm run type-check` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` produces `dist/chronos.js` without errors
- [ ] Demo page (`npm run dev` → open in browser) renders correctly
- [ ] Existing configuration shapes still work (backward compatibility)

### Must Have
- All 17 data files refactored with consistent pattern
- Backward-compatible merged types (`ChronosXxxDataType = BusinessType & StyleType`)
- Chinese comments maintained throughout
- No changes to service or component files

### Must NOT Have (Guardrails)
- NO centralized theme context (future enhancement, not this PR)
- NO changes to services (they continue using merged data class)
- NO changes to DI binding patterns
- NO breaking changes to existing user configurations
- NO barrel exports (maintain explicit imports)
- NO changes to component files
- NO runtime theme switching capability (future scope)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (demo/ serves as integration examples)
- **User wants tests**: Manual verification via build + demo
- **Framework**: None (no test suite in this project)

### Automated Verification (ALWAYS include)

Each TODO includes EXECUTABLE verification procedures:

**For TypeScript changes** (using Bash):
```bash
# Agent runs:
npm run type-check
# Assert: Exit code 0, no type errors

npm run lint
# Assert: Exit code 0, no lint errors

npm run build
# Assert: Exit code 0, dist/chronos.js created
```

**For Visual verification** (using playwright skill):
```
# Agent executes via browser automation:
1. Run: npm run dev (start dev server)
2. Navigate to: http://localhost:5173/ (or shown port)
3. Wait for: Chronos chart to render (canvas element visible)
4. Assert: No console errors
5. Assert: Lanes, timeline, nodes visible
6. Screenshot: .sisyphus/evidence/demo-renders.png
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation):
└── Task 1: Create shared utility types and document classification

Wave 2 (Core Components - Parallel):
├── Task 2: Lane components (3 files)
├── Task 3: Node components (5 files)
├── Task 4: Timeline components (3 files)
└── Task 5: UI components (6 files)

Wave 3 (Integration):
└── Task 6: Update data.type.ts public API

Wave 4 (Verification):
└── Task 7: Full build and demo verification
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4, 5 | None (must complete first) |
| 2 | 1 | 6 | 3, 4, 5 |
| 3 | 1 | 6 | 2, 4, 5 |
| 4 | 1 | 6 | 2, 3, 5 |
| 5 | 1 | 6 | 2, 3, 4 |
| 6 | 2, 3, 4, 5 | 7 | None |
| 7 | 6 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Approach |
|------|-------|---------------------|
| 1 | 1 | Single agent, establish pattern |
| 2 | 2, 3, 4, 5 | 4 parallel agents, each handles component group |
| 3 | 6 | Single agent, API integration |
| 4 | 7 | Single agent, verification |

---

## TODOs

### Task 1: Foundation - Create Property Classification and Pattern

- [ ] 1. Establish separation pattern and document property classification

  **What to do**:
  - Create a reference implementation in `lane-entry.data.ts` as the canonical pattern
  - Document property classification rules in code comments
  - Pattern to follow:
    ```typescript
    /**
     * 泳道条目-业务数据类型
     * Business properties: domain logic, identifiers, relationships
     */
    export type ChronosLaneEntryBusinessType = {
        id: string
        name: string
        rowNum?: number
        hide?: boolean
        extendField?: Record<string, unknown>
    }

    /**
     * 泳道条目-样式数据类型
     * Style properties: colors, fonts, margins, visual appearance
     */
    export type ChronosLaneEntryStyleType = {
        leftBackgroundColor?: string
        hoverLeftBackgroundColor?: string
        borderColor?: string
        border?: number
        textColor?: string
        fontSize?: number
        fontFamily?: string
        textLeftMargin?: number
        textTopMargin?: number
        textBottomMargin?: number
        radius?: number[] | number
        shadow?: ShadowConfigType
        button?: ButtonLaneConfigType
    }

    /**
     * 泳道条目-组件数据类型 (向后兼容)
     * Combined type for backward compatibility
     */
    export type ChronosLaneEntryDataType = ChronosLaneEntryBusinessType & ChronosLaneEntryStyleType
    ```
  - Update the `ChronosLaneEntryData` class to organize properties into logical groups with comments

  **Must NOT do**:
  - Do not change property names or types
  - Do not modify constructor logic (keep `??` merging)
  - Do not add new properties
  - Do not change the class structure (only add organizing comments)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file refactor with clear pattern, low complexity
  - **Skills**: []
    - No special skills needed for TypeScript refactoring

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (sequential - foundation)
  - **Blocks**: Tasks 2, 3, 4, 5
  - **Blocked By**: None

  **References**:
  
  **Pattern Reference** (file to modify):
  - `src/component/lane/entry/lane-entry.data.ts:197-219` - Current `ChronosLaneEntryDataType` definition to split

  **Type References** (nested types to keep as-is):
  - `src/core/common/type/shadow.type.ts` - ShadowConfigType, ShadowType definitions
  - `src/core/common/type/button.type.ts` - ButtonLaneConfigType, ButtonLaneType definitions

  **Classification Rules**:
  - **Business**: `id`, `name`, `*Id`, `*Time`, `row`, `rowNum`, `type`, `extendField`, `entry` arrays, `hide`/`hidden` (visibility is domain-driven)
  - **Style**: `*Color`, `*BackgroundColor`, `fontSize`, `fontFamily`, `*Margin`, `border`, `radius`, `shadow`, `button`, `width`, `height`, `startOffSet`, `*Pct` (layout is presentation)

  **Acceptance Criteria**:
  - [ ] `ChronosLaneEntryBusinessType` defined with business properties
  - [ ] `ChronosLaneEntryStyleType` defined with style properties  
  - [ ] `ChronosLaneEntryDataType = BusinessType & StyleType` (intersection)
  - [ ] Class properties organized with Chinese comment headers: `// ===== 业务属性 =====` and `// ===== 样式属性 =====`
  - [ ] `npm run type-check` → Exit code 0

  **Commit**: YES
  - Message: `refactor(lane-entry): 分离业务数据和样式数据类型定义`
  - Files: `src/component/lane/entry/lane-entry.data.ts`
  - Pre-commit: `npm run type-check`

---

### Task 2: Lane Components - Apply Pattern to Lane Data Files

- [ ] 2. Separate business/style data in lane component files

  **What to do**:
  - Apply the established pattern to all lane data files:
    - `src/component/lane/group/lane-group.data.ts`
    - `src/component/lane/display/lane-display.data.ts`
  - For each file:
    1. Create `ChronosXxxBusinessType` with business properties
    2. Create `ChronosXxxStyleType` with style properties
    3. Update `ChronosXxxDataType` to be intersection of both
    4. Add organizing comments to class properties

  **Must NOT do**:
  - Do not change lane-entry.data.ts (already done in Task 1)
  - Do not modify constructor logic
  - Do not change property types or names

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pattern already established, mechanical application
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern Reference** (established in Task 1):
  - `src/component/lane/entry/lane-entry.data.ts` - Follow the BusinessType/StyleType pattern exactly

  **Files to Modify**:
  - `src/component/lane/group/lane-group.data.ts:89-115` - ChronosLaneGroupDataType definition
  - `src/component/lane/display/lane-display.data.ts` - ChronosLaneDisplayDataType definition

  **Property Classification** (lane-group):
  - Business: `entry` (array of lane entries)
  - Style: `rowHeight`, `leftWidth`, `minLeftWidth`, `maxLeftWidth`, `lineColor`, `lineSize`, `bottomMargin`, `dividerColor`, `backgroundColor`, `radius`, `shadow`

  **Acceptance Criteria**:
  - [ ] `ChronosLaneGroupBusinessType` + `ChronosLaneGroupStyleType` defined
  - [ ] `ChronosLaneDisplayBusinessType` + `ChronosLaneDisplayStyleType` defined
  - [ ] Intersection types preserve backward compatibility
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm run lint` → Exit code 0

  **Commit**: YES
  - Message: `refactor(lane): 分离泳道组件业务数据和样式数据`
  - Files: `src/component/lane/group/lane-group.data.ts`, `src/component/lane/display/lane-display.data.ts`
  - Pre-commit: `npm run type-check && npm run lint`

---

### Task 3: Node Components - Apply Pattern to Node Data Files

- [ ] 3. Separate business/style data in node component files

  **What to do**:
  - Apply pattern to all node data files:
    - `src/component/node/operate/group/node-group.data.ts`
    - `src/component/node/operate/entry/node-entry.data.ts`
    - `src/component/node/operate/detail/node-detail.data.ts`
    - `src/component/node/operate/bar/node-bar.data.ts`
    - `src/component/node/operate/transformer/node-transformer.data.ts`

  **Must NOT do**:
  - Do not modify constructor logic
  - Do not change property types or names

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mechanical pattern application, multiple files but same pattern
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern Reference**:
  - `src/component/lane/entry/lane-entry.data.ts` - Established pattern from Task 1

  **Files to Modify**:
  - `src/component/node/operate/group/node-group.data.ts:92-114` - node-group types
  - `src/component/node/operate/entry/node-entry.data.ts:115-127` - node-entry types (mostly business)
  - `src/component/node/operate/detail/node-detail.data.ts` - node-detail types
  - `src/component/node/operate/bar/node-bar.data.ts` - node-bar types
  - `src/component/node/operate/transformer/node-transformer.data.ts` - node-transformer types

  **Property Classification** (node-entry - special case, mostly business):
  - Business: `id`, `name`, `type`, `startTime`, `finishTime`, `laneId`, `row`, `progress`, `hidden`, `extendField`
  - Style: (none in external type - all business!)

  **Property Classification** (node-group):
  - Business: `entry` (array of node entries), `hideProgress`
  - Style: `moveRangeColor`, `moveRangeBorderColor`, `moveRangeBorder`, `progress` (styling object)

  **Acceptance Criteria**:
  - [ ] All 5 node data files have BusinessType + StyleType
  - [ ] node-entry.data.ts: BusinessType contains all properties (it's all business)
  - [ ] Intersection types preserve backward compatibility
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm run lint` → Exit code 0

  **Commit**: YES
  - Message: `refactor(node): 分离节点组件业务数据和样式数据`
  - Files: All 5 node data files
  - Pre-commit: `npm run type-check && npm run lint`

---

### Task 4: Timeline Components - Apply Pattern to Timeline Data Files

- [ ] 4. Separate business/style data in timeline component files

  **What to do**:
  - Apply pattern to timeline data files:
    - `src/component/timeline/timeline.data.ts`
    - `src/component/timeline/control/timeline-control.data.ts`
    - `src/component/timeline/jump/timeline-jump.data.ts`

  **Must NOT do**:
  - Do not modify constructor logic
  - Do not change property types or names

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mechanical pattern application
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern Reference**:
  - `src/component/lane/entry/lane-entry.data.ts` - Established pattern

  **Files to Modify**:
  - `src/component/timeline/timeline.data.ts:196-220` - timeline types
  - `src/component/timeline/control/timeline-control.data.ts` - timeline-control types
  - `src/component/timeline/jump/timeline-jump.data.ts` - timeline-jump types

  **Property Classification** (timeline):
  - Business: `initTime`, `levelVisibility`
  - Style: `startOffSet`, `dayWidth`, `textMinWidth`, `rowHeight`, `headWidth`, `border`, `borderColor`, `backgroundColor`, `radius`, `textColor`, `fontSize`, `textMargin`, `fontFamily`, `shadow`

  **Acceptance Criteria**:
  - [ ] All 3 timeline data files have BusinessType + StyleType
  - [ ] `initTime` is in BusinessType (required field)
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm run lint` → Exit code 0

  **Commit**: YES
  - Message: `refactor(timeline): 分离时间轴组件业务数据和样式数据`
  - Files: All 3 timeline data files
  - Pre-commit: `npm run type-check && npm run lint`

---

### Task 5: UI Components - Apply Pattern to Remaining Data Files

- [ ] 5. Separate business/style data in UI component files

  **What to do**:
  - Apply pattern to remaining UI component data files:
    - `src/component/grid/grid.data.ts`
    - `src/component/toolbar/toolbar.data.ts`
    - `src/component/scale/scale.data.ts`
    - `src/component/revise/revise.data.ts`
    - `src/component/watermark/watermark.data.ts`
    - `src/component/holiday/holiday.data.ts`
    - `src/component/window/window.data.ts`
    - `src/component/fullscreen/fullscreen.data.ts`

  **Must NOT do**:
  - Do not modify constructor logic
  - Do not change property types or names

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mechanical pattern application, more files but same pattern
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 4)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern Reference**:
  - `src/component/lane/entry/lane-entry.data.ts` - Established pattern

  **Files to Modify**:
  - `src/component/grid/grid.data.ts:93-123` - grid types
  - `src/component/toolbar/toolbar.data.ts:249-278` - toolbar types
  - `src/component/scale/scale.data.ts:137-153` - scale types
  - `src/component/revise/revise.data.ts:157-169` - revise types
  - `src/component/watermark/watermark.data.ts:83-95` - watermark types
  - `src/component/holiday/holiday.data.ts` - holiday types
  - `src/component/window/window.data.ts` - window types
  - `src/component/fullscreen/fullscreen.data.ts` - fullscreen types

  **Property Classification** (grid):
  - Business: `hide`
  - Style: `startOffSet`, `tbGapSize`, `lrGapSize`, `color`, `width`

  **Property Classification** (toolbar):
  - Business: `itemsPerRow`, `collapsedRows`, `expanded`, `showExpandButton`, `expandDirection`
  - Style: `startOffSetPct`, `width`, `height`, `backgroundColor`, `border`, `borderColor`, `radius`, `button`

  **Property Classification** (watermark):
  - Business: `hide`
  - Style: `tbSize`, `lrSize`, `rotation`, `text` (entire object)

  **Acceptance Criteria**:
  - [ ] All 8 UI data files have BusinessType + StyleType
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm run lint` → Exit code 0

  **Commit**: YES
  - Message: `refactor(ui): 分离UI组件业务数据和样式数据`
  - Files: All 8 UI data files
  - Pre-commit: `npm run type-check && npm run lint`

---

### Task 6: Update Public API Types

- [ ] 6. Update data.type.ts to expose structured types

  **What to do**:
  - Update `src/config/data.type.ts` to:
    1. Import all new BusinessType and StyleType definitions
    2. Add optional structured type exports for future use
    3. Keep existing DataType unchanged for backward compatibility
  - Add JSDoc comments documenting the separation

  **Must NOT do**:
  - Do not change existing DataType shape
  - Do not make new structured types required
  - Do not break existing user configurations

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file update, import additions
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential)
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 2, 3, 4, 5

  **References**:

  **File to Modify**:
  - `src/config/data.type.ts:1-37` - Current public API types

  **Import Sources** (all new BusinessType/StyleType):
  - All 17 data files modified in Tasks 1-5

  **Expected Changes**:
  ```typescript
  // Add structured type re-exports for future theming API
  export type {
    ChronosLaneEntryBusinessType,
    ChronosLaneEntryStyleType,
    // ... all BusinessType and StyleType exports
  } from '../component/...';
  ```

  **Acceptance Criteria**:
  - [ ] All BusinessType and StyleType are exported from data.type.ts
  - [ ] Existing DataType interface unchanged
  - [ ] JSDoc comments document the separation
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm run build` → Exit code 0

  **Commit**: YES
  - Message: `refactor(api): 导出分离后的业务和样式类型定义`
  - Files: `src/config/data.type.ts`
  - Pre-commit: `npm run type-check && npm run build`

---

### Task 7: Final Verification

- [ ] 7. Complete verification of all changes

  **What to do**:
  - Run full build and verification suite
  - Test demo page renders correctly
  - Verify backward compatibility with existing config patterns

  **Must NOT do**:
  - Do not make code changes
  - This is verification only

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Requires browser verification via Playwright
  - **Skills**: [`playwright`]
    - `playwright`: Browser automation for demo verification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final)
  - **Blocks**: None (completion)
  - **Blocked By**: Task 6

  **References**:

  **Build Commands**:
  - `npm run type-check` - TypeScript validation
  - `npm run lint` - ESLint validation  
  - `npm run build` - Production build

  **Demo Verification**:
  - `npm run dev` - Start dev server
  - Navigate to localhost URL shown in terminal

  **Acceptance Criteria**:

  **Automated Verification** (using Bash):
  ```bash
  # Type checking
  npm run type-check
  # Assert: Exit code 0, "Found 0 errors" or no error output

  # Linting
  npm run lint
  # Assert: Exit code 0

  # Production build
  npm run build
  # Assert: Exit code 0
  # Assert: dist/chronos.js file exists
  ```

  **Visual Verification** (using playwright skill):
  ```
  1. Start dev server: npm run dev
  2. Navigate to: http://localhost:5173/ (or port shown)
  3. Wait for: canvas element to be visible (Chronos renders on canvas)
  4. Assert: No JavaScript console errors
  5. Assert: Timeline header visible with dates
  6. Assert: At least one swim lane visible
  7. Assert: Toolbar visible at bottom of chart
  8. Screenshot: .sisyphus/evidence/final-demo-verification.png
  ```

  **Evidence to Capture**:
  - [ ] Terminal output from type-check, lint, build commands
  - [ ] Screenshot of rendered demo page
  - [ ] Console log showing no errors

  **Commit**: YES
  - Message: `chore: 验证业务/样式数据分离重构完成`
  - Files: None (verification only, but commit for audit trail)
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `refactor(lane-entry): 分离业务数据和样式数据类型定义` | lane-entry.data.ts | type-check |
| 2 | `refactor(lane): 分离泳道组件业务数据和样式数据` | 2 lane files | type-check, lint |
| 3 | `refactor(node): 分离节点组件业务数据和样式数据` | 5 node files | type-check, lint |
| 4 | `refactor(timeline): 分离时间轴组件业务数据和样式数据` | 3 timeline files | type-check, lint |
| 5 | `refactor(ui): 分离UI组件业务数据和样式数据` | 8 UI files | type-check, lint |
| 6 | `refactor(api): 导出分离后的业务和样式类型定义` | data.type.ts | type-check, build |
| 7 | `chore: 验证业务/样式数据分离重构完成` | None | build, demo |

---

## Success Criteria

### Verification Commands
```bash
npm run type-check  # Expected: Exit 0, no errors
npm run lint        # Expected: Exit 0, no warnings
npm run build       # Expected: Exit 0, dist/chronos.js created
npm run dev         # Expected: Dev server starts, demo renders
```

### Final Checklist
- [ ] All 17 data files have BusinessType + StyleType definitions
- [ ] All merged DataType = BusinessType & StyleType (intersection)
- [ ] Existing user configurations still work (backward compat)
- [ ] Chinese comments maintained throughout
- [ ] No changes to service files
- [ ] No changes to component files
- [ ] No changes to DI config files (except imports if needed)
- [ ] Demo page renders correctly
- [ ] Build produces valid output
