//NESAHAT!!


////
// Logger
//
function logError(message) {
  sheetLog('errorLog', message);
  Logger.log(message);
}

function logNeedsAttention(message, email, id) {

  var needsAttentionSheetName = 'needs attention';

  var userDataHeader = ['timestamp', 'id', 'email', 'already looked at (enter your name after you fix it)', 'other data'];
  createSheetIfDoesntExist(needsAttentionSheetName, userDataHeader);

  var data = [id, email, false].concat(message);
  sheetLog(needsAttentionSheetName, data);
}

function runtimeLog(obj) {
  Logger.log(obj);
}

function sheetLog(logSheetName, message) {

  var logSheet = createSheetIfDoesntExist(logSheetName, undefined);
  var timestamp = new Date();

  if (Array.isArray(message)) {
    message = message.map(function (obj) { if (typeof obj !== 'string') { return JSON.stringify(obj); } else { return obj; } });
    message.unshift(timestamp);
  } else {
    if (typeof message !== 'string') { message = JSON.stringify(message); }
    message = [timestamp, message];
  }

  logSheet.appendRow(message);
}
//
// End Logger
////

////
// Sheet manipulating functions
//
function getStringsFromColumn(column, sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow == 0) {
    return [];
  }
  return sheet.getRange(column + "1:" + column + lastRow).getDisplayValues().map(s => s.toString());
}

function findRowIndexAndRangeInSheet(sheetName, searchValue, searchColumnIndex) {

  var dataRange = getActiveRange(sheetName);
  if (dataRange == null) { logError('sheet' + sheetName + 'does not exist but should.'); return null; }

  var data = dataRange.getValues();

  for (var i = 0; i < data.length; ++i) {

    var dataRow = data[i];
    if (dataRow[searchColumnIndex] != searchValue) { continue; }

    return {
      'range': dataRange,
      'indexInRange': i,
    };

  }

  return null;
}

function getActiveRange(sheetName) {

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (sheet == null) { return null; }
  var dataRange = sheet.getDataRange();

  return dataRange;

}

function createSheetIfDoesntExist(sheetName, header) {

  var currSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = currSpreadsheet.getSheetByName(sheetName);
  if (sheet == null) {
    sheet = currSpreadsheet.insertSheet(sheetName);
    if (typeof header !== 'undefined') { sheet.appendRow(header); }
  }

  return sheet;
}

function insertComumnIfDoesNotExist(columnHeader, sheet, indexBefore) {

  //Range indexes are one-based
  var headerCellValue = sheet.getRange(1, indexBefore + 1).getValue();
  if (headerCellValue != columnHeader) {
    sheet.insertColumnBefore(indexBefore + 1);
  }

  sheet.getRange(1, indexBefore + 1).setValue(columnHeader);
}

function addDataToCurrentRow(range, columnIndex, data) {
  var sheet = range.getSheet();
  var rowNumber = range.getRow();

  //Range isn't zero based index
  var cellObject = sheet.getRange(rowNumber, columnIndex + 1);
  var originalValue = cellObject.getValue();
  if (originalValue !== '') {
    logError(['Cell for id was not empty:', originalValue, ' ', rowNumber, range]);
    runtimeLog(originalValue);
  }

  cellObject.setValue(data);
}
//
// End Sheet manipulating functions
////

////
// Mailer:
//
function fillInTemplate(template, data) {
  var templateVars = template.match(/##[A-Za-z]+/g);
  var templatedString = template;

  if (templateVars == null) { return template; }

  for (var i = 0; i < templateVars.length; ++i) {
    var dataKey = templateVars[i].substring(2);
    if (data.hasOwnProperty(dataKey)) {
      var dataValue = data[dataKey];
    } else {
      var dataValue = "";
      logError("No key \"" + dataKey + "\" in " + data)
    }

    templatedString = templatedString.replace(templateVars[i], dataValue);
  }

  return templatedString;
}

function logCurrentEmailQuota() {
  var q = MailApp.getRemainingDailyQuota();
  runtimeLog('current remaining daily quota ' + q);
}

function emailQuotaVojta() {
  return MailApp.getRemainingDailyQuota();
}

function sendEmailMailerSend(recipient, templateData, templateId) {

  var body =
  {
    "to": [
      {
        "email": recipient,
      }
    ],
    "template_id": templateId,
    "reply_to": [
      {
        "email": 'info@absolventskyvelehrad.cz',
        "name": 'AV21'
      }
    ],
    "variables": [
      {
        "email": recipient,
        "substitutions": templateData
      }
    ]
  }
  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "authorization": "Bearer " + getMailerSendkey()
    },
    "payload": JSON.stringify(body)
  }

  var response = UrlFetchApp.fetch("https://api.mailersend.com/v1/email", options);
  Logger.log(response);
}

