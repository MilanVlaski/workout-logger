import { LitElement, html } from 'lit'
/*
  Represents multiple setsWithWeight.
*/
class ExerciseInputs extends LitElement {
  static properties = { data: { type: Object } }

  createRenderRoot() {
    return this
  }

  render() {
    const name = this.data?.name || ''
    const comment = this.data?.comment || ''
    const setsWithWeight = this.data?.setsWithWeight?.length > 0
      ? this.data.setsWithWeight
      : [{}]
    return html`
      <label data-field>Exercise Name
        <input type="search" name="exercise-name" .value=${name} required>
      </label>

      ${setsWithWeight.map((setData, index) => html`
        <exercise-input
          ?closeable=${index > 0}
          .data=${setData}
        ></exercise-input>
      `)}

      <label data-field>Comment
        <input type="search" name="comment" .value=${comment}>
      </label>
    `
  }

  value() {
    const nameInput = this.querySelector('[name="exercise-name"]')
    const commentInput = this.querySelector('[name="comment"]')
    const exerciseInputs = this.querySelectorAll('exercise-input')

    return {
      name: nameInput?.value || '',
      setsWithWeight: Array.from(exerciseInputs).map(input => input.value()),
      comment: commentInput?.value || ''
    }
  }

  _addSet() {
    const commentLabel = this.querySelector('label[data-field] input[name="comment"]')?.parentElement
    if (!commentLabel) return

    const exerciseInput = document.createElement('exercise-input')
    exerciseInput.setAttribute('closeable', '')

    // Insert before comment label
    this.insertBefore(exerciseInput, commentLabel)
  }

  _removeSet(index) {
    const exerciseInputs = this.querySelectorAll('exercise-input')
    if (exerciseInputs.length > 1 && index >= 0 && index < exerciseInputs.length) {
      exerciseInputs[index].remove()
    }
  }
}

customElements.define('exercise-inputs', ExerciseInputs)
