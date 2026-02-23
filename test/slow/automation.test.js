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
        // Closes the tab and wipes the session, but leaves the "Engine" running
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

    // 1. Fill the inputs
    for (const [name, value] of Object.entries(demoData)) {
        await page.locator(`[name="${name}"]`).fill(value)
    }

    // 2. Trigger the submission
    await page.locator('#finish-btn').click()

    // 3. Assert on the Textarea
    // Use .inputValue() for <textarea> elements
    const logValue = await page.locator('.temporary-log-input').inputValue()

    // Check if the log contains our data
    assertEquals(logValue.includes("Pullups: 1200lbs: 12. Was a good workout!"), true)
}))
