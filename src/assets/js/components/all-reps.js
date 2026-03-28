import { LitElement, html } from 'lit'

/*
  Represents an array of numbers, representing reps.
*/
class AllReps extends LitElement {
  static properties = { data: { type: Array } }

  createRenderRoot() {
    return this // Render in light DOM
  }

  firstUpdated() {
    this.addEventListener('reset', () => {
      this._resetReps()
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
    const reps = this.data && this.data.length > 0 ? this.data : ['']
    return html`
    <label data-field for="all-reps">Reps</label>
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
      <div class="all-reps" id="all-reps">
        ${reps.map(v => html`<input type="text" inputMode="numeric" name="reps" .value=${String(v)}>`)}
        <button type="button" class="primary" @click=${this._addReps}>+</button>
      </div>
    `
  }

  _createRepInput() {
    const input = document.createElement('input')
    input.type = 'text'
    input.inputMode = 'numeric'
    input.name = 'reps'
    return input
  }

  _resetReps() {
    const container = this.querySelector('.all-reps')
    container.innerHTML = ''
    container.appendChild(this._createRepInput())
  }

  _addReps() {
    const container = this.querySelector('.all-reps')
    const plusButton = container.querySelector('button')
    container.insertBefore(this._createRepInput(), plusButton)
    ;[...this.querySelectorAll('[name="reps"]')].at(-1)?.focus()
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
