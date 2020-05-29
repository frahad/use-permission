import path from 'path';
import url from '@rollup/plugin-url';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, 'src/index.ts');

export default {
  input: INPUT_FILE,
  output: [
    {
      file: path.resolve(PACKAGE_ROOT_PATH, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: path.resolve(PACKAGE_ROOT_PATH, 'dist/index.es.js'),
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    url(),
    resolve({
      extensions: ['.js', '.ts', '.tsx'],
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    typescript(),
    commonjs(),
  ],
};
