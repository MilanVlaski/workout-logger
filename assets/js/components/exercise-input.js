// Template for exercise-input component
const exerciseInputTemplate = document.createElement('template');
exerciseInputTemplate.innerHTML = /*html*/`
<div class="exercise-input">
    <all-reps></all-reps>
    <label data-field>Weight
        <div class="half-screen-buttons">
            <input type="text" id="weight" name="weight">
            <button type="button" class="outline" id="new-weight-btn">
                <svg><use href="#weight"></use></svg>
                New Weight
            </button>
        </div>
    </label>
</div>
`;

class ExerciseInput extends HTMLElement {

    connectedCallback() {
        this.render();
        this.querySelector('#new-weight-btn')
            .addEventListener('click', () => this.newWeight());
    }

    render() {
        // Clear current content
        this.innerHTML = '';
        // Clone and attach the template
        this.appendChild(exerciseInputTemplate.content.cloneNode(true));
    }

    newWeight() {
        /* TODO maybe add an X to these elements */
        this.after(document.createElement('hr'), document.createElement('exercise-input'));
    }
}

customElements.define('exercise-input', ExerciseInput);
