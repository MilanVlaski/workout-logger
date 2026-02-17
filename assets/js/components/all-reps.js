const $repsTemplate = document.getElementById('reps').content.cloneNode(true).firstElementChild

class AllReps extends HTMLElement {

    connectedCallback() {
        this.innerHTML = /*html*/`
        <label>Reps</label>
        <div class="all-reps">
            <input type="text" inputmode="numeric" name="reps">
        </div>
        <div class="half-screen-buttons">
            <button class="danger outline">
                <svg><use href="#remove"></use></svg>
                Remove Reps
            </button>
            <button class="primary outline">
                <svg><use href="#add"></use></svg>
                Add Reps
            </button>
        </div>
        `

        this.querySelector('button.primary').addEventListener('click', () => this.addReps());
        this.querySelector('button.danger').addEventListener('click', () => this.removeReps());
    }

    addReps() {
        const $reps = $repsTemplate.cloneNode(true)
        this.querySelector('.all-reps')
            .append($reps)

        requestAnimationFrame(() => {
            if($reps) {
                $reps.focus()
                $reps.select()
            }
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
