class Workout extends HTMLElement {

    workout

    connectedCallback() {
        this.render()
    }

    render() {
        this.replaceChildren(document.createElement('the-exercise'))

        // 
    }
}

customElements.define('the-workout', Workout)
