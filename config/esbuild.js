/* eslint-disable no-console */
import 'dotenv/config';
import esbuild from 'esbuild';

const entryPoints = [
    'src/sw.js',
    'src/scripts/scrapCandidates.js',
    'src/scripts/scrapProfiles.js'
];

//eslint-disable-next-line no-undef
const { DEPLOYMENT } = process.env;

esbuild.build({
    entryPoints: entryPoints,
    watch: DEPLOYMENT === 'DEV',
    bundle: true,
    outdir: 'dist',
    // target: 'chrome',
    minify: !(DEPLOYMENT === 'DEV'),
    allowOverwrite: true,
    logLevel: DEPLOYMENT === 'DEV' ? 'debug' : 'silent'
})
    .then(response => console.log(JSON.stringify(response)))
    .catch(err => console.log(err));