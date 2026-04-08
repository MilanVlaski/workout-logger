- [x] Use oat.ink to restyle everything ~~Make textarea look the same as the input?~~
- [x] Add 11ty as passthrough copy
- [x] Make index.html a .webc layout file
- [x] Define each of my web components as a .webc file (pretty trivial)\
- [x] Currently, the code either clones <template>s, in the very .html file, or it uses innerHTML as a string.Use webc from 11ty, to create <template> to clone in the component itself, and instead of innerHTML, also use a cloneable template, invoked in the render() method. ~~Switch to fragment cloning~~
- [x] Add reset icon to the right of buttons, in case users mistype
- [x] Add x buttons to the top-right of the current exercise "elements", when they're appended.
- [x] Date must come from today.
- [x] Disable "Remove reps" while there is only one reps input
  - [x] Install deno
  - [x] Add test (runs unit tests by default) with Deno
  - [x] The functions to test are just "formatting" json to text. No need for parsing.
  - [x] Move app to src folder
- [x] Export workout log as CSV
- [x] Then make a "failing test case" that spans both pages. Console log "test fail".
- [x] Test Data generator function:
  - [x] For each date, from now, going back X days each, at random times of the day, given an array of exercise names, for X exercises, each exercise having 0-1 changes of weight, 1-4 sets, 5-30 reps, and an optional comment between 1 and 5 words.
- [x] Singleline, multiline switcher. (Preferences has multiline as default, and it gets loaded into app)
- [x] Use data-action="" instead of attaching listeners by id
- [x] refactor: Use name instead of exerciseName
- [x] Make tests actually pass
- [x] Make exercise-inputs reusable component
- [x] Create test for the edit feature
  - [x] Append to the first test
  - [x] User clicks on the pre
  - [x] They edit the exercise name input
  - [x] They "finish editing"
  - [x] We verify that the entire text is correct has changed
  - [x] Add plus button, which also adds a rep, and moves together with the thingy.
  - [x] Make the buttons and inputs twice as big.
