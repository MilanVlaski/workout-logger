import { LitElement, html } from 'lit'

/*
  Represents an array of numbers, representing reps.
*/
class AllReps extends LitElement {

  static get properties() {
    return {
      reps: { state: true }
    }
  }

  createRenderRoot() {
    return this // Render in light DOM
  }

  constructor() {
    super()
    this.reps = [null] // Start with one null value
  }

  firstUpdated() {
    this.addEventListener('reset', () => {
      this.reps = [null]
    })
  }

  value() {
    return this.reps.filter(Boolean)
  }

  render() {
    return html`
      <label data-field>Reps
        <div class="all-reps">
          ${this.reps.map((repValue, index) => html`
            <input
              type="text"
              inputmode="numeric"
              name="reps"
              .value=${repValue || ''}
              @input=${(e) => this._updateRep(index, e.target.value)}
            >
          `)}
        </div>
      </label>
      <div class="half-screen-buttons">
        <button
          type="button"
          data-variant="danger"
          class="outline"
          ?disabled=${this.reps.length === 1}
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

  _updateRep(index, value) {
    this.reps = [...this.reps.slice(0, index), value, ...this.reps.slice(index + 1)]
  }

  _addReps() {
    this.reps = [...this.reps, null]
  }

  _removeReps() {
    if (this.reps.length > 1) {
      this.reps = this.reps.slice(0, -1)
    }
  }
}

customElements.define('all-reps', AllReps)
