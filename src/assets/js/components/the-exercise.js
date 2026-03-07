import { LitElement, html } from 'lit'

class Exercise extends LitElement {

  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <form action="finish-exercise" class="current-exercise" @submit=${this._handleSubmit}>
        ${this.hasAttribute('closeable') ? html`
          <close-btn @click=${() => this.remove()}></close-btn>
        ` : ''}
        <h2>Exercise</h2>
        <exercise-inputs></exercise-inputs>

        <div class="exercise-actions">
          <button type="button" class="outline" data-action="add-new-exercise" @click=${this._addNewExercise}>
            <svg>
              <use href="#dumbbell"></use>
            </svg>
            New Exercise
          </button>
          <button type="submit" data-action="finish-exercise">
            <svg>
              <use href="#check"></use>
            </svg>
            Finish Exercise
          </button>
        </div>
      </form>
    `
  }

  _handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    if (form.getAttribute('action') === 'finish-exercise') {
      const exerciseInputs = this.querySelector('exercise-inputs')
      const data = exerciseInputs.value()

      form.reset() // This will trigger reset event on form, which bubbles to all-reps

      this.dispatchEvent(new CustomEvent('exercise:finish', {
        detail: data,
        bubbles: true
      }))

      // Remove all closeable exercise-input children
      this.querySelectorAll('exercise-input[closeable]').forEach((it) => {
        it.remove()
      })

      if (this.hasAttribute('closeable')) {
        this.remove()
      }
    }
  }

  _addNewExercise() {
    const newExercise = document.createElement('the-exercise')
    newExercise.setAttribute('closeable', '')
    this.after(newExercise)
  }
}

customElements.define('the-exercise', Exercise)
