
function createInitialSheetsWithNotes() {
  const ss = SpreadsheetApp.create('シフト作成くん（マスタ）');

  // 1. 基本設定
  const settingSheet = ss.insertSheet('基本設定');
  settingSheet.getRange('A1:B5').setValues([
    ['営業日切替時刻', '30:00'],
    ['勤務時間刻み', 15],
    ['提出締切日', '月末3日前'],
    ['提出期限時刻', '23:59'],
    ['週の起点', '月曜']
  ]);
  settingSheet.getRange('A1').setNote('営業日の切り替え時刻。例: 30:00 = 翌6:00');
  settingSheet.getRange('A2').setNote('時刻選択の刻み。15なら15分単位で選択可能');
  settingSheet.getRange('A3').setNote('提出締切日。例: 月末3日前、20日など');
  settingSheet.getRange('A4').setNote('締切時刻（24時間表記）');
  settingSheet.getRange('A5').setNote('週集計の起点曜日（例：月曜／日曜）');

  // 2. 従業員マスタ
  const employeeSheet = ss.insertSheet('従業員マスタ');
  employeeSheet.getRange('A1:E1').setValues([['ID', '氏名', 'ロール', '所属クラスター', '制約（JSON）']]);
  employeeSheet.getRange('A1').setNote('社員番号やユニークID（任意の英数字）');
  employeeSheet.getRange('B1').setNote('従業員のフルネーム');
  employeeSheet.getRange('C1').setNote('ロール（従業員／シフト作成担当／管理者）');
  employeeSheet.getRange('D1').setNote('所属店舗や部署など（クラスタ分け）');
  employeeSheet.getRange('E1').setNote('制約条件。例: {"月":[{"start":"18:00","end":"23:00","type":"NG"}]}');

  // 3. 勤務パターン
  const patternSheet = ss.insertSheet('勤務パターン');
  patternSheet.getRange('A1:F1').setValues([['パターン名', '開始時刻', '終了時刻', '跨ぎ可', '色コード', 'みなし残業']]);
  patternSheet.getRange('A1').setNote('シフト名。例: 早番、遅番、夜勤など');
  patternSheet.getRange('B1').setNote('勤務開始時刻（HH:mm形式）');
  patternSheet.getRange('C1').setNote('勤務終了時刻（HH:mm形式）');
  patternSheet.getRange('D1').setNote('営業日を跨いでよいか（○/×）');
  patternSheet.getRange('E1').setNote('表示に使う色コード（例: #A5D6A7）');
  patternSheet.getRange('F1').setNote('みなし残業時間。例: 0、2hなど');

  // 4. 必要人数マスタ
  const needsSheet = ss.insertSheet('必要人数');
  needsSheet.getRange('A1:C1').setValues([['日付', '時間帯', '必要人数']]);
  needsSheet.getRange('A1').setNote('対象日（例: 7/1）');
  needsSheet.getRange('B1').setNote('時間帯の開始時刻（例: 09:00）');
  needsSheet.getRange('C1').setNote('必要な人数（例: 3）');

  // デフォルトの「シート1」を削除
  const defaultSheet = ss.getSheetByName('シート1');
  if (defaultSheet) ss.deleteSheet(defaultSheet);

  Logger.log('作成完了: ' + ss.getUrl());
}
