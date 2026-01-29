# NODE MODULE

Task node components - most complex feature with deep nesting.

## STRUCTURE

```
node/
├── board/              # Node drawing/brushing mode
│   └── shape/          # Shape implementations
│       ├── rect-node-shape.ts   # Rectangle nodes
│       ├── star-node-shape.ts   # Star nodes
│       └── arrow-node-shape.ts  # Arrow/dependency nodes
└── operate/            # Node interaction handlers
    ├── bar/            # Navigation bar (prev/next node)
    ├── detail/         # Node detail popup on hover
    ├── entry/          # Individual node lifecycle (largest: 422 lines)
    ├── group/          # Node container management
    └── transformer/    # Resize/move handles (371 lines)
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Custom node shape | `board/shape/` - extend existing or create new |
| Node click/drag events | `operate/entry/node-entry.service.ts` |
| Resize handles | `operate/transformer/` |
| Node navigation | `operate/bar/` |
| Node popup details | `operate/detail/` |

## COMPLEXITY HOTSPOTS

### node-entry.service.ts (422 lines)
- Full node lifecycle: draw/reDraw/clear
- Event handling: click, dblclick, drag, mouseover
- Coordinate sync with lanes/timeline
- Injects 9+ components for coordination

### node-transformer.service.ts (371 lines)
- Left/right drag handles with time tooltips
- Bounds enforcement (min width)
- Real-time resize via transform()
- Follow listeners for node/lane movements

## PATTERNS

**Board vs Operate**: Board handles drawing shapes, Operate handles user interactions.

**Shape Extension**: To add new node shape:
1. Create `{name}-node-shape.ts` in `board/shape/`
2. Implement shape drawing with Konva primitives
3. Register in node configuration

**Event Coordination**: Node components use follow/clearFollow patterns to maintain relationships during drags:
```typescript
// In service
this._data.bindFollow("lane-group", () => this.updatePosition())
this._data.clearFollow("lane-group")
```

## ANTI-PATTERNS

- Never modify node coordinates without updating timeline sync
- Never skip follow cleanup in destroy()
- Always check edit mode before enabling interactions
