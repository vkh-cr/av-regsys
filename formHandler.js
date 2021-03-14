
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

function workOnSendingConfirmationEmail(formSubmitObj) {
  Logger.log("Sending email...");

  var translationConfig = getTranslationConfig();
  console.log(translationConfig);

  var formData = getFormData(formSubmitObj, translationConfig);
  console.log(formData);

  var accommodationCode = getAccommodationCode(formData);
  var supportValue = formData['support'].value;

  var price = getTicketPrice(accommodationCode, supportValue);

  var userEmailAddress = formData.email.value;
  var timestamp = formData['timestamp'].value;
  var varSymbolId = getVariableSymbol(formSubmitObj.range, price);

  var accommodation = formData['accommodation'].value || ' ';
  var name = formData['name'].value || ' ';
  var surname = formData['surname'].value || ' ';
  var phone = formData['phone'].value || ' ';
  var birthYear = formData['birthYear'].value || ' ';
  var address = formData['address'].value || ' ';
  var roommate = formData['roommate'].value || ' ' ;
  var support = formData['support'].value || 0 ;
  var note = formData['note'].value || '' ;

  if (support < 0) { support = 0; }

  var date = new Date();
  date.setDate(date.getDate() + PAYMENT_DEADLINE_DAYS);
  var deadline = Utilities.formatDate(date, 'Europe/Prague', 'dd.MM.yyyy');
  
  var supportMsg = '';
  if (support > 0) { supportMsg = ' a dobrovolný příspěvek ' + support + 'Kč'; }

  var summaryVars = {
    'timestamp' : timestamp,
    'accommodation' : accommodation.toLowerCase(),
    'name' : name + ' ' + surname,
    'email' : userEmailAddress,
    'phone' : phone,
    'address' : address,
    'roommate' : roommate,
    'support' : support,
    'note' : note,
    'birthYear' : birthYear,
    'price' : price,
    'varSymbol' : varSymbolId,
    'deadline' : deadline,
    'supportMsg' : supportMsg
  };

  // store inferred var symbol in sheet
  addDataToCurrentRow(formSubmitObj.range, 1, varSymbolId);

  startTrackingPayment(summaryVars, name + ' ' + surname, userEmailAddress, true);
  sendEmailConfirmation(summaryVars, userEmailAddress);

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

function getVariableSymbol(range, price) {
  var rowNumber = range.getRow();
  var rowNumberPadded = ("000" + rowNumber).slice(-3);
  var pricePadded = ("0000" + price).slice(-4);
  return '21' + rowNumberPadded + pricePadded;
}

function getAccommodationCode(formData) {
  var accommodation = formData['accommodation'].value || ' ';
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

function sendEmailConfirmation(summaryVars, userEmailAddress) {

  Logger.log(summaryVars);
  Logger.log(userEmailAddress);

  var emailObj = emailRegistrationCreated();

  var plainText = fillInTemplate(emailObj.textPlain, summaryVars);
  var htmlText  = fillInTemplate(emailObj.textHtml,  summaryVars);

  sendEmailMailerSend(userEmailAddress, null, CONFIRMATION_TEMPLATE)
}

function getCurrentAccomodationTypeCounts(){
  var spreadsheet = SpreadsheetApp.openById(MAIN_SPREADSHEET);
  var sheet = spreadsheet.getSheetByName('Odpovědi formuláře 6');
  var values = getStringsFromColumn("J", sheet);
  var allowed = values.filter(v => Object.values(AccomondationType).some(a=>v.startsWith(a)));
  var withCount = allowed.filter(a=>a.startsWith(AccomondationType[WITH_TYPE])).length;
  var withoutCount = allowed.filter(a=>a.startsWith(AccomondationType[WITHOUT_TYPE])).length;
  var spacakCount = allowed.filter(a=>a.startsWith(AccomondationType[SPACAK_TYPE])).length;
  var programCount = allowed.filter(a=>a.startsWith(AccomondationType[PROGRAM_ONLY_TYPE])||a.startsWith(AccomondationType[PROGRAM_FOOD_ONLY_TYPE])).length;
  return {[WITH_TYPE]: withCount, [WITHOUT_TYPE]: withoutCount, [SPACAK_TYPE]: spacakCount, [PROGRAM_TYPE]: programCount};
}

