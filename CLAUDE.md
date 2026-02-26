# Workout Logger

A workout logging web application built with vanilla JavaScript, HTML, and CSS. The app allows users to log exercises, weights, and reps during a workout, with data persisted to IndexedDB.

## Technology Stack

- **Runtime**: Deno (no Node.js dependency)
- **Frontend**: Vanilla JavaScript (ES6 modules), native Web Components
- **Storage**: IndexedDB (via `db.js`)
- **Styling**: Custom CSS with OAT CSS framework
- **Testing**: Deno test framework + Playwright for E2E
- **No build step**: Direct execution of ES modules

---

## Development Commands

### Testing

**Fast unit tests** (pure JavaScript, no browser):
```bash
deno test test/fast/**
```
or:
```bash
make test
```

**Slow E2E tests** (Playwright, requires running server):
```bash
PAGE_URL=http://localhost:8000 deno test -A test/slow/automation.test.js
```
or:
```bash
make slow-test
```
Note: The default `PAGE_URL` in the Makefile is `http://127.0.0.1:5500`. Override as needed.

**CI tests** (starts dev server and runs slow tests):
```bash
make ci-test
```

**All tests** (fast + slow):
```bash
make everything-test
```

### Development Server

**Start the local server** (serves `src/` on port 8000):
```bash
deno run --allow-net --allow-read jsr:@std/http/file-server src/ --port 8000
```
or:
```bash
make serve
```

---

## Project Structure

```
src/
  assets/
    css/
      oat.min.css     # Third-party OAT CSS framework
      common.css      # Shared styles
      workout.css     # Workout-specific styles
    js/
      components/     # Web Components (custom elements)
        all-reps.js       - Reps input management (add/remove rep fields)
        exercise-input.js - Weight + reps input wrapper
        the-exercise.js   - Main exercise form component
        close-btn.js      - Close button component
        workout-start-time.js - Workout start timestamp
      core.js          # Pure serialization logic (exerciseToText, workoutToText)
      db.js            # IndexedDB persistence layer
      oat.min.js       # Third-party OAT library
      main.js       # UI event handling, connects components
  index.html          # Main entry point with templates

test/
  fast/
    unit.test.js      # Unit tests for serialization functions
  slow/
    automation.test.js # Playwright E2E tests (complete exercise flow)

Makefile              # Development command wrappers
```

---

## Architecture

### Design Patterns

1. **Event-driven communication**: Components communicate via DOM events:
   - `exercise:finish` - Dispatched when an exercise is completed
   - `db-save-confirmed` - Dispatched after exercise is saved to IndexedDB

2. **Web Components**: Custom elements (`the-exercise`, `all-reps`, `workout-start-time`, etc.) encapsulate UI logic and templates.

3. **Separation of concerns**:
   - `core.js` - Pure functions, no DOM access, handles text serialization
   - `main.js` - Glue layer, listens for events and updates UI
   - `db.js` - IndexedDB operations, listens for `exercise:finish` events

4. **Template-based rendering**: HTML `<template>` elements in `index.html` are cloned for component initialization.

### Data Flow

1. User fills exercise form (name, weight, reps, comment)
2. On form submission, `the-exercise` component creates data object and dispatches `exercise:finish` event
3. `main.js` listens and appends formatted text to temporary log textarea via `exerciseToText()`
4. `db.js` listens and saves exercise data to IndexedDB "exercises" object store
5. On "Finish Workout", the full workout is serialized via `workoutToText()`

### Key Modules

**`core.js`**:
- `exerciseToText(this, format)` - Formats an exercise object into string (single-line or multiline)
- `workoutToText(this, format)` - Formats a workout (array of exercises) into string

**`main.js`**:
- Listens for `exercise:finish` events
- Updates temporary log textarea

**`db.js`**:
- Opens IndexedDB database "WorkoutLogger" with "exercises" object store
- Listens for `exercise:finish` events and persists exercise data
- Dispatches `db-save-confirmed` with saved exercise ID

---

## Code Conventions

- **No semicolons** (use automatic semicolon insertion)
- **No unnecessary non-null checks**: Do not check if something is null or truthy, unless it is truly an "optional" piece of data, in a data structure. For example, don't check if(domElement) and then execute on it.
- **ES6 modules**: Use absolute imports from project root (e.g., `import './core.js'`)
- **Native DOM APIs**: No jQuery or frameworks
- **CustomElements**: Use standard Web Components API

---

## Notes

- **No linting** tools configured (no eslint, deno lint, etc.)
- **No build step** - ES modules run directly in browser
- **Slow tests require** `PAGE_URL` environment variable pointing to a running dev server
- **Permission flags**: E2E tests run with `-A` (all permissions) for Playwright browser automation

</content>