// 📄 doPost() + ルーティング定義

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  switch (action) {
    case "submitShift":
      return ContentService.createTextOutput(
        JSON.stringify(submitShift(data.payload))
      ).setMimeType(ContentService.MimeType.JSON);

    default:
      return ContentService.createTextOutput(
        JSON.stringify({ error: "Unknown action" })
      ).setMimeType(ContentService.MimeType.JSON);
  }
}
