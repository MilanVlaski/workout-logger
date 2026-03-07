import { LitElement, html } from 'lit'

class ExerciseInputs extends LitElement {

  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <label data-field>Exercise Name
        <input type="search" name="exercise-name" required>
      </label>

      <exercise-input></exercise-input>

      <label data-field>Comment
        <input type="search" name="comment">
      </label>
    `
  }

  value() {
    const nameInput = this.querySelector('[name="exercise-name"]')
    const commentInput = this.querySelector('[name="comment"]')
    const exerciseInputs = this.querySelectorAll('exercise-input')

    return {
      name: nameInput.value,
      setsWithWeight: Array.from(exerciseInputs).map(input => input.value()),
      comment: commentInput.value
    }
  }
}

customElements.define('exercise-inputs', ExerciseInputs)
