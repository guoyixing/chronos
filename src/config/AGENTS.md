# CONFIG MODULE

Inversify DI container configuration. Hub for all component bindings.

## STRUCTURE

```
config/
├── inversify.config.ts    # TYPES symbols + helper functions
├── data.type.ts           # Public API data interface (DataType)
├── context.inversify.ts   # Context bindings
├── callback.inversify.ts  # User callback bindings
├── fullscreen.inversify.ts # Fullscreen component config
└── {component}.inversify.ts  # Per-component DI config (18 files)
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add new TYPES symbol | `inversify.config.ts` |
| Define public config | `data.type.ts` (DataType) |
| Bind new component | Create `{name}.inversify.ts` |
| Bind event listener | Add `chronosContainer.bind<ListenerType>(TYPES.Listener).to(Component)` |

## DI BINDING PATTERN

Each component needs a config class:

```typescript
export class XxxConfig {
  constructor(
    chronosContainer: Container,
    divElement: HTMLDivElement,
    data: DataType
  ) {
    // 1. Bind Data (toConstantValue - singleton)
    chronosContainer.bind<ChronosXxxData>(TYPES.ChronosXxxData)
      .toConstantValue(new ChronosXxxData(
        chronosContainer.get<Context>(TYPES.Context),
        data.xxx
      ));
    
    // 2. Bind Service
    chronosContainer.bind<ChronosXxxService>(TYPES.ChronosXxxService)
      .to(ChronosXxxService);
    
    // 3. Bind Component
    chronosContainer.bind<ChronosXxxComponent>(TYPES.ChronosXxxComponent)
      .to(ChronosXxxComponent);
    
    // 4. Bind event listeners (if applicable)
    chronosContainer.bind<StageDragListener>(TYPES.StageDragListener)
      .to(ChronosXxxComponent);
    chronosContainer.bind<ResizeListener>(TYPES.ResizeListener)
      .to(ChronosXxxComponent);
    
    // 5. Register as component + lifecycle
    bindComponent(chronosContainer, ChronosXxxComponent);
    bindLifecycle(chronosContainer, ChronosXxxComponent);
  }
}
```

## HELPER FUNCTIONS

```typescript
bindComponent(container, ComponentClass)  // Registers for iteration
bindLifecycle(container, ComponentClass)  // Registers for init/start/destroy
```

## TYPES SYMBOL NAMING

Pattern: `Chronos{Feature}{Type}`

```typescript
TYPES = {
  ChronosXxxData: Symbol.for("ChronosXxxData"),
  ChronosXxxService: Symbol.for("ChronosXxxService"),
  ChronosXxxComponent: Symbol.for("ChronosXxxComponent"),
  // Event listeners
  StageDragListener: Symbol.for("StageDragListener"),
  MouseMoveListener: Symbol.for("MouseMoveListener"),
  ResizeListener: Symbol.for("ResizeListener"),
}
```

## BINDING ORDER

In `chronos.ts`, binding order determines lifecycle order:
1. ContextConfig (first - provides Context)
2. CallbackConfig (user hooks)
3. WindowConfig (container)
4. GridConfig, WatermarkConfig (background)
5. LaneConfig, HolidayConfig (structure)
6. ToolbarConfig, ScaleConfig (controls)
7. NodeTransformerConfig, TimelineConfig (content)
8. NodeConfig, NodeDetailConfig (nodes)
9. ReviseConfig, DisplayConfig (overlays)
10. FullscreenConfig (last - toggles others)

## ANTI-PATTERNS

- Never bind without adding to TYPES first
- Never skip `bindLifecycle` for visual components
- Data must use `toConstantValue` (singleton per instance)
- Never forget to bind listener interfaces for event-responding components
