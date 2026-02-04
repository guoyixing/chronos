# Chronos Plugin System (方案二)

## TL;DR

> **Quick Summary**: 为 Chronos 实现插件系统，支持生命周期钩子、组件注册、事件通信，同时保持向后兼容性。
> 
> **Deliverables**:
> - `src/plugin/plugin.interface.ts` - 插件接口定义
> - `src/plugin/manager.plugin.ts` - PluginManager 实现
> - 修改 `src/chronos.ts` - 集成插件系统
> - 修改 `src/config/data.type.ts` - 添加 ChronosOptions 类型
> - `src/__tests__/plugin.test.ts` - 单元测试
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6

---

## Context

### Original Request
用户要求实现 Chronos 插件系统（方案二），支持：
1. 生命周期钩子 (onInstall, onBeforeInit, onAfterInit, onAfterStart, onDestroy)
2. PluginContext API (context, container, registerComponent, on/emit, getPlugin, log)
3. ComponentRegistration 接口让插件注册自定义组件
4. PluginManager 管理插件注册和生命周期
5. 向后兼容（无 options = 当前行为）

### Interview Summary
**Key Discussions**:
- 分析了 chronos.ts 构造函数流程，确定了插件钩子插入点
- 研究了组件 triad 模式 (Data + Service + Component)
- 检查了 Inversify 绑定模式，包括事件监听器
- 审查了 EventManager 的自定义 pub/sub 系统

**Research Findings**:
- 现有组件模式: GridConfig 绑定 Data (toConstantValue), Service, Component, listeners
- EventManager 已支持 listen()/publish() 自定义 pub/sub
- 生命周期流程: Container → ContextConfig → Component configs → EventManager → init() → start()
- 插件组件使用 `Symbol.for(\`plugin:${name}:${type}\`)` 生成唯一 TYPES

### Metis Review
**Identified Gaps** (addressed):
1. **Destroy 生命周期未实现**: 当前 `Chronos.destroy()` 不调用 `LifecycleManager.destroy()` - 需要修复
2. **插件名称冲突**: 需要在 `onInstall` 时验证唯一性
3. **Container 访问范围**: PluginContext 不应暴露原始 container
4. **插件组件顺序**: 默认 order >= 1000，确保核心组件优先
5. **循环依赖检测**: 安装时检测并报错

---

## Work Objectives

### Core Objective
实现一个类型安全的插件系统，允许第三方通过生命周期钩子扩展 Chronos 功能，并可注册自定义组件。

### Concrete Deliverables
- `src/plugin/plugin.interface.ts` - ChronosPlugin, PluginContext, ComponentRegistration 接口
- `src/plugin/manager.plugin.ts` - PluginManager 类
- 修改 `src/chronos.ts` - 接受 options 参数，集成 PluginManager
- 修改 `src/config/data.type.ts` - 添加 ChronosOptions 类型导出
- `src/__tests__/plugin.test.ts` - 覆盖所有 5 个生命周期钩子的测试

### Definition of Done
- [ ] `npm run type-check` 通过
- [ ] `npm test -- --run` 所有测试通过
- [ ] `npm run lint` 无错误
- [ ] 现有 `api-integration.test.ts` 测试仍然通过（向后兼容）
- [ ] 插件可注册组件并在 stage 上渲染

### Must Have
- 所有 5 个生命周期钩子 (onInstall, onBeforeInit, onAfterInit, onAfterStart, onDestroy)
- PluginContext 提供 context, registerComponent, on/emit, getPlugin, log
- 插件错误不崩溃主应用（try-catch 包装）
- 向后兼容（无 options = 当前行为）
- 插件依赖解析（拓扑排序）
- 循环依赖检测

### Must NOT Have (Guardrails)
- ❌ 暴露原始 Inversify Container
- ❌ 支持运行时插件安装/卸载（V1 仅构造时）
- ❌ 异步钩子（V1 全部同步）
- ❌ 创建新的事件监听器接口（使用现有 StageDragListener 等）
- ❌ 添加 barrel exports (index.ts)
- ❌ 插件配置验证（仅名称唯一性检查）
- ❌ 插件版本兼容性强制（存储版本，不强制 semver）

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.
> This is NOT conditional — it applies to EVERY task, regardless of test strategy.

### Test Decision
- **Infrastructure exists**: YES (Vitest)
- **Automated tests**: YES (Tests-after)
- **Framework**: Vitest

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

