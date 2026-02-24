import { chromium } from "npm:playwright"
import { assertEquals } from "jsr:@std/assert"

// 1. GLOBAL SETUP: Launch browser once for all tests in this file
const browser = await chromium.launch({ headless: false })

/**
 * CLEANUP: Ensures the browser actually closes when tests are done.
 * Without this, Deno will hang in your terminal forever.
 */
Deno.test.afterAll(async () => {
    await browser.close()
})

/**
 * HELPER: withPage
 * Creates a fresh incognito context (resets localStorage/cookies)
 * and a new tab for every test.
 */
async function withPage(testFn) {
    const context = await browser.newContext()
    const page = await context.newPage()
    try {
        await testFn(page)
    } finally {
        await context.close()
    }
}

// --- YOUR TESTS ---

const URL = Deno.env.get("PAGE_URL")

Deno.test("Verify Title", () => withPage(async (page) => {
    await page.goto(URL)
    assertEquals(await page.title(), "Workout Logger")
}))

Deno.test("Complete Exercise Flow", () => withPage(async (page) => {
    await page.goto(URL)

    const demoData = {
        "exercise-name": "Pullups",
        "reps": "12",
        "comment": "Was a good workout!",
        "weight": "1200lbs"
    }

    for (const [name, value] of Object.entries(demoData)) {
        await page.locator(`[name="${name}"]`).fill(value)
    }

    await page.locator('#finish-btn').click()

    const logValue = await page.locator('.temporary-log-input').inputValue()

    assertEquals(logValue.includes("Pullups: 1200lbs: 12. Was a good workout!"), true)
}))

Deno.test("Full Exercise Flow with Add Reps Button", () => withPage(async (page) => {
    await page.goto(URL)

    const exerciseName = "Bench Press"
    const repsSequence = ["10", "12", "8"]

    await page.locator('[name="exercise-name"]').fill(exerciseName)

    await page.locator('[name="reps"]').click()
    for (let i = 0; i < repsSequence.length; i++) {
        await page.keyboard.type(repsSequence[i])

        if (i < repsSequence.length - 1) {
            await page.locator('#add-reps').click()

            await new Promise(r => setTimeout(r, 50))
        }
    }

    await page.locator('#finish-btn').click()

    const logValue = await page.locator('.temporary-log-input').inputValue()

    assertEquals(logValue.includes("Bench Press: 10, 12, 8"), true)
}))
