import {defineConfig} from 'vite';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            name: 'chronos',
            fileName: (format) => `chronos.${format === 'es' ? 'js' : 'cjs'}`,
            entry: resolve(__dirname, './src/chronos.ts'),
            formats: ['es', 'cjs']
        },
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            external: ['konva', 'inversify', 'reflect-metadata'],
            output: {
                globals: {
                    konva: 'Konva',
                    inversify: 'inversify',
                    'reflect-metadata': 'Reflect'
                }
            },
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ]
});
