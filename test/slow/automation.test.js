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
    const finalBtn = page.locator('button:has-text("Finish"), [type="submit"]').last()
    await finalBtn.click()

    // 6. Switch Tab and Verify
    const logTab = page.getByRole('tab', { name: /Log/i })
    await logTab.click()

    const logContainer = page.locator('.workout-log')
    // Wait for the final container to show the data
    await expect(logContainer).toContainText(exerciseName)
    await expect(logContainer).toContainText("10, 12, 8")
}))
