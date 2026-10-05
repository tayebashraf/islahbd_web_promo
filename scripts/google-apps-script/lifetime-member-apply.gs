/**
 * Appends new lifetime-member applications to the "NewMembers" tab of the
 * Google Sheet below. Called by the Django backend
 * (eslahbd_backend/api/sheets_service.py) after it saves each application.
 *
 * Setup:
 *  1. Open the Google Sheet > Extensions > Apps Script, paste this file.
 *  2. Project Settings > Script properties > add SECRET = <long random string>.
 *  3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *  4. Put the /exec URL in LIFETIME_SHEET_WEBHOOK_URL and the same secret
 *     in LIFETIME_SHEET_SECRET in the backend (Railway) environment.
 *  After editing this file, use Deploy > Manage deployments > Edit > New version.
 */

var SPREADSHEET_ID = "1PPWSig00RCgVfxjUe72E18gZYc6Q7kRijxS4mIUSmPs";
var SHEET_NAME = "NewMembers";
var HEADERS = [
  "আইডি",
  "আবেদনের সময়",
  "অবস্থা",
  "ক্যাটাগরি",
  "বাৎসরিক অনুদান",
  "নাম",
  "মোবাইল",
  "হোয়াটসঅ্যাপ",
  "পেশা",
  "ঠিকানা",
  "মাধ্যমের নাম",
  "মাধ্যমের মোবাইল",
  "পেমেন্ট মাধ্যম",
  "প্রেরক নম্বর",
  "TrxID",
];

var STATUS_LABELS = {
  later: "পরে অনুদান দিবেন",
  payment_sent: "অনুদান তথ্য পাঠিয়েছেন",
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || data.secret !== secret) return json_({ ok: false, error: "unauthorized" });

    lock.waitLock(20000);

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    var row = [
      data.id,
      Utilities.formatDate(new Date(), "Asia/Dhaka", "yyyy-MM-dd HH:mm:ss"),
      STATUS_LABELS[data.status] || data.status,
      data.tierTitle,
      data.amount,
      data.name,
      data.phone,
      data.whatsapp || data.phone,
      data.profession,
      data.address,
      data.mediumName,
      data.mediumPhone,
      data.paymentMethod,
      data.senderNumber,
      data.trxId,
    ];

    // Plain-text format keeps leading zeros of phone numbers and TrxIDs.
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length);
    range.setNumberFormat("@");
    range.setValues([row]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
