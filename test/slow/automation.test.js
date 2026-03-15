import { chromium } from "npm:playwright"
import { expect } from "npm:playwright/test"

const browser = await chromium.launch({ headless: true })

Deno.test.afterAll(async () => {
    await browser.close()
})

async function withPage(testFn) {
    const context = await browser.newContext()
    const page = await context.newPage()
    try {
        await testFn(page)
    } finally {
        await context.close()
    }
}

const URL = Deno.env.get("PAGE_URL") || "http://127.0.0.1:5500"

Deno.test("Complete an exercise and see it in the workout log", () => withPage(async (page) => {
    await page.goto(URL)

    const exerciseName = "Bench Press"
    const repsSequence = ["10", "12", "8"]

    // 1. Fill Exercise Name
    const nameInput = page.locator('[name="exercise-name"]')
    await nameInput.waitFor({ state: 'visible' })
    await nameInput.fill(exerciseName)

    // 2. Loop through and add reps
    for (let i = 0; i < repsSequence.length; i++) {
        const repsInput = page.locator('input[name="reps"]').nth(i)

        await repsInput.click()
        await repsInput.fill(repsSequence[i])

        // Ensure the app registers the input
        await repsInput.dispatchEvent('input')
        await repsInput.dispatchEvent('change')

        if (i < repsSequence.length - 1) {
            const addBtn = page.locator('[data-action="add-reps"]')
            await addBtn.click()

            // Wait for the next input to exist before moving to next loop iteration
            await page.locator('input[name="reps"]').nth(i + 1).waitFor({ state: 'attached' })
        }
    }

    // 3. Submit to Temp Log
    const finishBtn = page.locator('[data-action="finish-exercise"]')
    await finishBtn.click()

    // 4. Verify Temp Log (Using auto-retry assertions to prevent the "" vs "Bench Press" error)
    const tempLog = page.locator('.temporary-log-input')
    await expect(tempLog).toContainText(exerciseName)
    await expect(tempLog).toContainText("10, 12, 8")

    // 5. Submit to Permanent Log
    const finalBtn = page.locator('form.temporary-log button.primary')
    await finalBtn.click()

    // 6. Switch Tab and Verify
    const logTab = page.getByRole('tab', { name: /Log/i })
    await logTab.click()

    const logContainer = page.locator('.workout-log')
    // Wait for the final container to show the data
    await expect(logContainer).toContainText(exerciseName)
    await expect(logContainer).toContainText("10, 12, 8")
}))

// This test will fail until the edit feature is implemented
// It serves as a specification for the expected behavior
Deno.test("Edit an exercise in the workout log", () => withPage(async (page) => {
    await page.goto(URL)

    const exerciseName = "Bench Press"
    const repsSequence = ["10", "12", "8"]
    const editedExerciseName = "Edited Bench Press"

    // 1. Complete an exercise first (same as previous test)
    const nameInput = page.locator('[name="exercise-name"]')
    await nameInput.waitFor({ state: 'visible' })
    await nameInput.fill(exerciseName)

    for (let i = 0; i < repsSequence.length; i++) {
        const repsInput = page.locator('input[name="reps"]').nth(i)
        await repsInput.click()
        await repsInput.fill(repsSequence[i])
        await repsInput.dispatchEvent('input')
        await repsInput.dispatchEvent('change')

        if (i < repsSequence.length - 1) {
            const addBtn = page.locator('[data-action="add-reps"]')
            await addBtn.click()
            await page.locator('input[name="reps"]').nth(i + 1).waitFor({ state: 'attached' })
        }
    }

    const finishBtn = page.locator('[data-action="finish-exercise"]')
    await finishBtn.click()

    const finalBtn = page.locator('form.temporary-log button.primary')
    await finalBtn.click()

    // 2. Switch to Log tab
    const logTab = page.getByRole('tab', { name: /Log/i })
    await logTab.click()

    // 3. Click on the workout log to open edit dialog
    const logPre = page.locator('.workout-log').first()
    await logPre.click()

    // 4. Wait for dialog to appear and edit exercise name
    const dialog = page.locator('#edit-workout-dialog')
    await dialog.waitFor({ state: 'visible' })

    const editNameInput = dialog.locator('[name="exercise-name"]').first()
    await editNameInput.waitFor({ state: 'visible' })
    await editNameInput.fill(editedExerciseName)

    // 5. Save changes
    const saveBtn = dialog.locator('[data-action="save-workout"]')
    await saveBtn.click()

    // 6. Wait for dialog to close and verify text changed
    await dialog.waitFor({ state: 'hidden' })

    // Wait a bit for the update to propagate
    await page.waitForTimeout(500)

    await expect(logPre).toContainText(editedExerciseName)
    await expect(logPre).not.toContainText(exerciseName)
}))
