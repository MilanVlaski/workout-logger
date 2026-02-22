const repsTemplate = document.getElementById('reps-input')
const $repsTemplate = repsTemplate.content.cloneNode(true)

const allReps = document.getElementById('all-reps')
const $allRepsTemplate  = allReps.content.cloneNode(true)

class AllReps extends HTMLElement {

    $removeRepsBtn = null

    connectedCallback() {
        this.render()
    }

    render() {
        this.replaceChildren($allRepsTemplate.cloneNode(true))

        this.$removeRepsBtn = this.querySelector('button[data-variant="danger"]')
        this.$container = this.querySelector('.all-reps')

        this.querySelector('#add-reps').addEventListener('click', () => this.addReps())
        this.$removeRepsBtn.addEventListener('click', () => this.removeReps())

        this.$removeRepsBtn.disabled = true
        this.addEventListener('reset', () => { this.render() })
    }

    addReps() {
        const $reps = $repsTemplate.cloneNode(true).firstElementChild
        this.querySelector('.all-reps').append($reps)
        requestAnimationFrame(() => {
            $reps.focus()
        })

        if (this.querySelector('.all-reps').childElementCount > 1) {
            this.$removeRepsBtn.disabled = false
        }
    }

    removeReps() {
        const $container = this.querySelector('.all-reps')
        if ($container.childElementCount > 1) {
            $container.lastElementChild.remove();
        }

        if($container.childElementCount === 1) {
            this.$removeRepsBtn.disabled = true
        }
    }
}

customElements.define('all-reps', AllReps)