> 每个任务 MUST 包含 Agent-Executed QA Scenarios。
> 执行代理将直接运行可交付成果并验证。

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **TypeScript 文件** | Bash (npm run type-check) | 编译无错误 |
| **单元测试** | Bash (npm test) | 所有测试通过 |
| **ESLint** | Bash (npm run lint) | 无错误 |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Fix Chronos.destroy() to call LifecycleManager.destroy()
└── Task 2: Create plugin interfaces (plugin.interface.ts)

Wave 2 (After Wave 1):
├── Task 3: Implement PluginManager (manager.plugin.ts)
└── Task 4: Add ChronosOptions to data.type.ts

Wave 3 (After Wave 2):
└── Task 5: Integrate PluginManager into chronos.ts

Wave 4 (After Wave 3):
└── Task 6: Create comprehensive unit tests

Critical Path: Task 1 → Task 3 → Task 5 → Task 6
Parallel Speedup: ~30% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 5 | 2 |
| 2 | None | 3 | 1 |
| 3 | 1, 2 | 5 | 4 |
| 4 | 2 | 5 | 3 |
| 5 | 3, 4 | 6 | None |
| 6 | 5 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | delegate_task(category="quick") |
| 2 | 3, 4 | delegate_task(category="unspecified-low") |
| 3 | 5 | delegate_task(category="unspecified-high") |
| 4 | 6 | delegate_task(category="unspecified-low") |

---

## TODOs

- [ ] 1. Fix Chronos.destroy() to call LifecycleManager.destroy()

  **What to do**:
  - 修改 `src/chronos.ts` 的 `destroy()` 方法
  - 在销毁 stage 之前，调用 `LifecycleManager.destroy()`
  - 需要存储 lifecycleManager 引用为类属性

  **Must NOT do**:
  - 不要改变现有 stage.destroy() 逻辑
  - 不要修改 LifecycleManager 类本身

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 单文件简单修改，<30 行代码变更
  - **Skills**: `[]`
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3, Task 5
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/chronos.ts:126-137` - 现有 destroy() 方法实现
  - `src/chronos.ts:126-128` - lifecycleManager 创建和使用模式

  **API/Type References**:
  - `src/core/lifecycle/manager.lifecycle.ts:54-58` - LifecycleManager.destroy() 方法签名

  **WHY Each Reference Matters**:
  - `chronos.ts:126-137`: 需要理解当前 destroy 实现，仅销毁 stage 但不调用组件 destroy
  - `manager.lifecycle.ts:54-58`: 确认 destroy() 方法存在且可调用

  **Acceptance Criteria**:

  - [ ] `src/chronos.ts` 添加 `lifecycleManager` 类属性
  - [ ] `destroy()` 方法先调用 `this.lifecycleManager.destroy()`
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm test -- --run` → 现有测试仍通过

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Type check passes after modification
    Tool: Bash
    Preconditions: File modified
    Steps:
      1. Run: npm run type-check
      2. Assert: Exit code is 0
      3. Assert: No error output
    Expected Result: TypeScript compilation succeeds
    Evidence: Terminal output captured

  Scenario: Existing tests still pass
    Tool: Bash
    Preconditions: File modified
    Steps:
      1. Run: npm test -- --run src/__tests__/api-integration.test.ts
      2. Assert: Exit code is 0
      3. Assert: Output contains "Tests passed" or similar
    Expected Result: Backward compatibility maintained
    Evidence: Test output captured
  ```

  **Commit**: YES
  - Message: `fix(core): call LifecycleManager.destroy() in Chronos.destroy()`
  - Files: `src/chronos.ts`
  - Pre-commit: `npm run type-check`

---

- [ ] 2. Create plugin interfaces (plugin.interface.ts)

  **What to do**:
  - 创建 `src/plugin/plugin.interface.ts`
  - 定义 `ChronosPlugin` 接口（name, version?, dependencies?, 5 个可选钩子）
  - 定义 `PluginContext` 接口（context, registerComponent, on, emit, getPlugin, log）
  - 定义 `ComponentRegistration` 接口（id, dataClass, serviceClass, componentClass, config?, listeners?）
  - 使用中文注释，英文标识符

  **Must NOT do**:
  - 不要添加实现逻辑（仅类型定义）
  - 不要暴露 Container 类型
  - 不要创建 index.ts barrel export

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 仅类型定义文件，无复杂逻辑
  - **Skills**: `[]`
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3, Task 4
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/core/lifecycle/lifecycle.ts:1-51` - Lifecycle 接口定义模式
  - `src/core/event/event.ts:1-63` - 事件接口定义模式

  **API/Type References**:
  - `src/core/context/context.ts:8-28` - Context 类定义
  - `src/component/component-data.interface.ts:7-20` - ComponentData 类
  - `src/component/component-service.interface.ts:4-10` - ComponentService 接口
  - `src/core/lifecycle/lifecycle.ts:4-6` - Lifecycle 接口

  **External References**:
  - 用户需求文档中的接口定义

  **WHY Each Reference Matters**:
  - `lifecycle.ts`: 学习项目中接口定义的注释和命名风格
  - `event.ts`: 学习事件类型的定义模式
  - `context.ts`: PluginContext 需要提供 Context 访问
  - `ComponentData/Service/Lifecycle`: ComponentRegistration 需要引用这些类型

  **Acceptance Criteria**:

  - [ ] 文件创建于 `src/plugin/plugin.interface.ts`
  - [ ] 导出 `ChronosPlugin` 接口
  - [ ] 导出 `PluginContext` 接口
  - [ ] 导出 `ComponentRegistration` 接口
  - [ ] 所有钩子方法标记为可选 (?)
  - [ ] 中文注释，英文标识符
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm run lint` → 无错误

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: TypeScript compilation succeeds
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Run: npm run type-check
      2. Assert: Exit code is 0
    Expected Result: No type errors
    Evidence: Terminal output

  Scenario: ESLint passes
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Run: npx eslint src/plugin/plugin.interface.ts
      2. Assert: Exit code is 0 or only warnings
    Expected Result: No lint errors
    Evidence: Lint output
  ```

  **Commit**: YES
  - Message: `feat(plugin): add plugin system interfaces`
  - Files: `src/plugin/plugin.interface.ts`
  - Pre-commit: `npm run type-check`

