/**
 * Appends new lifetime-member applications to the "NewMembers" tab of the
 * Google Sheet below. Called by the Django backend
 * (eslahbd_backend/api/sheets_service.py) after it saves each application.
 *
 * Setup (3 steps):
 *  1. Open the Google Sheet > Extensions > Apps Script, paste this file, Save.
 *  2. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *     Allow the permission prompt, then copy the /exec URL.
 *  3. Put that URL in LIFETIME_SHEET_WEBHOOK_URL in the backend (Railway) environment.
 *
 * The long unguessable /exec URL is the only credential, so keep it private.
 * After editing this file, use Deploy > Manage deployments > Edit > New version.
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

// Column widths in pixels, in HEADERS order.
var COLUMN_WIDTHS = [50, 150, 150, 190, 130, 180, 120, 120, 150, 260, 160, 130, 130, 130, 150];
var WRAP_COLUMNS = [10]; // ঠিকানা (1-based) wraps onto several lines.

var STATUS_LABELS = {
  later: "পরে অনুদান দিবেন",
  payment_sent: "অনুদান তথ্য পাঠিয়েছেন",
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);
    lock.waitLock(20000);

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

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
    formatSheet_(sheet);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

/** Run this by hand to tidy the tab at any time (also runs after every new row). */
function formatSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  formatSheet_(sheet);
}

function formatSheet_(sheet) {
  var cols = HEADERS.length;
  var rows = Math.max(sheet.getLastRow(), 2);

  var header = sheet.getRange(1, 1, 1, cols);
  header
    .setValues([HEADERS])
    .setBackground("#065F46")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(11)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(6); // keep আইডি ... নাম visible while scrolling sideways

  for (var i = 0; i < COLUMN_WIDTHS.length; i++) sheet.setColumnWidth(i + 1, COLUMN_WIDTHS[i]);

  var body = sheet.getRange(2, 1, rows - 1, cols);
  body.setVerticalAlignment("middle").setFontSize(10).setWrap(false);
  for (var w = 0; w < WRAP_COLUMNS.length; w++) {
    sheet.getRange(2, WRAP_COLUMNS[w], rows - 1, 1).setWrap(true);
  }
  sheet.getRange(2, 1, rows - 1, 1).setHorizontalAlignment("center");

  // Soft borders and zebra stripes, applied once.
  body.setBorder(true, true, true, true, true, true, "#D1D5DB", SpreadsheetApp.BorderStyle.SOLID);
  if (sheet.getBandings().length === 0) {
    sheet.getRange(1, 1, rows, cols).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
    sheet.getBandings()[0].setHeaderRowColor("#065F46").setFirstRowColor("#FFFFFF").setSecondRowColor("#F0FDF4");
  }

  // Filter dropdowns on the header row for sorting and searching.
  if (!sheet.getFilter()) sheet.getRange(1, 1, rows, cols).createFilter();

  // Colour the অবস্থা column so unpaid / paid applications stand out.
  var statusRange = sheet.getRange(2, 3, rows - 1, 1);
  var rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("পাঠিয়েছেন").setBackground("#D1FAE5").setFontColor("#065F46").setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("পরে").setBackground("#FEF3C7").setFontColor("#92400E").setRanges([statusRange]).build(),
  ];
  sheet.setConditionalFormatRules(rules);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
