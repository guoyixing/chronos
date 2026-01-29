# COMPONENT MODULE

UI components following the triad pattern. Each feature is self-contained.

## STRUCTURE

```
component/
├── component.interface.ts      # BaseComponent abstract class
├── component-data.interface.ts # ComponentData base class  
├── component-service.interface.ts # ComponentService interface
├── fullscreen/  # Fullscreen toggle with ResizeListener dispatch
├── window/      # Main container window
├── grid/        # Background grid lines
├── toolbar/     # Tool buttons (plugins register here)
├── timeline/    # Time axis with jump feature
├── scale/       # Zoom controls
├── lane/        # Swim lanes (group/entry/display)
├── node/        # Task nodes (board/operate subdirs) - see AGENTS.md there
├── revise/      # Edit dialogs (node/lane)
├── holiday/     # Holiday markers
└── watermark/   # Watermark overlay
```

## TRIAD PATTERN (MANDATORY)

Every component requires 3 files:

```
{feature}/
├── {feature}.component.ts   # Extends BaseComponent, implements Lifecycle
├── {feature}.data.ts        # Extends ComponentData, holds state + graphics
└── {feature}.service.ts     # Implements ComponentService, has draw()
```

### Component Class
```typescript
@injectable()
export class ChronosXxxComponent 
  extends BaseComponent<ChronosXxxData, ChronosXxxService>
  implements Lifecycle {
  
  name = () => "xxx"          // Layer name
  order(): number { return 0 } // Lifecycle priority
  
  constructor(
    @inject(TYPES.ChronosXxxData) data: ChronosXxxData,
    @inject(TYPES.ChronosXxxService) service: ChronosXxxService
  ) { super(data, service) }
}
```

### Data Class
```typescript
export class ChronosXxxData extends ComponentData {
  graphics?: Konva.Group  // Rendered shapes (destroy on redraw)
  // ... component-specific state
}
```

### Service Class
```typescript
@injectable()
export class ChronosXxxService implements ComponentService {
  constructor(@inject(TYPES.ChronosXxxData) private data: ChronosXxxData) {}
  
  draw(): void {
    // Render to this.data.layer
  }
}
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add toolbar button | Implement `ToolbarPlugRegister` interface |
| Custom node shape | `node/board/shape/` - implement `NodeShape` |
| Lane operations | `lane/entry/` for items, `lane/group/` for container |
| Node transforms | `node/operate/transformer/` |
| Respond to resize | Implement `ResizeListener.resizeListen(width, height)` |

## EVENT LISTENER INTERFACES

Components can implement to respond to global events:
```typescript
implements StageDragListener  // Stage pan/drag
implements MouseMoveListener  // Cursor position
implements ResizeListener     // Fullscreen/window resize
```

Bind in inversify config: `chronosContainer.bind<ResizeListener>(TYPES.ResizeListener).to(Component)`

## ANTI-PATTERNS

- Never skip the triad; all 3 files required
- Never render outside `service.draw()`
- Always destroy `graphics` before redraw
- Always use layer from `data.layer`, not `rootLayer`
