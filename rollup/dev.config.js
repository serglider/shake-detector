import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import pkg from '../package.json';

export default [
    {
        input: 'src/index.ts',
        output: {
            name: 'ShakeMonitor',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true,
        },
        plugins: [resolve(), commonjs(), typescript()],
    },
    {
        input: 'src/index.ts',
        plugins: [typescript()],
        output: [
            { file: pkg.main, format: 'cjs', exports: 'auto', sourcemap: true },
            { file: pkg.module, format: 'es', exports: 'auto', sourcemap: true },
        ],
    },
];
