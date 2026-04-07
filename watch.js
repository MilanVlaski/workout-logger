import { watch } from "fs"
import { execSync } from "child_process"

// Get destination from command line: bun watch.js dist/pro
const dest = Bun.argv[2]

if (!dest) {
    console.error("Error: No destination directory provided.")
    process.exit(1)
}

console.log(`Watching ./src for changes -> Syncing to ${dest}`)

let timeout
watch("./src", { recursive: true }, (event, filename) => {
    // Ignore JS (handled by Bun build --watch) and temp files
    if (!filename || filename.includes("assets/js") || filename.startsWith(".")) {
        return
    }

    // Debounce the rsync to prevent process spam
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        try {
            console.log(`File changed: ${filename}. Syncing...`)
            execSync(`rsync -av --exclude='assets/js' src/ ${dest}`)
        } catch (err) {
            console.error("Rsync failed:", err.message)
        }
    }, 100) // 100ms buffer
})
