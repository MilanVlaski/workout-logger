const theExerciseTemplate = document.getElementById('the-exercise')
const $theExerciseTemplate  = theExerciseTemplate.content.cloneNode(true)

class Exercise extends HTMLElement {

    connectedCallback() {
        this.render()

        this.addEventListener('submit', (e) => {
            e.preventDefault()

            if (e.target.getAttribute('action') === 'finish-exercise') {
                const formData = new FormData(e.target)

                const data = {}
                const setsWithWeight = []

                this.querySelectorAll('.exercise-input').forEach(item => {
                    const weightInput = item.querySelector('input[name="weight"]')
                    const repInputs = item.querySelectorAll('input[name="reps"]')

                    setsWithWeight.push({
                        weight: weightInput.value,
                        reps: Array.from(repInputs)
                            .map(rep => rep.value)
                            .filter(Boolean)
                    })
                })

                data.exerciseName = formData.get('exercise-name')
                data.comment = formData.get('comment')
                data.setsWithWeight = setsWithWeight

                e.target.reset()
                const $el = document.querySelector('all-reps')
                $el.render()

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

        this.querySelector('#new-exercise-btn')
            .addEventListener('click', () => {
                this.newExercise()
            })

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

    newExercise() {
        const $theExercise = document.createElement('the-exercise')
        $theExercise.setAttribute('closeable', '')
        this.after($theExercise)
    }
}

customElements.define('the-exercise', Exercise)