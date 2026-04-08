export let db

const WORKOUT_KEY = 'single-workout'

// In-memory storage
let currentWorkout = { exercises: [] }
let workouts = []
const dbReadyPromise = Promise.resolve()

export async function addExercise(exercise) {
    currentWorkout.exercises.push(exercise)
    return currentWorkout
}

export async function readCurrentWorkout() {
    return currentWorkout
}

/**
 * Retrieves all saved workouts from the history log.
 * @returns {Promise<Array>} A list of all completed workouts.
 */
export async function readWorkoutLog() {
    return [...workouts]
}

export async function saveCurrentWorkoutToLog() {
    if (currentWorkout.exercises.length === 0) return

    const finishedWorkout = {
        ...currentWorkout,
        timestamp: new Date().toISOString()
    }

    workouts.unshift(finishedWorkout)
    currentWorkout = { exercises: [] }

    return finishedWorkout
}

/**
 * Retrieves a specific workout by its timestamp ID.
 * @param {string} timestamp - The ISO string timestamp to search for.
 * @returns {Promise<Object|null>} The workout object or null if not found.
 */
export async function findWorkoutById(timestamp) {
    return workouts.find(w => w.timestamp === timestamp) || null
}

export async function updateWorkout(workout) {
    const index = workouts.findIndex(w => w.timestamp === workout.timestamp)
    if (index === -1) {
        throw new Error('Workout not found')
    }

    workouts[index] = {
        ...workouts[index],
        exercises: workout.exercises
    }

    return workouts[index]
}

export const demoDb = {
    addExercise,
    readCurrentWorkout,
    readWorkoutLog,
    saveCurrentWorkoutToLog,
    findWorkoutById,
    updateWorkout,
    get db() { return db } // Handles your test_fixture.js requirement
}
