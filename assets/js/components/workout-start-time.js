class WorkoutStartTime extends HTMLElement {

    connectedCallback() {
        this.innerHTML = "<time></time>"
        
        const $time = this.querySelector('time');
        const now = new Date();

        $time.textContent = now.toLocaleDateString(navigator.language, {
            month: 'long', day: 'numeric', year: 'numeric'
        });

        // Will have to localize for Serbian
        $time.setAttribute('datetime', now.toISOString());
    }
}

customElements.define('workout-start-time', WorkoutStartTime)