---

- [ ] 3. Implement PluginManager (manager.plugin.ts)

  **What to do**:
  - 创建 `src/plugin/manager.plugin.ts`
  - 实现 `PluginManager` 类：
    - 存储已注册插件的 Map
    - `install(plugin)` - 验证名称唯一性，拓扑排序依赖
    - `installAll(plugins)` - 批量安装
    - `invokeHook(hookName, ctx)` - try-catch 包装调用钩子
    - `createPluginContext(context, container)` - 创建 PluginContext 实例
    - `registerComponent(registration, container, context)` - 使用 Symbol.for 动态绑定组件
  - 循环依赖检测
  - 所有钩子调用 try-catch 包装，错误记录但不抛出

  **Must NOT do**:
  - 不要暴露原始 Container
  - 不要支持异步钩子
  - 不要超过 200 行代码

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 中等复杂度，需要理解 Inversify 和生命周期
  - **Skills**: `[]`
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1, Task 2

  **References**:

  **Pattern References**:
  - `src/config/grid.inversify.ts:14-28` - 组件绑定模式（Data/Service/Component/Listeners）
  - `src/core/event/manager.event.ts:46-58` - 错误处理模式（try-catch + console.error）
  - `src/core/lifecycle/manager.lifecycle.ts:36-48` - 生命周期管理模式

  **API/Type References**:
  - `src/plugin/plugin.interface.ts` - ChronosPlugin, PluginContext, ComponentRegistration 接口
  - `src/config/inversify.config.ts:148-163` - bindLifecycle, bindComponent 辅助函数
  - `src/core/context/context.ts:8-28` - Context 类

  **WHY Each Reference Matters**:
  - `grid.inversify.ts`: registerComponent 需要复制此绑定模式
  - `manager.event.ts:46-58`: 学习项目中的错误处理模式
  - `inversify.config.ts`: 使用 bindLifecycle/bindComponent 辅助函数

  **Acceptance Criteria**:

  - [ ] 文件创建于 `src/plugin/manager.plugin.ts`
  - [ ] 导出 `PluginManager` 类
  - [ ] `install()` 方法验证插件名称唯一性
  - [ ] `install()` 方法检测循环依赖
  - [ ] `invokeHook()` 方法使用 try-catch 包装
  - [ ] `registerComponent()` 使用 `Symbol.for(\`plugin:${pluginName}:${type}\`)` 生成 Symbol
  - [ ] `createPluginContext()` 不暴露原始 Container
  - [ ] 代码 < 200 行
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm run lint` → 无错误

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: TypeScript compilation succeeds
    Tool: Bash
    Preconditions: File created, dependencies exist
    Steps:
      1. Run: npm run type-check
      2. Assert: Exit code is 0
    Expected Result: No type errors
    Evidence: Terminal output

  Scenario: File size is reasonable
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Run: wc -l src/plugin/manager.plugin.ts
      2. Assert: Line count < 200
    Expected Result: Code is concise
    Evidence: Line count output
  ```

  **Commit**: YES
  - Message: `feat(plugin): implement PluginManager with lifecycle hooks`
  - Files: `src/plugin/manager.plugin.ts`
  - Pre-commit: `npm run type-check`

