import { assertEquals } from 'jsr:@std/assert'
import { exerciseToText, workoutToText, workoutLogToText, workoutLogToCsv } from '../../src/assets/js/core.js'

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { name: 'Name' }
    assertEquals(json.name, exerciseToText.call(json, 'single'))
})

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { name: 'Pullups', setsWithWeight: [{ reps: [1, 2, 3] }] }
    assertEquals(`${json.name}: 1, 2, 3.`, exerciseToText.call(json, 'single'))
})

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { name: 'Pullups', setsWithWeight: [{}], comment: '' }
    assertEquals(json.name, exerciseToText.call(json, 'single'))
})

Deno.test('Workout with just one exercise with just name produces text with just name', () => {
    const json = { exercises: [{ name: 'Name' }] }
    assertEquals(json.exercises[0].name, workoutToText.call(json, 'single'))
})

Deno.test('Workout with just one exercise with just name produces text with just name', () => {
    const json = { exercises: [{ name: 'Pullups', setsWithWeight: [{ reps: [1, 2, 3] }] }] }
    assertEquals(`${json.exercises[0].name}: 1, 2, 3.`, workoutToText.call(json, 'single'))
})

Deno.test('Workout with just one exercise with just name produces text with just name', () => {
    const json = { exercises: [{ name: 'Pullups', setsWithWeight: [{}], comment: '' }] }
    assertEquals(json.exercises[0].name, workoutToText.call(json, 'single'))
})

Deno.test('Single line workout serialization', () => {
    const json = {
        exercises: [
            {
                name: 'Pullups',
                setsWithWeight: [
                    { weight: "120kg", reps: [1, 2, 3] },
                    { weight: "150", reps: [1] },
                    { weight: "99lb", reps: [1, 2, 3] }
                ],
                comment: "What a great workout!",
            },
            {
                name: 'Pushups',
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
        , workoutToText.call(json, 'single'))
})

Deno.test('Multi line workout serialization', () => {
    const json = {
        exercises: [{
            name: 'Pullups',
            setsWithWeight: [
                { weight: "120kg", reps: [1, 2, 3] },
                { weight: "150", reps: [1] },
                { weight: "99lb", reps: [1, 2, 3] }
            ],
            comment: "What a great workout!",
        }, {
            name: 'Pushups',
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
        , workoutToText.call(json, 'multi'))
})

Deno.test('Serialize two workouts', () => {
    const json = [{
        timestamp: '2026-02-26T14:30:00Z',
        exercises: [{
            name: 'Pullups',
            setsWithWeight: [
                { weight: "120kg", reps: [1, 2, 3] },
                { weight: "150", reps: [1] },
                { weight: "99lb", reps: [1, 2, 3] }
            ],
            comment: "What a great workout!",
        }, {
            name: 'Pushups',
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
            name: 'Pullups',
            setsWithWeight: [
                { weight: "120kg", reps: [1, 2, 3] },
                { weight: "150", reps: [1] },
                { weight: "99lb", reps: [1, 2, 3] }
            ],
            comment: "What a great workout!",
        }, {
            name: 'Pushups',
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
        , workoutLogToText.call(json, 'multi'))

})

Deno.test('CSV export', () => {
    const json = [{
        timestamp: '2026-02-26T14:30:00Z',
        exercises: [{
            name: 'Pullups',
            setsWithWeight: [
                { weight: "120kg", reps: [1, 2, 3] },
                { weight: "150", reps: [1] },
                { weight: "99lb", reps: [1, 2, 3] }
            ],
            comment: "What a great workout!",
        }, {
            name: 'Pushups',
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
            name: 'Pullups',
            setsWithWeight: [
                { weight: "120kg", reps: [1, 2, 3] },
                { weight: "150", reps: [1] },
                { weight: "99lb", reps: [1, 2, 3] }
            ],
            comment: "What a great workout!",
        }, {
            name: 'Pushups',
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
`Timestamp,Exercise,Weight,Reps,Comment
2026-02-26 14:30:00,Pullups,120kg,"1,2,3",What a great workout!
2026-02-26 14:30:00,Pullups,150,1,What a great workout!
2026-02-26 14:30:00,Pullups,99lb,"1,2,3",What a great workout!
2026-02-26 14:30:00,Pushups,89g,"15,16,30",Felt weaker
2026-02-26 14:30:00,Pushups,150,"1,2,4",Felt weaker
2026-02-26 14:30:00,Pushups,99lb,"1,2,3",Felt weaker
2026-02-25 14:30:00,Pullups,120kg,"1,2,3",What a great workout!
2026-02-25 14:30:00,Pullups,150,1,What a great workout!
2026-02-25 14:30:00,Pullups,99lb,"1,2,3",What a great workout!
2026-02-25 14:30:00,Pushups,89g,"15,16,30",Felt weaker
2026-02-25 14:30:00,Pushups,150,"1,2,4",Felt weaker
2026-02-25 14:30:00,Pushups,99lb,"1,2,3",Felt weaker`
    , workoutLogToCsv.call(json))
})
