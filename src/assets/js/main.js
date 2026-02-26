import { exerciseToText, workoutLogToText, workoutToText, workoutDelimiter } from "./core.js"
import { addExercise, readCurrentWorkout, readWorkoutLog, saveCurrentWorkoutToLog } from "./db.js"

const $temporaryLog = document.querySelector('.temporary-log-input')

// This actually has to be for each exercise element currently on the screen,
// rather than just one. Based on that, we can also remove the elements
document.addEventListener('exercise:finish', (e) => {
    addExercise(e.detail)
        .then(() => { $temporaryLog.value += `${exerciseToText.call(e.detail)}${workoutDelimiter}` })
})

document.addEventListener('submit', (e) => {
    e.preventDefault()
    
    if(e.target.getAttribute('action') == 'finish-workout') {
        saveCurrentWorkoutToLog()
            .then((workout) => {document.querySelector('#workout-log').prepend(
                workoutToText.call(workout) + workoutDelimiter)})
            .catch((err) => console.error("Couldn't write workout.", err))

        e.target.reset()
    }
})

document.addEventListener('db:ready', (e) => {
    readCurrentWorkout()
        .then((workout) => {
            if(workout) $temporaryLog.value = workoutToText.call(workout) + '\n'
        })

    readWorkoutLog()
        .then(workouts => {
            document.querySelector('#workout-log').textContent = workoutLogToText.call(workouts)
        })
})
