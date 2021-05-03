
function onFormSubmit(formSubmitObj) {
  // For unknown reason onFormSubmit is sometimes called without form being submitted.
  // Usually two or three times immediately after legitimate submission. In such a case
  // formSubmitObj contains timestmap but it is otherwise empty.
  if (formSubmitObj.namedValues.Email == '' || formSubmitObj.namedValues['Varianta ubytování'] == '') {
    console.log('On form submitted call suppressed');
    return;
  }
  runtimeLog('On form submited fired.');
  prepareHeaderForId();
  workOnSendingConfirmationEmail(formSubmitObj);
  updateSignInForm();
}

function prepareHeaderForId() {
  var sheet = getSheet(ANSWERS_SHEET);
  var config = getTranslationConfig();
  insertComumnIfDoesNotExist(config[K_VAR_SYMBOL].title, sheet, 1);
}

function getDeadlineFromCurrentDate() {
  var date = new Date();
  date.setDate(date.getDate() + PAYMENT_DEADLINE_DAYS);
  return Utilities.formatDate(date, 'Europe/Prague', 'dd.MM.yyyy');
}

function workOnSendingConfirmationEmail(formSubmitObj) {
  Logger.log("Sending email...");
  var translationConfig = getTranslationConfig();
  console.log(translationConfig);

  var formData = getFormData(formSubmitObj, translationConfig);
  console.log(formData);

  var supportValue = formData[K_SUPPORT].value;
  var accomodationCode = formData[K_ACCOMODATION_TYPE].value;
  var price = getTicketPrice(accomodationCode, supportValue);

  var currentRow;
  var answersSheet = getSheet(ANSWERS_SHEET);

  if (typeof formSubmitObj.range.getRow !== "undefined") {
    currentRow = formSubmitObj.range.getRow();
  }
  else {
    currentRow = answersSheet.getLastRow() + 1;
  }
  var varSymbolId = getVariableSymbol(currentRow, price);

  var timestamp = formData[K_TIMESTAMP].value;
  var name = formData[K_NAME].value || ' ';
  var surname = formData[K_SURNAME].value || ' ';
  var sex = formData[K_SEX].value || ' ';
  var userEmailAddress = formData.email.value;
  var birthYear = formData[K_BIRTH_YEAR].value || ' ';
  var address = formData[K_ADDRESS].value || ' ';
  var region = formData[K_REGION].value || ' ';
  var city = formData[K_CITY].value || ' ';
  var accommodation = formData[K_ACCOMODATION_TYPE].value || ' ';
  var roommate = formData[K_ROOMMATE].value || ' ';
  var support = formData[K_SUPPORT].value || 0;
  var phone = formData[K_PHONE].value || ' ';
  var healthCondition = formData[K_HEALTH_CONDITION].value || '';
  var note = formData[K_NOTE].value || '';
  var volunteerPreference = formData[K_VOLUNTEER_PREFERENCE].value || '';
  var volunteerWeekend = formData[K_VOLUNTEER_WEEKEND].value || '';
  var afterAVinfo = formData[K_AFTER_AV_INFO].value || '';
  var supportConfirm = formData[K_SUPPORT_CONFIRM].value || '';

  if (support < 0) { support = 0; }

  var deadline = getDeadlineFromCurrentDate();

  var order = getCurrentOrderFromAccomodation()+1;
  var counts = getCurrentAccomodationTypeCounts();
  var normalMode = isFullCapacity(counts);
  
  var summaryVars = {
    [K_TIMESTAMP]: timestamp,
    [K_NAME]: name,
    [K_SURNAME]: surname,
    [K_SEX]: sex,
    [K_EMAIL]: userEmailAddress,
    [K_BIRTH_YEAR]: birthYear,
    [K_ADDRESS]: address,
    [K_REGION]: region,
    [K_CITY]: city,
    [K_ACCOMODATION_TYPE]: accommodation,
    [K_ROOMMATE]: roommate,
    [K_SUPPORT]: support,
    [K_PHONE]: phone,
    [K_HEALTH_CONDITION]: healthCondition,
    [K_NOTE]: note,
    [K_VOLUNTEER_PREFERENCE]: volunteerPreference,
    [K_VOLUNTEER_WEEKEND]: volunteerWeekend,
    [K_AFTER_AV_INFO]: afterAVinfo,
    [K_PRICE]: price,
    [K_VAR_SYMBOL]: varSymbolId,
    [K_DEADLINE]: deadline,
    [K_SUB_ORDER]: order,
    [K_SUPPORT_CONFIRM]: supportConfirm
  };

  // store inferred var symbol in sheet
  addDataToCurrentRow(currentRow, 1, varSymbolId, answersSheet);

  // accomodation value is rewritten as a code
  updateValueOnColumn(summaryVars[K_ACCOMODATION_TYPE], currentRow - 1, translationConfig[K_ACCOMODATION_TYPE].title, answersSheet);

  if (normalMode) {
    startTrackingPayment(summaryVars);
    sendEmailConfirmation(summaryVars);
  }
  else {
    sendEmailSub(summaryVars);
  }

  // copy line added by form submittion into sheet where we do our calculations
  // we do not want to manually add rows into original form responses sheet
  // and at the same time we do not want to copy data from sheet to sheet manually.
  // using simple equals formular is not working since new form data are added by
  // inserting new row instead of filling existing empty row. Therefore all
  // formula pointing to last empty line are still pointing to empty line after new
  // response
  
  var valuesArray = [
    summaryVars[K_TIMESTAMP],
    summaryVars[K_VAR_SYMBOL],
    summaryVars[K_NAME],
    summaryVars[K_SURNAME],
    summaryVars[K_EMAIL],
    summaryVars[K_BIRTH_YEAR],
    summaryVars[K_ADDRESS],
    summaryVars[K_ROOMMATE],
    summaryVars[K_ACCOMODATION_TYPE],
    summaryVars[K_PHONE],
    summaryVars[K_SUPPORT],
    summaryVars[K_SUPPORT_CONFIRM],
    summaryVars[K_NOTE],
    summaryVars[K_SUB_ORDER]
  ];
  var sheet = getSheet(YOU_CAN_TOUCH_SHEET);
  sheet.appendRow(valuesArray);
}

