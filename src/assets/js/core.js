// TODO hardcoded localization
const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
})

export const workoutDelimiter = '\n\n\n'

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
export function exerciseToText(format = 'multi') {
    // Filter out sets with no reps
    const sets = (this.setsWithWeight || [])
        .filter(set => set.reps && set.reps.length > 0)
        .map(set => {
            const repStr = set.reps.join(', ')
            return set.weight ? `${set.weight}: ${repStr}` : repStr
        })

    if (format === 'multi') {
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
export function workoutToText(format = 'multi') {
    const dateStr = this.timestamp ? dateFormatter.format(new Date(this.timestamp)) : ''
    const exercises = this.exercises || []
    const formatted = exercises.map(ex => exerciseToText.call(ex, format))

    return `${opt`${dateStr}\n`}${formatted.join(format === 'multi' ? '\n\n' : '\n')}`
}

/**
 * Formats an array of workout log entries into a multiline string.
 * @param {Array} logs - Array of workout objects.
 * @returns {string} Formatted workout log string.
 */
export function workoutLogToText(format = 'multi') {
    return this
        .map((workout) => { return workoutToText.call(workout, format) })
        .join(workoutDelimiter)
}

export function workoutLogToCsv() {
    const header = "Timestamp,Exercise,Weight,Reps,Comment"

    const rows = this.flatMap(entry => {
        // Format timestamp: '2026-02-26T14:30:00Z' -> '2026-02-26 14:30:00'
        const formattedDate = entry.timestamp.replace('T', ' ').replace('Z', '')

        return entry.exercises.flatMap(ex => {
            return ex.setsWithWeight.map(set => {
                // Handle Reps: if more than 1 rep, wrap in quotes
                const repsStr = set.reps.join(',')
                const finalReps = set.reps.length > 1 ? `"${repsStr}"` : repsStr

                return [
                    formattedDate,
                    ex.exerciseName,
                    set.weight,
                    finalReps,
                    ex.comment
                ].join(',')
            })
        })
    })

    return [header, ...rows].join('\n')
}