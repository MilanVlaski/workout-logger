// watch.js
import { watch } from "fs"
import { execSync } from "child_process"

console.log("Watching src for changes...")

watch("./src", { recursive: true }, (event, filename) => {
    if (filename && !filename.includes("assets/js")) {
        console.log(`File changed: ${filename}. Syncing...`)
        execSync("rsync -av --exclude='assets/js' src/ dist/demo")
    }
})
