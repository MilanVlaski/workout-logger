import { db } from "./db.js"
import { writeWorkoutLogToScreen } from "./main.js"

// Setup
const demoData = {
    "exercise-name": "Pullups",
    reps: '12',
    comment: "Was a good workout!",
    weight: "1200lbs"
}

const $resetDbBtn = document.createElement('button')
$resetDbBtn.textContent = 'Reset IndexedDB'
$resetDbBtn.addEventListener('click', (e) => {
    indexedDB.deleteDatabase('WorkoutDB')
    location.reload()
})


const $demoBtn = document.createElement('button')
$demoBtn.textContent = 'Data'
$demoBtn.classList.add('warning')



$demoBtn.addEventListener('click', (e) => { fillForm() })

const $useCase = document.createElement('button')
$useCase.classList.add('primary')
$useCase.textContent = 'To Temp Log'

const $dbTestData = document.createElement('button')
$dbTestData.textContent = 'Fill Workout Log'

$dbTestData.addEventListener('click', async () => {
    const exercises = ['Pullups', 'Pushups', 'Squats', 'Deadlift', 'Bench Press']
    const generatedData = generateWorkoutData(exercises, 50, 5)

        new Promise((resolve, reject) => {
            const transaction = db.transaction(['workouts'], 'readwrite')

            generatedData.forEach(workout => transaction.objectStore('workouts').add(workout))
    
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)
        })
        writeWorkoutLogToScreen()
})

document.querySelector('nav')
    .append(
        $demoBtn,
        $resetDbBtn,
        $useCase,
        $dbTestData
    )
// Setup

// Test

$useCase.addEventListener('click', (e) => {
    fillForm()
    setTimeout(
        finishExercise, 200
    )
})
// Test
function fillForm() {
    Object.keys(demoData).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`)
        if (input) {
            input.value = demoData[key]
        }
    })
}

function finishExercise() {
    const $finishBtn = document.querySelector('[data-action="finish-exercise"]')
    $finishBtn.click()
}

/**
 * Generates synthetic exercise workout data.
 * * @param {string[]} exerciseNames - Array of available exercise names.
 * @param {number} daysBack - Number of days to generate data for (going back from today).
 * @param {number} exercisesPerDay - Number of exercises per daily log.
 * @returns {Array} - The generated JSON data.
 */
function generateWorkoutData(exerciseNames, daysBack, exercisesPerDay) {
    const data = []
    const today = new Date()

    const comments = ["Great session!", "Felt weak.", "Solid PR!", "Fix form."]

    for (let i = 0; i < daysBack; i++) {
        const logDate = new Date(today)
        logDate.setDate(today.getDate() - i)
        logDate.setHours(Math.floor(Math.random() * 24))
        logDate.setMinutes(Math.floor(Math.random() * 60))

        const dailyExercises = []
        const shuffledNames = [...exerciseNames].sort(() => 0.5 - Math.random())
        const selectedExercises = shuffledNames.slice(0, exercisesPerDay)

        for (const name of selectedExercises) {
            const setsWithWeight = []
            const totalSets = Math.floor(Math.random() * 4) + 1 // 1-4 sets

            // Randomly decide where to split the sets for a weight change
            // splitPoint will be between 0 (no change) and totalSets
            const splitPoint = Math.floor(Math.random() * (totalSets + 1))

            // Group 1
            if (splitPoint > 0) {
                const weight1 = `${Math.floor(Math.random() * 100) + 20}kg`
                const reps1 = []
                for (let s = 0; s < splitPoint; s++) {
                    reps1.push(Math.floor(Math.random() * 26) + 5)
                }
                setsWithWeight.push({ weight: weight1, reps: reps1 })
            }

            // Group 2
            if (splitPoint < totalSets) {
                const weight2 = `${Math.floor(Math.random() * 100) + 20}kg`
                const reps2 = []
                for (let s = splitPoint; s < totalSets; s++) {
                    reps2.push(Math.floor(Math.random() * 26) + 5)
                }
                setsWithWeight.push({ weight: weight2, reps: reps2 })
            }

            dailyExercises.push({
                name: name,
                setsWithWeight: setsWithWeight,
                comment: Math.random() > 0.5 ? comments[Math.floor(Math.random() * comments.length)] : ""
            })
        }

        data.push({
            timestamp: logDate.toISOString(),
            exercises: dailyExercises
        })
    }

    return data
}
