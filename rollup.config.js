import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import localdev from "rollup-plugin-dev";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;

function typeCheck() {
    return {
        writeBundle() {
            require("child_process").spawn("svelte-check", {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true,
            });
        },
    };
}

function prettier() {
    return {
        writeBundle() {
            require("child_process").spawn("prettier -c ./src", {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true,
            });
        },
    };
}

export default {
    input: "src/main.ts",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "public/build/bundle.js",
    },
    plugins: [
        // typeCheck(),
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
        }),
        prettier(),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({ output: "bundle.css" }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        !production &&
            localdev({
                dirs: ["public"],
                host: "localhost",
                port: 5000,
                proxy: {
                    "/api/*": [
                        "localhost:8000",
                        { proxyReqPathResolver: (ctx) => ctx.url },
                    ],
                },
            }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        // !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload("public"),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
};
