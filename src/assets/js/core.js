/**
 * Formats workout data into a readable log string.
 * Supports both single-line and multiline formats.
 */

// Optional parts plugin - includes content only if all values are truthy
const opt = (strings, ...values) =>
    values.every(Boolean) ? strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "") : ""

/**
 * Formats an exercise object into a string.
 * @this {Object} The exercise object.
 * @param {'single'|'multiline'} [format='single'] The output format.
 * @returns {string} Formatted exercise string.
 */
export function exerciseToText(format = 'single') {
    // Filter out sets with no reps
    const sets = (this.setsWithWeight || [])
        .filter(set => set.reps && set.reps.length > 0)
        .map(set => {
            const repStr = set.reps.join(', ')
            return set.weight ? `${set.weight}: ${repStr}` : repStr
        })

    if (format === 'multiline') {
        let result = this.exerciseName
        if (sets.length > 0) {
            result += '\n' + sets.join('\n')
        }
        if (this.comment) {
            result += '\n' + this.comment
        }
        return result
    }

    // single-line format
    const setsStr = sets.join('. ')
    return `${this.exerciseName}${opt`: ${setsStr}.`}${opt` ${this.comment}`}`
}

/**
 * Formats a workout object (containing an array of exercises) into a string.
 * @this {Object} The workout object.
 * @param {'single'|'multiline'} [format='single'] The output format.
 * @returns {string} Formatted workout string.
 */
export function workoutToText(format = 'single') {
    const exercises = this.exercises || []
    const formatted = exercises.map(ex => exerciseToText.call(ex, format))
    return formatted.join(format === 'multiline' ? '\n\n' : '\n')
}
