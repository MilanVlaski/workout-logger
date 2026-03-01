## Text Based Constraint

1. The logger is primarily text based. The consequence is that both the current workout view, and the workout log view is raw text. The benefit is that this text can be searched, and for all practical purposes, it can **always fit on an HTML page**. No need for virtual scrolling.
   - However, to edit the workout, the UI must be smart enough to figure out which workouts are on which line in the entire workout log. This makes formatting very important, and static. For now, two formats exist:
    1. single
Saturday, Feb 28, 18:46
Deadlift: 93kg: 14.
Squats: 52kg: 8.
Bench Press: 71kg: 8, 5. Fix form.
Pushups: 115kg: 22. 105kg: 28, 14, 17.
Pullups: 40kg: 13. 111kg: 11. Solid PR!

    2. multi
Saturday, Feb 28, 18:46
Deadlift
93kg: 14

Squats
52kg: 8

Bench Press
71kg: 8, 5
Fix form.

Pushups
115kg: 22
105kg: 28, 14, 17

Pullups
40kg: 13
111kg: 11
Solid PR!

The number of lines that singleline takes up is: 1(date) + number of exercises
The number of lines that multiline takes up is: 1(date) + (exercise * 1 + setsWithWeight * 1)

## Data Entry

The UI while working out is special, insofar as it's:
1. Big enough for users to hit with their fingers.
2. Adding a rep count creates a new input, and gives it focus.

## Persistence

*While in the app* Indexed DB is the primary source of truth for the workout log. However, a true source of truth is expected to be some backed up version of the workout log, CSV being sufficient for most intents and purposes.

IndexedDB works while the user is offline.

### PWA

The app is installable.

### Uniqueness

The IndexedDB uses ISO timestamp to 3 decimal seconds. Consider truncating it to only consider minutes (realistic), but leave the other numbers at zero. In a cloud db, timestamp may no be the unique id.

## Translation

Being text based avoids needing to invent translations for the thousands of workouts, and workout variations that exist.
The application simply needs to *remember* the exercises that the user commonly does.

The app doesn't take a stance on what's meaningful in terms of measurement units, and doesn't translate between them. It may remember that the user uses KG (and writes it kg, Kg kG or KG), and simply use that everywhere. The entire log is, again, text editable. If someone decided to change form lb to kg, they could find/replace the entire text. A weight calculation could perhaps be applied as well, if users need it, but likely not.

The app may also remember the different types of workouts a user does, and provide them as templates.

## Data Flow Example

### Current Workout

The datetime is implicit, and captured on finish. Consider capturing it on the first entered workout name.

```javascript
let workout = { exercises: [{
            exerciseName: 'Pullups',
            setsWithWeight: [
                { weight: "120kg", reps: [1, 2, 3] },
                { weight: "150", reps: [1] },
                { weight: "99lb", reps: [1, 2, 3] }
            ],
            comment: "What a great workout!",
        }, {
            exerciseName: 'Pushups',
            setsWithWeight: [
                { weight: "89g", reps: [15, 16, 30] },
                { weight: "150", reps: [1, 2, 4] },
                { weight: "99lb", reps: [1, 2, 3] }
            ],
            comment: "Felt weaker",
        }
        ]
}
```

### Logged workouts

Adds autoincrement id and timestamp to it.

