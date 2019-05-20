import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/router.js',
      format: 'umd',
      name: 'Router',
      sourcemap: true,
      sourcemapFile: 'dist/router.js.map'
    },
    {
      file: 'dist/router.mjs',
      format: 'esm',
      name: 'Router',
      sourcemap: true,
      sourcemapFile: 'dist/router.mjs.map'
    }
  ],
  plugins:
    [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
      minify({
        mangle: { topLevel: true },
        comments: false
      })
    ]
}
