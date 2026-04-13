import { exerciseToText, workoutLogToText, workoutToText, workoutDelimiter, workoutLogToCsv, linesPerWorkout } from "./core.js"
import { database } from "./db.js"

const {
    addExercise,
    findWorkoutById,
    readCurrentWorkout,
    readWorkoutLog,
    saveCurrentWorkoutToLog,
    updateWorkout,
    updateCurrentWorkout
} = database

const $temporaryLog = document.querySelector('.temporary-log-input')
const $editWorkoutDialog = document.querySelector('#edit-workout-dialog')
const $editCurrentWorkoutDialog = document.querySelector('#edit-current-workout-dialog')

let workoutPositionMap = new Map()

if (!localStorage.getItem('exerciseFormat')) {
    localStorage.setItem('exerciseFormat', 'multi')
}
document.querySelector('[data-action="change-exercise-format"]').value = localStorage.getItem('exerciseFormat')

document.querySelector('[data-action="change-exercise-format"]').addEventListener('change', (e) => {
    localStorage.setItem('exerciseFormat', e.target.value)
    writeCurrentWorkoutToScreen()
    writeWorkoutLogToScreen()
})



// This actually has to be for each exercise element currently on the screen,
// rather than just one. Based on that, we can also remove the elements
document.addEventListener('exercise:finish', (e) => {
    addExercise(e.detail)
        .then(() => { writeCurrentWorkoutToScreen()
            // const format = localStorage.getItem('exerciseFormat')
            // $temporaryLog.textContent += `${exerciseToText.call(e.detail, format)}${(format == 'single') ? '\n' : '\n\n'}`
        })
})

$editWorkoutDialog.addEventListener('submit', (e) => {
    e.preventDefault()

    const $modifyWorkout = e.target.querySelector('modify-workout')
    const updatedWorkout = $modifyWorkout.value()

    $editWorkoutDialog.close()

    updateWorkout(updatedWorkout)
        .then(() => {writeWorkoutLogToScreen()})
        .catch(err => console.error('Failed to update workout:', err))
})

$editCurrentWorkoutDialog.addEventListener('submit', (e) => {
    e.preventDefault()

    const $modifyWorkout = e.target.querySelector('modify-workout')
    const updatedWorkout = $modifyWorkout.value()
    console.log(`Updated workout: ${updatedWorkout}`)
    $editCurrentWorkoutDialog.close()

    updateCurrentWorkout(updatedWorkout)
        .then(() => { writeCurrentWorkoutToScreen() })
        .catch(err => console.error('Failed to update workout:', err))
})

document.addEventListener('submit', (e) => {

    if (e.target.getAttribute('action') == 'finish-workout') {
        e.preventDefault()
        saveCurrentWorkoutToLog()
            // Writing the entire text OFFSCREEN is perfectly fine. It's like pre-rendering.
            .then((workout) => { writeWorkoutLogToScreen() })
            .catch((err) => console.error("Couldn't write workout.", err))

        $temporaryLog.textContent = ''
    }
})

document.querySelector('[data-action="edit-current-workout"]').addEventListener('click', (e) => {
    readCurrentWorkout()
        .then(workout => {
            openDialogForEditingWorkout($editCurrentWorkoutDialog, workout)
        })
})

document.addEventListener('db:ready', (e) => {
    writeCurrentWorkoutToScreen()
    writeWorkoutLogToScreen()
})

function writeCurrentWorkoutToScreen() {
    readCurrentWorkout()
        .then((workout) => {
            let format = localStorage.getItem('exerciseFormat')
            if (workout) $temporaryLog.textContent =
                `${workoutToText.call(workout, format)}${(format == 'single') ? '\n' : '\n\n'}`
        })
}


export function writeWorkoutLogToScreen() {
    readWorkoutLog()
        .then(workouts => {
            const exerciseFormat = localStorage.getItem('exerciseFormat')
            const workoutsText = workoutLogToText.call(workouts, exerciseFormat)

            document.querySelector('.workout-log').textContent = workoutsText

            // Map line numbers to workouts on screen
            let lineCount = 0
            workoutPositionMap = workouts.reduce((map, workout) => {
                lineCount += linesPerWorkout(workout, exerciseFormat)
                map.set(lineCount, workout.timestamp)
                return map
            }, workoutPositionMap)
        })
}

const $workoutLog = document.querySelector('.workout-log')

// TODO INCORRECT!!!
// Handle "New Exercise" button in edit dialog
document.getElementById('add-exercise-btn')?.addEventListener('click', () => {
    const $modifyWorkout = document.querySelector('#modify-workout')
    if ($modifyWorkout && $modifyWorkout._addExercise) {
        $modifyWorkout._addExercise()
    }
})

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
    let maxIterations = 1000
    // TODO Infinite loop if the number is greater than every
    while (!workoutPositionMap.get(i)) {
        i++
        maxIterations--
        if (maxIterations <= 0) {
            console.error('Could not find workout at line:', lineNumber)
            console.error('Workout position map:', Array.from(workoutPositionMap.entries()))
            return
        }
    }

    const timestamp = workoutPositionMap.get(i)

    findWorkoutById(timestamp).then(workout => {
        openDialogForEditingWorkout($editWorkoutDialog, workout)
    }).catch(err => {
        console.error('Error finding workout:', err)
    })
})

function openDialogForEditingWorkout(dialog, workout) {
    const $modifyWorkout = dialog.querySelector('modify-workout')
    $modifyWorkout.workout = workout

    dialog.showModal()
}

// TODO feature limited 
document.querySelector('[data-action="export-csv"]').addEventListener('click', async () => {
    try {
        const workoutLog = await readWorkoutLog()
        const csvString = workoutLogToCsv.call(workoutLog)

        const blob = new Blob([csvString], { type: 'text/csv' })
        const file = new File([blob], 'workout-log.csv', { type: 'text/csv' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Workout Log',
                text: 'Here is my exported workout data.'
            })
        } else {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'workout-log.csv'
            a.click()
            URL.revokeObjectURL(url)
        }
    } catch (err) {
        console.error("Couldn't export workout log", err)
    }
})