---

- [ ] 4. Add ChronosOptions to data.type.ts

  **What to do**:
  - 修改 `src/config/data.type.ts`
  - 添加 `ChronosOptions` 类型定义
  - 包含 `plugins?: ChronosPlugin[]` 属性
  - 导出类型

  **Must NOT do**:
  - 不要修改现有类型定义
  - 不要添加必需属性（全部可选）

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 单文件简单类型添加
  - **Skills**: `[]`
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: Task 5
  - **Blocked By**: Task 2 (需要 ChronosPlugin 类型)

  **References**:

  **Pattern References**:
  - `src/config/data.type.ts:197-210` - 现有类型定义模式

  **API/Type References**:
  - `src/plugin/plugin.interface.ts` - ChronosPlugin 接口

  **WHY Each Reference Matters**:
  - `data.type.ts:197-210`: 学习项目中类型导出的格式和注释风格

  **Acceptance Criteria**:

  - [ ] `ChronosOptions` 类型定义添加到 `data.type.ts`
  - [ ] 包含 `plugins?: ChronosPlugin[]` 属性
  - [ ] 类型已导出
  - [ ] 现有类型未被修改
  - [ ] `npm run type-check` → Exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Type check passes
    Tool: Bash
    Preconditions: File modified
    Steps:
      1. Run: npm run type-check
      2. Assert: Exit code is 0
    Expected Result: No type errors
    Evidence: Terminal output

  Scenario: Existing tests still pass
    Tool: Bash
    Preconditions: File modified
    Steps:
      1. Run: npm test -- --run src/__tests__/api-integration.test.ts
      2. Assert: Exit code is 0
    Expected Result: Backward compatibility maintained
    Evidence: Test output
  ```

  **Commit**: NO (groups with Task 5)

---

- [ ] 5. Integrate PluginManager into chronos.ts

  **What to do**:
  - 修改 `src/chronos.ts`
  - 添加可选第三参数 `options?: ChronosOptions`
  - 创建 PluginManager 实例
  - 在正确的生命周期点调用插件钩子：
    - `onInstall`: ContextConfig 后，组件 Config 前
    - `onBeforeInit`: EventManager 后，lifecycleManager.init() 前
    - `onAfterInit`: lifecycleManager.init() 后，start() 前
    - `onAfterStart`: lifecycleManager.start() 后
    - `onDestroy`: destroy() 方法中，lifecycleManager.destroy() 前
  - 向后兼容（无 options = 当前行为）

  **Must NOT do**:
  - 不要改变现有组件绑定顺序
  - 不要改变现有构造函数逻辑（仅添加）
  - 不要在没有 plugins 时创建 PluginManager

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 核心文件修改，需要精确的生命周期点集成
  - **Skills**: `[]`
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential)
  - **Blocks**: Task 6
  - **Blocked By**: Task 3, Task 4

  **References**:

  **Pattern References**:
  - `src/chronos.ts:69-129` - 现有构造函数流程
  - `src/chronos.ts:134-137` - 现有 destroy() 方法

  **API/Type References**:
  - `src/plugin/manager.plugin.ts` - PluginManager 类
  - `src/plugin/plugin.interface.ts` - PluginContext 接口
  - `src/config/data.type.ts` - ChronosOptions 类型

  **WHY Each Reference Matters**:
  - `chronos.ts:69-129`: 确定每个钩子的精确插入位置
  - `chronos.ts:134-137`: 确定 onDestroy 钩子位置

  **Acceptance Criteria**:

  - [ ] 构造函数签名变为 `constructor(rootHtml, input, options?)`
  - [ ] 无 options 时行为与之前完全相同
  - [ ] `onInstall` 在 ContextConfig 后调用
  - [ ] `onBeforeInit` 在 EventManager 后，init() 前调用
  - [ ] `onAfterInit` 在 init() 后，start() 前调用
  - [ ] `onAfterStart` 在 start() 后调用
  - [ ] `onDestroy` 在 destroy() 中调用
  - [ ] `npm run type-check` → Exit code 0
  - [ ] `npm test -- --run` → 所有现有测试通过

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Type check passes
    Tool: Bash
    Preconditions: All dependencies complete
    Steps:
      1. Run: npm run type-check
      2. Assert: Exit code is 0
    Expected Result: No type errors
    Evidence: Terminal output

  Scenario: Backward compatibility - existing tests pass
    Tool: Bash
    Preconditions: Integration complete
    Steps:
      1. Run: npm test -- --run src/__tests__/api-integration.test.ts
      2. Assert: Exit code is 0
      3. Assert: All tests pass
    Expected Result: No breaking changes
    Evidence: Test output

  Scenario: No options = no PluginManager overhead
    Tool: Bash
    Preconditions: Integration complete
    Steps:
      1. Grep for "options?.plugins" or similar conditional
      2. Assert: Plugin code only runs when plugins provided
    Expected Result: Zero overhead without plugins
    Evidence: Code inspection via grep
  ```

  **Commit**: YES
  - Message: `feat(plugin): integrate plugin system into Chronos constructor`
  - Files: `src/chronos.ts`, `src/config/data.type.ts`
  - Pre-commit: `npm run type-check && npm test -- --run`

