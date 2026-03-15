import { LitElement, html } from 'lit'
/*
  Component for modifying an existing workout.
*/
class ModifyWorkout extends LitElement {

  createRenderRoot() {
    return this
  }

  render() {
    return html`
    `
  }

  value() {
    const exerciseInputs = this.querySelectorAll('exercise-inputs')
    return {
      exercises: Array.from(exerciseInputs).map(input => input.value()),
      timestamp: this.timestamp || Date.now()
    }
  }

  setWorkout(workout) {
    // Store timestamp for value() method
    this.timestamp = workout.timestamp

    // Clear existing content
    this.innerHTML = ''

    // Create exercise containers for each exercise
    const exercisesToRender = workout.exercises.length > 0 ? [...workout.exercises] : [{ name: '', setsWithWeight: [{}], comment: '' }]
    exercisesToRender.forEach((exercise, index) => {
      const container = document.createElement('div')
      container.className = 'exercise-container'

      if (index > 0) {
        const closeBtn = document.createElement('close-btn')
        closeBtn.addEventListener('click', () => this._removeExercise(index))
        container.appendChild(closeBtn)
      }

      const exerciseInputs = document.createElement('exercise-inputs')
      exerciseInputs.setValue(exercise)
      container.appendChild(exerciseInputs)

      this.appendChild(container)
    })
  }

  _addExercise() {
    const container = document.createElement('div')
    container.className = 'exercise-container'

    const closeBtn = document.createElement('close-btn')
    closeBtn.addEventListener('click', () => {
      const containers = this.querySelectorAll('.exercise-container')
      const index = Array.from(containers).indexOf(container)
      if (index !== -1) {
        this._removeExercise(index)
      }
    })
    container.appendChild(closeBtn)

    const exerciseInputs = document.createElement('exercise-inputs')
    container.appendChild(exerciseInputs)

    this.appendChild(container)
  }

  _removeExercise(index) {
    const containers = this.querySelectorAll('.exercise-container')
    if (containers.length > 1 && index >= 0 && index < containers.length) {
      containers[index].remove()
    }
  }
}

customElements.define('modify-workout', ModifyWorkout)