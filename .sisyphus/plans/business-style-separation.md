# Business/Style Data Separation API

## TL;DR

> **Quick Summary**: Add a new public API that allows users to configure Chronos with separated business and style data, enabling reusable theme configurations while maintaining full backward compatibility with the existing merged DataType API.
> 
> **Deliverables**:
> - Vitest test infrastructure setup
> - `ChronosBusinessDataType` and `ChronosStyleDataType` aggregate types
> - `ChronosSeparatedDataType` input type with `{ business, style }` structure
> - Deep merge utility with TDD tests
> - Overloaded Chronos constructor supporting both API formats
> 
> **Estimated Effort**: Medium (4-6 focused tasks)
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 (Vitest) → Task 2 (Merge util) → Task 4 (Constructor)

---

## Context

### Original Request
Users want to configure styles ONCE, then only focus on business data for subsequent operations:
```typescript
// Configure styles once (can be a separate theme file)
const styleConfig: ChronosStyleDataType = {
  grid: { backgroundColor: '#fff', lineColor: '#eee' },
  lane: { rowHeight: 50, backgroundColor: '#f5f5f5' },
  // ...
}

// Only pass business data when creating instances
new Chronos(div, {
  business: {
    timeline: { initTime: '2024-01-01' },
    lane: { entry: [...] },
    node: { entry: [...] }
  },
  style: styleConfig  // Reusable!
})
```

### Interview Summary
**Key Discussions**:
- Constructor strategy: Function overload with runtime detection via `'business' in input`
- Merge strategy: Deep merge, business wins for conflicting keys
- Merge location: Chronos constructor only (zero changes to 21 config classes)
- Type naming: `ChronosBusinessDataType`, `ChronosStyleDataType`, `ChronosSeparatedDataType`
- `isEdit` placement: Goes into business data
- `timeline.initTime`: Remains required in business
- Both `business` and `style` keys required in separated format

**Research Findings**:
- Utility pattern: `src/core/common/utils/` with pure functions, Chinese JSDoc comments
- Vite config ready for Vitest extension with `test` block
- All 17+ components already export `BusinessType` and `StyleType`
- Runtime overload detection: Use `'business' in input && 'style' in input`

### Metis Review (Self-Analysis)
**Identified Gaps** (addressed):
- Required field handling: `timeline.initTime` stays required in business
- Partial input: Both `business` and `style` required (can be empty objects)
- Array merge strategy: Arrays are replaced, not merged
- Null/undefined handling: Skip undefined values during merge

---

## Work Objectives

### Core Objective
Enable users to provide Chronos configuration as separated `{ business, style }` objects while maintaining full backward compatibility with the existing flat `DataType` API.

### Concrete Deliverables
- `src/core/common/utils/merge.utils.ts` - Deep merge utility
- `src/core/common/utils/merge.utils.test.ts` - TDD tests for merge
- `src/config/data.type.ts` - Aggregate type definitions
- `src/chronos.ts` - Overloaded constructor
- `vitest.config.ts` or extended `vite.config.ts` - Test configuration
- `package.json` - Test script and vitest dependency

### Definition of Done
- [ ] `npm run test` passes all merge utility tests
- [ ] `npm run type-check` passes with zero errors
- [ ] Old API: `new Chronos(div, { timeline: { initTime: '...' } })` works unchanged
- [ ] New API: `new Chronos(div, { business: {...}, style: {...} })` works correctly
- [ ] Types provide full autocomplete for both patterns

### Must Have
- Backward compatibility: existing code works without modification
- Type safety: full autocomplete for both API patterns
- Deep merge: nested objects merge correctly
- Business wins: conflicting keys resolved in favor of business data

### Must NOT Have (Guardrails)
- NO changes to any of the 21 config classes in `src/config/`
- NO changes to component data classes (they already export BusinessType/StyleType)
- NO array merging (arrays must be replaced entirely)
- NO lodash or external dependencies for merge
- NO migration of demo files (old API continues to work)
- NO documentation files in this scope

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO → Setting up Vitest
- **User wants tests**: YES (TDD)
- **Framework**: Vitest (Vite-native, zero-config with existing setup)

