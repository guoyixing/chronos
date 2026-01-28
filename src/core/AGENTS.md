# CORE MODULE

Cross-cutting concerns: context, events, lifecycle, shared utilities.

## STRUCTURE

```
core/
├── context/        # Application state containers
├── event/          # Pub/sub event system
├── lifecycle/      # Component lifecycle management
└── common/         # Shared types and utils
    ├── type/       # ButtonType, ShadowType
    └── utils/      # Date utilities
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Access IoC container | `context.ts` → `Context.ioc` |
| Manage Konva stage | `draw.context.ts` → `DrawContext` |
| Add new event type | `event.ts` → Add to `EVENT_TYPES` |
| Subscribe to events | `manager.event.ts` → `listen()` |
| Control init order | Component's `order()` method |

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
}
```

### Event System
- Symbol-based event IDs (`EVENT_TYPES`)
- `EventManager.listen(publisher, event, callback)`
- `EventManager.publish(publisher, event, data)`
- Built-in: `StageDragListener`, `MouseMoveListener`

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
