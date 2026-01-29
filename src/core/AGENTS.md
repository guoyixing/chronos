# CORE MODULE

Cross-cutting concerns: context, events, lifecycle, shared utilities.

## STRUCTURE

```
core/
├── context/        # Application state containers
│   ├── context.ts      # Context class (ioc, drawContext, eventManager)
│   └── draw.context.ts # DrawContext (stage, layers, bounds)
├── event/          # Pub/sub event system
│   ├── event.ts        # Listener interfaces + EVENT_TYPES
│   ├── manager.event.ts # EventManager orchestration
│   └── callback/       # User-facing callback hooks
├── lifecycle/      # Component lifecycle management
│   ├── lifecycle.ts    # Lifecycle interface
│   └── manager.lifecycle.ts # LifecycleManager
└── common/         # Shared types and utils
    ├── type/       # ButtonType, ShadowType
    └── utils/      # date.utils.ts (betweenDays, betweenMs)
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Access IoC container | `context.ts` → `Context.ioc` |
| Manage Konva stage | `draw.context.ts` → `DrawContext` |
| Add event listener type | `event.ts` → Add interface + bind in TYPES |
| Subscribe to events | `manager.event.ts` → `listen()` |
| Control init order | Component's `order()` method |
| Date calculations | `common/utils/date.utils.ts` |

## EVENT LISTENER INTERFACES

```typescript
// In event.ts - components implement these
export interface StageDragListener {
  bindStageDragListener(): void  // Stage pan events
}

export interface MouseMoveListener {
  bindMouseMoveListener(): void  // Cursor tracking
}

export interface ResizeListener {
  resizeListen(width: number, height: number): void  // Fullscreen/resize
}
```

## KEY PATTERNS

### Context
```typescript
Context {
  ioc: Container           // Inversify container
  drawContext: DrawContext // Konva stage, layers
  eventManager: EventManager
}
```

### DrawContext
```typescript
DrawContext {
  stage: Konva.Stage       // Root canvas
  rootLayer: Konva.Layer   // Base layer
  isEdit: boolean          // Edit mode flag
  stageMoveLimit: {yTop, yBottom}  // Drag bounds
  applyLayer(name): Layer  // Get/create named layer
}
```

### Lifecycle
```typescript
interface Lifecycle {
  order(): number  // Lower = earlier execution
  init(): void     // Setup, apply layer
  start(): void    // Draw initial state
  destroy(): void  // Cleanup
}
```

## ANTI-PATTERNS

- Never access `stage` directly; use `drawContext` methods
- Never create layers manually; use `applyLayer(name)`
- Event callbacks must be error-handled (see `manager.event.ts`)
