
function onFormSubmit(formSubmitObj) {
  // For unknown reason onFormSubmit is sometimes called without form being submitted.
  // Usually two or three times immediately after legitimate submission. In such a case
  // formSubmitObj contains timestmap but it is otherwise empty.
  if (formSubmitObj.namedValues.Email == '') {
    console.log('On form submitted call suppressed');
    return;
  }
  runtimeLog('On form submited fired.');
  workOnSendingConfirmationEmail(formSubmitObj);
  updateSignInForm();
}

function getDeadlineFromCurrentDate() {
  var date = new Date();
  date.setDate(date.getDate() + PAYMENT_DEADLINE_DAYS);
  return Utilities.formatDate(date, 'Europe/Prague', 'dd.MM.yyyy');
}

function workOnSendingConfirmationEmail(formSubmitObj) {
  Logger.log("Processing data...");
  var translationConfig = getTranslationConfig();
  console.log(translationConfig);

  var formData = getFormData(formSubmitObj, translationConfig);
  console.log(formData);

  var counts = getCurrentAccommodationTypeCounts();
  var subMode = isFullCapacity(counts);

  var accommodation = formData[K_ACCOMODATION_TYPE].value || ' ';
  if (subMode) {
    accommodation = SUB_ACCOMODATION;
  }

  var supportValue = formData[K_SUPPORT].value;
  var isShirtChosen = !(formData[K_SHIRT].value.isEmpty() || formData[K_SHIRT].value == "Bez trika");
  var price = getTicketPrice(accommodation, supportValue, isShirtChosen);

  var currentRow;
  var answersSheet = getSheet(ANSWERS_SHEET);

  if (typeof formSubmitObj.range.getRow !== "undefined") {
    currentRow = formSubmitObj.range.getRow();
  }
  else {
    currentRow = answersSheet.getLastRow();
  }
  var varSymbolId = getVariableSymbol(currentRow, price);



  if (supportValue < 0) { supportValue = 0; }

  var deadline = getDeadlineFromCurrentDate();

  var timestamp = formData[K_TIMESTAMP].value;

  var summaryVars = {
    [K_TIMESTAMP]: timestamp,
    [K_VAR_SYMBOL]: varSymbolId,
    [K_PRICE]: price,
    [K_DEADLINE]: deadline,
    [K_SUB_ORDER]: currentRow,
    //hidden note
  };

  RegistrationFormQuestions.forEach(q=>summaryVars[q] = formData[q].value);

  Logger.log("Adding data to Master data...");
  
  createDataMasterRow(summaryVars);

  Logger.log("Adding data to Bank info...");

  startTrackingPayment(summaryVars, subMode);

  Logger.log("Sending email...");

  if (!subMode) {
    sendEmailConfirmation(summaryVars);
  }
  else {
    sendEmailSub(summaryVars);
  }
}

function getVariableSymbol(rowNumber, price) {
  var rowNumberPadded = ("000" + rowNumber).slice(-3);
  var pricePadded = ("0000" + price).slice(-4);
  return '23' + rowNumberPadded + pricePadded;
}

function getTicketPrice(accommodationCode, supportValue, isShirtChosen) {

  var price = 0;
 
  var support = parseInt(supportValue) || 0;
  if (support < 0) {
    support = 0;
  }
  price += support;
  if(isShirtChosen)
  {
    price += SHIRT_PRICE;
  }
  var accomodationPrice = AccommodationPrice[accommodationCode];
  price += accomodationPrice;

  return price;
}

function createDataMasterRow(summaryVars) {
  var config = getTranslationConfig();
  var userDataHeader = DataMasterHeader.map(k => config[k].title);
  createSheetIfDoesntExist(DATA_MASTER_SHEET, userDataHeader);

  summaryVars[K_HIDDEN_NOTE] = "";
  summaryVars[K_ROLE] = "participant";

  appendRowToSheet(DATA_MASTER_SHEET, projectVarsIntoArray(summaryVars, DataMasterHeader));
}

function projectVarsIntoArray(summaryVars, array)
{
  var targetArray = [];
  array.forEach(d => {
    if (typeof summaryVars[d] !== "undefined") {
      targetArray.push(summaryVars[d].toString());
    }
    else {
      targetArray.push('');
    }
  });
  return targetArray;
}

function startTrackingPayment(summaryVars, isManual) {

  var config = getTranslationConfig();
  var userDataHeader = BankInfoDataHeader.map(k => config[k].title);
  createSheetIfDoesntExist(MONEY_INFO_SHEET, userDataHeader);

  summaryVars[K_MANUAL_OVERRIDE] = isManual;
  summaryVars[K_PAID] = 0;
  summaryVars[K_PAID_EVERYTHING] = false;
  summaryVars[K_HIDDEN_NOTE] = "";
  summaryVars[K_REGISTRATION_VALID] = true;
  summaryVars[K_REMINDER_SENT] = false;

  appendRowToSheet(MONEY_INFO_SHEET, projectVarsIntoArray(summaryVars, BankInfoDataHeader));
}

function overLimit(counts) {
  // Object.keys(AccomondationLimits).forEach((key) => {
  //   limit += AccomondationLimits[key];
  // });
  var current = 0;
  Object.keys(counts).forEach((key) => {
    current += counts[key];
  });
  return current - MAX_PARTICIPANTS;
}

function isFullCapacity(counts) {
  return overLimit(counts) >= 0;
}

function getValuesFromColumn(sheetName, columnType) {
  var sheet = getSheet(sheetName);
  var translationConfig = getTranslationConfig();
  var accomodationIndex = getIndexOfColumnName(translationConfig[columnType].title, sheet);
  return getStringsFromColumn(accomodationIndex, sheet);
}

function getCurrentAccommodationTypeCounts() {
  var values = getValuesFromColumn(DATA_MASTER_SHEET, K_ACCOMODATION_TYPE);
  return (
    {
      [GYMPL_TYPE]: values.filter(v => v == GYMPL_TYPE).length,
      [VDCM_POSTEL_TYPE]:  values.filter(v => v == VDCM_POSTEL_TYPE).length,
      [SPACAK_FOOD_TYPE]: values.filter(v => v == SPACAK_FOOD_TYPE).length,
      [SPACAK_ONLY_TYPE]: values.filter(v => v == SPACAK_ONLY_TYPE).length,
      [PROGRAM_FOOD_TYPE]: values.filter(v => v == PROGRAM_FOOD_TYPE).length,
      [PROGRAM_ONLY_TYPE]: values.filter(v => v == PROGRAM_ONLY_TYPE).length,
      [PROGRAM_ONLY_FRIDAY]: values.filter(v => v == PROGRAM_ONLY_FRIDAY).length,
      [PROGRAM_ONLY_SATURDAY]: values.filter(v => v == PROGRAM_ONLY_SATURDAY).length
    }
  );
}