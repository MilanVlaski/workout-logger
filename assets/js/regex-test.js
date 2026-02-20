const workoutData = `Pullups
1200lbs: 12, 12, 12
50lb: 12, 12, 12
(Was a good workout!)

Bench Press
225lbs: 5, 5, 5
(Feeling strong)`;

// A function that takes a regex, and acts on json, to output text.
// A function that takes a regex, and acts on text, to produce json.

// Your regex with the Global (g) and Multiline (m) flags added
const regex = /^([A-Za-z0-9 ]+?)(?:\. |\n|$)\s*((?:(?=.*\d)[A-Za-z0-9]+: \d+(?:, \d+)*(?:\. |\n|$)\s*)*)(\(.*\))?/gm;

function parseWorkout(text) {
    // .matchAll returns an iterator of all matches found
    const matches = [...text.matchAll(regex)]

    return matches.map(match => {
        const [fullMatch, name, setsRaw, comment] = match

        // Parse the sets string into the object format
        const setsWithWeight = setsRaw.trim().split('\n').filter(line => line.includes(':')).map(line => {
            const [weight, repsPart] = line.split(':')
            return {
                weight: weight.trim(),
                reps: repsPart.split(',').map(r => r.trim())
            }
        })

        return {
            exerciseName: name.trim(),
            comment: comment ? comment.replace(/[()]/g, '') : "",
            setsWithWeight: setsWithWeight
        }
    })
}

const parsedResults = parseWorkout(workoutData);
console.log(JSON.stringify(parsedResults, null, 2))
