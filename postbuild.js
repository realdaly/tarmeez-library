const fs = require("fs")

// Ensure dist directory exists
if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist")
}

try {
    // Copy types
    fs.copyFileSync("src/index.d.ts", "dist/index.d.ts")
    fs.copyFileSync("src/react.d.ts", "dist/react.d.ts")

    // Create duplicate declarations for commonjs (.d.cts) to prevent resolution bugs
    fs.copyFileSync("src/index.d.ts", "dist/index.d.cts")
    fs.copyFileSync("src/react.d.ts", "dist/react.d.cts")

    // Copy CSS file
    fs.copyFileSync("src/tarmeez-library.css", "dist/tarmeez-library.css")

    console.log("Successfully copied assets and TypeScript declaration files to /dist!")
} catch (err) {
    console.error("Postbuild copy failed:", err)
    process.exit(1)
}
