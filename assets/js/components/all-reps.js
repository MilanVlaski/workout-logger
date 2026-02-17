const reps = document.getElementById('reps')
const $repsTemplate = reps.content.cloneNode(true)

class AllReps extends HTMLElement {

    addReps() {
        this.querySelector('.all-reps')
            .append($repsTemplate.cloneNode(true))
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
