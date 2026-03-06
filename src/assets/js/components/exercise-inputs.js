const exerciseInput = document.getElementById('exercise-inputs')
const $exerciseInputs = exerciseInput.content.cloneNode(true)

class ExerciseInputs extends HTMLElement {

    exercise = null

    connectedCallback() {
        this.render()
    }

    render() {
        this.replaceChildren($exerciseInputs.cloneNode(true))
    }

    value() {
        return {
            name: this.querySelector('[name="exercise-name"]').value,
            setsWithWeight: [...this.querySelectorAll('exercise-input')].map(item => item.value()),
            comment: this.querySelector('[name="comment"]').value
        }
    }
}

customElements.define('exercise-inputs', ExerciseInputs)
