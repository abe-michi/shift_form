
const data = [
  { name: "佐藤", start: "10:00", end: "18:00", color: "#888" },
  { name: "田中", start: "13:00", end: "20:00", color: "#2196F3" },
  { name: "鈴木", start: "14:00", end: "22:00", color: "#888" },
  { name: "山田", start: "15:00", end: "23:00", color: "#4CAF50" },
  { name: "伊藤", start: "09:00", end: "17:00", color: "#F44336" },
];

function timeToIndex(t) {
  const [h, m] = t.split(":").map(Number);
  return (h - 10) * 4 + m / 15;
}

function createTimeHeader() {
  const container = document.getElementById("timeHeader");
  for (let h = 10; h <= 26; h++) {
    const cell = document.createElement("div");
    cell.textContent = h < 24 ? `${h}:00` : `${h - 24}:00`;
    cell.style.gridColumn = "span 4";
    container.appendChild(cell);
  }
}

function createGanttBody() {
  const container = document.getElementById("ganttBody");
  container.innerHTML = "";
  data.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "gantt-row";
    rowDiv.innerHTML = `
      <div class="fixed-col">${row.name}</div>
      <div class="fixed-col">${row.start}</div>
      <div class="fixed-col">${row.end}</div>
      <div class="gantt-grid"></div>
    `;
    const grid = rowDiv.querySelector(".gantt-grid");
    const bar = document.createElement("div");
    bar.className = "bar";
    const startIdx = timeToIndex(row.start);
    const endIdx = timeToIndex(row.end);
    bar.style.gridColumn = `${startIdx + 1} / ${endIdx + 1}`;
    bar.style.backgroundColor = row.color || "#888";
    bar.textContent = row.name;
    bar.title = `${row.name}：${row.start}〜${row.end}`;
    grid.appendChild(bar);
    container.appendChild(rowDiv);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createTimeHeader();
  createGanttBody();
});
