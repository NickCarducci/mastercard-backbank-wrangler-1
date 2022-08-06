//import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
//import { spawnProcess } from 'rollup-plugin-spawn-process';
//imports work in build actions until publishing to cloudflare worker
//import { wasm } from '@rollup/plugin-wasm';
//import copy from 'rollup-plugin-copy'//EACCES: permission denied

export default {
  input: "src/shim.mjs",
	/*external: [
		//'path',
		'crypto',
		'@rollup/plugin-inject'
	],*/
  output: {
    //name: "default",
    //exports: 'auto',//named
    //strict: false,
    file: "dist/shim.mjs",
    format: "es",//umd
    //sourcemap: true
  },
  plugins: [
    /*copy({
      targets: [
        { src: 'src/iWAM.mjs', dest: 'src', rename: 'iwam.mjs' },
        { src: 'a.out.wasm', dest: '/', rename: 'backbank.wasm' }
      ]
    }),
    spawnProcess({ 
      command:"node src/iWAM.mjs",//"ln -s src/iWAM.mjs src/iWAM.mjs",
      file:"iWAM.mjs",
      args:[],
      key:"serviceService",
      global:".",
      events:[],
      setup:()=>{},
      cleaup:()=>console.log("see iWAM.js process in iwam.js"),
    }),*/
    nodePolyfills(),
    commonjs({
      /*
      depreciated, done automatically, not the problem!
      namedExports: {
        'node_modules/picomatch/index.js': ['pm']
      },*/
     //exclude: ["node_modules/**/*", "notes/**/*", "src/notes/**/*"],
     //include: "src/**/*",
    }),
    nodeResolve({
      exportConditions: ['browser', 'worker'],
      browser:true
    })
    //terser()
    //wasm()
  ]
};

/*
manualChunks: {
  'vendor': ['mastercard-locations', 'mastercard-places', 'cors']
},
inlineDynamicImports: true,
external: Object.keys(dependencies),
plugins: [cjs({exportType,nested: true}),
  nodePolyfills(),
  commonjs({transformMixedEsModules:true,include: 'node_modules/**'}),
  legacy({  'browserii.js': 'Window' }),
]
*/
