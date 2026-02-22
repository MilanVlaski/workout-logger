/*
If the script must keep working after navigation, this is how it's done.
We have to put this same script in the next page, and leave a "flag" for it to
read on 'load', and then it can execute the rest of the scenario.

// 1. Check if we have a pending task on page load
window.addEventListener('load', () => {
    if (localStorage.getItem('pendingFinish') === 'true') {
        localStorage.removeItem('pendingFinish');
        finishExercise();
    }
});

// 2. Set the flag before the action that causes navigation
$useCase.addEventListener('click', (e) => {
    fillForm();
    localStorage.setItem('pendingFinish', 'true');
    finishExercise(); // If this navigates, the 'load' listener above catches it on the next page.
});

*/


// Setup
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
$useCase.textContent = 'To Temp Log'
document.querySelector('header>nav')
    .append($useCase)
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
    const $finishBtn = document.querySelector('#finish-btn')
    $finishBtn.click()
}
