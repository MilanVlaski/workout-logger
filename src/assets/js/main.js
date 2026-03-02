import { exerciseToText, workoutLogToText, workoutToText, workoutDelimiter, workoutLogToCsv, linesPerWorkout } from "./core.js"
import { addExercise, findWorkoutById, readCurrentWorkout, readWorkoutLog, saveCurrentWorkoutToLog } from "./db.js"

const $temporaryLog = document.querySelector('.temporary-log-input')

let workoutPositionMap = new Map()

if (!localStorage.getItem('exerciseFormat')) {
    localStorage.setItem('exerciseFormat', 'multi')
}
document.querySelector('#exercise-format').value = localStorage.getItem('exerciseFormat')

document.querySelector('#exercise-format').addEventListener('change', (e) => {
    localStorage.setItem('exerciseFormat', e.target.value)
    writeCurrentWorkoutToScreen()
    writeWorkoutLogToScreen()
})



// This actually has to be for each exercise element currently on the screen,
// rather than just one. Based on that, we can also remove the elements
document.addEventListener('exercise:finish', (e) => {
    addExercise(e.detail)
        .then(() => { $temporaryLog.textContent += `${exerciseToText.call(e.detail, localStorage.getItem('exerciseFormat'))}\n` })
})

document.addEventListener('submit', (e) => {
    e.preventDefault()

    if (e.target.getAttribute('action') == 'finish-workout') {
        saveCurrentWorkoutToLog()
            .then((workout) => {
                document.querySelector('#workout-log').prepend(
                    workoutToText.call(workout, localStorage.getItem('exerciseFormat')) + workoutDelimiter)
            })
            .catch((err) => console.error("Couldn't write workout.", err))

        e.target.reset()
    }
})

document.addEventListener('db:ready', (e) => {
    writeCurrentWorkoutToScreen()
    writeWorkoutLogToScreen()
})

function writeCurrentWorkoutToScreen() {
    readCurrentWorkout()
        .then((workout) => {
            if (workout) $temporaryLog.textContent = workoutToText.call(workout, localStorage.getItem('exerciseFormat')) + '\n'
        })
}


function writeWorkoutLogToScreen() {
    readWorkoutLog()
        .then(workouts => {
            const exerciseFormat = localStorage.getItem('exerciseFormat')
            const workoutsText = workoutLogToText.call(workouts, exerciseFormat)
            document.querySelector('#workout-log').textContent = workoutsText

            // Map line numbers to workouts on screen
            let lineCount = 0
            workoutPositionMap = workouts.reduce((map, workout) => {
                lineCount += linesPerWorkout(workout, exerciseFormat)
                map.set(lineCount, workout.timestamp)
                return map
            }, workoutPositionMap)
        })
}

const $workoutLog = document.getElementById('workout-log')

$workoutLog.addEventListener('click', (event) => {
    // 1. Get the computed style to find the line height
    const style = window.getComputedStyle($workoutLog)
    const lineHeight = parseFloat(style.lineHeight)

    // 2. Get the top position of the pre element
    const rect = $workoutLog.getBoundingClientRect()
    const scrollTop = $workoutLog.scrollTop

    // 3. Calculate the clicked y-position relative to the top of the content
    const clickY = event.clientY - rect.top + scrollTop

    // 4. Calculate the line number (1-based index)
    const lineNumber = Math.floor(clickY / lineHeight)

    let i = lineNumber
    // Infinite loop if the number is greater than every
    while (!workoutPositionMap.get(i)) {
        i++
    }

    console.debug(`Line clicked: ${lineNumber}`)
    findWorkoutById(workoutPositionMap.get(i)).then(workout => {
        console.debug(workout)
        const $editWorkoutDialog = document.querySelector('#edit-workout-dialog')
        $editWorkoutDialog.showModal()
    })
})

// TODO feature limited 
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