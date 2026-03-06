const exerciseInput = document.getElementById('exercise-inputs')
const $exerciseInputs  = exerciseInput.content.cloneNode(true)

class ExerciseInputs extends HTMLElement {

    exercise = null

    connectedCallback() {
        this.render()
    }

    render() {
        this.replaceChildren($exerciseInputs.cloneNode(true))
        
    }
}

customElements.define('exercise-inputs', ExerciseInputs)
