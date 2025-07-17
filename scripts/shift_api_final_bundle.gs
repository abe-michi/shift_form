
/**
 * ログ関数：操作履歴
 */
function logShiftOperation({ action, name, date, status, operator }) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheetName = 'シフト履歴';
  let sheet = ss.getSheetByName(logSheetName);

  if (!sheet) {
    sheet = ss.insertSheet(logSheetName);
    sheet.appendRow(['タイムスタンプ', '操作種別', '氏名', '対象日', 'ステータス', '操作ユーザー']);
  }

  const now = new Date();
  sheet.appendRow([
    Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'),
    action,
    name,
    date,
    status,
    operator
  ]);
}


/**
 * ログ関数：エラー記録
 */
function logError(error, context = '') {
  console.error(`【ERROR】${context}: ${error.message}\n${error.stack}`);
}


/**
 * シフト提出データ取得API
 */
function getSubmittedShifts(year, month, userEmail = '') {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('フォームの回答');
    const data = sheet.getDataRange().getValues();
    const header = data[0];
    const result = [];

    const dateCol = header.indexOf('日付');
    const startCol = header.indexOf('開始時刻');
    const endCol = header.indexOf('終了時刻');
    const patternCol = header.indexOf('勤務パターン');
    const statusCol = header.indexOf('ステータス');
    const nameCol = header.indexOf('氏名');
    const emailCol = header.indexOf('メール');

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const dateStr = row[dateCol];
      const date = new Date(dateStr);
      if (!date || isNaN(date)) continue;

      const rowYear = date.getFullYear();
      const rowMonth = date.getMonth() + 1;

      if (rowYear != year || rowMonth != month) continue;
      if (userEmail && row[emailCol] !== userEmail) continue;

      result.push({
        date: Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy-MM-dd'),
        start: row[startCol],
        end: row[endCol],
        pattern: row[patternCol],
        status: row[statusCol],
        name: row[nameCol],
        email: row[emailCol]
      });
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    logError(e, 'getSubmittedShifts');
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: '取得に失敗しました' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * ガントチャート用データ取得API
 */
function getGanttShifts(year, month) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const formSheet = ss.getSheetByName('フォームの回答');
    const empSheet = ss.getSheetByName('従業員マスタ');
    const formData = formSheet.getDataRange().getValues();
    const empData = empSheet.getDataRange().getValues();

    const empColorMap = {};
    const empHeader = empData[0];
    const nameIdx = empHeader.indexOf('氏名');
    const colorIdx = empHeader.indexOf('カラー');
    for (let i = 1; i < empData.length; i++) {
      const name = empData[i][nameIdx];
      const color = empData[i][colorIdx] || '#888';
      empColorMap[name] = color;
    }

    const formHeader = formData[0];
    const dateIdx = formHeader.indexOf('日付');
    const nameIdxF = formHeader.indexOf('氏名');
    const startIdx = formHeader.indexOf('開始時刻');
    const endIdx = formHeader.indexOf('終了時刻');

    const result = [];

    for (let i = 1; i < formData.length; i++) {
      const row = formData[i];
      const date = new Date(row[dateIdx]);
      if (isNaN(date)) continue;

      if (date.getFullYear() !== year || (date.getMonth() + 1) !== month) continue;

      const name = row[nameIdxF];
      const start = row[startIdx];
      const end = row[endIdx];
      const color = empColorMap[name] || '#888';

      result.push({
        name: name,
        date: Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy-MM-dd'),
        start: start,
        end: end,
        color: color
      });
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    logError(e, 'getGanttShifts');
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: '取得に失敗しました' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * ステータス更新API（仮確定／確定）
 */
function updateShiftStatus(request) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('フォームの回答');
    const data = sheet.getDataRange().getValues();
    const header = data[0];

    const dateIdx = header.indexOf('日付');
    const nameIdx = header.indexOf('氏名');
    const statusIdx = header.indexOf('ステータス');

    const req = JSON.parse(request.postData.contents);
    const targetDate = new Date(req.date);
    const targetName = req.name;
    const newStatus = req.status;

    let updated = false;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowDate = new Date(row[dateIdx]);
      const rowName = row[nameIdx];

      if (rowName === targetName && rowDate.getTime() === targetDate.getTime()) {
        sheet.getRange(i + 1, statusIdx + 1).setValue(newStatus);
        updated = true;

        logShiftOperation({
          action: 'ステータス更新',
          name: targetName,
          date: req.date,
          status: newStatus,
          operator: Session.getActiveUser().getEmail() || 'unknown'
        });
        break;
      }
    }

    const output = updated
      ? { success: true, message: 'ステータスを更新しました' }
      : { success: false, message: '該当データが見つかりませんでした' };

    return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    logError(e, 'updateShiftStatus');
    const output = {
      success: false,
      message: 'シフトステータスの更新中にエラーが発生しました'
    };
    return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * doGet テストルーティング
 */
function doGet(e) {
  const action = e.parameter.action;
  const year = parseInt(e.parameter.year);
  const month = parseInt(e.parameter.month);
  const email = e.parameter.email;

  if (action === 'getSubmittedShifts') {
    return getSubmittedShifts(year, month, email);
  } else if (action === 'getGanttShifts') {
    return getGanttShifts(year, month);
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid action' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * doPost テストルーティング
 */
function doPost(e) {
  const action = e.parameter.action;

  if (action === 'updateShiftStatus') {
    return updateShiftStatus(e);
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid action' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
