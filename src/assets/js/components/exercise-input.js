import { LitElement, html } from 'lit'

class ExerciseInput extends LitElement {

  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <div class="exercise-input">
        ${this.hasAttribute('closeable') ? html`
          <close-btn @click=${() => this.remove()}></close-btn>
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
  }

  value() {
    const weightInput = this.querySelector('[name="weight"]')
    const allReps = this.querySelector('all-reps')
    return {
      weight: weightInput.value,
      reps: allReps.value()
    }
  }
}

customElements.define('exercise-input', ExerciseInput)
