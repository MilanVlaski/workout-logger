import { LitElement, html } from 'lit'
/*
  Component for modifying an existing workout.
*/
class ModifyWorkout extends LitElement {

  static get properties() {
    return {
      workout: { state: true }
    }
  }

  createRenderRoot() {
    return this
  }

  constructor() {
    super()
    this.workout = { exercises: [] }
  }

  render() {
    return html`
      ${this.workout.exercises.map((exercise, index) => html`
        <div class="exercise-container">
          ${index > 0 ? html`
            <close-btn @click=${() => this._removeExercise(index)}></close-btn>
          ` : ''}
          <exercise-inputs></exercise-inputs>
        </div>
      `)}
    `
  }

  value() {
    const exerciseInputs = this.querySelectorAll('exercise-inputs')
    return {
      exercises: Array.from(exerciseInputs).map(input => input.value()),
      timestamp: this.workout.timestamp
    }
  }

  setWorkout(workout) {
    this.workout = workout
    // Need to update child exercise-inputs components with data
    this.requestUpdate()

    // After update, set values on exercise-inputs children
    this.updateComplete.then(() => {
      const exerciseInputs = this.querySelectorAll('exercise-inputs')
      exerciseInputs.forEach((input, index) => {
        if (this.workout.exercises[index]) {
          input.setValue(this.workout.exercises[index])
        }
      })
    })
  }

  _removeExercise(index) {
    if (this.workout.exercises.length > 1) {
      this.workout.exercises = this.workout.exercises.filter((_, i) => i !== index)
      this.requestUpdate()
    }
  }
}

customElements.define('modify-workout', ModifyWorkout)