### TDD Workflow for Deep Merge Utility

Each test case follows RED-GREEN-REFACTOR:

**Test Cases to Cover**:
1. Shallow merge of flat objects
2. Deep merge of nested objects
3. Business wins for conflicting keys
4. Arrays are replaced, not merged
5. Undefined values are skipped
6. Null values are preserved (not skipped)
7. Empty objects merge correctly
8. Prototype pollution protection

**Vitest Setup Task**:
- Install: `npm install --save-dev vitest`
- Config: Add `test` block to `vite.config.ts`
- Verify: `npm run test -- --run` → shows vitest output
- Script: Add `"test": "vitest"` to package.json

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Setup Vitest infrastructure
└── Task 3: Define aggregate types in data.type.ts

Wave 2 (After Wave 1):
├── Task 2: Implement deep merge utility (TDD) [depends: 1]
└── (Task 3 may complete in Wave 1)

Wave 3 (After Wave 2):
└── Task 4: Implement constructor overload [depends: 2, 3]

Wave 4 (After Wave 3):
└── Task 5: Integration verification [depends: 4]

Critical Path: Task 1 → Task 2 → Task 4 → Task 5
Parallel Speedup: ~30% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2 | 3 |
| 2 | 1 | 4 | None |
| 3 | None | 4 | 1 |
| 4 | 2, 3 | 5 | None |
| 5 | 4 | None | None (final) |

---

## TODOs

- [ ] 1. Setup Vitest Test Infrastructure

  **What to do**:
  - Install vitest as dev dependency
  - Add `test` configuration to vite.config.ts
  - Add test script to package.json
  - Create example test file to verify setup works

  **Must NOT do**:
  - Do NOT install jsdom (not testing DOM)
  - Do NOT add coverage configuration (out of scope)
  - Do NOT create test utilities beyond basic setup

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple configuration task with clear steps
  - **Skills**: None required
    - Standard npm/vite knowledge sufficient
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No UI work involved

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 3)
  - **Blocks**: Task 2
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `vite.config.ts:1-31` - Current Vite configuration structure to extend

  **API/Type References**:
  - `package.json:32-38` - Scripts section to add test command

  **External References**:
  - Vitest docs: `https://vitest.dev/guide/` - Setup with Vite

  **WHY Each Reference Matters**:
  - `vite.config.ts` shows the defineConfig structure; add `test: {}` block inside
  - `package.json` scripts section shows where to add `"test": "vitest"`

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Verify vitest is installed
  npm ls vitest
  # Expected: vitest@x.x.x in dependencies

  # Verify test script exists
  cat package.json | grep '"test"'
  # Expected: "test": "vitest" appears

  # Verify vitest runs successfully
  npm run test -- --run
  # Expected: Exit code 0, shows vitest output (may show 0 tests initially)
  ```

  **Commit**: YES
  - Message: `build(test): add vitest test infrastructure`
  - Files: `package.json`, `vite.config.ts`
  - Pre-commit: `npm run type-check`

---

- [ ] 2. Implement Deep Merge Utility (TDD)

  **What to do**:
  - Create `src/core/common/utils/merge.utils.ts`
  - Create `src/core/common/utils/merge.utils.test.ts`
  - Follow TDD: write failing tests first, then implement
  - Use Chinese JSDoc comments (match existing pattern)
  - Export `deepMerge<T>(target: T, source: Partial<T>): T`

  **Implementation Details**:
  ```typescript
  // Pseudocode for deepMerge
  function deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target };
    for (const key in source) {
      if (source[key] === undefined) continue; // skip undefined
      if (isPlainObject(source[key]) && isPlainObject(result[key])) {
        result[key] = deepMerge(result[key], source[key]); // recurse
      } else {
        result[key] = source[key]; // replace (including arrays)
      }
    }
    return result;
  }
  ```

  **Test Cases**:
  1. `deepMerge({a:1}, {b:2})` → `{a:1, b:2}`
  2. `deepMerge({a:{x:1}}, {a:{y:2}})` → `{a:{x:1, y:2}}`
  3. `deepMerge({a:1}, {a:2})` → `{a:2}` (source wins)
  4. `deepMerge({arr:[1,2]}, {arr:[3]})` → `{arr:[3]}` (replace array)
  5. `deepMerge({a:1}, {a:undefined})` → `{a:1}` (skip undefined)
  6. `deepMerge({a:1}, {a:null})` → `{a:null}` (keep null)
  7. `deepMerge({}, {a:1})` → `{a:1}` (empty target)
  8. `deepMerge({a:1}, {})` → `{a:1}` (empty source)

  **Must NOT do**:
  - Do NOT use lodash or external libraries
  - Do NOT handle circular references (not needed for config objects)
  - Do NOT merge arrays (replace only)
  - Do NOT mutate input objects

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Requires careful TDD discipline and edge case handling
  - **Skills**: None required
    - Pure TypeScript utility, no framework knowledge needed
  - **Skills Evaluated but Omitted**:
    - `git-master`: Will commit but standard commit is fine

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (Wave 2)
  - **Blocks**: Task 4
  - **Blocked By**: Task 1 (needs Vitest)

  **References**:

  **Pattern References**:
  - `src/core/common/utils/date.utils.ts:1-68` - Utility function pattern with Chinese JSDoc

  **External References**:
  - Vitest docs: `https://vitest.dev/api/` - Test API (describe, it, expect)

  **WHY Each Reference Matters**:
  - `date.utils.ts` shows the exact JSDoc style and export pattern to follow
  - Vitest API needed for writing test cases

  **Acceptance Criteria**:

  **TDD Workflow**:
  - [ ] Test file created: `src/core/common/utils/merge.utils.test.ts`
  - [ ] All 8 test cases written and initially failing
  - [ ] `npm run test -- --run` → PASS (8 tests pass after implementation)

  **Automated Verification**:
  ```bash
  # Run merge utility tests
  npm run test -- --run src/core/common/utils/merge.utils.test.ts
  # Expected: 8 tests passed

  # Type check passes
  npm run type-check
  # Expected: Exit code 0
  ```

  **Commit**: YES
  - Message: `feat(util): add deepMerge utility for config object merging`
  - Files: `src/core/common/utils/merge.utils.ts`, `src/core/common/utils/merge.utils.test.ts`
  - Pre-commit: `npm run test -- --run && npm run type-check`

