const steps = [
  {
    selector: "#clue-from",
    title: "Sender domain matches the brand",
    text: "This email comes from no-reply@spotify.com. For legit promos, the sender domain should match the company’s official domain.",
  },
  {
    selector: "#clue-link a",
    title: "Link points to a real Spotify domain",
    text: "The CTA goes to spotify.com/account — a normal place to manage offers and billing. No lookalike domain tricks.",
  },
  {
    selector: "#clue-urgency",
    title: "No threats or forced countdown",
    text: "Legit promos usually don’t threaten loss in minutes. It says you can review in your account, and reminds you Spotify won’t ask for your password.",
  },
]

const correctAnswer = "real"

let currentStep = 0
let popEl, arrowEl, highlightedEl

const btnPhish = document.getElementById("answerPhish")
const btnReal = document.getElementById("answerReal")

btnPhish.addEventListener("click", () => submitAnswer("phish"))
btnReal.addEventListener("click", () => submitAnswer("real"))

function submitAnswer(answer) {
  btnPhish.disabled = true
  btnReal.disabled = true

  showToast(
    answer === correctAnswer
      ? "Correct! Let's review why."
      : "Not quite. Here's what to look for.",
    answer === correctAnswer ? "success" : "danger"
  )

  currentStep = 0
  showStep(currentStep)
}

function showStep(index) {
  cleanupStep()

  const step = steps[index]
  const el = document.querySelector(step.selector)
  if (!el) return

  highlightedEl = el
  el.classList.add("clue-highlight")

  popEl = document.createElement("div")
  popEl.className = "clue-pop"
  popEl.innerHTML = `
    <div class="title">${step.title} (${index + 1}/${steps.length})</div>
    <div>${step.text}</div>
    <div class="controls">
      <button class="btn btn-sm btn-outline-secondary" id="prev" ${
        index === 0 ? "disabled" : ""
      }>Prev</button>
      <button class="btn btn-sm btn-primary" id="next">${
        index === steps.length - 1 ? "Finish" : "Next"
      }</button>
    </div>
  `
  document.body.appendChild(popEl)

  arrowEl = document.createElement("div")
  arrowEl.className = "clue-arrow"
  document.body.appendChild(arrowEl)

  position(el)

  document.getElementById("prev").onclick = () => {
    currentStep--
    showStep(currentStep)
  }

  document.getElementById("next").onclick = () => {
    if (currentStep === steps.length - 1) {
      cleanupStep()
      showToast("🎯 Walkthrough complete", "primary")
    } else {
      currentStep++
      showStep(currentStep)
    }
  }
}

function cleanupStep() {
  if (highlightedEl) highlightedEl.classList.remove("clue-highlight")
  popEl?.remove()
  arrowEl?.remove()
}

function position(target) {
  const r = target.getBoundingClientRect()
  const x = r.right + 16 + window.scrollX
  const y = r.top + window.scrollY

  popEl.style.left = `${x}px`
  popEl.style.top = `${y}px`

  arrowEl.style.left = `${x - 8}px`
  arrowEl.style.top = `${y + 12}px`
}

function showToast(msg, type) {
  const t = document.createElement("div")
  t.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3 shadow`
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 2000)
}
