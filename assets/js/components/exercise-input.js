class ExerciseInput extends HTMLElement {

    connectedCallback() {
        this.innerHTML = this.render()
        
        this.querySelector('#new-weight-btn')
            .addEventListener('click', (e) => this.newWeight())
    }

    render() {
        return /*html*/`
        <div class="exercise-input">
            <all-reps></all-reps>
            <label>Weight
            <div class="half-screen-buttons">
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
