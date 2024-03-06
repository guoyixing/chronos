## Install Project

```bash
npm install -g
```

## Compile TypeScript

```bash
npx tsc
```

## Watch TypeScript

```
npm run dev
```

## Verify Project

```
npm run lint
```

## Publish Npm Lib
```
todo
```

## Package Json
```
开发时依赖( devDependencies )           
vite                        开发调试运行时
vite-plugin-dts             构建插件
            
eslint                      代码检查工具
typescript                  ts语言

编译后依赖( dependencies )
konva                       canvas库
```

# 渲染器（ Renderer ）
```
1, 负责canvas层复杂操作
2, 管理用户行为事件 ( DomEventProvider ) ( keyword, click, mounse[x,y] )     
3, 提供最底层的画布  
4, 提供响应式最小单位
5, 控制整个窗口的大小,通知其余 canvas 重新渲染  
```

# 元数据,持久化,序列化,反序列化 ( metadata )
```
1, 通过网络传输恢复甘特图
2, 通过本地缓存恢复甘特图
```