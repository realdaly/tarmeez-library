import { defineConfig } from "tsup"

export default defineConfig({
    entry: {
        index: "src/index.js",
        react: "src/react.jsx"
    },
    format: ["cjs", "esm"],
    external: ["react", "react-dom"],
    clean: true,
    minify: true,
    sourcemap: true,
    target: "es2020",
    dts: false // Manual declaration files copy is handled by postbuild.js
})
