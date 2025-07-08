
const data = [
  { date: "7/1", id: "001", name: "佐藤", start: "10:00", end: "18:00", color: "#888" },
  { date: "7/1", id: "002", name: "田中", start: "13:00", end: "20:00", color: "#007bff" },
  { date: "7/1", id: "003", name: "鈴木", start: "14:00", end: "22:00", color: "#888" },
  { date: "7/1", id: "004", name: "山田", start: "15:00", end: "23:00", color: "#28a745" },
  { date: "7/1", id: "005", name: "伊藤", start: "09:00", end: "17:00", color: "#dc3545" },
  { date: "7/2", id: "001", name: "佐藤", start: "13:00", end: "17:00", color: "#888" },
  { date: "7/2", id: "002", name: "田中", start: "11:00", end: "19:00", color: "#007bff" },
  { date: "7/2", id: "003", name: "鈴木", start: "10:00", end: "14:00", color: "#888" },
  { date: "7/2", id: "004", name: "山田", start: "15:00", end: "22:00", color: "#28a745" },
  { date: "7/2", id: "005", name: "伊藤", start: "10:30", end: "15:30", color: "#dc3545" }
];

const baseMin = 10 * 60;
function toMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function render(day) {
  const tbody = document.getElementById("gBody");
  tbody.innerHTML = "";
  data.filter(r => r.date === day)
      .sort((a, b) => a.id.localeCompare(b.id) || toMin(a.start) - toMin(b.start))
      .forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="fixed-col">${r.name}</td>
                        <td class="fixed-col-2">${r.start}</td>
                        <td class="fixed-col-3">${r.end}</td>`;
        for (let i = 0; i < (17 * 4); i++) {
          tr.appendChild(document.createElement("td"));
        }
        const bar = document.createElement("div");
        bar.className = "row-bar";
        bar.style.left = (toMin(r.start) - baseMin) + "px";
        bar.style.width = (toMin(r.end) - toMin(r.start)) + "px";
        bar.style.background = r.color;
        bar.textContent = r.name;
        bar.title = `${r.name}：${r.start}〜${r.end}`;
        tr.children[3].style.position = "relative";
        tr.children[3].appendChild(bar);
        tbody.appendChild(tr);
      });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("dateSelect").addEventListener("change", e => render(e.target.value));
  render("7/1");
});
