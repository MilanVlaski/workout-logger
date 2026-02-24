import { exerciseToText, workoutToText } from "./core.js"
import { addExercise, readCurrentWorkout } from "./db.js"

const $temporaryLog = document.querySelector('.temporary-log-input')

// This actually has to be for each exercise element currently on the screen,
// rather than just one. Based on that, we can also remove the elements
document.addEventListener('exercise:finish', (e) => {
    $temporaryLog.value += exerciseToText.call(e.detail) + "\n"
    addExercise(e.detail)
})

document.addEventListener('db:ready', (e) => {
    readCurrentWorkout()
        .then((workout) => {
            $temporaryLog.value = workoutToText.call(workout)
        })
})
