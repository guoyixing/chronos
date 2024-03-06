import {defineConfig} from 'vite';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            name: 'chronos',
            fileName: 'chronos',
            entry: resolve(__dirname, './src/main/chronos.ts'),
        },
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: false,
        rollupOptions: {
            output: {
                globals: {
                    packageName: 'chronos',
                    konva: 'konva'
                }
            },
        },
    },
    optimizeDeps: {
        include: ['konva'],
        exclude: ['./index.html']
    },
    plugins: [
        dts(),
    ]
});
