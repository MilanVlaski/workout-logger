class ExerciseInput extends HTMLElement {

    connectedCallback() {
        this.innerHTML = this.render()
        
        this.querySelector('#new-weight-btn')
            .addEventListener('click', (e) => this.newWeight())

        // TODO respond to formdata event, gather the inputs into an array, and pass it along, to exercise-input
        // { 
        //   weight: "120kg",
        //   reps: [1, 2, 3, 4]
        // }
    }

    render() {
        return /*html*/`
        <div class="exercise-input">
            <all-reps></all-reps>
            <label>Weight
            <div class=half-screen-buttons>
                <input type="text" id="weight" name="weight">
                <button type="button" class="primary outline" id="new-weight-btn">
                    <svg><use href="#weight"></use></svg>
                    New Weight
                </button>
            </div>
            </label>
        </div>
        `
    }

    newWeight() {
        /* TODO maybe add an X to these elements */
        this.after(document.createElement('hr'), document.createElement('exercise-input'))
    }
}

customElements.define('exercise-input', ExerciseInput)
