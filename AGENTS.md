# CHRONOS KNOWLEDGE BASE

**Generated:** 2026-02-03
**Branch:** vibe_coding

## OVERVIEW

Gantt-like chart frontend plugin for project/resource management. Built with TypeScript, Konva.js (canvas rendering), and Inversify (DI).

## COMMANDS

```bash
# Development
npm run dev           # Vite dev server (http://localhost:5173)
npm run type-check    # TypeScript check (no emit)
npm run lint          # ESLint with auto-fix
npm run build         # Production build → dist/chronos.js

# Testing (Vitest)
npm run test          # Watch mode
npm test -- --run     # Run all tests once
npm test -- --run src/core/common/utils/merge.utils.test.ts  # Single file
npm test -- --run -t "should merge flat objects"             # Single test by name
```

## PROJECT STRUCTURE

```
chronos/
├── src/
│   ├── chronos.ts          # Library entry, DI binding order
│   ├── config/             # Inversify DI configs (21 files)
│   ├── component/          # UI components - triad pattern
│   ├── core/               # Context, events, lifecycle, utils
│   └── __tests__/          # Integration tests
├── demo/                   # Example usage (not tests)
├── doc/zh_CN/              # Chinese documentation
└── index.html              # Demo page entry
```

## CODE STYLE

### Language & Comments
- **Comments**: Chinese (中文注释)
- **Conversation**: Chinese (对话使用中文)
- **Code/Variables**: English identifiers

### File Naming
- `kebab-case.type.ts` - e.g., `node-entry.component.ts`, `merge.utils.ts`
- Test files: `{name}.test.ts` (colocated or in `__tests__/`)

### Imports
```typescript
// Order: 1) reflect-metadata first 2) external 3) internal
import "reflect-metadata";              // MUST be first for Inversify
import {Container} from "inversify";    // External libraries
import {TYPES} from "./config/inversify.config";  // Internal absolute
import {Context} from "../../core/context/context"; // Internal relative

// No barrel exports (no index.ts) - use explicit imports
```

### TypeScript Conventions
```typescript
// Strict mode enabled (tsconfig.json)
// noUncheckedIndexedAccess: true - array/object access returns T | undefined

// DI decorators required
@injectable()
export class MyService { }

// Constructor injection
constructor(@inject(TYPES.MyData) data: MyData) { }

// Optional chaining preferred
this.data.graphics?.destroy()

// Nullish coalescing for defaults
const value = data?.color ?? '#EFEFEF';

// Explicit undefined checks (due to strict mode)
if (!pointerPosition) { return; }
```

### Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| DI Symbol | `Chronos{Feature}{Type}` | `ChronosGridData`, `ChronosGridService` |
| Class | PascalCase | `ChronosGridComponent` |
| Type alias | PascalCase + suffix | `ChronosGridDataType`, `ChronosGridBusinessType` |
| Interface | PascalCase | `ComponentService`, `Lifecycle` |
| Function | camelCase | `bindLifecycle()`, `deepMerge()` |
| Property | camelCase | `startOffSet`, `lrGapSize` |
| Constant | UPPER_SNAKE (symbols) | `TYPES.ChronosGridData` |

### Error Handling
```typescript
// Constructor validation
if (!rootHtml) {
    throw Error("div 还没有被渲染")  // Chinese error messages OK
}

// Guard clauses preferred
if (this._data.hide) { return; }
if (!pointerPosition) { return; }
```

## ARCHITECTURE

### Component Triad (MANDATORY)
Every visual component requires 3 files:

```
{feature}/
├── {feature}.component.ts   # Extends BaseComponent, implements Lifecycle
├── {feature}.data.ts        # Extends ComponentData, holds state + graphics
└── {feature}.service.ts     # Implements ComponentService.draw()
```

### Data Type Separation (Business vs Style)
```typescript
// Business: domain logic, IDs, data flags
export type ChronosGridBusinessType = {
    hide?: boolean  // visibility state
}

// Style: visual appearance
export type ChronosGridStyleType = {
    color?: string
    width?: number
}

// Combined (backward compatible)
export type ChronosGridDataType = ChronosGridBusinessType & ChronosGridStyleType
```

### DI Binding Pattern
```typescript
// In {feature}.inversify.ts
export class XxxConfig {
    constructor(container: Container, div: HTMLDivElement, data: DataType) {
        // 1. Data as singleton (toConstantValue)
        container.bind<XxxData>(TYPES.XxxData)
            .toConstantValue(new XxxData(context, data.xxx));
        // 2. Service
        container.bind<XxxService>(TYPES.XxxService).to(XxxService);
        // 3. Component
        container.bind<XxxComponent>(TYPES.XxxComponent).to(XxxComponent);
        // 4. Event listeners (if applicable)
        container.bind<StageDragListener>(TYPES.StageDragListener).to(XxxComponent);
        // 5. Register
        bindComponent(container, XxxComponent);
        bindLifecycle(container, XxxComponent);
    }
}
```

### Event Listeners
```typescript
// Components can implement multiple interfaces
implements StageDragListener  // Stage pan events
implements MouseMoveListener  // Cursor tracking  
implements ResizeListener     // Fullscreen/resize

// Methods
stageDragListen(): void
mouseMoveListen(): void
resizeListen(width: number, height: number): void
```

### Lifecycle
```
init() → start() → destroy()
```
- `order()` returns priority (lower = earlier)
- `service.draw()` called during `start()`

## ANTI-PATTERNS (NEVER DO)

| Violation | Reason |
|-----------|--------|
| `as any`, `@ts-ignore`, `@ts-expect-error` | Hides type errors |
| Skip triad pattern | Architecture violation |
| Render outside `service.draw()` | Lifecycle violation |
| Create layers manually | Use `applyLayer(name)` |
| Bind without TYPES symbol | DI will fail |
| Data without `toConstantValue` | Creates multiple instances |
| Forget `graphics?.destroy()` | Memory leak |
| Commit without request | Git discipline |

## ESLINT RULES

```json
{
  "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-non-null-assertion": "warn",
  "@typescript-eslint/prefer-optional-chain": "warn"
}
```

## TESTING

```typescript
// Vitest with describe/it/expect
import { describe, it, expect } from 'vitest';

describe('featureName', () => {
    it('should do something', () => {
        expect(result).toEqual(expected);
    });
});
```

## QUICK REFERENCE

| Task | Location |
|------|----------|
| Add component | `src/component/{name}/` (3 files) |
| Register DI | `src/config/{name}.inversify.ts` → `chronos.ts` |
| Add event listener | Implement interface in component |
| Public API types | `src/config/data.type.ts` |
| Lifecycle order | Component's `order()` method |
| External callbacks | `src/core/event/callback/callback.ts` |

## NOTES

- `reflect-metadata` MUST be imported before any Inversify usage
- Stage draggable by default; components listen via `StageDragListener`
- Peer deps: konva, inversify, reflect-metadata (not bundled)
- See subdirectory AGENTS.md files for module-specific guidance:
  - `src/component/AGENTS.md` - Component patterns
  - `src/component/node/AGENTS.md` - Node shapes
  - `src/config/AGENTS.md` - DI configuration
  - `src/core/AGENTS.md` - Core utilities
