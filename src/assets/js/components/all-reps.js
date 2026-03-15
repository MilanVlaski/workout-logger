import { LitElement, html } from 'lit'

/*
  Represents an array of numbers, representing reps.
*/
class AllReps extends LitElement {

  createRenderRoot() {
    return this // Render in light DOM
  }

  firstUpdated() {
    this.addEventListener('reset', () => {
      this.setValue([])
    })
  }

  value() {
    const repsInputs = this.querySelectorAll('[name="reps"]')
    return Array.from(repsInputs)
      .map(input => input.value)
      .filter(Boolean)
      .map(Number)
  }

  render() {
    return html`
      <label data-field>Reps
        <div class="all-reps">
          <input
            type="text"
            inputmode="numeric"
            name="reps"
            value=""
          >
        </div>
      </label>
      <div class="half-screen-buttons">
        <button
          type="button"
          data-variant="danger"
          class="outline"
          @click=${this._removeReps}
        >
          <svg>
            <use href="#remove"></use>
          </svg>
          Remove Reps
        </button>
        <button type="button" class="outline" data-action="add-reps" @click=${this._addReps}>
          <svg>
            <use href="#add"></use>
          </svg>
          Add Reps
        </button>
      </div>
    `
  }

  setValue(reps = []) {
    const container = this.querySelector('.all-reps')
    if (!container) return

    // Clear existing inputs
    container.innerHTML = ''

    // Create inputs for each rep (or empty one if no reps)
    const valuesToRender = reps.length > 0 ? [...reps] : ['']
    valuesToRender.forEach(repValue => {
      const input = document.createElement('input')
      input.type = 'text'
      input.inputMode = 'numeric'
      input.name = 'reps'
      input.value = repValue
      container.appendChild(input)
    })
  }

  _addReps() {
    const container = this.querySelector('.all-reps')
    if (!container) return

    const input = document.createElement('input')
    input.type = 'text'
    input.inputMode = 'numeric'
    input.name = 'reps'
    input.value = ''
    container.appendChild(input)
  }

  _removeReps() {
    const container = this.querySelector('.all-reps')
    if (!container) return

    const inputs = container.querySelectorAll('[name="reps"]')
    if (inputs.length > 1) {
      container.removeChild(inputs[inputs.length - 1])
    }
  }
}

customElements.define('all-reps', AllReps)
