- [x] Use oat.ink to restyle everything ~~Make textarea look the same as the input?~~
- [ ] Add 11ty as passthrough copy
- [ ] Make index.html a .webc layout file
- [ ] Define each of my web components as a .webc file (pretty trivial)\
For example:
```html
<template id="reps-row">
  <input type="text" inputmode="numeric" name="reps">
</template>

<label data-field>
  <span @text="t('repsLabel', 'en')">Reps</span>
  <div class="all-reps">
      <input type="text" inputmode="numeric" name="reps">
  </div>
</label>

<div class="half-screen-buttons">
    <button type="button" data-variant="danger" class="outline" id="remove-reps">
        <svg><use href="#remove"></use></svg>
        <span @text="t('removeBtn', 'en')">Remove Reps</span>
    </button>
    <button type="button" class="outline" id="add-reps">
        <svg><use href="#add"></use></svg>
        <span @text="t('addBtn', 'en')">Add Reps</span>
    </button>
</div>

<script>
class AllReps extends HTMLElement {
    connectedCallback() {
        // We grab our local template
        this.rowTemplate = this.querySelector('#reps-row');
        
        // Setup listeners
        this.querySelector('#add-reps').addEventListener('click', () => this.addReps());
        this.querySelector('#remove-reps').addEventListener('click', () => this.removeReps());
        
        // If you still need a 'reset' listener to clear everything
        this.addEventListener('reset', () => {
            this.querySelector('.all-reps').innerHTML = '<input type="text" inputmode="numeric" name="reps">';
        });
    }

    addReps() {
        const $reps = this.rowTemplate.content.cloneNode(true).firstElementChild;
        this.querySelector('.all-reps').append($reps);

        requestAnimationFrame(() => {
            $reps.focus();
        });
    }

    removeReps() {
        const container = this.querySelector('.all-reps');
        if (container.childElementCount > 1) {
            container.lastElementChild.remove();
        }
    }
}

// 11ty/WebC can handle the define for you, but being explicit is fine.
customElements.define('all-reps', AllReps);
</script>
```
- [ ] Currently, the code either clones <template>s, in the very .html file, or it uses innerHTML as a string.Use webc from 11ty, to create <template> to clone in the component itself, and instead of innerHTML, also use a cloneable template, invoked in the render() method. ~~Switch to fragment cloning~~
- [ ] Add reset icon to the right of buttons, in case users mistype
- [ ] Add x buttons to the top-right of the current exercise "elements", when they're appended.
- [ ] Date must come from today.
- [ ] Disable "Remove reps" while there is only one reps input
  - [ ] ~~Make disabled look good in my-css~~
- [ ] Make the "focus event" on the all-reps, hit the LAST input
