// vite.config.ts
import { defineConfig } from "file:///D:/work/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/chronos/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import dts from "file:///D:/work/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/chronos/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\work\\\u5F00\u6E90\u9879\u76EE\\chronos";
var vite_config_default = defineConfig({
  build: {
    lib: {
      name: "chronos",
      fileName: "chronos",
      entry: resolve(__vite_injected_original_dirname, "./src/main/chronos.ts")
    },
    outDir: resolve(__vite_injected_original_dirname, "dist"),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        globals: {
          packageName: "chronos",
          konva: "konva"
        }
      }
    }
  },
  optimizeDeps: {
    include: ["konva"],
    exclude: ["./index.html"]
  },
  plugins: [
    dts()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3JrXFxcXFx1NUYwMFx1NkU5MFx1OTg3OVx1NzZFRVxcXFxjaHJvbm9zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx3b3JrXFxcXFx1NUYwMFx1NkU5MFx1OTg3OVx1NzZFRVxcXFxjaHJvbm9zXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93b3JrLyVFNSVCQyU4MCVFNiVCQSU5MCVFOSVBMSVCOSVFNyU5QiVBRS9jaHJvbm9zL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBsaWI6IHtcclxuICAgICAgICAgICAgbmFtZTogJ2Nocm9ub3MnLFxyXG4gICAgICAgICAgICBmaWxlTmFtZTogJ2Nocm9ub3MnLFxyXG4gICAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9tYWluL2Nocm9ub3MudHMnKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG91dERpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0JyksXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IGZhbHNlLFxyXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6ICdjaHJvbm9zJyxcclxuICAgICAgICAgICAgICAgICAgICBrb252YTogJ2tvbnZhJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgICAgaW5jbHVkZTogWydrb252YSddLFxyXG4gICAgICAgIGV4Y2x1ZGU6IFsnLi9pbmRleC5odG1sJ11cclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgZHRzKCksXHJcbiAgICBdXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNSLFNBQVEsb0JBQW1CO0FBQ2pULFNBQVEsZUFBYztBQUN0QixPQUFPLFNBQVM7QUFGaEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsT0FBTztBQUFBLElBQ0gsS0FBSztBQUFBLE1BQ0QsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsT0FBTyxRQUFRLGtDQUFXLHVCQUF1QjtBQUFBLElBQ3JEO0FBQUEsSUFDQSxRQUFRLFFBQVEsa0NBQVcsTUFBTTtBQUFBLElBQ2pDLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLFNBQVM7QUFBQSxVQUNMLGFBQWE7QUFBQSxVQUNiLE9BQU87QUFBQSxRQUNYO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDVixTQUFTLENBQUMsT0FBTztBQUFBLElBQ2pCLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDNUI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLElBQUk7QUFBQSxFQUNSO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
