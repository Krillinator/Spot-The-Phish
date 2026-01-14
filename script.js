// Maps our answer → Bootstrap color class
const answerToClass = {
  danger: "list-group-item-danger",
  warning: "list-group-item-warning",
  success: "list-group-item-success",
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("emailList")
  const explainBox = document.getElementById("explainBox")

  if (!list) return

  function clearColors() {
    const items = list.querySelectorAll(".list-group-item")
    items.forEach((item) => {
      item.classList.remove(
        "list-group-item-danger",
        "list-group-item-warning",
        "list-group-item-success"
      )
    })
  }

  list.addEventListener("click", (e) => {
    const item = e.target.closest("a.list-group-item")
    if (!item) return

    e.preventDefault() // prevent jump to top

    clearColors()

    const answer = item.dataset.answer // danger | warning | success
    const bsClass = answerToClass[answer]

    if (bsClass) item.classList.add(bsClass)

    // Show explanation (optional)
    if (explainBox && item.dataset.explain) {
      explainBox.textContent = item.dataset.explain
      explainBox.classList.remove("d-none")
    }
  })
})
