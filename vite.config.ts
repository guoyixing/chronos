import {defineConfig} from 'vite';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            name: 'package-name',
            fileName: 'package-name',
            entry: resolve(__dirname, './src/application.ts')
        },
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: false,
        rollupOptions: {
            output: {
                globals: {
                    packageName: 'packageName',
                    konva: 'konva'
                }
            }
        }
    },
    optimizeDeps: {
        include: ['konva'],
        exclude: ['./index.html']
    },
    plugins: [
        dts(),
    ]
});
