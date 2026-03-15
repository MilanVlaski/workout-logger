import { LitElement, html } from 'lit'
/*
  Represents multiple setsWithWeight.
*/
class ExerciseInputs extends LitElement {

  static get properties() {
    return {
      setsWithWeight: { state: true }
    }
  }

  createRenderRoot() {
    return this
  }

  constructor() {
    super()
    this.setsWithWeight = [{}] // Start with one empty set
  }

  firstUpdated() {
    // Listen for add-set events from exercise-input components
    this.addEventListener('add-set', () => {
      this.setsWithWeight = [...this.setsWithWeight, {}]
    })
  }

  render() {
    return html`
      <label data-field>Exercise Name
        <input type="search" name="exercise-name" required>
      </label>

      ${this.setsWithWeight.map((set, index) => html`
        <exercise-input
          ?closeable=${index > 0}
          @remove-set=${() => this._removeSet(index)}
        ></exercise-input>
      `)}

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

  setValue({ name = '', setsWithWeight = [], comment = '' }) {
    const nameInput = this.querySelector('[name="exercise-name"]')
    const commentInput = this.querySelector('[name="comment"]')

    if (nameInput) nameInput.value = name
    if (commentInput) commentInput.value = comment

    // Set setsWithWeight array
    this.setsWithWeight = setsWithWeight.length > 0 ? [...setsWithWeight] : [{}]

    // After update, set values on exercise-input children
    this.requestUpdate()
    this.updateComplete.then(() => {
      const exerciseInputs = this.querySelectorAll('exercise-input')
      exerciseInputs.forEach((input, index) => {
        if (this.setsWithWeight[index]) {
          input.setValue(this.setsWithWeight[index])
        }
      })
    })
  }

  _removeSet(index) {
    if (this.setsWithWeight.length > 1) {
      this.setsWithWeight = this.setsWithWeight.filter((_, i) => i !== index)
    }
  }
}

customElements.define('exercise-inputs', ExerciseInputs)
