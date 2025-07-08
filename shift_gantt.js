
const data = [{"date": "7/1", "id": "001", "name": "佐藤", "start": "10:00", "end": "18:00", "color": "#888"}, {"date": "7/1", "id": "002", "name": "田中", "start": "13:00", "end": "20:00", "color": "#007bff"}, {"date": "7/1", "id": "003", "name": "鈴木", "start": "14:00", "end": "22:00", "color": "#888"}, {"date": "7/1", "id": "004", "name": "山田", "start": "15:00", "end": "23:00", "color": "#28a745"}, {"date": "7/1", "id": "005", "name": "伊藤", "start": "09:00", "end": "17:00", "color": "#dc3545"}];
const baseMin = 600;
const minutesPerCell = 15;
const cellsPerRow = 64;

function toMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function render(day) {
  const tbody = document.getElementById('gBody');
  tbody.innerHTML = '';
  data.filter(r => r.date === day)
    .sort((a, b) => a.id.localeCompare(b.id) || toMin(a.start) - toMin(b.start))
    .forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class='fixed-col'>${r.name}</td>
                      <td class='fixed-col-2'>${r.start}</td>
                      <td class='fixed-col-3'>${r.end}</td>`;
      for (let i = 0; i < cellsPerRow; i++) {
        const td = document.createElement('td');
        td.className = 'time-cell';
        if (i % 4 === 3) td.classList.add('hour-mark');
        tr.appendChild(td);
      }
      const bar = document.createElement('div');
      bar.className = 'row-bar';
      const leftOffset = (toMin(r.start) - baseMin) / minutesPerCell;
      const widthCells = (toMin(r.end) - toMin(r.start)) / minutesPerCell;
      bar.style.left = `calc(var(--cell-w) * ${leftOffset})`;
      bar.style.width = `calc(var(--cell-w) * ${widthCells})`;
      bar.style.background = r.color || '#888';
      bar.textContent = r.name;
      bar.title = `${r.name}：${r.start}〜${r.end}`;
      tr.children[3].style.position = 'relative';
      tr.children[3].appendChild(bar);
      tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dateSelect').addEventListener('change', e => render(e.target.value));
  render('7/1');
});
