import { LitElement, html } from 'lit'

/*
  Represents a setWithWeight, in terms of data.
*/
class ExerciseInput extends LitElement {

  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <div class="exercise-input">
        ${this.hasAttribute('closeable') ? html`
          <close-btn @click=${() => this._handleClose()}></close-btn>
        ` : ''}
        <all-reps></all-reps>
        <label data-field>Weight
          <div class="half-screen-buttons">
            <input type="search" name="weight">
            <button type="button" class="outline" data-action="add-new-weight" @click=${this._newWeight}>
              <svg>
                <use href="#weight"></use>
              </svg>
              New Weight
            </button>
          </div>
        </label>
      </div>
    `
  }

  _newWeight() {
    const newInput = document.createElement('exercise-input')
    newInput.setAttribute('closeable', '')
    this.after(newInput)

    // Dispatch event to parent exercise-inputs
    this.dispatchEvent(new CustomEvent('add-set', { bubbles: true }))
  }

  value() {
    const weightInput = this.querySelector('[name="weight"]')
    const allReps = this.querySelector('all-reps')
    return {
      weight: weightInput.value,
      reps: allReps.value()
    }
  }

  setValue({ weight = '', reps = [] }) {
    const weightInput = this.querySelector('[name="weight"]')
    const allReps = this.querySelector('all-reps')

    if (weightInput) weightInput.value = weight
    if (allReps) {
      // Set reps array on all-reps component
      allReps.reps = reps.length > 0 ? [...reps] : [null]
    }
  }

  _handleClose() {
    // Dispatch event before removing
    this.dispatchEvent(new CustomEvent('remove-set', { bubbles: true }))
    this.remove()
  }
}

customElements.define('exercise-input', ExerciseInput)
