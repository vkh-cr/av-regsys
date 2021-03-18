
function onFormSubmit(formSubmitObj) {
  console.log(formSubmitObj);

  // For unknown reason onFormSubmit is sometimes called without form being submitted.
  // Usually two or three times immediately after legitimate submission. In such a case
  // formSubmitObj contains timestmap but it is otherwise empty.
  if (formSubmitObj.namedValues.Email == '' || formSubmitObj.namedValues['Varianta ubytování'] == '') {
    console.log('On form submitted call suppressed');
    return;
  }
  runtimeLog('On form submited fired.');
  prepareHeaderForId(formSubmitObj);
  workOnSendingConfirmationEmail(formSubmitObj);
}

function prepareHeaderForId(formSubmitObj) {
  var sheet = formSubmitObj.range.getSheet();
  insertComumnIfDoesNotExist('id/var. symbol', sheet, 1);
}

function getDeadlineFromCurrentDate()
{
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

  var accommodationCode = getAccommodationCode(formData);
  var supportValue = formData[K_SUPPORT].value;

  var price = getTicketPrice(accommodationCode, supportValue);

  var varSymbolId = getVariableSymbol(formSubmitObj.range.getRow(), price);

  var timestamp = formData[K_TIMESTAMP].value;
  var name = formData[K_NAME].value || ' ';
  var surname = formData[K_SURNAME].value || ' ';
  var sex = formData[K_SEX].value || ' ';
  var userEmailAddress = formData.email.value;
  var birthYear = formData[K_BIRTH_YEAR].value || ' ';
  var address = formData[K_ADDRESS].value || ' ';
  var region = formData[K_REGION].value || ' ';
  var city = formData[K_CITY].value || ' ';
  var accommodation = formData[K_ACCOMODATION].value || ' ';
  var roommate = formData[K_ROOMMATE].value || ' ' ;
  var support = formData[K_SUPPORT].value || 0 ;
  var phone = formData[K_PHONE].value || ' ';
  var healthCondition = formData[K_HEALTH_CONDITION].value || '' ;
  var note = formData[K_NOTE].value || '' ;
  var volunteerPreference = formData[K_VOLUNTEER_PREFERENCE].value || '' ;
  var volunteerWeekend = formData[K_VOLUNTEER_WEEKEND].value || '' ;
  var afterAVinfo = formData[K_AFTER_AV_INFO].value || '' ;

  if (support < 0) { support = 0; }

  var deadline = getDeadlineFromCurrentDate();
  
  var supportMsg = '';
  if (support > 0) { supportMsg = ' a dobrovolný příspěvek ' + support + 'Kč'; }

  var summaryVars = {
    [K_TIMESTAMP] : timestamp,
    [K_NAME] : name,
    [K_SURNAME] : surname,
    [K_SEX] : sex,
    [K_EMAIL] : userEmailAddress,
    [K_BIRTH_YEAR] : birthYear,
    [K_ADDRESS] : address,
    [K_REGION] : region,
    [K_CITY] : city,
    [K_ACCOMODATION] : accommodation,
    [K_ROOMMATE] : roommate,
    [K_SUPPORT] : support,
    [K_PHONE] : phone,
    [K_HEALTH_CONDITION] : healthCondition,
    [K_NOTE] : note,
    [K_VOLUNTEER_PREFERENCE] : volunteerPreference,
    [K_VOLUNTEER_WEEKEND] : volunteerWeekend,
    [K_AFTER_AV_INFO] : afterAVinfo,
    [K_PRICE] : price,
    [K_VAR_SYMBOL] : varSymbolId,
    [K_DEADLINE] : deadline,
    [K_SUPPORTMSG] : supportMsg
  };

  // store inferred var symbol in sheet
  addDataToCurrentRow(formSubmitObj.range, 1, varSymbolId);

  startTrackingPayment(summaryVars, name + ' ' + surname, userEmailAddress, true);
  sendEmailConfirmation(summaryVars);

  // copy line added by form submittion into sheet where we do our calculations
  // we do not want to manually add rows into original form responses sheet
  // and at the same time we do not want to copy data from sheet to sheet manually.
  // using simple equals formular is not working since new form data are added by
  // inserting new row instead of filling existing empty row. Therefore all
  // formula pointing to last empty line are still pointing to empty line after new
  // response
  var valuesArr = formSubmitObj.range.getDisplayValues()[0];
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('You CAN touch this');
  sheet.appendRow(valuesArr);
}

function getVariableSymbol(rowNumber, price) {
  var rowNumberPadded = ("000" + rowNumber).slice(-3);
  var pricePadded = ("0000" + price).slice(-4);
  return '21' + rowNumberPadded + pricePadded;
}

function getAccommodationCode(formData) {
  var accommodation = formData[K_ACCOMODATION].value || ' ';
  if (accommodation in AccomondationType)
  {
    return AccomondationType[accommodation];
  }
  logError('Invalid accommodation value: ' + accommodation);
}

function getTicketPrice(accommodationCode, supportValue){

  var support = parseInt(supportValue) || 0;
  if (support < 0) {
    support = 0;
  }

  var price = AccomondationPrice[accommodationCode];

  return price+support;
}

function startTrackingPayment(summaryVars, name, email, registrationValid) {
  var moneyInfoSheetName = 'money info';
  var userDataHeader = [
	  'timestamp',
	  'name',
	  'id',
	  'manual override',
	  'email',
	  'price',
	  'paid',
	  'paid everything',
    'paid everything timestamp',
	  'registration valid (not too old, ...)',
	  'upominka odeslana',
	  'expired alert',
	  'other notes'
  ];
  createSheetIfDoesntExist(moneyInfoSheetName, userDataHeader);

  var moneyInfo = {
    // timestamp is added by sheetLog function
    'name' : name,
    'id' : summaryVars.varSymbol,
    'manualOverrideReq' : false,
    'email' : email,
    'finalPrice' : summaryVars.price,
    'paidCZK' : 0,
    'paidEverything' : false,
    'registrationValid' : registrationValid
  };
  sheetLog(moneyInfoSheetName, objectValuesToArray(moneyInfo));
}

function getCurrentAccomodationTypeCounts()
{
  var spreadsheet = SpreadsheetApp.openById(MAIN_SPREADSHEET);
  var sheet = spreadsheet.getSheetByName(ANSWERS_SHEET);
  var values = getStringsFromColumn(9, sheet);
  var withCount = values.filter(a=>a.startsWith(AccomondationType[WITH_TYPE])).length;
  var withoutCount = values.filter(a=>a.startsWith(AccomondationType[WITHOUT_TYPE])).length;
  var spacakCount = values.filter(a=>a.startsWith(AccomondationType[SPACAK_TYPE])).length;
  var programCount = values.filter(a=>a.startsWith(AccomondationType[PROGRAM_ONLY_TYPE])||a.startsWith(AccomondationType[PROGRAM_FOOD_ONLY_TYPE])).length;
  return {[WITH_TYPE]: withCount, [WITHOUT_TYPE]: withoutCount, [SPACAK_TYPE]: spacakCount, [PROGRAM_TYPE]: programCount};
}

