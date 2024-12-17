import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import gltf from "vite-plugin-gltf";
import { textureResize } from "@gltf-transform/functions";
import glsl from 'vite-plugin-glsl';
// import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    svelte(),
    tsconfigPaths(),
    glsl(),
    gltf({
      transforms: [textureResize({ size: [1024, 1024] })],
    }),
  ],
});
