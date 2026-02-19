class Exercise extends HTMLElement {

    connectedCallback() {
        this.innerHTML = this.render()

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
            }

        })

        this.querySelector('#new-exercise-btn')
            .addEventListener('click', () => {
                this.newExercise()
            })
    }


    render() {
        return /*html*/`
        <form action="finish-exercise" class="current-exercise">
            <h2>Exercise</h2>
            <label data-field>Exercise Name
                <input type="text" name="exercise-name" id="exercise-input" required>
            </label>

            <exercise-input></exercise-input>

            <label data-field>Comment
                <input type="text" id="comment" name="comment">
            </label>

            <div class="exercise-actions">
                <button type="button" class="outline" id="new-exercise-btn">
                    <svg><use href="#dumbbell"></use></svg>
                    New Exercise
                </button>
                <button type="submit" id="finish-btn">
                    <svg><use href="#check"></use></svg>
                    Finish Exercise
                </button>
            </div>

        </form>
        `
    }

    newExercise() {
        this.after(document.createElement('the-exercise'))
    }
}

customElements.define('the-exercise', Exercise)