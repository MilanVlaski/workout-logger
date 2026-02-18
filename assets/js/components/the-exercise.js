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
                    console.log(data)
                    e.target.reset()
                    const $el = document.querySelector('all-reps')
                    $el.render()
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
            <label>Exercise Name
                <input type="text" name="exercise-name" id="exercise-input">
            </label>
            
            <exercise-input></exercise-input>
        
            <label>Comment
                <input type="text" id="comment" name="comment">
            </label>

            <div class="exercise-actions">
                <button type="button" class="primary outline" id="new-exercise-btn">
                    <svg><use href="#dumbbell"></use></svg>
                    New Exercise
                </button>
                <button type="submit" class="primary" id="finish-btn">
                    <svg><use href="#finish"></use></svg>
                    Finish
                </button>
            </div>

        </form>
        `
    }

    newExercise() {
        this.after(document.createElement('hr'), document.createElement('the-exercise'))
    }
}

customElements.define('the-exercise', Exercise)