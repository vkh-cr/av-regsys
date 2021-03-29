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

  var timestamp = new Date();
  if (Array.isArray(message)) {
    message = message.map(function (obj) { if (typeof obj !== 'string') { return JSON.stringify(obj); } else { return obj; } });
    message.unshift(timestamp);
  } else {
    if (typeof message !== 'string') { message = JSON.stringify(message); }
    message = [timestamp, message];
  }
  appendRowToSheet(logSheetName, message)
}

function appendRowToSheet(sheetName, message)
{
  var logSheet = createSheetIfDoesntExist(sheetName, undefined);
  logSheet.appendRow(message);
}
//
// End Logger
////

////
// Sheet manipulating functions
//
function getIndexOfColumnName(columnName, sheet)
{
  var columns = getColumnNames(sheet);
  return columns.indexOf(columnName);
}

function getSummaryVars(mail, sheet)
{
  var translations = getTranslationConfig();  
  var columns =  getColumnNames(sheet);
  var rowIndex = getIndexOfValueFromColumn(translations[K_EMAIL].title, mail, columns, sheet);
  if(rowIndex==-1)
  {
    logError(mail + ' was not found among registered.');
    return {};
  }

  // +1, because first row is column names
  var values = getStringsFromRow(rowIndex+1, sheet);
  var summaryVars = {};
  for (const i in columns) 
  {
    var translationKey = getKeyByTranslationValue(translations, columns[i]);
    if (typeof translationKey === "undefined")
    {
      continue;
    }

    summaryVars[translationKey] = values[i];
  }
  return summaryVars;
}

function getStringsFromColumn(column, sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow == 0) {
    return [];
  }
  return sheet.getRange(2, column + 1, lastRow, 1).getDisplayValues().map(s => s.toString());
}

function getIndexOfValueFromColumn(columnName, value, columns, sheet)
{
  var index = columns.indexOf(columnName);
  if(index == -1)
  {
    logError(columnName + ' was not found in columns.');
    return;
  }
  var allValues = getStringsFromColumn(index, sheet);
  return allValues.indexOf(value);
}

function getColumnNames(sheet) 
{
  return getStringsFromRow(0, sheet);
}

function getStringsFromRow(rowIndex, sheet)
{
  var lastColumn = sheet.getLastColumn();
  var range = sheet.getRange(rowIndex + 1, 1, 1, lastColumn);
  return range.getDisplayValues()[0].map(s => s.toString());
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
  if(typeof currSpreadsheet === 'undefined' || currSpreadsheet == null)
  {
    currSpreadsheet = SpreadsheetApp.openById(MAIN_SPREADSHEET);
  }
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

// zero based index in parameters
function addDataToCurrentRow(rowIndex, columnIndex, data, sheet) {
  var cellObject = sheet.getRange(rowIndex, columnIndex + 1);
  var originalValue = cellObject.getValue();
  if (originalValue !== '') {
    logError(['Cell for id was not empty:', originalValue, ' ', rowIndex + 1, range]);
    runtimeLog(originalValue);
  }
  cellObject.setValue(data);
}

// zero based index in parameters
function updateValueOnColumn(value, rowIndex, columnName, sheet)
{  
  var columns =  getColumnNames(sheet);
  return updateValueOnColumnsDefined(value, rowIndex, columnName, sheet, columns);
}

// zero based index in parameters
function updateValueOnColumnsDefined(value, rowIndex, columnName, sheet, columns)
{  
  var columnIndex = columns.indexOf(columnName);
  var cellObject = sheet.getRange(rowIndex + 1, columnIndex + 1);
  cellObject.setValue(value);
}

function getSheet(name)
{
  var spreadsheet = SpreadsheetApp.openById(MAIN_SPREADSHEET);
  return spreadsheet.getSheetByName(name);
}
//
// End Sheet manipulating functions
////

////
// Utils:
//
String.prototype.isEmpty = function() {
  return (this.length === 0 || !this.trim());
};

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
  else if (objType == "boolean") {
    return (obj) ? 1 : 0;
  }
  else { return undefined; }
}
//
// End Utils;
////