---

- [ ] 6. Create comprehensive unit tests

  **What to do**:
  - 创建 `src/__tests__/plugin.test.ts`
  - 测试用例覆盖：
    - 插件生命周期钩子调用顺序
    - 插件名称唯一性验证
    - 循环依赖检测
    - 插件错误不崩溃主应用
    - PluginContext API (registerComponent, on/emit, getPlugin, log)
    - 插件组件注册和渲染
    - 依赖解析顺序
  - 使用 Vitest describe/it/expect
  - 中文注释

  **Must NOT do**:
  - 不要创建需要真实 DOM 的测试（使用 mock）
  - 不要创建需要人工验证的测试

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 测试编写，参考现有测试模式
  - **Skills**: `[]`
    - 无需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 5

  **References**:

  **Pattern References**:
  - `src/__tests__/api-integration.test.ts:1-278` - 现有测试模式

  **API/Type References**:
  - `src/plugin/plugin.interface.ts` - 所有插件接口
  - `src/plugin/manager.plugin.ts` - PluginManager 类

  **WHY Each Reference Matters**:
  - `api-integration.test.ts`: 学习项目测试结构、describe/it 组织、断言风格

  **Acceptance Criteria**:

  - [ ] 文件创建于 `src/__tests__/plugin.test.ts`
  - [ ] 覆盖 5 个生命周期钩子测试
  - [ ] 覆盖名称唯一性验证测试
  - [ ] 覆盖循环依赖检测测试
  - [ ] 覆盖错误隔离测试
  - [ ] 覆盖依赖解析顺序测试
  - [ ] `npm test -- --run src/__tests__/plugin.test.ts` → 所有测试通过
  - [ ] 测试覆盖 PluginContext.registerComponent

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: All plugin tests pass
    Tool: Bash
    Preconditions: Test file created
    Steps:
      1. Run: npm test -- --run src/__tests__/plugin.test.ts
      2. Assert: Exit code is 0
      3. Assert: Output shows all tests passed
    Expected Result: 100% tests pass
    Evidence: Test output with pass/fail summary

  Scenario: Full test suite passes
    Tool: Bash
    Preconditions: All implementation complete
    Steps:
      1. Run: npm test -- --run
      2. Assert: Exit code is 0
      3. Assert: Both api-integration and plugin tests pass
    Expected Result: No regressions
    Evidence: Complete test output
  ```

  **Commit**: YES
  - Message: `test(plugin): add comprehensive plugin system tests`
  - Files: `src/__tests__/plugin.test.ts`
  - Pre-commit: `npm test -- --run`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(core): call LifecycleManager.destroy() in Chronos.destroy()` | src/chronos.ts | npm run type-check |
| 2 | `feat(plugin): add plugin system interfaces` | src/plugin/plugin.interface.ts | npm run type-check |
| 3 | `feat(plugin): implement PluginManager with lifecycle hooks` | src/plugin/manager.plugin.ts | npm run type-check |
| 5 | `feat(plugin): integrate plugin system into Chronos constructor` | src/chronos.ts, src/config/data.type.ts | npm test -- --run |
| 6 | `test(plugin): add comprehensive plugin system tests` | src/__tests__/plugin.test.ts | npm test -- --run |

---

## Success Criteria

### Verification Commands
```bash
# Type check
npm run type-check
# Expected: Exit code 0

# All tests pass
npm test -- --run
# Expected: Exit code 0, all tests pass

# Lint check
npm run lint
# Expected: Exit code 0 or warnings only

# Backward compatibility
npm test -- --run src/__tests__/api-integration.test.ts
# Expected: All existing tests pass
```

### Final Checklist
- [ ] 所有 "Must Have" 功能实现
- [ ] 所有 "Must NOT Have" 约束遵守
- [ ] 所有测试通过
- [ ] 类型检查通过
- [ ] 向后兼容性验证
