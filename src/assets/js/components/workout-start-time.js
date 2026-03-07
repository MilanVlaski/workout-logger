import { LitElement, html } from 'lit'

class WorkoutStartTime extends LitElement {

  createRenderRoot() {
    return this
  }

  render() {
    const now = new Date()
    return html`
      <time datetime=${now.toISOString()}>
        ${now.toLocaleDateString(navigator.language, {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </time>
    `
  }
}

customElements.define('workout-start-time', WorkoutStartTime)
