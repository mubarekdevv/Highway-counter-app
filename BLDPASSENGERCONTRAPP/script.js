let countEl = document.getElementById("count-el");
let saveEl = document.getElementById("save-el");
let totalCountEl = document.getElementById("total-count");

let count = 0;
let total = 0;

window.onload = function () {
  const savedEntries = localStorage.getItem("savedEntries");
  const savedTotal = localStorage.getItem("savedTotal");

  if (savedEntries) {
    saveEl.textContent = savedEntries;
  }

  if (savedTotal) {
    total = parseInt(savedTotal);
    totalCountEl.textContent = "Total: " + total + " vehicles";
  }
};

function increment() {
  count += 1;
  countEl.textContent = count;
}

function save() {
  let strCounter = count + " - ";
  saveEl.textContent += strCounter;

  total += count;
  totalCountEl.textContent = "Total: " + total + " vehicles";

  localStorage.setItem("savedEntries", saveEl.textContent);
  localStorage.setItem("savedTotal", total.toString());

  count = 0;
  countEl.textContent = count;
}

function resetTotal() {
  total = 0;
  saveEl.textContent = "Vehicles recorded per session: ";
  totalCountEl.textContent = "Total: 0 vehicles";

  localStorage.removeItem("savedEntries");
  localStorage.removeItem("savedTotal");
}