- [x] Fix the writing on my portfolio, because it's a mess
- [x] Current service worker code is actually network first, then fallback to cache. It should be flipped. This is expected to massively simplify the code, as the only thing that's checking whether the cache updates, is the cache_name variable.
- [x] Remove the plus button
- [x] Add a reps count in the middle of the two buttons
- [x] EXPERIMENTING WITH BUN BUILD AND STUFF. `bun x serve dist` to test. `make build` to build.
- [x] Move all to bun.
- [x] Add build and [profiles](#profiles)
- [ ] Move all vendor libs into vendor (css, js, )
- [ ] Dynamically include files (no need to exclude). Solves the problem of sw.js, and test_fixture.js
  - 1. aliasing - good for replacing different modules, e.g. `esbuild index.js --bundle --alias:./db.js=./db/sync-stack.js`
  - 2. 
- 
- [ ] Dev build without sw.js
- [ ] 

## Bun the king
For these requirements, the best tool is **Bun** using its **JavaScript Build API**. While the CLI is great for simple tasks, your need to "append" code to a Service Worker and swap dependencies based on environment targets requires a small build script (`build.ts`).

### The Strategy
We will use Bun's `plugins` to handle the dependency swapping (the "Alias" part) and a post-build step to handle the Service Worker "append" logic.

---

### 1. The Project Structure
Assume your source files look like this:
* `src/index.html` (Points to `main.js`)
* `src/sw.js` (Your base Service Worker)
* `src/db/indexeddb.js`
* `src/db/transientdb.js`
* `src/db/clouddb.js`
* `src/test_fixture.js`

### 2. The Build Script (`build.ts`)
This script uses a `TARGET` environment variable to decide how to bundle.

```javascript
const target = process.env.TARGET || "dev" // dev, demo, pro, cloud

const result = await Bun.build({
  entrypoints: ["./src/index.html", "./src/sw.js"],
  outdir: "./dist",
  minify: target !== "dev",
  plugins: [{
    name: "db-swapper",
    setup(build) {
      // 1. Handle Demo: Swap IndexedDB for TransientDB
      if (target === "demo") {
        build.onResolve({ filter: /indexeddb\.js$/ }, () => ({
          path: import.meta.resolve("./src/db/transientdb.js")
        }))
      }

      // 2. Handle Dev: Ensure test_fixture is included 
      // (Or just import it conditionally in your main.js)
    }
  }],
  // Global constants for conditional code
  define: {
    IS_CLOUD: JSON.stringify(target === "cloud"),
    IS_DEV: JSON.stringify(target === "dev")
  }
})

// 3. Handle Cloud Service Worker "Append"
if (target === "cloud") {
  const baseSW = await Bun.file("./dist/sw.js").text()
  const syncCode = await Bun.file("./src/cloud-sync-logic.js").text()
  
  // Append and overwrite the built file
  await Bun.write("./dist/sw.js", baseSW + "\n" + syncCode)
}

console.log(`Build for ${target} complete!`)
```

---

### 3. How to Fulfill Your Requirements

#### **Requirement: Dev vs. Demo (DB Swapping)**
In your code, you just `import db from "./db/indexeddb.js"`. 
* When you run `TARGET=demo bun build.ts`, the plugin intercepts that specific file path and redirects it to `transientdb.js`.
* The rest of your app remains "vanilla"—it has no idea the file was swapped.

#### **Requirement: Cloud (Sync Logic & SW Append)**
Since you can't have two Service Worker files, we build the "standard" one first. If the target is `cloud`, we read the newly bundled file, tack on the `clouddb` sync logic at the bottom, and save it. 

#### **Requirement: Conditional Logic (Cloud DB)**
Inside your `main.js`, you can use the `define` constants we set up:
```javascript
import db from "./db/indexeddb.js"

if (IS_CLOUD) {
  const { initCloudSync } = await import("./db/clouddb.js")
  initCloudSync(db)
}
```
Bun’s minifier is smart: if `IS_CLOUD` is false, it will **tree-shake** (delete) the `import("./db/clouddb.js")` block entirely from the production build, keeping it lean.

---

### 4. Running the Builds
Add these to your `package.json` scripts:

```json
"scripts": {
  "build:dev": "TARGET=dev bun build.ts",
  "build:demo": "TARGET=demo bun build.ts",
  "build:cloud": "TARGET=cloud bun build.ts"
}
```

### Why this works best:
* **One Tool:** You don't need a separate "append" tool or a complex Webpack setup.
* **Vanilla Entry:** You still point the builder at your `.html` file.
* **Fast:** Even with the custom script, Bun will finish this build in roughly 20-50ms.
---


- [ ] Add edit button on the Workout page, which opens up a modify workout dialog, which changes the current workout. Inline with the Temporary Log message.
- [ ] Research how to activate native, Ctrl + F, text search to search the entire page
---
### Optional
- [ ] Settings with light/dark switcher
- [ ] I18N (read from data file)
```javascript
window.I18N = {
  en: { welcome: "Welcome", login: "Login" },
  es: { welcome: "Bienvenido", login: "Iniciar sesión" }
}
```

```html
<head>
  <script src="strings.js"></script>
  
  <script>
    const savedLang = localStorage.getItem('user_lang') || 'en';
    window.strings = window.I18N[savedLang] || window.I18N.en;
    document.documentElement.lang = savedLang;
  </script>
</head>
```
---

## Notes 
### Profiles

- dev   - Has test_fixture.js. Uses indexeddb.js, like all of them.
- demo  - Uses transientdb.js instead of indexeddb.js. Does not use test_fixture.js.
- pro   - Uses indexeddb.js.
- cloud -  Uses clouddb, in addition to indexeddb, because it needs to sync. Also a sync service worker code gets "appended" to the existing one, because we can't have two service worker files in the same directory.

**Note**, the build step for the different profiles should be additive, e.g., for test_fixture.js. It's only included in the demo.
The of db module, is done by importing it as db always, but specifying which one we want in our build logic. The import happens only in one place:
```javascript
import { db } from './db.js';
```
|-- src/db/transientdb.js
|-- src/db/indexeddb.js
 `- src/db/clouddb.js

- e.g.: cp src/db/transient.js dist/demo/assets/js/db.js

**manifest.json** file must also be different per build.

Build step needs to:
1. Add test_fixture.js into index.js.
2. Build the appropriate db file as db.js.
3. Add clouddb.js additionally.
4. Parameterize manifest.json, or just put them 

## Example structure
.
├── Makefile                <-- The "Assembler"
├── src/
│   ├── index.html          <-- Base template
│   ├── manifest.json       <-- Base manifest
│   ├── sw/                 <-- SW fragments
│   │   ├── base.js         <-- Caching logic
│   │   └── sync.js         <-- Cloud sync logic (only for Cloud profile)
│   ├── db/                 <-- The "Engines"
│   │   ├── transient.js    <-- For Demo
│   │   ├── indexeddb.js    <-- For Pro/Dev
│   │   └── cloud.js        <-- For Cloud (wraps indexeddb)
│   ├── assets/
│   │   ├── css/            <-- Shared styles
│   │   └── js/
│   │       ├── components/ <-- Shared custom elements
│   │       ├── core.js
│   │       ├── main.js
│   │       └── index.js    <-- The "Bootstrap" (contains the SW registration)
│   └── test_fixture.js     <-- Additive module
└── dist/                   <-- The "Out" folder (organized by profile)
    ├── demo/               <-- myapp.com/demo
    │   ├── index.html
    │   ├── sw.js           (base.js)
    │   └── assets/js/db.js (transient.js)
    ├── pro/                <-- myapp.com/pro
    │   ├── index.html
    │   ├── sw.js           (base.js)
    │   └── assets/js/db.js (indexeddb.js)
    └── cloud/              <-- myapp.com/cloud
        ├── index.html
        ├── sw.js           (base.js + sync.js)
        └── assets/js/db.js (cloud.js)

### Makefile
```makefile
build-demo:
	mkdir -p dist/demo/assets/js
	cp -r src/assets dist/demo/
	cp src/index.html dist/demo/
	cp src/db/transient.js dist/demo/assets/js/db.js
	cat src/sw/base.js > dist/demo/sw.js
	# Additive step
	cp src/test_fixture.js dist/demo/assets/js/
	echo 'import "./test_fixture.js"' >> dist/demo/assets/js/index.js

build-cloud:
	mkdir -p dist/cloud/assets/js
	# ... base copies ...
	cp src/db/cloud.js dist/cloud/assets/js/db.js
	cat src/sw/base.js src/sw/sync.js > dist/cloud/sw.js
```
#### New Lines
```
Pullupsfg
1200lbs: 12, 12, 12
50lb: 12, 12, 12
(Was a good workout!)
```
### Dot+Space Instead Of Newline
```
Pullups. 1200lbs: 12, 12, 12. 50lb: 12, 12, 12. (Was a good workout!)
```
### CSV
```csv
Exercise,Weight,Reps,Comment
Squats,100kg,"5, 5",Knee felt okay
Squats,120kg,3,Knee felt okay
```

##  # Old windowing, unnecessary, since we just load ALL of the text, in the background, but a cool idea ~~Show workout log~~
1. Write to IndexedDB...
2. The entire workout log container has a kind of state. Which is:
   1. In the background, fetch the first two weeks of exercises. Add them to the DOM. Remember the timestamp of the latest workout that was fetched. Put a "sentinel" div at the bottom, which will tell us when to fetch more; based on `rootMargin`.
   2. When the sentinel is reached, we respond by fetching two weeks more of workouts, and remembering the latest date, again.
3. The first two weeks of exercises get fetched immediately, even if we're not on the page.
4. When we click on log, we just see the result :P
