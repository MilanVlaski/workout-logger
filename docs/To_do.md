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
- [ ] refactor: Use name instead of exerciseName
- [ ] Make tests read nicely, and make them actually pass
- [ ] Make exercise-form-input reusable component
- [ ] Make exercise-form-input return entire exercise data as value
- [ ] Render exercise-form-input as a component with an exercise value
- [ ] Make modify-workout component, that simply contains a list of exercises, and their exercise-form-inputs
- [ ] Wrap inside form, and add buttons to the end
- [ ] Place inside nice dialog, passing workout data to it
---- 
  - [x] Create a "map" of lines that the user's exercise belongs to.
  - [x] Specifically, when the user clicks BELOW a workout's date, or on it, it counts as a click on the workout.
  - [ ] Current workout is edited in full. That way, the component for editing a workout is reused.
- [ ] \[Optional](friendly LABEL) - that STICKS to the top as we scroll. An event gets sent once each thingy scrolls into view. That is, when the top element shows X, we do that. 
    - [ ] for singleline it's: 1(date) + number of exercises
    - [ ] for multiline it's: 1(date) + (exercise * 1 + setsWithWeight * 1)
- [ ] Limit testing number of workouts on mobile.
- [ ] Add build and [profiles](#profiles)
- [ ] PWA
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

- [ ] Preferences for singleline, multiline

---


## Profiles
- dev - has demo buttons: To Temp Log, Reset IndexedDB, Data, Dummy Data (test_fixture.js). Uses localdb (db.js). Export enabled.
- demo - Dev, but forbids export.
- local - Adds PWA install and Export. Remove demo buttons (test_fixture.js). Uses localdb (db.js).
- cloud - Adds PWA install and Export. Removes demo buttons. Uses cloud db. (Not sure if clouddb is used additionally, or instead of local db)

### Logical steps
- demo_controls -> import test_fixture.js
- localdb -> import indexeddb.js
- clouddb -> import clouddb.js
- export -> import export.js, and button somewhere
- pwa -> adds manifest.json and service_worker.js
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
3. The first two weeks of exercises get fetched immediatelly, even if we're not on the page.
4. When we click on log, we just see the result :P
