class Exercise extends HTMLElement {

    connectedCallback() {
        this.innerHTML = this.render()

        this.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log(e.target.getAttribute('action'))

            if(e.target.getAttribute('action') === 'finish-exercise') {
                const formData = new FormData(e.target)
                console.log('mariska')
                console.log(Object.fromEntries(formData))
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
            <label for="exercise-input">Exercise Name</label>
            <input type="text" name="exercise-name" id="exercise-input">
            
            <exercise-input></exercise-input>
        
            <label for="comment">Comment</label>

            <input type="text" id="comment" name="comment">
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