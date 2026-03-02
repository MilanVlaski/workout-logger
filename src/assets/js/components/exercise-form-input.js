const exerciseFormInput = document.getElementById('exercise-form-input')
const $exerciseFormInput  = exerciseFormInput.content.cloneNode(true)

class ExerciseFormInput extends HTMLElement {

    exercise = null

    connectedCallback() {
        // exercise = {
        //     name: "pullups",
        //     setsWithWeight: [
        //         {weight: "120kg"}
        //     ]
        // }
        this.render()
    }

    render() {
        this.replaceChildren($exerciseFormInput.cloneNode(true))


    }
}

customElements.define('exercise-form-input', ExerciseFormInput)
