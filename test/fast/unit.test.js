import { assertEquals } from 'jsr:@std/assert'
import { exerciseToText, workoutToText, workoutLogToText } from '../../src/assets/js/core.js'

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { exerciseName: 'Name' }
    assertEquals(json.exerciseName, exerciseToText.call(json))
})

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { exerciseName: 'Pullups', setsWithWeight: [{ reps: [1, 2, 3] }] }
    assertEquals(`${json.exerciseName}: 1, 2, 3.`, exerciseToText.call(json))
})

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { exerciseName: 'Pullups', setsWithWeight: [{}], comment: '' }
    assertEquals(json.exerciseName, exerciseToText.call(json))
})

Deno.test('Workout with just one exercise with just name produces text with just name', () => {
    const json = { exercises: [{ exerciseName: 'Name' }] }
    assertEquals(json.exercises[0].exerciseName, workoutToText.call(json))
})

Deno.test('Workout with just one exercise with just name produces text with just name', () => {
    const json = { exercises: [{ exerciseName: 'Pullups', setsWithWeight: [{ reps: [1, 2, 3] }] }] }
    assertEquals(`${json.exercises[0].exerciseName}: 1, 2, 3.`, workoutToText.call(json))
})

Deno.test('Workout with just one exercise with just name produces text with just name', () => {
    const json = { exercises: [{ exerciseName: 'Pullups', setsWithWeight: [{}], comment: '' }] }
    assertEquals(json.exercises[0].exerciseName, workoutToText.call(json))
})

Deno.test('Single line workout serialization', () => {
    const json = {
        exercises: [
            {
                exerciseName: 'Pullups',
                setsWithWeight: [
                    { weight: "120kg", reps: [1, 2, 3] },
                    { weight: "150", reps: [1] },
                    { weight: "99lb", reps: [1, 2, 3] }
                ],
                comment: "What a great workout!",
            },
            {
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

    assertEquals(
        `Pullups: 120kg: 1, 2, 3. 150: 1. 99lb: 1, 2, 3. What a great workout!
Pushups: 89g: 15, 16, 30. 150: 1, 2, 4. 99lb: 1, 2, 3. Felt weaker`
        , workoutToText.call(json))
})

Deno.test('Multi line workout serialization', () => {
    const json = {
        exercises: [{
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

    assertEquals(
        `Pullups
120kg: 1, 2, 3
150: 1
99lb: 1, 2, 3
What a great workout!

Pushups
89g: 15, 16, 30
150: 1, 2, 4
99lb: 1, 2, 3
Felt weaker`
        , workoutToText.call(json, 'multiline'))
})

Deno.test('Serialize two workouts', () => {
    const json = [{
        timestamp: '2026-02-26T14:30:00Z',
        exercises: [{
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
    },
    {
        timestamp: '2026-02-25T14:30:00Z',
        exercises: [{
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
    }]

    assertEquals(
`Thursday, Feb 26, 14:30
Pullups
120kg: 1, 2, 3
150: 1
99lb: 1, 2, 3
What a great workout!

Pushups
89g: 15, 16, 30
150: 1, 2, 4
99lb: 1, 2, 3
Felt weaker


Wednesday, Feb 25, 14:30
Pullups
120kg: 1, 2, 3
150: 1
99lb: 1, 2, 3
What a great workout!

Pushups
89g: 15, 16, 30
150: 1, 2, 4
99lb: 1, 2, 3
Felt weaker`
        , workoutLogToText.call(json, 'multiline'))

})
