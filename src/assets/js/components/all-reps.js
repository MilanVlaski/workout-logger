import { LitElement, html } from 'lit'

class AllReps extends LitElement {

  static get properties() {
    return {
      _repsCount: { state: true }
    }
  }

  createRenderRoot() {
    return this // Render in light DOM
  }

  constructor() {
    super()
    this._repsCount = 1
  }

  firstUpdated() {
    this.addEventListener('reset', () => {
      this._repsCount = 1
    })
  }

  value() {
    const inputs = this.querySelectorAll('input[name="reps"]')
    return Array.from(inputs).map(i => i.value).filter(Boolean)
  }

  render() {
    return html`
      <label data-field>Reps
        <div class="all-reps">
          ${Array.from({ length: this._repsCount }).map(() => html`
            <input type="text" inputmode="numeric" name="reps">
          `)}
        </div>
      </label>
      <div class="half-screen-buttons">
        <button
          type="button"
          data-variant="danger"
          class="outline"
          ?disabled=${this._repsCount === 1}
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

  _addReps() {
    this._repsCount++
    this.requestUpdate('_repsCount')
  }

  _removeReps() {
    if (this._repsCount > 1) {
      this._repsCount--
    }
  }
}

customElements.define('all-reps', AllReps)
