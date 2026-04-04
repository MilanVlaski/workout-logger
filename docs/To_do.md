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
- [ ] EXPERIMENTING WITH BUN BUILD AND STUFF
- [ ] Add edit button on the Workout page, which opens up a modify workout dialog, which changes the current workout. Inline with the Temporary Log message.
- [ ] Research how to activate native, Ctrl + F, text search to search the entire page
- [ ] Add build and [profiles](#profiles)
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

# Notes 
## Profiles
- dev   - Has test_fixture.js.
- demo  - Clears the database every 10 minutes.
- pro   - Remove test_fixture.js.
- cloud - Removes test_fixture.js. Uses cloud db, in addition to localdb, because it needs to sync. Should we purge when synced? Probably.

### Logical steps
- Forbid export in demo version
- 

### New Lines
```
Pullups
1200lbs: 12, 12, 12
50lb: 12, 12, 12
(Was a good workout!)
```
## Dot+Space Instead Of Newline
```
Pullups. 1200lbs: 12, 12, 12. 50lb: 12, 12, 12. (Was a good workout!)
```
## CSV
```csv
Exercise,Weight,Reps,Comment
Squats,100kg,"5, 5",Knee felt okay
Squats,120kg,3,Knee felt okay
```

## Old windowing, unnecessary, since we just load ALL of the text, in the background, but a cool idea ~~Show workout log~~
1. Write to IndexedDB...
2. The entire workout log container has a kind of state. Which is:
   1. In the background, fetch the first two weeks of exercises. Add them to the DOM. Remember the timestamp of the latest workout that was fetched. Put a "sentinel" div at the bottom, which will tell us when to fetch more; based on `rootMargin`.
   2. When the sentinel is reached, we respond by fetching two weeks more of workouts, and remembering the latest date, again.
3. The first two weeks of exercises get fetched immediately, even if we're not on the page.
4. When we click on log, we just see the result :P
