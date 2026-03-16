import { LitElement, html } from 'lit'
/*
  Component for modifying an existing workout.
*/
class ModifyWorkout extends LitElement {
  static properties = { workout: { type: Object } }

  createRenderRoot() {
    return this
  }

  render() {
    if (!this.workout) return html``
    const exercises = this.workout.exercises?.length > 0
      ? this.workout.exercises
      : [{ name: '', setsWithWeight: [{}], comment: '' }]
    return html`
      ${exercises.map((exercise, index) => html`
        <div class="exercise-container">
          ${index > 0 ? html`
            <close-btn @click=${() => this._removeExercise(index)}></close-btn>
          ` : ''}
          <exercise-inputs .data=${exercise}></exercise-inputs>
        </div>
      `)}
    `
  }

  value() {
    const exerciseInputs = this.querySelectorAll('exercise-inputs')
    return {
      exercises: Array.from(exerciseInputs).map(input => input.value()),
      timestamp: this.workout?.timestamp || Date.now()
    }
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
