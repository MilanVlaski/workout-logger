const theExerciseTemplate = document.getElementById('the-exercise')
const $theExerciseTemplate  = theExerciseTemplate.content.cloneNode(true)

class Exercise extends HTMLElement {


    connectedCallback() {
        this.render()

        this.addEventListener('submit', (e) => {
            e.preventDefault()

            if (e.target.getAttribute('action') === 'finish-exercise') {
                const formData = new FormData(e.target)

                let data = this.querySelector('exercise-inputs').value()

                e.target.reset()
                this.querySelector('all-reps').render()

                this.dispatchEvent(new CustomEvent('exercise:finish', {
                    detail: data, bubbles: true
                }))

                this.querySelectorAll('exercise-input[closeable]').forEach(it => {
                    it.remove()
                })

                if(this.hasAttribute('closeable')) {
                    this.remove()
                }
            }

        })

        this.querySelector('[data-action="add-new-exercise"]')
            .addEventListener('click', () => {this.addNewExercise()})

    }


    render() {
        const $element = $theExerciseTemplate.cloneNode(true)
        if (this.hasAttribute('closeable')) {
            const $closeBtn = document.createElement('close-btn')
            $closeBtn.addEventListener('click', () => { this.remove() })
            $element.prepend($closeBtn)
        }
        this.replaceChildren($element)
    }

    addNewExercise() {
        const $theExercise = document.createElement('the-exercise')
        $theExercise.setAttribute('closeable', '')
        this.after($theExercise)
    }
}

customElements.define('the-exercise', Exercise)