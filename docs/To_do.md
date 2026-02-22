- [x] Use oat.ink to restyle everything ~~Make textarea look the same as the input?~~
- [x] Add 11ty as passthrough copy
- [x] Make index.html a .webc layout file
- [x] Define each of my web components as a .webc file (pretty trivial)\
- [x] Currently, the code either clones <template>s, in the very .html file, or it uses innerHTML as a string.Use webc from 11ty, to create <template> to clone in the component itself, and instead of innerHTML, also use a cloneable template, invoked in the render() method. ~~Switch to fragment cloning~~
- [x] Add reset icon to the right of buttons, in case users mistype
- [x] Add x buttons to the top-right of the current exercise "elements", when they're appended.
- [x] Date must come from today.
- [x] Disable "Remove reps" while there is only one reps input
- [ ] Use Deno to make unit tests for the regex functions
  - [x] Install deno
  - [x] Add test (runs unit tests by default) with Deno
  - [ ] The functions to test are just "formatting" json to text. No need for parsing.
  - [ ] Move app to src folder
  - [ ] 
- [ ] Make a more complex test case for the entire GUI, on the index page. Also make it console log "test success".
- [ ] Then make a "failing test case" that spans both pages. Console log "test fail".
- [ ] Make the "focus event" on the all-reps, hit the LAST input
- [ ] Test the regexes (automated tests?)
  - [ ] Make regex injectable into the asLog() function
  - [ ] Make the textarea revert text, if there is a mistake when editing
- [ ] Save to IndexedDB, and read on "workout log" page. (Read the last 7 workouts).
- [ ] Write a test for the entire flow, from data entry, from the temporary log, to the permanent log (IndexedDB).
- [ ] Export workout log as CSV
- [ ] Settings with light/dark switcher
- [ ] Internationalization (read from data file)
- [ ] PWA
- [ ] Make my own theme.css
- [ ] Syntax highlighting on the textarea
- [ ] 

# Textarea Input

It's all based on a nice and robust regex.
Mistakes are prevented because the element is prevented from being invalid by a "blur" rollback to previous value, thingy.
The regex doesn't care whether it's one or multiple lines.

## Regexes
```
^([A-Za-z0-9 ]+?)(?:\. |\n|$)\s*((?:(?=.*\d)[A-Za-z0-9]+: \d+(?:, \d+)*(?:\. |\n|$)\s*)*)(\(.*\))?
```

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

Sample javascript object:
```json
{
    "exerciseName": "Pullups",
    "comment": "Was a good workout!",
    "setsWithWeight": [
        {
            "weight": "1200lbs",
            "reps": [
                "12",
                "12",
                "12"
            ]
        },
        {
            "weight": "50lb",
            "reps": [
                "12",
                "12",
                "12"
            ]
        }
    ]
}
```

```html
<!-- VALIDATING TEXT AREA -->
 <textarea 
  id="log" 
  onfocus="this.dataset.backup = this.value"
  onblur="validateAndSnap(this)">
Squats: 100kg. 5, 5, 5
</textarea>

<script>
function validateAndSnap(el) {
    const pattern = /.+:(\s*[\d\w]+\.\s*[\d\s,]+)+/g;
    
    // Test if the WHOLE text still makes sense
    if (pattern.test(el.value)) {
        // Success: Update the backup to the new valid version
        el.dataset.backup = el.value;
        el.classList.remove('error');
    } else {
        // Failure: Force the previous version back in
        el.value = el.dataset.backup;
        el.classList.add('flash-red'); // Visual feedback of rejection
        setTimeout(() => el.classList.remove('flash-red'), 500);
    }
}
</script>
```