const steps = [
  {
    selector: "#clue-from",
    title: "Avsändaren använder auktoritet",
    text: "Meddelandet ser ut att komma från en person i ledningen. Chef-bedrägerier bygger ofta på att mottagaren inte vågar ifrågasätta.",
  },
  {
    selector: ".email-body",
    title: "Ingen länk – ingen bilaga – bara förtroende",
    text: "Det finns inga tekniska indikatorer som länkar eller bilagor. Det här är ren social manipulation, vilket gör den svår att upptäcka.",
  },
  {
    selector: "#clue-urgency",
    title: "Tidsbrist används som påtryckning",
    text: "Att hänvisa till möte och kort tidsfönster minskar chansen att mottagaren verifierar begäran via andra kanaler.",
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
