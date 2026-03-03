const exerciseInputTemplate = document.getElementById('exercise-input')
const $exerciseInputTemplate = exerciseInputTemplate.content.cloneNode(true).firstElementChild

class ExerciseInput extends HTMLElement {

    connectedCallback() {
        this.render();
        this.querySelector('#new-weight-btn')
            .addEventListener('click', () => this.newWeight());
    }

    render() {
        const $element = $exerciseInputTemplate.cloneNode(true)
        if (this.hasAttribute('closeable')) {
            const $closeBtn = document.createElement('close-btn')
            $closeBtn.addEventListener('click', () => { this.remove() })
            $element.prepend($closeBtn)
        }
        this.replaceChildren($element);
    }

    newWeight() {
        const $exerciseInput = document.createElement('exercise-input')
        $exerciseInput.setAttribute('closeable', '')
        this.after($exerciseInput);
    }

    value() {
        return {
            weight: this.querySelector('[name="weight"]').value,
            reps: this.querySelector('all-reps').value()
        }
    }
}

customElements.define('exercise-input', ExerciseInput);
