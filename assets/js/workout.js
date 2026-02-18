/**
 * Formats workout data into a readable log string.
 * * @this {Object}
 * @property {string} exerciseName - The name of the performed exercise.
 * @property {Array<Object>} [setsWithWeight] - Collection of set data.
 * @property {number[]} [setsWithWeight[].reps] - Array of repetition counts..
 * @property {number|string} [setsWithWeight[].weight] - The weight used for the set.
 * @property {string} [comment] - User notes about the exercise.
 * * @returns {string} A formatted string, e.g., "Bench Press: 10, 10 - 225. 8, 8 - 225 - Felt strong"
 */
function asLog() {
    const sets = this.setsWithWeight.map(set => {
        return `${set.reps.join(', ')}${opt` - ${set.weight}`}`
    }).join('. ');

    return `${this.exerciseName}${opt`: ${sets}.`}${opt` ${this.comment}`}`
}

document.addEventListener('exercise:finish', (e) => {
    const $temporaryLog = document.querySelector('.temporary-log')

    // e.detail.asLog = asLog
    // $temporaryLog.textContent = e.detail.asLog()

    // const exercise = Object.assign(e.detail, { asLog })
    // $temporaryLog.textContent = exercise.asLog()

    // $temporaryLog.textContent = asLog.call(e.detail)

    // $temporaryLog.textContent = new Exercise(e.detail).asLog()

    $temporaryLog.value += asLog.call(e.detail) + "\n"
})

const opt = (strings, ...values) =>
    values.every(Boolean) ? strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "") : ""
