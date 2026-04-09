import { localDb } from './db/local-db.js'
import { demoDb } from './db/demo-db.js'

let selected

// We only attempt to switch if process.env exists (Bun/Node builds)
let profile = 'local'
try {
    profile = APP_PROFILE
} catch (_) {}

console.log(`My profile: ${profile}`)

switch (profile) {
    case 'local':
        selected = localDb
        break
    case 'demo':
        selected = demoDb
        break
    default:
        selected = localDb
}

export const database = selected
export const db = selected.db
