const exerciseInputTemplate = document.getElementById('exercise-input')
const $exerciseInputTemplate  = exerciseInputTemplate.content.cloneNode(true).firstElementChild

class ExerciseInput extends HTMLElement {

    connectedCallback() {
        this.render();
        this.querySelector('#new-weight-btn')
            .addEventListener('click', () => this.newWeight());
    }

    render() {
        this.innerHTML = '';
        this.appendChild($exerciseInputTemplate.cloneNode(true));
    }

    newWeight() {
        this.after(document.createElement('hr'), document.createElement('exercise-input'));
    }
}

customElements.define('exercise-input', ExerciseInput);
