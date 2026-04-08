import { localDb } from './db/local-db.js'
import { demoDb } from './db/demo-db.js'

let selected = localDb // Default

// We only attempt to switch if process.env exists (Bun/Node builds)
const flavor = (typeof process !== 'undefined' && process.env.APP_FLAVOR)
    ? process.env.APP_FLAVOR
    : 'local'

switch (flavor) {
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
