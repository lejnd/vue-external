require('shelljs/global');
import vue from 'rollup-plugin-vue2';
import css from 'rollup-plugin-css-only';
import less from 'rollup-plugin-less';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

rm('-rf', 'dist');
mkdir('-p', 'dist');

export default {
    input: 'src/pack/index.js',
    output: {
        file:'dist/dist.js',
        format: 'iife', //保证能直接使用
        sourcemap: true
    },
    plugins: [
        vue(),
        less({
            output: './dist/dist.css'
        }),
        css(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        }),
        nodeResolve({
            browser: true,
            jsnext: true,
            main: true,
            // pass custom options to the resolve plugin
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        commonjs(),
        uglify(),
        replace({
          'process.env.NODE_ENV': JSON.stringify( 'production' )
        })
    ],
    external: ['vue', 'jquery']
}
