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

## Publish Npm Lib
```
todo
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