function getVariableSymbol(rowNumber, price) {
  var rowNumberPadded = ("000" + rowNumber).slice(-3);
  var pricePadded = ("0000" + price).slice(-4);
  return '21' + rowNumberPadded + pricePadded;
}

function getTicketPrice(accommodationCode, supportValue) {

  var support = parseInt(supportValue) || 0;
  if (support < 0) {
    support = 0;
  }
  var price = AccomondationPrice[accommodationCode];

  return price + support;
}

function startTrackingPayment(summaryVars) {

  var config = getTranslationConfig();
  var userDataHeader = BankInfoDataHeader.map(k=>config[k].title);

  summaryVars[K_MANUAL_OVERRIDE] = false;
  summaryVars[K_PAID] = 0;
  summaryVars[K_PAID_EVERYTHING] = false;
  summaryVars[K_HIDDEN_NOTE] = "";
  summaryVars[K_REGISTRATION_VALID] = true;
  summaryVars[K_REMINDER_SENT] = false;


  createSheetIfDoesntExist(MONEY_INFO_SHEET, userDataHeader);

  var moneyInfo = [];
  BankInfoDataHeader.forEach(d => {
    if(typeof summaryVars[d] !== "undefined")
    {
      moneyInfo.push(summaryVars[d]);
    }
    else
    {
      moneyInfo.push('');
    }
  });
  appendRowToSheet(MONEY_INFO_SHEET, objectValuesToArray(moneyInfo));
}

function overLimit(counts) {
  var limit = 0;
  Object.keys(AccomondationLimits).forEach((key) => {
    limit += AccomondationLimits[key];
  });
  var current = 0;
  Object.keys(counts).forEach((key) => {
    current += counts[key];
  });
  return current - limit;
}

function isFullCapacity(counts) {
  return overLimit(counts) <= 0;
}

function getValuesFromColumn(sheetName, columnType)
{
  var sheet = getSheet(sheetName);
  var translationConfig = getTranslationConfig();
  var accomodationIndex = getIndexOfColumnName(translationConfig[columnType].title, sheet);
  return getStringsFromColumn(accomodationIndex, sheet);
}

function getCurrentAccomodationTypeCounts() {
  var values = getValuesFromColumn(ANSWERS_SHEET, K_ACCOMODATION_TYPE);
  var withCount = values.filter(v => v == WITH_TYPE).length;
  var withoutCount = values.filter(v => v == WITHOUT_TYPE).length;
  var spacakCount = values.filter(v => v == SPACAK_TYPE).length;
  var programCount = values.filter(v => v == PROGRAM_ONLY_TYPE || v == PROGRAM_FOOD_ONLY_TYPE).length;
  return { [WITH_TYPE]: withCount, [WITHOUT_TYPE]: withoutCount, [SPACAK_TYPE]: spacakCount, [PROGRAM_TYPE]: programCount };
}

function getCurrentOrderFromAccomodation() {
  var values = getValuesFromColumn(ANSWERS_SHEET, K_ACCOMODATION_TYPE);
  var order = values.filter(v => v == WITH_TYPE || v == WITHOUT_TYPE || v == SPACAK_TYPE || v == PROGRAM_FOOD_ONLY_TYPE || v == PROGRAM_ONLY_TYPE || v == STORNO_TYPE).length;
  return order;
}