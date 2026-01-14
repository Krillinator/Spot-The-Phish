const steps = [
  {
    selector: "#clue-from",
    title: "The sender looks completely legitimate",
    text: "The email uses Microsoft branding and a realistic sender address. Push-fatigue attacks often rely on trusted platforms rather than fake companies.",
  },
  {
    selector: ".email-body",
    title: "The attacker already has your password",
    text: "Repeated MFA notifications usually mean the password is already compromised. The goal is to get you to approve one request or share a one-time code.",
  },
  {
    selector: "#clue-urgency",
    title: "Pressure is used to trigger a mistake",
    text: "Short deadlines and warnings about account restrictions are meant to push you into approving a request you did not initiate.",
  },
]

const correctAnswer = "phish"

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
