# Draft: Business/Style Data Separation

## Requirements (confirmed)
- Separate business data from style data in 17+ component data classes
- Keep backward compatibility for external API (DataType)
- Enable future theming capabilities
- Minimize breaking changes to service/component code

## Research Findings

### Current Architecture
- 21 data files found in `src/component/**/*.data.ts`
- Pattern: `ChronosXxxDataType` (external input) + `ChronosXxxData` class (internal state)
- Constructor uses `??` for merging user input with defaults
- DI binds data as `toConstantValue` singletons with Context

### Property Classification (from analysis)
**Business Data**: id, name, type, startTime, finishTime, laneId, row, rowNum, extendField, nodeGroup, entry arrays
**Style Data**: colors (*Color, backgroundColor), fonts (fontSize, fontFamily), margins (*Margin), borders, radius, shadow, button configs
**Layout/Position**: startOffSet, width, height, coordinate - AMBIGUOUS (could be either)
**Visibility**: hide, hidden flags - AMBIGUOUS (could be either)

### Codebase Patterns
- Uses Chinese comments throughout
- No barrel exports (explicit imports)
- Triad pattern: .component.ts, .data.ts, .service.ts
- Services access data via DI injection

### Research: Best Practices
1. **Intersection Types**: Combine BusinessData & StyleData for backward-compatible merged type
2. **Factory Pattern**: Deep merge for nested objects like shadow, button
3. **Theme Context**: Central style provider (similar to MUI/Chakra)
4. **Deprecation Strategy**: Mark old flat API as deprecated, provide migration path

## Technical Decisions
- (pending) Separation strategy: inline split vs theme context?
- (pending) Layout properties (width, height, startOffSet) - business or style?
- (pending) Visibility flags (hide, hidden) - business or style?

## Open Questions
1. Should we create a centralized theme/style context, or keep styles inline per component?
2. How to handle layout properties (width, height, position)?
3. Should visibility flags be considered business or style?
4. Do you want to maintain the flat merged type for backward compatibility, or deprecate it?

## Scope Boundaries
- INCLUDE: All 17+ data files, inversify configs, data.type.ts
- EXCLUDE: Services (only accessor patterns may need updates)
- EXCLUDE: Components (unchanged - DI handles injection)
