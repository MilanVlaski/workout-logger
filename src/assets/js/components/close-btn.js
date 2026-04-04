import { LitElement, html } from './../lit.js'

class CloseButton extends LitElement {

  createRenderRoot() {
    return this
  }

  render() {
    return html`
      <button style="display: block; margin-inline-start: auto; padding: var(--space-1);" type="button" class="ghost small" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <use href="#x"></use>
        </svg>
      </button>
    `
  }
}

customElements.define('close-btn', CloseButton)
