import { chromium } from "npm:playwright"
import { assertEquals } from "jsr:@std/assert"

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

const URL = Deno.env.get("PAGE_URL")

Deno.test("Complete an exercise and see it in the workout log", () => withPage(async (page) => {
    await page.goto(URL)

    const exerciseName = "Bench Press"
    const repsSequence = ["10", "12", "8"]

    // Fill Exercise Name
    await page.locator('[name="exercise-name"]').fill(exerciseName)

    // Loop with forced focus and event-loop yielding
    for (let i = 0; i < repsSequence.length; i++) {
        const selector = `input[name="reps"]:nth-of-type(${i + 1})`
        const repsInput = page.locator(selector).first()

        await repsInput.click()
        await repsInput.fill(repsSequence[i])
        await repsInput.dispatchEvent('input')
        await repsInput.dispatchEvent('change')

        if (i < repsSequence.length - 1) {
            const addBtn = page.locator('#add-reps')
            await addBtn.click()

            // Wait for DOM stability
            await page.waitForSelector(`input[name="reps"]:nth-of-type(${i + 2})`, { state: 'attached' })
        }
    }

    // Submit to Temp Log
    const finishBtn = page.locator('#finish-exercise-btn')
    await finishBtn.click()

    // Verify Temp Log
    const tempLog = page.locator('.temporary-log-input')
    await page.waitForFunction((el) => el.value !== "", await tempLog.elementHandle())
    const logValue = await tempLog.inputValue()

    assertEquals(logValue.includes(exerciseName), true)
    assertEquals(logValue.includes("10, 12, 8"), true)

    // Submit to Permanent Log
    const finalBtn = page.locator('button:has-text("Finish"), [type="submit"]').last()
    await finalBtn.click()

    // Switch Tab and Verify
    const logTab = page.getByRole('tab', { name: /Log/i })
    await logTab.click()

    const logContainer = page.locator('#workout-log')
    const logText = await logContainer.innerText()

    assertEquals(logText.includes(exerciseName), true)
    assertEquals(logText.includes("10, 12, 8"), true)
}))