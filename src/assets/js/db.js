export let db

const dbReadyPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('WorkoutDB', 3)

    request.onupgradeneeded = (e) => {
        const database = e.target.result
        if (!database.objectStoreNames.contains('current-workout')) {
            database.createObjectStore('current-workout')
        }

        if (!database.objectStoreNames.contains('workouts')) {
            const workouts = database.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true})
            workouts.createIndex('timestamp', 'timestamp', { unique: true });
        }
    }

    request.onsuccess = (e) => {
        db = e.target.result
        resolve(db)
        document.dispatchEvent(new CustomEvent('db:ready'))
    }

    request.onerror = (e) => reject(e.target.error)
})

const WORKOUT_KEY = 'single-workout'

export async function addExercise(exercise) {
    await dbReadyPromise

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('current-workout', 'readwrite')
        const store = transaction.objectStore('current-workout')
        const getRequest = store.get(WORKOUT_KEY)

        getRequest.onsuccess = () => {
            const workout = getRequest.result || { exercises: [] }
            workout.exercises.push(exercise)
            const putRequest = store.put(workout, WORKOUT_KEY)
            putRequest.onsuccess = () => resolve(workout)
            putRequest.onerror = () => reject(putRequest.error)
        }
        getRequest.onerror = () => reject(getRequest.error)
    })
}

export async function readCurrentWorkout() {
    await dbReadyPromise

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('current-workout', 'readonly')
        const store = transaction.objectStore('current-workout')
        const request = store.get(WORKOUT_KEY)

        request.onsuccess = () => {resolve(request.result) ;console.debug(`Current workout`); console.debug(request.result)}
        request.onerror = () => reject(request.error)
    })
}

/**
 * Retrieves all saved workouts from the history log.
 * @returns {Promise<Array>} A list of all completed workouts.
 */
export async function readWorkoutLog() {
    await dbReadyPromise

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('workouts', 'readonly')
        const store = transaction.objectStore('workouts')

        // getAll() is the most efficient way to retrieve the entire log
        const request = store.getAll()

        request.onsuccess = () => {
            // Returns an array of workout objects, or an empty array if none exist
            resolve(request.result || [])
        }

        request.onerror = () => reject(request.error)
    })
}

export async function saveCurrentWorkoutToLog() {
    const current = await readCurrentWorkout(); console.debug(`Result of reading current:`); console.debug(current)
    if (current.exercises.length === 0) return
    
    await dbReadyPromise
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['workouts', 'current-workout'], 'readwrite')

        let finishedWorkout = {
            ...current,
            timestamp: new Date().toISOString()
        }
        // 1. Add to log
        transaction.objectStore('workouts').add(finishedWorkout)

        // 2. Clear current workout
        transaction.objectStore('current-workout').delete(WORKOUT_KEY)

        transaction.oncomplete = () => resolve(finishedWorkout)
        transaction.onerror = () => reject(transaction.error)
    })
}

/**
 * Retrieves a specific workout by its timestamp ID.
 * @param {string} timestamp - The ISO string timestamp to search for.
 * @returns {Promise<Object|null>} The workout object or null if not found.
 */
export async function findWorkoutById(timestamp) {
    await dbReadyPromise

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('workouts', 'readonly')
        const store = transaction.objectStore('workouts')

        // Use get() with the keyPath value
        const request = store.index('timestamp').get(timestamp)

        request.onsuccess = () => {
            resolve(request.result || null)
        }

        request.onerror = () => reject(request.error)
    })
}
