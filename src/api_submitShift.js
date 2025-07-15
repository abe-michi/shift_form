// 📄 submitShift() + formatSheetName()

function formatSheetName(template, store, startDateStr, endDateStr, halfLabel = '') {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const pad = n => String(n).padStart(2, '0');

  const replacements = {
    '${store}': store,
    '${yyyy}': start.getFullYear(),
    '${yy}': String(start.getFullYear()).slice(-2),
    '${M}': start.getMonth() + 1,
    '${MM}': pad(start.getMonth() + 1),
    '${dd}': pad(start.getDate()),
    '${start_mmdd}': \`\${pad(start.getMonth() + 1)}\${pad(start.getDate())}\`,
    '${end_mmdd}': \`\${pad(end.getMonth() + 1)}\${pad(end.getDate())}\`,
    '${half}': halfLabel
  };

  let sheetName = template;
  for (const [key, value] of Object.entries(replacements)) {
    sheetName = sheetName.replaceAll(key, value);
  }

  return sheetName;
}

function submitShift(payload) {
  const {
    year, month, startDate, endDate,
    periodType, halfLabel, storeName,
    templateName, data
  } = payload;

  const sheetName = formatSheetName(templateName, storeName, startDate, endDate, halfLabel);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['氏名', '日付', '開始', '終了', 'パターン名', '登録日時', '仮確定']);
  }

  const existing = sheet.getDataRange().getValues();
  const headers = existing[0];
  const rows = existing.slice(1);

  data.forEach(entry => {
    const now = new Date();
    const row = [entry.name, entry.date, entry.start, entry.end, entry.patternName, now, ""];

    const idx = rows.findIndex(r => r[0] === entry.name && r[1] === entry.date);
    if (idx >= 0) {
      sheet.getRange(idx + 2, 1, 1, 7).setValues([row]); // 上書き
    } else {
      sheet.appendRow(row); // 新規
    }
  });

  return { success: true, count: data.length, sheetName };
}
