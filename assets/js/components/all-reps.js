const repsTemplate = document.getElementById('reps-input')
const $repsTemplate  = repsTemplate.content.cloneNode(true).firstElementChild

class AllReps extends HTMLElement {

    connectedCallback() {
        this.render()
    }

    render() {
        this.innerHTML = /*html*/`
        <label data-field>Reps
        <div class="all-reps">
            <input type="text" inputmode="numeric" name="reps">
        </div>
        </label>
        <div class="half-screen-buttons">
            <button type="button" data-variant="danger" class="outline">
                <svg><use href="#remove"></use></svg>
                Remove Reps
            </button>
            <button type="button" class="outline" id="add-reps">
                <svg><use href="#add"></use></svg>
                Add Reps
            </button>
        </div>
        `

        this.querySelector('#add-reps').addEventListener('click', () => this.addReps())
        this.querySelector('button[data-variant="danger"]').addEventListener('click', () => this.removeReps())
        this.addEventListener('reset', () => { this.render() })
    }

    addReps() {
        const $reps = $repsTemplate.cloneNode(true)
        this.querySelector('.all-reps')
            .append($reps)

        requestAnimationFrame(() => {
            $reps.focus()
        })
    }

    removeReps() {
        const container = this.querySelector('.all-reps');

        if (container.childElementCount > 1) {
            container.lastElementChild.remove();
        } else {
            console.warn("You must keep at least one set of reps!");
        }
    }
}

customElements.define('all-reps', AllReps)
