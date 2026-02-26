import { exerciseToText, workoutLogToText, workoutToText, workoutDelimiter, workoutLogToCsv } from "./core.js"
import { addExercise, readCurrentWorkout, readWorkoutLog, saveCurrentWorkoutToLog } from "./db.js"

const $temporaryLog = document.querySelector('.temporary-log-input')

// This actually has to be for each exercise element currently on the screen,
// rather than just one. Based on that, we can also remove the elements
document.addEventListener('exercise:finish', (e) => {
    addExercise(e.detail)
        .then(() => { $temporaryLog.value += `${exerciseToText.call(e.detail)}\n` })
})

document.addEventListener('submit', (e) => {
    e.preventDefault()

    if (e.target.getAttribute('action') == 'finish-workout') {
        saveCurrentWorkoutToLog()
            .then((workout) => {
                document.querySelector('#workout-log').prepend(
                    workoutToText.call(workout) + workoutDelimiter)
            })
            .catch((err) => console.error("Couldn't write workout.", err))

        e.target.reset()
    }
})

document.addEventListener('db:ready', (e) => {
    readCurrentWorkout()
        .then((workout) => {
            if (workout) $temporaryLog.value = workoutToText.call(workout) + '\n'
        })

    readWorkoutLog()
        .then(workouts => {
            document.querySelector('#workout-log').textContent = workoutLogToText.call(workouts)
        })
})

document.querySelector('#csv-export-btn').addEventListener('click', async () => {
    try {
        const workoutLog = await readWorkoutLog();
        const csvString = workoutLogToCsv.call(workoutLog);

        const blob = new Blob([csvString], { type: 'text/csv' });
        const file = new File([blob], 'workout-log.csv', { type: 'text/csv' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Workout Log',
                text: 'Here is my exported workout data.'
            });
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'workout-log.csv';
            a.click();
            URL.revokeObjectURL(url);
        }
    } catch (err) {
        console.error("Couldn't export workout log", err);
    }
});