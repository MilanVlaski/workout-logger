const demoData = {
    "exercise-name": "Pullups",
    reps: "12",
    comment: "Was a good workout!",
    weight: "1200lbs"
};

const $demoBtn = document.createElement('button')
$demoBtn.textContent = 'Data'
$demoBtn.classList.add('warning')

document.querySelector('header>nav')
    .append($demoBtn)

$demoBtn.addEventListener('click', (e) => { fillForm() })

const $useCase = document.createElement('button')
$useCase.classList.add('primary')
$useCase.textContent = 'Use Case'
document.querySelector('header>nav')
    .append($useCase)


$useCase.addEventListener('click', (e) => {
    fillForm()
    setTimeout(
        finishExercise, 200
    )
})

function fillForm() {
    Object.keys(demoData).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = demoData[key]
        }
    })
}

function finishExercise() {
    const $finishBtn = document.querySelector('#finish-btn')
    $finishBtn.click()
}