---

- [ ] 3. Define Aggregate Types in data.type.ts

  **What to do**:
  - Add `ChronosBusinessDataType` aggregate (all business types)
  - Add `ChronosStyleDataType` aggregate (all style types)
  - Add `ChronosSeparatedDataType` wrapper type
  - Add `ChronosInputType` union type (for constructor signature)
  - Export all new types

  **Type Definitions**:
  ```typescript
  /**
   * 业务数据聚合类型 - 所有组件的业务数据
   * Aggregate of all component business data types
   */
  export type ChronosBusinessDataType = {
    isEdit?: boolean;
    grid?: ChronosGridBusinessType;
    lane?: ChronosLaneGroupBusinessType;
    toolbar?: ChronosToolbarBusinessType;
    // ... (only business types)
    timeline: ChronosTimelineBusinessType; // Required!
    // ...
  }

  /**
   * 样式数据聚合类型 - 所有组件的样式数据
   * Aggregate of all component style data types
   */
  export type ChronosStyleDataType = {
    window?: ChronosWindowStyleType;
    grid?: ChronosGridStyleType;
    lane?: ChronosLaneGroupStyleType;
    // ... (only style types)
  }

  /**
   * 分离数据类型 - 业务和样式分开传入
   * Separated input format with business and style keys
   */
  export type ChronosSeparatedDataType = {
    business: ChronosBusinessDataType;
    style: ChronosStyleDataType;
  }

  /**
   * 输入类型 - 支持旧API和新API
   * Union type supporting both legacy and new API formats
   */
  export type ChronosInputType = DataType | ChronosSeparatedDataType;
  ```

  **Must NOT do**:
  - Do NOT change existing `DataType` definition
  - Do NOT remove any existing exports
  - Do NOT add imports for types already re-exported

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward type definitions with clear pattern
  - **Skills**: None required
    - TypeScript type composition knowledge sufficient
  - **Skills Evaluated but Omitted**:
    - All skills irrelevant for pure type work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 4
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/config/data.type.ts:18-37` - Existing DataType structure to mirror
  - `src/config/data.type.ts:50-146` - Existing re-exports to reference

  **API/Type References**:
  - `src/component/timeline/timeline.data.ts:203-213` - ChronosTimelineBusinessType (required field)
  - `src/component/grid/grid.data.ts:100-105` - ChronosGridBusinessType example
  - `src/component/window/window.data.ts:61-66` - ChronosWindowStyleType (style-only component)

  **WHY Each Reference Matters**:
  - `data.type.ts:18-37` shows key naming (grid, lane, timeline, etc.)
  - Timeline business type shows `initTime` is required - must reflect in aggregate
  - Window is style-only component - appears only in StyleDataType

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Type check passes with new types
  npm run type-check
  # Expected: Exit code 0, no errors

  # Verify types are exported (grep for type names)
  grep -n "ChronosBusinessDataType" src/config/data.type.ts
  grep -n "ChronosStyleDataType" src/config/data.type.ts
  grep -n "ChronosSeparatedDataType" src/config/data.type.ts
  # Expected: All three appear as exports
  ```

  **Commit**: YES
  - Message: `feat(types): add aggregate business/style types for separated API`
  - Files: `src/config/data.type.ts`
  - Pre-commit: `npm run type-check`

