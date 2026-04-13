import { chromium } from "playwright"
import { test, describe, beforeAll, afterAll } from "bun:test"
import { expect } from "@playwright/test"


const URL = process.env.PAGE_URL || "http://127.0.0.1:5500"

describe("Workout Logger E2E Tests", () => {
    
    let browser
    let page

    beforeAll(async () => {
        browser = await chromium.launch({ headless: true })
        page = await browser.newPage()
    })

    afterAll(async () => {
        await browser.close()
    })

    test("Complete an exercise and see it in the workout log", async () => {
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
    })

    // This test will fail until the edit feature is implemented
    // It serves as a specification for the expected behavior
    test("Edit an exercise in the workout log", async () => {
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
        await logPre.waitFor({ state: 'visible' })

        // Click at the approximate position of the last workout
        // The workout log should have 2 workouts, so we click in the lower half
        const box = await logPre.boundingBox()
        if (box) {
            await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.75)
        } else {
            await logPre.click()
        }

        // 4. Wait for dialog to appear and edit exercise name
        const dialog = page.locator('#edit-workout-dialog')
        await dialog.waitFor({ state: 'visible', timeout: 10000 })

        const editNameInput = dialog.locator('[name="exercise-name"]').first()
        await editNameInput.waitFor({ state: 'visible', timeout: 5000 })
        await editNameInput.fill(editedExerciseName)

        // 5. Save changes
        const saveBtn = dialog.locator('[data-action="save-workout"]')
        await saveBtn.waitFor({ state: 'visible', timeout: 5000 })

        // Click the save button using evaluate
        await saveBtn.evaluate(el => el.click())

        // Wait for the workout log to update
        await page.waitForTimeout(1000)

        // 6. Verify the workout log was updated
        await expect(logPre).toContainText(editedExerciseName)
        await expect(logPre).toContainText("10, 12, 8")
    })
})
