# Draft: Business/Style Data Separation API

## Current State (Confirmed)

### What Exists
- Each component has `BusinessType` and `StyleType` exported separately
- Intersection pattern: `DataType = BusinessType & StyleType`
- All types already re-exported from `data.type.ts`
- 17+ components with this pattern applied

### Current API
```typescript
new Chronos(div, {
  timeline: { /* required - mixed */ },
  lane: { /* optional - mixed */ },
  // ... 15+ keys, each mixing business + style
})
```

### Components Inventory (from data.type.ts)
| Key | Component | Has Business | Has Style |
|-----|-----------|--------------|-----------|
| `window` | Window | NO (style-only) | YES |
| `grid` | Grid | YES (hide) | YES |
| `lane` | LaneGroup | YES (entry[]) | YES |
| `toolbar` | Toolbar | ? | ? |
| `scale` | Scale | ? | ? |
| `transformer` | NodeTransformer | ? | ? |
| `timeline` | Timeline | YES (initTime, levelVisibility) | YES |
| `timelineControl` | TimelineControl | ? | ? |
| `jumpTimeline` | JumpTimeline | ? | ? |
| `bar` | NodeBar | ? | ? |
| `node` | NodeGroup | YES (entry[], hideProgress) | YES |
| `detail` | NodeDetail | ? | ? |
| `nodeRevise` | Revise | ? | ? |
| `laneRevise` | Revise | ? | ? |
| `laneDisplay` | LaneDisplay | ? | ? |
| `holiday` | Holiday | ? | ? |
| `watermark` | Watermark | ? | ? |

## User's Desired API

```typescript
// Style config (reusable theme)
const styleConfig: StyleDataType = {
  grid: { backgroundColor: '#fff', lineColor: '#eee' },
  lane: { height: 50 },
  // ... all style-only properties
}

// Instance creation with business data only
new Chronos(div, {
  business: {
    timeline: { initTime: '2024-01-01' },
    lane: { entry: [...] },
    node: { entry: [...] }
  },
  style: styleConfig
})
```

## Technical Constraints

1. **Backward Compatibility**: Old API must work unchanged
2. **Components unchanged**: Config classes still receive merged `DataType`
3. **Type Safety**: Full autocomplete for both patterns
4. **Merge location**: TBD - Chronos constructor preferred

## Research Findings

### Pattern Analysis
- `timeline` has REQUIRED property (`initTime`) - business data
- Most properties are optional with `??` defaults
- Business types tend to have `entry` arrays (lane, node)
- Style types tend to have colors, sizes, offsets

### Merge Strategy Considerations
- Merge at Chronos constructor = single point of change
- Deep merge needed for nested objects (e.g., `progress.background`)
- Same key in business + style = business wins? style wins? error?

## Decisions Made

### 1. Constructor Strategy: Function Overload
- Two signatures: `Chronos(div, DataType)` OR `Chronos(div, { business, style })`
- TypeScript discriminates automatically via discriminated union or signature overloads
- Zero breaking change to existing users

### 2. Merge Strategy: Deep merge, business wins
- Recursively merge nested objects
- Business data overrides style for same keys
- Matches intuition: business is "current state"

### 3. Merge Location: Chronos constructor
- Single merge point
- Config classes receive normalized `DataType`
- Zero changes to 21 config files

### 4. Aggregate Types: Export both
- Export `ChronosBusinessDataType` and `ChronosStyleDataType` from `data.type.ts`
- Users get full autocomplete for themed configs

### 5. isEdit Placement: Business data
- `isEdit` is behavioral (edit mode on/off)
- Goes into `ChronosBusinessDataType`

### 6. Type Naming Convention
- `ChronosBusinessDataType` - aggregate of all business types
- `ChronosStyleDataType` - aggregate of all style types
- `ChronosSeparatedDataType` - the new input format `{ business, style }`

### 7. Deep Merge Utility: Minimal custom implementation
- Simple recursive merge (~15 lines)
- No external dependencies
- Arrays replaced (not merged)
- Located in `src/core/util/deep-merge.ts` or similar

## Test Strategy Decision

- **Infrastructure exists**: NO
- **User wants tests**: YES (TDD with Vitest)
- **Framework choice**: Vitest (Vite-native, zero-config with existing setup)
- **QA approach**: TDD for deep-merge utility, type-check for type safety

## Scope Boundaries

### INCLUDE
- Vitest test infrastructure setup
- New aggregate types: `ChronosBusinessDataType`, `ChronosStyleDataType`, `ChronosSeparatedDataType`
- Function overload for Chronos constructor
- Deep merge utility with TDD tests
- Update `data.type.ts` exports
- Update `chronos.ts` with overloaded constructor

### EXCLUDE
- No changes to 21 config classes (they receive normalized DataType)
- No changes to component data classes (BusinessType/StyleType already exported)
- No migration of demo files (old API continues to work)
- No documentation updates (separate task if needed)