---

- [ ] 4. Implement Overloaded Chronos Constructor

  **What to do**:
  - Add type guard function `isSeparatedDataType`
  - Add function to merge separated data into DataType
  - Modify constructor to detect and handle both formats
  - Preserve all existing behavior for legacy format

  **Implementation Details**:
  ```typescript
  // Type guard
  function isSeparatedDataType(
    input: ChronosInputType
  ): input is ChronosSeparatedDataType {
    return 'business' in input && 'style' in input;
  }

  // Merge function
  function mergeToDataType(separated: ChronosSeparatedDataType): DataType {
    const { business, style } = separated;
    return deepMerge(style, business) as DataType;
    // business wins because it's the source (second param)
  }

  // In constructor
  constructor(rootHtml: HTMLDivElement, input: ChronosInputType) {
    const data: DataType = isSeparatedDataType(input) 
      ? mergeToDataType(input) 
      : input;
    // ... rest of constructor uses `data`
  }
  ```

  **Must NOT do**:
  - Do NOT change Config class instantiation calls
  - Do NOT modify any logic after the merge point
  - Do NOT add console.log or debugging code
  - Do NOT change the order of Config instantiations

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Core API change requiring careful type handling
  - **Skills**: None required
    - TypeScript generics and type guards knowledge needed
  - **Skills Evaluated but Omitted**:
    - `git-master`: Standard commit sufficient

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (Wave 3)
  - **Blocks**: Task 5
  - **Blocked By**: Task 2 (needs deepMerge), Task 3 (needs types)

  **References**:

  **Pattern References**:
  - `src/chronos.ts:37-92` - Current constructor implementation

  **API/Type References**:
  - `src/config/data.type.ts` - ChronosInputType, ChronosSeparatedDataType (after Task 3)
  - `src/core/common/utils/merge.utils.ts` - deepMerge function (after Task 2)

  **External References**:
  - TypeScript docs: Type guards - `https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates`

  **WHY Each Reference Matters**:
  - `chronos.ts:37-92` shows exactly where to insert the detection/merge logic (line 37)
  - Must import deepMerge and new types

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # Type check passes
  npm run type-check
  # Expected: Exit code 0

  # Build succeeds
  npm run build
  # Expected: dist/chronos.js generated without errors

  # All tests still pass
  npm run test -- --run
  # Expected: All tests pass
  ```

  **Commit**: YES
  - Message: `feat(api): support separated business/style data input`
  - Files: `src/chronos.ts`
  - Pre-commit: `npm run test -- --run && npm run type-check`

---

- [ ] 5. Integration Verification

  **What to do**:
  - Verify old API works unchanged (type-check + build)
  - Create temporary test file to verify new API works at runtime
  - Verify TypeScript autocomplete works for both patterns
  - Clean up any temporary test files

  **Verification Steps**:
  1. Create `src/__tests__/api-integration.test.ts` with both API formats
  2. Test old format: `new Chronos(mockDiv, { timeline: {...} })`
  3. Test new format: `new Chronos(mockDiv, { business: {...}, style: {...} })`
  4. Verify merged data reaches components correctly

  **Test Cases**:
  ```typescript
  describe('Chronos API', () => {
    it('accepts legacy DataType format', () => {
      // Mock div element
      const div = document.createElement('div');
      // Should not throw
      expect(() => new Chronos(div, { 
        timeline: { initTime: '2024-01-01' } 
      })).not.toThrow();
    });

    it('accepts separated business/style format', () => {
      const div = document.createElement('div');
      expect(() => new Chronos(div, {
        business: { timeline: { initTime: '2024-01-01' } },
        style: { grid: { color: '#fff' } }
      })).not.toThrow();
    });

    it('merges business and style correctly', () => {
      // Test that style defaults are overridden by business values
    });
  });
  ```

  **Must NOT do**:
  - Do NOT modify demo files
  - Do NOT leave debug code in production files
  - Do NOT skip cleanup of temporary files

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Integration testing requires understanding full system
  - **Skills**: None required
    - Vitest and TypeScript knowledge sufficient
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (Wave 4 - final)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `src/chronos.ts` - Chronos class to instantiate
  - `demo/demo.ts` (if exists) - Example usage patterns

  **API/Type References**:
  - `src/config/data.type.ts` - All type definitions

  **WHY Each Reference Matters**:
  - Need to understand how Chronos is instantiated to write correct tests
  - Demo shows real-world usage patterns to verify

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # All tests pass including integration tests
  npm run test -- --run
  # Expected: All tests pass

  # Full build succeeds
  npm run build
  # Expected: dist/chronos.js, dist/chronos.cjs, dist/chronos.d.ts generated

  # Type check passes
  npm run type-check
  # Expected: Exit code 0
  ```

  **Evidence to Capture**:
  - [ ] Terminal output showing all tests pass
  - [ ] Build output showing all dist files generated

  **Commit**: YES
  - Message: `test(api): add integration tests for separated data API`
  - Files: `src/__tests__/api-integration.test.ts`
  - Pre-commit: `npm run test -- --run && npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `build(test): add vitest test infrastructure` | package.json, vite.config.ts | npm run test -- --run |
| 2 | `feat(util): add deepMerge utility for config object merging` | merge.utils.ts, merge.utils.test.ts | npm run test -- --run |
| 3 | `feat(types): add aggregate business/style types for separated API` | data.type.ts | npm run type-check |
| 4 | `feat(api): support separated business/style data input` | chronos.ts | npm run test && type-check |
| 5 | `test(api): add integration tests for separated data API` | api-integration.test.ts | npm run test && build |

---

## Success Criteria

### Verification Commands
```bash
# All tests pass
npm run test -- --run
# Expected: X tests passed, 0 failed

# Type check passes  
npm run type-check
# Expected: Exit code 0

# Build succeeds
npm run build
# Expected: dist/ contains chronos.js, chronos.cjs, chronos.d.ts

# Lint passes
npm run lint
# Expected: No errors (warnings acceptable)
```

### Final Checklist
- [ ] Old API `new Chronos(div, { timeline: {...} })` works unchanged
- [ ] New API `new Chronos(div, { business: {...}, style: {...} })` works correctly
- [ ] TypeScript autocomplete works for both `ChronosBusinessDataType` and `ChronosStyleDataType`
- [ ] Deep merge handles nested objects correctly
- [ ] Business data wins for conflicting keys
- [ ] Arrays are replaced, not merged
- [ ] All 21 config classes unchanged
- [ ] All component data classes unchanged
- [ ] All tests pass
- [ ] Build produces valid output
