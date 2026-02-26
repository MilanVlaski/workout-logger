// Setup
const demoData = {
    "exercise-name": "Pullups",
    reps: '12',
    comment: "Was a good workout!",
    weight: "1200lbs"
};

const $resetDbBtn = document.createElement('button')
$resetDbBtn.textContent = 'Reset IndexedDB'
$resetDbBtn.addEventListener('click', (e) => {
    indexedDB.deleteDatabase('WorkoutDB')
})


const $demoBtn = document.createElement('button')
$demoBtn.textContent = 'Data'
$demoBtn.classList.add('warning')



$demoBtn.addEventListener('click', (e) => { fillForm() })

const $useCase = document.createElement('button')
$useCase.classList.add('primary')
$useCase.textContent = 'To Temp Log'

document.querySelector('nav')
    .append(
        $demoBtn,
        $resetDbBtn,
        $useCase
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
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = demoData[key]
        }
    })
}

function finishExercise() {
    const $finishBtn = document.querySelector('#finish-exercise-btn')
    $finishBtn.click()
}

