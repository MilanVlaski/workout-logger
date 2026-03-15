import { LitElement, html } from 'lit'
/*
  Represents multiple setsWithWeight.
*/
class ExerciseInputs extends LitElement {

  createRenderRoot() {
    return this
  }

  firstUpdated() {
    // Add initial exercise-input if none exists
    setTimeout(() => {
      if (this.querySelectorAll('exercise-input').length === 0) {
        this._addSet()
      }
    })
  }

  render() {
    return html`
      <label data-field>Exercise Name
        <input type="search" name="exercise-name" required>
      </label>

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
      name: nameInput?.value || '',
      setsWithWeight: Array.from(exerciseInputs).map(input => input.value()),
      comment: commentInput?.value || ''
    }
  }

  setValue({ name = '', setsWithWeight = [], comment = '' }) {
    const nameInput = this.querySelector('[name="exercise-name"]')
    const commentInput = this.querySelector('[name="comment"]')

    if (nameInput) nameInput.value = name
    if (commentInput) commentInput.value = comment

    // Clear existing exercise-input children
    this.querySelectorAll('exercise-input').forEach(input => input.remove())

    // Create and insert exercise-input elements before comment field
    const commentLabel = this.querySelector('label[data-field] input[name="comment"]')?.parentElement
    if (!commentLabel) return

    const setsToRender = setsWithWeight.length > 0 ? [...setsWithWeight] : [{}]
    setsToRender.forEach((setData, index) => {
      const exerciseInput = document.createElement('exercise-input')
      if (index > 0) {
        exerciseInput.setAttribute('closeable', '')
      }

      // Insert before comment label
      this.insertBefore(exerciseInput, commentLabel)

      // Set data on the exercise-input
      exerciseInput.setValue(setData)
    })
  }

  _addSet() {
    const commentLabel = this.querySelector('label[data-field] input[name="comment"]')?.parentElement
    if (!commentLabel) return

    const exerciseInput = document.createElement('exercise-input')
    exerciseInput.setAttribute('closeable', '')

    // Insert before comment label
    this.insertBefore(exerciseInput, commentLabel)
  }

  _removeSet(index) {
    const exerciseInputs = this.querySelectorAll('exercise-input')
    if (exerciseInputs.length > 1 && index >= 0 && index < exerciseInputs.length) {
      exerciseInputs[index].remove()
    }
  }
}

customElements.define('exercise-inputs', ExerciseInputs)
