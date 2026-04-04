// Bootstrap: Import all application modules in the correct order

// Third-party non-module script (oat.min.js) must remain in HTML as separate <script defer> tag

// Component modules (self-registering custom elements)
import "./lit.js"
import "./components/close-btn.js"
import "./components/all-reps.js"
import "./components/exercise-input.js"
import "./components/workout-start-time.js"
import "./components/exercise-inputs.js"
import "./components/the-exercise.js"
import "./components/modify-workout.js"

// Core application modules
import "./core.js"
import "./db.js"
import "./main.js"

// Development/test utilities
import "./test_fixture.js"
