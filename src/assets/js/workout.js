import { asLog } from "./core.js"

// This actually has to be for each exercise element currently on the screen,
// rather than just one. Based on that, we can also remove the elements
document.addEventListener('exercise:finish', (e) => {
    const $temporaryLog = document.querySelector('.temporary-log-input')
    $temporaryLog.value += asLog.call(e.detail) + "\n"
})
