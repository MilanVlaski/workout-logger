import { assertEquals } from 'jsr:@std/assert'
import { toText } from './core.js'

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { exerciseName: 'Name' }
    assertEquals(json.exerciseName, toText.call(json))
})

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { exerciseName: 'Pullups', setsWithWeight: [{reps: [1, 2, 3]}]}
    assertEquals(`${json.exerciseName}: 1, 2, 3.` , toText.call(json))
})

Deno.test('One exercise with just name produces text with just name', () => {
    const json = { exerciseName: 'Pullups', setsWithWeight: [{}], comment: '' }
    assertEquals(json.exerciseName, toText.call(json))
})

Deno.test('Single line workout serialization', () => {
    const json = {
        exerciseName: 'Pullups',
        setsWithWeight: [
            { weight: "120kg", reps: [1, 2, 3] },
            { weight: "150", reps: [1] },
            { weight: "99lb", reps: [1, 2, 3] }
        ],
        comment: "What a great workout!",
        exerciseName: 'Pushups',
        setsWithWeight: [
            { weight: "89g", reps: [15, 16, 30] },
            { weight: "150", reps: [1, 2, 4 ] },
            { weight: "99lb", reps: [1, 2, 3] }
        ],
        comment: "Felt weaker",
    }

    assertEquals(
`Pullups: 120kg: 1, 2, 3. 150: 1. 99lb: 1, 2, 3. What a great workout!
Pushups: 89g: 15, 16, 30. 150: 1, 2, 4. 99lb: 1, 2, 3. Felt weaker`
, toText.call(json))
})

Deno.test('Multi line workout serialization', () => {
    const json = {
        exerciseName: 'Pullups',
        setsWithWeight: [
            { weight: "120kg", reps: [1, 2, 3] },
            { weight: "150", reps: [1] },
            { weight: "99lb", reps: [1, 2, 3] }
        ],
        comment: "What a great workout!",
        exerciseName: 'Pushups',
        setsWithWeight: [
            { weight: "89g", reps: [15, 16, 30] },
            { weight: "150", reps: [1, 2, 4] },
            { weight: "99lb", reps: [1, 2, 3] }
        ],
        comment: "Felt weaker",
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
        , toText.call(json))
})
