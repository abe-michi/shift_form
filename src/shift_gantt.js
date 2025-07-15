
document.addEventListener("DOMContentLoaded", () => {
  initControls();
  loadDummyData();
});

let shiftData = [];
const BASE_MINUTES = 6 * 60;
const CELL_WIDTH = 15;
const RANGE_DAYS = {
  week: 7,
  half: 15,
  month: 31,
};

function initControls() {
  const rangeSel = document.getElementById("view-range");
  const dateSel = document.getElementById("date-select");

  rangeSel.addEventListener("change", () => {
    generateDateOptions();
    renderGantt();
  });

  dateSel.addEventListener("change", () => {
    renderGantt();
  });

  generateDateOptions();
}

function generateDateOptions() {
  const dateSel = document.getElementById("date-select");
  const range = document.getElementById("view-range").value;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();

  dateSel.innerHTML = "";
  const unit = RANGE_DAYS[range];
  for (let start = 1; start <= totalDays; start += unit) {
    const label = `${month + 1}/${start}〜${Math.min(start + unit - 1, totalDays)}`;
    const opt = new Option(label, start);
    dateSel.appendChild(opt);
  }
}

function loadDummyData() {
  shiftData = [
    { name: "田中 太郎", color: "#FFB74D", start: "10:00", end: "18:00" },
    { name: "鈴木 花子", color: "#4FC3F7", start: "12:00", end: "21:00" },
  ];
  renderGantt();
}
