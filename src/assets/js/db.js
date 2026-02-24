let db

const dbReadyPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('WorkoutDB', 1)

    request.onupgradeneeded = (e) => {
        const database = e.target.result
        if (!database.objectStoreNames.contains('current-workout')) {
            database.createObjectStore('current-workout')
        }
    }

    request.onsuccess = (e) => {
        db = e.target.result
        console.log('Database connection established')
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

        request.onsuccess = () => resolve(request.result || { exercises: [] })
        request.onerror = () => reject(request.error)
    })
}