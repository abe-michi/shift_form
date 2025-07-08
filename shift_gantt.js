
const data = [
  { name: "佐藤", start: "10:00", end: "18:00", color: "#888" },
  { name: "田中", start: "13:00", end: "20:00", color: "#2196F3" },
  { name: "鈴木", start: "14:00", end: "22:00", color: "#888" },
  { name: "山田", start: "15:00", end: "23:00", color: "#4CAF50" },
  { name: "伊藤", start: "09:00", end: "17:00", color: "#F44336" },
];

// グリッド列数（10:00〜26:00 → 16h * 4 = 64 + 4 予備）
const startHour = 10;
const endHour = 26;
const columns = (endHour - startHour) * 4;

function timeToIndex(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return (h - startHour) * 4 + m / 15;
}

function createTimeHeader() {
  const header = document.querySelector(".time-header");
  for (let i = 0; i <= (endHour - startHour); i++) {
    const cell = document.createElement("div");
    cell.textContent = `${startHour + i}:00`;
    cell.style.gridColumn = `span 4`;
    header.appendChild(cell);
  }
}

function createGridLines(container) {
  for (let i = 0; i < columns; i++) {
    const line = document.createElement("div");
    line.className = "grid-line";
    if (i % 4 === 0) line.classList.add("hour");
    container.appendChild(line);
  }
}

function createGanttRows() {
  const body = document.getElementById("gantt-body");
  data.forEach((d) => {
    const row = document.createElement("div");
    row.className = "gantt-row";
    row.innerHTML = `
      <div>${d.name}</div>
      <div>${d.start}</div>
      <div>${d.end}</div>
      <div class="gantt-grid"></div>
    `;
    const grid = row.querySelector(".gantt-grid");
    createGridLines(grid);

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.textContent = d.name;
    bar.style.left = `calc(${(timeToIndex(d.start) / columns) * 100}%)`;
    bar.style.width = `calc(${((timeToIndex(d.end) - timeToIndex(d.start)) / columns) * 100}%)`;
    bar.style.backgroundColor = d.color;
    grid.appendChild(bar);

    body.appendChild(row);
  });
}

createTimeHeader();
createGanttRows();
