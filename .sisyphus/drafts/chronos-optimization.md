# Draft: Chronos Optimization Plan

## Requirements (confirmed)
- Fix code quality issues (delete dead code, split large files)
- Improve type safety (replace `any`, fix non-null assertions)
- Optimize performance (throttling, destroy(), caching, incremental redraws)
- Decouple architecture (ViewportState, extended events, provider interfaces)
- Improve project configuration (scripts, eslint, tsconfig)

## Exclusions (confirmed)
- No documentation work
- No CI/CD setup
- No test infrastructure
- Keep comments in Chinese
- Maintain backward API compatibility

## Technical Decisions
- [confirmed] No test infrastructure exists, manual QA only
- [confirmed] Internal API breaking changes OK (only public Chronos API must stay stable)
- [confirmed] Full caching system with invalidation strategy (not just quick wins)
- [confirmed] ViewportState as simple injectable service (not triad pattern)

## Research Findings (verified 2026-01-29)
### Dead Code Files (confirmed all commented out)
- `src/component/node/board/node-brush.component.ts` - 228 lines, 100% commented
- `src/component/node/board/node-draw.component.ts` - 34 lines, 100% commented
- `src/debug/debugger.ts` - 94 lines, 100% commented

### Current Config State
- ESLint: `no-explicit-any: warn`, `no-non-null-assertion: off` (permissive)
- tsconfig: `strict: true`, but missing `noUncheckedIndexedAccess`
- package.json: missing `type-check`, `clean`, `prepublishOnly` scripts

### BaseComponent.destroy()
- Confirmed empty at line 79-81 in `component.interface.ts`
- All components inherit this empty implementation

### Event Manager
- No throttling on mousemove (line 59-73 in `manager.event.ts`)
- Uses `any` in callback signatures (lines 20, 26, 81, 95, 106)

## Open Questions
- [RESOLVED] All strategic questions answered via user interview

## Metis Review Findings (2026-01-29)
### Additional Guardrails Identified
- Demo imports internal types (`ChronosNodeEntryData`, `ChronosLaneEntryData`) - protect these
- Demo serves as de-facto integration test
- Must NOT add new npm dependencies
- Must NOT change Inversify binding order in chronos.ts
- Must NOT create barrel exports (index.ts)

### Missing Acceptance Criteria (addressed)
- Each phase needs: build success + demo smoke test
- Type safety: verify with `eslint --rule "@typescript-eslint/no-explicit-any: error"`
- Performance: 16ms (60fps) throttle threshold

### Edge Cases to Address
- Event listener cleanup (memory leaks if not removed in destroy)
- Konva shape references must be destroyed
- Lifecycle destroy() order matters (reverse of init order)

### Tool Recommendations
- Use `lsp_find_references` before modifying demo-exposed types
- Use `ast_grep_search` to find all `new Konva.*` for destroy audit

## Scope Boundaries
- INCLUDE: Code quality, type safety, performance, architecture, config
- EXCLUDE: Docs, CI/CD, tests
