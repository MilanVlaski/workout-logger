import { assertEquals } from 'jsr:@std/assert'
import { asLog } from './core.js'

Deno.test('Test', () => {
    const sum = 2 + 3
    assertEquals(sum, 5)
})

const regex = /^([A-Za-z0-9 ]+?)(?:\. |\n|$)\s*((?:(?=.*\d)[A-Za-z0-9]+: \d+(?:, \d+)*(?:\. |\n|$)\s*)*)(\(.*\))?/gm


Deno.test('One exercise with just name produces text with just name', () => {
    const json = { exerciseName: 'Pullups' }
    assertEquals(json.exerciseName, asLog.call(json))
})