function sendEmail(recipient, subject, plainBody, html_Body, bcc, enqueue) {
  if (typeof enqueue === 'undefined' || enqueue === 'undefined') { enqueue = true; }
  onTryToSendEnqueuedEmailsTick();

  var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  console.log("Remaining email quota: " + emailQuotaRemaining);

  if (emailQuotaRemaining < 5 && enqueue) {
    enqueueEmail(recipient, subject, plainBody, html_Body, bcc);
    return false;
  }

  var options = {
    from: "tym.realizace@absolventskyvelehrad.cz",
    replyTo: "tym.realizace@absolventskyvelehrad.cz",
    htmlBody: html_Body
  }

  GmailApp.sendEmail(recipient, subject, plainBody, options);
  return true;
}


function enqueueEmail(recipient, subject, plainBody, htmlBody, bcc) {
  runtimeLog('enqueued email');

  var emailQueueSheetName = 'emailQueue';
  createSheetIfDoesntExist(emailQueueSheetName, undefined);

  sheetLog(emailQueueSheetName, [recipient, subject, plainBody, htmlBody, bcc, false]);
}

function onTryToSendEnqueuedEmailsTick() {
  var todaysQuota = MailApp.getRemainingDailyQuota();
  if (todaysQuota < 1) { return -1; }

  var dataRange = getActiveRange('emailQueue');
  if (dataRange == null) { return -1; }

  var sheet = dataRange.getSheet();
  var data = dataRange.getValues();

  var numberOfEmailsToBeSent = Math.min(data.length, todaysQuota); runtimeLog('To be sent:' + numberOfEmailsToBeSent);
  var i = 0;
  for (i = 0; i < numberOfEmailsToBeSent; ++i) {

    var dataRow = data[i];
    if (dataRow[6]) { continue; }

    if (sendEmail(dataRow[1], dataRow[2], dataRow[3], dataRow[4], dataRow[5], false)) {
      sheet.getRange(1 + i, 7).setValue(true);
    } else { break; }

  }

  runtimeLog('Sent: ' + i);
  return i;
}

function onTryToSendAttentionRequiredEmailsTick() {
  var todaysQuota = MailApp.getRemainingDailyQuota();
  if (todaysQuota < 1) { return; }

  var dataRange = getActiveRange('needs attention');
  if (dataRange == null) { return; }

  var sheet = dataRange.getSheet();
  var data = dataRange.getValues();

  var body = '';
  var numberOfNeedsAttentionMessages = 0;
  for (var i = 1; i < data.length; ++i) {

    var dataRow = data[i];
    if (dataRow[3]) { continue; }
    body += dataRow.join(', ') + '\n';
    numberOfNeedsAttentionMessages += 1;

  }

  if (!(numberOfNeedsAttentionMessages > 0)) { return; }

  var generalConfig = getGeneralConfig();
  var attentionEmailObject = {
    'subject': generalConfig['attentionSubject'],
    'recipient': generalConfig['attentionEmail'],
    'body': body,
  };

  sendEmail(attentionEmailObject.recipient, attentionEmailObject.subject, attentionEmailObject.body, '', undefined, true);
}
//
// End Mailer;
////

////
// Utils:
//
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function dayDiff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1;
}

function getStringHashCode(stringToBeHashed) {
  var hash = 0;
  if (this.length == 0) return hash;
  for (var i = 0; i < stringToBeHashed.length; i++) {
    var char = stringToBeHashed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  hash = Math.abs(hash);
  hash = (hash > 1000000000) ? hash : hash + 1000000000;
  return hash;
}

function objectValuesToArray(obj) {
  return Object.keys(obj).map(function (key) { return obj[key]; });
}

function objectKeysToArray(obj) {
  return Object.keys(obj);
}

function dateTimeToFullString(date) {
  var now = date;
  var year = now.getFullYear().toString();
  var month = (now.getMonth() + 1).toString();
  var day = now.getDate().toString();
  var hour = now.getHours().toString();
  var minute = now.getMinutes().toString();
  var second = now.getSeconds().toString();

  if (month.length == 1) {
    month = '0' + month;
  }
  if (day.length == 1) {
    day = '0' + day;
  }
  if (hour.length == 1) {
    hour = '0' + hour;
  }
  if (minute.length == 1) {
    minute = '0' + minute;
  }
  if (second.length == 1) {
    second = '0' + second;
  }
  var dateTime = year + '/' + day + '/' + month + ' ' + hour + ':' + minute + ':' + second;
  return dateTime;
}

function dateTimeToLimitedString(date) {
  var now = date;
  var year = now.getFullYear().toString();
  var month = (now.getMonth() + 1).toString();
  var day = now.getDate().toString();

  if (month.length == 1) {
    month = '0' + month;
  }
  if (day.length == 1) {
    day = '0' + day;
  }

  var dateTime = day + '/' + month;
  return dateTime;
}

function reliableToInt(obj) {
  var objType = typeof obj;
  if (objType === "string") {
    return parseInt(obj);
  }
  else if (objType === "number") {
    return obj;
  }
  else if (objType == "booloean") {
    return (obj) ? 1 : 0;
  }
  else { return undefined; }
}
//
// End Utils;
////
