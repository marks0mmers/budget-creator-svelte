import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from "svelte-preprocess/dist/autoProcess.js";
import { spawn } from "child_process";

const typeCheck = () => {
  return {
    name: "type-check",
    buildStart() {
      console.log("type-check");
      spawn("svelte-check", {
        stdio: ["ignore", "inherit"],
        shell: true,
      });
    },
  };
};

const prettier = () => {
  return {
    name: "prettier",
    buildStart() {
      console.log("prettier");
      spawn("prettier -c ./src", {
        stdio: ["ignore", "inherit"],
        shell: true,
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    typeCheck(),
    svelte({
      preprocess: sveltePreprocess({sourceMap: true}),
    }),
    prettier(),
  ],
  server: {
    proxy: {
      "^/api/.*": {
        target: "http://localhost:8000",
        secure: false,
      }
    },
    cors: {
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  }

})
