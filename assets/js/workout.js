const $startExercise = document.querySelector('form[action="start-exercise"')
$startExercise.addEventListener('submit', (e) => {
    e.preventDefault()

    const $currentWorkout = document.querySelector('.current-workout')
    console.log($currentWorkout)
    const $currentExercise = document.createElement('current-exercise')
    console.log($currentExercise)
    $currentExercise.setAttribute('name', new FormData(e.target).get('exercise-name'))

    $currentWorkout.after($currentExercise)
})
