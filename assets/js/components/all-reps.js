const repsTemplate = document.getElementById('reps-input')
const $repsTemplate = repsTemplate.content.cloneNode(true)

const allReps = document.getElementById('all-reps')
const $allRepsTemplate  = allReps.content.cloneNode(true)

class AllReps extends HTMLElement {

    connectedCallback() {
        this.render()
    }

    render() {
        this.replaceChildren($allRepsTemplate.cloneNode(true))

        this.querySelector('#add-reps').addEventListener('click', () => this.addReps())
        this.querySelector('button[data-variant="danger"]').addEventListener('click', () => this.removeReps())
    }

    addReps() {
        const $reps = $repsTemplate.cloneNode(true).firstElementChild
        this.querySelector('.all-reps').append($reps)
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
