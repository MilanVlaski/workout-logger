import { LitElement, html } from 'lit'

/*
  Represents a setWithWeight, in terms of data.
*/
class ExerciseInput extends LitElement {
  static properties = { data: { type: Object } }

  createRenderRoot() {
    return this
  }

  render() {
    const weight = this.data?.weight || ''
    const reps = this.data?.reps || []
    return html`
    <label data-field>Weight
      <div class="half-screen-buttons">
        <input type="search" name="weight" .value=${weight}>
        <button type="button" class="outline" data-action="add-new-weight" @click=${this._newWeight}>
          <svg>
            <use href="#weight"></use>
          </svg>
          New Weight
        </button>
      </div>
    </label>
    
      <div class="exercise-input">
        ${this.hasAttribute('closeable') ? html`
          <close-btn @click=${() => this._handleClose()}></close-btn>
        ` : ''}
        <all-reps .data=${reps}></all-reps>
      </div>
    `
  }

  _newWeight() {
    const newInput = document.createElement('exercise-input')
    newInput.setAttribute('closeable', '')
    this.after(newInput)

    // Call parent exercise-inputs to add this new set
    const parent = this.closest('exercise-inputs')
    if (parent && parent._addSet) {
      parent._addSet()
    }
  }

  value() {
    const weightInput = this.querySelector('[name="weight"]')
    const allReps = this.querySelector('all-reps')
    return {
      weight: weightInput.value,
      reps: allReps.value()
    }
  }

  _handleClose() {
    // Call parent exercise-inputs to remove this set
    const parent = this.closest('exercise-inputs')
    if (parent && parent._removeSet) {
      const exerciseInputs = parent.querySelectorAll('exercise-input')
      const index = Array.from(exerciseInputs).indexOf(this)
      if (index !== -1) {
        parent._removeSet(index)
      }
    }
  }
}

customElements.define('exercise-input', ExerciseInput)
