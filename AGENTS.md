# CHRONOS KNOWLEDGE BASE

**Generated:** 2026-01-28
**Commit:** 6a4305c
**Branch:** master

## OVERVIEW

Gantt-like chart frontend plugin for project/resource management. Built with TypeScript, Konva.js (canvas rendering), and Inversify (DI).

## STRUCTURE

```
chronos/
├── src/                # Source code
│   ├── chronos.ts      # Library entry point - exports Chronos class
│   ├── config/         # Inversify DI configurations
│   ├── component/      # UI components (triad pattern)
│   ├── core/           # Shared context, events, lifecycle
│   └── debug/          # Debugger utilities
├── demo/               # Demo files for development
├── doc/                # Documentation with localized subdirs (zh_CN/)
└── index.html          # Demo page entry
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new component | `src/component/` | Follow triad pattern: `.component.ts`, `.data.ts`, `.service.ts` |
| Register component DI | `src/config/` | Create `{name}.inversify.ts`, update `chronos.ts` |
| Modify lifecycle | `src/core/lifecycle/` | Components implement `Lifecycle` interface |
| Add event listener | `src/core/event/` | Implement `StageDragListener` or `MouseMoveListener` |
| External callbacks | `src/core/event/callback/callback.ts` | User-facing event hooks |
| Data types for API | `src/config/data.type.ts` | Main configuration interface |

## ARCHITECTURE

### Component Triad Pattern
Every component has 3 files:
- `{name}.component.ts` - Extends `BaseComponent`, implements lifecycle
- `{name}.data.ts` - Extends `ComponentData`, holds state
- `{name}.service.ts` - Implements `ComponentService.draw()`

### Inversify DI Flow
1. Define symbols in `config/inversify.config.ts` (TYPES)
2. Create `{name}.inversify.ts` config class
3. Bind in `chronos.ts` constructor (order matters for lifecycle)
4. Use `@inject(TYPES.X)` in constructors

### Lifecycle Phases
```
init() → start() → destroy()
```
- `order()` controls execution sequence (lower = earlier)
- Components auto-register via `bindLifecycle()`

### Rendering
- Konva.js Stage → Layers → Shapes
- Each component gets own layer via `drawContext.applyLayer()`
- `service.draw()` called on `start()`

## CONVENTIONS

- **Language**: Chinese comments throughout codebase
- **File naming**: Kebab-case with dot separator (`node-entry.component.ts`)
- **DI symbols**: PascalCase prefixed with `Chronos` (`ChronosGridData`)
- **No barrel exports**: Use explicit imports (no `index.ts`)
- **Decorators**: `@injectable()` on all DI classes

## COMMANDS

```bash
npm run dev         # Vite dev server
npm run lint        # ESLint with auto-fix
npm run build       # Production build → dist/chronos.js
```

## NOTES

- `reflect-metadata` must be imported before Inversify usage
- Stage draggable by default; components listen via `StageDragListener`
- Demo code is in `demo/` directory (not unit tests)
