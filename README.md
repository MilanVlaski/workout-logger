# Workout Logger

A workout logging web application.

## How to Run & Build

The project uses a `Makefile` to manage different build flavors (`demo`, `local`, `cloud`, `dev`).

### Core Commands

| Operation | Command | Description |
| :--- | :--- | :--- |
| **Build** | `make <flavor>-build` | Compiles the specific flavor into `dist/<flavor>/` using `bun build`. |
| **Run** | `make <flavor>-run` | Starts a watch-mode development server at `dist/<flavor>/` for the specified flavor. |

Replace `<flavor>` with `demo`, `local`, `cloud`, or `dev`.

### Requirements
- **Bun**: Required runtime and build tool.
- **System**: `make`, `rsync`, and `bash`.
- **BrowserSync**: Used in `run` tasks for live reloading.

### Workflow Notes
- **Build**: Syncs assets/manifests and bundles the flavor-specific entry point (`src/assets/js/index-<flavor>.js`).
- **Run**: Watches for file changes, rebuilds the bundle, and refreshes the browser. Service workers (`sw.js`) are excluded during `run` tasks to simplify debugging.

To prevent service worker cache during development:
- **Update on Reload** (DevTools): In Chrome/Edge, go to **Application > Service Workers** and check "Update on reload".
- **Bypass for network**: In the **Application** tab, check "Bypass for network" to disable SW fetch interception.

Note that `make <flavor>-run` commands do not include a service worker file, in order not to interfere with debugging.
