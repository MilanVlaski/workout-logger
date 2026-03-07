# Lit Migration Plan

## Context
The workout logger app uses vanilla Web Components with HTML template cloning. We need to migrate all components to Lit while preserving:
- Same DOM structure and CSS classes (E2E tests rely on selectors)
- Same custom element names
- Same event dispatching (`exercise:finish`, etc.)
- Same attributes (`closeable`)
- Same dynamic element creation behavior

## Components to Migrate

**Already migrated:**
- `close-btn.js`
- `workout-start-time.js`

**Remaining (6 components):**
1. `all-reps.js` - Dynamic rep inputs with add/remove, uses `reps-input` template
2. `exercise-input.js` - Weight + reps wrapper, creates `all-reps`, supports `closeable`, creates new `exercise-input` dynamically
3. `exercise-inputs.js` - Container aggregating `exercise-input`s and comment, provides `value()`
4. `the-exercise.js` - Main form, dispatches `exercise:finish`, creates new exercises, supports `closeable`
5. `the-workout.js` - Stub component, currently just creates `the-exercise`
6. Any component loading issues in `index.html` - need to ensure order and imports work

## Migration Strategy

**For each component:**

1. **Replace class definition** with Lit's `LitElement` base class
2. **Use `@customElement` decorator** instead of `customElements.define()`
3. **Convert `render()`** to return Lit `html` template literal that **exactly matches** the original template structure (same HTML structure, class names, attributes, data attributes like `[data-action="..."]`, `[name="..."]`, etc.)
4. **Replace template cloning** with inline `html` literals in `render()` method
5. **Replace `connectedCallback()`** logic:
   - If it only calls `render()`, Lit handles this automatically
   - If it sets up event listeners, move those to `firstUpdated()` or use Lit's `@click`, `@submit` event handlers
   - If it mutates DOM directly, convert to reactive properties and render updates
6. **Replace `addEventListener()` calls** in render with Lit's directive syntax:
   - `@click=${this.handler}` instead of `addEventListener('click', ...)`
   - `@submit=${this.handleSubmit}` instead of form submit listeners
7. **Preserve public methods** like `value()` - keep them as regular methods (they're called from external code)
8. **Preserve attribute reflection** if any (e.g., `closeable` attribute). For boolean attributes, use `static properties = { closeable: { type: Boolean, reflect: true } }` or handle in `shouldUpdate`/`render`.
9. **Handle special properties**:
   - `closeable`: If present, prepend a `close-btn` in the render template with click handler that calls `this.remove()`
   - Dynamic child management (`addReps`, `removeReps`, `newWeight`, `addNewExercise`): Keep these as methods and update reactive state that triggers re-render
10. **Maintain shadow DOM behavior**: Lit uses shadow DOM by default (like `attachShadow({mode: 'open'})` in current code). This preserves style encapsulation.

**Special Cases:**

- **`all-reps.js`**: Manages an array of rep inputs. Need reactive property `repsCount` (or similar) that starts at 1. `addReps()` increments and triggers re-render. `removeReps()` decrements and triggers re-render. `value()` returns array of values from inputs. Must preserve the `reset` event listener that calls `render()`.

- **Template dependencies**: Some components rely on HTML templates in `index.html` (`$allRepsTemplate`, `$repsTemplate`, etc.). These templates must be converted to Lit `html` strings that match exactly. I'll copy the template content from index.html and convert to Lit syntax.

## Files to Modify

1. `src/assets/js/components/all-reps.js`
2. `src/assets/js/components/exercise-input.js`
3. `src/assets/js/components/exercise-inputs.js`
4. `src/assets/js/components/the-exercise.js`
5. `src/assets/js/components/the-workout.js`

## Implementation Order (dependency bottom-up)

1. `all-reps.js` (base component, used by others)
2. `exercise-input.js` (uses `all-reps`)
3. `exercise-inputs.js` (uses `exercise-input`)
4. `the-exercise.js` (uses `exercise-inputs`) - **critical, dispatches events**
5. `the-workout.js` (uses `the-exercise`)

## Verification

**Pass criteria:**
- `make test` - All unit tests pass (unchanged, as they only use `core.js`)
- `make slow-test` - All E2E Playwright tests pass
- Manual testing: Open the app, verify it works identically

**E2E test relies on:**
- Selecting `[name="exercise-name"]` and filling it
- Multiple `input[name="reps"]` fields and adding/removing them
- Clicking `[data-action="add-reps"]`, `[data-action="finish-exercise"]`
- Clicking `[data-action="add-new-weight"]`
- Final "Finish Workout" button
- Switching to Log tab and seeing formatted output

E2E tests should continue to pass if DOM structure, attributes, class names, and event flow remain unchanged.

## Risks & Mitigations

**Risk**: Lit's declarative rendering might re-render and lose focus.
- **Mitigation**: Use `requestAnimationFrame(() => input.focus())` as in original. Lit's virtual DOM doesn't disrupt focus if we carefully use `firstUpdated` and `updated` lifecycle for post-render DOM manipulation. For adding reps, we'll focus the new input after render.

**Risk**: `value()` method queries DOM (`this.querySelectorAll`) - still works with Lit shadow DOM.
- **Mitigation**: Keep as-is; Lit's shadow DOM is still accessible via querySelector.

**Risk**: Template differences - accidentally change structure.
- **Mitigation**: Copy exact template HTML from index.html, convert to Lit syntax, double-check class names and data attributes.

**Risk**: Event listeners on parent vs. delegated patterns.
- **Mitigation**: Current code uses `this.addEventListener('submit', ...)` and `querySelector('[data-action="..."]')`. We'll use Lit's `@submit=${this.handleSubmit}` and `@click=${...}` directly on elements. For dynamically created buttons (like add-reps), we'll need to attach after render or use event delegation (fallback to original pattern if needed).

## Step-by-Step

For each component file:
1. Read the original template from index.html (for those that have templates)
2. Convert the template HTML to a Lit `html` literal
3. Create a new file content with:
   - `import { LitElement, html, css } from 'lit'`
   - `import { customElement } from 'lit/decorators.js'`
   - `@customElement('element-name')`
   - `class ElementName extends LitElement { ... }`
   - `render()` returns the template literal
   - Convert event handlers to `@event` syntax or `firstUpdated()` setup
   - Reactive properties for dynamic state (e.g., `repsCount`)
   - Keep `value()` method if exposed
4. Test with `make test` and `make slow-test` after each migration or all at once

The plan allows parallel migration but I'll do sequentially to catch issues early.
