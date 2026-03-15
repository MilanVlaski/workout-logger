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
    this.setValue()
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
        <div class="all-reps"></div>
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
    const valuesToRender = reps.length > 0 ? [...reps] : ['']
    valuesToRender.forEach(repValue => {
      this.querySelector('.all-reps').appendChild(this._createRepInput(repValue))
    })
  }

  _addReps() {
    this.querySelector('.all-reps').appendChild(this._createRepInput(''))
    requestAnimationFrame(() => 
      // focus last element
      [...this.querySelectorAll('[name="reps"]')].at(-1)?.focus()
    )
  }

  _createRepInput(value = '') {
    const input = document.createElement('input')
    input.type = 'text'
    input.inputMode = 'numeric'
    input.name = 'reps'
    input.value = value
    return input
  }

  _removeReps() {
    const container = this.querySelector('.all-reps')

    const inputs = container.querySelectorAll('[name="reps"]')
    if (inputs.length > 1) {
      container.removeChild(inputs[inputs.length - 1])
    }
  }
}

customElements.define('all-reps', AllReps)
