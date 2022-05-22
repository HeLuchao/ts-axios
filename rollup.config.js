"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rollup_plugin_node_resolve_1 = __importDefault(require("rollup-plugin-node-resolve"));
var rollup_plugin_commonjs_1 = __importDefault(require("rollup-plugin-commonjs"));
var rollup_plugin_sourcemaps_1 = __importDefault(require("rollup-plugin-sourcemaps"));
var lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
var rollup_plugin_typescript2_1 = __importDefault(require("rollup-plugin-typescript2"));
var rollup_plugin_json_1 = __importDefault(require("rollup-plugin-json"));
var pkg = require('./package.json');
var libraryName = '--libraryname--';
exports.default = {
    input: "src/" + libraryName + ".ts",
    output: [
        { file: pkg.main, name: lodash_camelcase_1.default(libraryName), format: 'umd', sourcemap: true },
        { file: pkg.module, format: 'es', sourcemap: true },
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
        include: 'src/**',
    },
    plugins: [
        // Allow json resolution
        rollup_plugin_json_1.default(),
        // Compile TypeScript files
        rollup_plugin_typescript2_1.default({ useTsconfigDeclarationDir: true }),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        rollup_plugin_commonjs_1.default(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        rollup_plugin_node_resolve_1.default(),
        // Resolve source maps to the original source
        rollup_plugin_sourcemaps_1.default(),
    ],
};
