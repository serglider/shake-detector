import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import pkg from '../package.json';

export default [
    {
        input: 'src/index.ts',
        output: {
            name: 'ShakeDetector',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true,
        },
        plugins: [resolve(), commonjs(), typescript(), compiler()],
    },
    {
        input: 'src/index.ts',
        plugins: [typescript(), compiler()],
        output: [
            { file: pkg.main, format: 'cjs', exports: 'auto', sourcemap: true },
            { file: pkg.module, format: 'es', exports: 'auto', sourcemap: true },
        ],
    },
];

// create_source_map
