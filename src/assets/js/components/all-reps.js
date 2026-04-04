import { LitElement, html } from './../lit.js'

/*
  Represents an array of numbers, representing reps.
*/
class AllReps extends LitElement {
  static formAssociated = true
  static properties = { data: { type: Array } }

  createRenderRoot() {
    return this // Render in light DOM
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
    <label for="all-reps">Sets</label>
    <div class="all-reps-controls">
      <button
        type="button"
        data-variant="danger"
        class="outline"
        @click=${this._removeReps}
      > <svg>
          <use href="#remove"></use>
        </svg>
      </button>

      <output>${this._currentCount}</output>

      <button type="button" class="outline" data-action="add-reps" @click=${this._addReps}>
        <svg>
          <use href="#add"></use>
        </svg>
      </button>
    </div>
      <div class="all-reps" id="all-reps">
        ${reps.map(v => html`<input type="text" inputMode="numeric" name="reps" .value=${String(v)}>`)}
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

  formResetCallback() {
    const container = this.querySelector('.all-reps')
    container.innerHTML = ''
    container.appendChild(this._createRepInput())
    this.requestUpdate()
  }

  _addReps() {
    const container = this.querySelector('.all-reps')
    container.append(this._createRepInput())
      ;[...this.querySelectorAll('[name="reps"]')].at(-1)?.focus()
    this.requestUpdate()
  }

  _removeReps() {
    const container = this.querySelector('.all-reps')
    const inputs = container.querySelectorAll('[name="reps"]')
    if (inputs.length > 1) {
      container.removeChild(inputs[inputs.length - 1])
    }
    this.requestUpdate()
  }

  get _currentCount() {
    return this.querySelectorAll('[name="reps"]').length || 1
  }
}

customElements.define('all-reps', AllReps)
