# CHRONOS KNOWLEDGE BASE

**Generated:** 2026-01-29
**Commit:** 6f95a75
**Branch:** vibe_coding

## OVERVIEW

Gantt-like chart frontend plugin for project/resource management. Built with TypeScript, Konva.js (canvas rendering), and Inversify (DI).

## STRUCTURE

```
chronos/
├── src/
│   ├── chronos.ts      # Library entry - exports Chronos class, binding order
│   ├── config/         # Inversify DI configurations (21 files)
│   ├── component/      # UI components - triad pattern (see AGENTS.md there)
│   └── core/           # Context, events, lifecycle, utilities
├── demo/               # Example usage with mock data (not tests)
├── doc/zh_CN/          # Chinese documentation
└── index.html          # Demo page entry
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add component | `src/component/{name}/` | Create 3 files: `.component.ts`, `.data.ts`, `.service.ts` |
| Register DI | `src/config/{name}.inversify.ts` | Then add to `chronos.ts` constructor |
| Add event listener | `src/core/event/event.ts` | Implement `StageDragListener`, `MouseMoveListener`, or `ResizeListener` |
| External callbacks | `src/core/event/callback/callback.ts` | User-facing event hooks |
| Public API types | `src/config/data.type.ts` | DataType interface |
| Lifecycle control | Component's `order()` method | Lower = earlier execution |

## ARCHITECTURE

### Component Triad (MANDATORY)
```
{feature}/
├── {feature}.component.ts   # Extends BaseComponent, implements Lifecycle
├── {feature}.data.ts        # Extends ComponentData, holds state + graphics
└── {feature}.service.ts     # Implements ComponentService.draw()
```

### DI Binding Order (in chronos.ts)
Order matters for lifecycle execution:
1. ContextConfig → 2. CallbackConfig → 3. WindowConfig → 4. GridConfig
→ 5. WatermarkConfig → 6. LaneConfig → 7. HolidayConfig → 8. ToolbarConfig
→ 9. ScaleConfig → 10. NodeTransformerConfig → 11. TimelineConfig → ...

### Event Listeners
Components can implement multiple listener interfaces:
- `StageDragListener.bindStageDragListener()` - Stage pan events
- `MouseMoveListener.bindMouseMoveListener()` - Cursor tracking
- `ResizeListener.resizeListen(width, height)` - Fullscreen/resize events

### Lifecycle
```
init() → start() → destroy()
```
- `order()` controls execution sequence
- Components auto-register via `bindLifecycle()`
- `service.draw()` called during `start()`

## CONVENTIONS

- **Comments**: Chinese throughout codebase
- **File naming**: `kebab-case.type.ts` (e.g., `node-entry.component.ts`)
- **DI symbols**: `Chronos{Feature}{Type}` (e.g., `ChronosGridData`)
- **No barrel exports**: Explicit imports only, no `index.ts`
- **Decorators**: `@injectable()` on all DI classes

## ANTI-PATTERNS

- Never use `as any`, `@ts-ignore`, `@ts-expect-error`
- Never skip the triad pattern (all 3 files required)
- Never render outside `service.draw()`
- Never create layers manually; use `applyLayer(name)`
- Never bind without adding to TYPES first
- Data must use `toConstantValue` (singleton per instance)
- Always destroy `graphics` before redraw

## COMMANDS

```bash
npm run dev         # Vite dev server
npm run lint        # ESLint with auto-fix
npm run build       # Production build → dist/chronos.js
npm run type-check  # TypeScript check (no emit)
```

## NOTES

- `reflect-metadata` must be imported before Inversify usage
- Stage draggable by default; components listen via `StageDragListener`
- No test suite; demo/ serves as integration examples
- Peer deps: konva, inversify, reflect-metadata (not bundled)
