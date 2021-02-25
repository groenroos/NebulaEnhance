'use strict';

import 'rollup';
import scss from 'rollup-plugin-scss';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import presetEnv from 'postcss-preset-env';
import glob from 'glob';
import path from 'path';

console.info(`Build mode ${process.env.BUILD ? 'on' : 'off'}`);
const w = process.env.ROLLUP_WATCH ? {
        clearScreen: false,
    } : false;
export default glob.sync('src/**/*.@(sa|sc|c)ss', { ignore: [ 'src/**/_*.@(sa|sc|c)ss' ] }).map(e => {
    const d = e.replace(/(^|\/)src\//, '$1extension-dist/').replace(/.(sa|sc|c)ss$/, '.css');
    // Report destination paths on console
    console.info(`\u001b[36m\[Rollup build\]\u001b[97m Converting (sa|sc|c)ss from ${e} to css, exporting to: ${d}`);
    return {
        input: e,
        output: {
            file: `${d}.tmp`,
        },
        plugins: [
            scss({
                output: d,
                outFile: d,
                outputStyle: process.env.BUILD ? 'compressed' : 'expanded',
                sourceMap: process.env.BUILD ? null : `${d}.map`,
                sass: require('sass'),
                processor: _ => postcss([autoprefixer(), presetEnv()]),
                watch: process.env.ROLLUP_WATCH ? glob.sync(`${path.dirname(e)}/**/*.@(sa|sc|c)ss`) : false,
            }),
            remove(),
        ],
        onwarn: (warning, warn) => {
            if (warning.code === 'EMPTY_BUNDLE') return; // intentionally empty
            warn(warning);
        },
        watch: w
    };
});

function remove() {
    return {
        generateBundle(_, bundle, isWrite) {
            if (!isWrite)
                return;
            for (const prop in bundle) {
                if (bundle[prop].code === '\n')
                    delete bundle[prop];
            }
        }
    };
}