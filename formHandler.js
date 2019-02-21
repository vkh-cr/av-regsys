
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
  var priceConfig = getPriceConfig();

  var formData = getFormData(formSubmitObj, translationConfig);
  console.log(formData);

  var accommodationCode = getAccommodationCode(formData);
  var supportValue = formData['support'].value;

  var price = getTicketPrice(accommodationCode, supportValue, priceConfig);

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
  date.setDate(date.getDate() + 11);
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
}

function getVariableSymbol(range, price) {
  var rowNumber = range.getRow();
  var rowNumberPadded = ("000" + rowNumber).slice(-3);
  var pricePadded = ("0000" + price).slice(-4);
  return '19' + rowNumberPadded + pricePadded;
}

function getAccommodationCode(formData) {
  var accommodation = formData['accommodation'].value || ' ';
  if(accommodation == 'Postel s příslušenstvím')       { return 'with'; }
  else if(accommodation == 'Postel bez příslušenství') { return 'without'; }
  else if(accommodation == 'Spacák')                   { return 'spacak'; }
  else {
    logError('Invalid accommodation value: ' + accommodation);
  }
}

function getTicketPrice(accommodationCode, supportValue, priceConfig){

  var support = parseInt(supportValue) || 0;
  if (support < 0) {
    support = 0;
  }

  var priceStr = undefined;

  if(accommodationCode == 'with')         { priceStr = priceConfig.With; }
  else if(accommodationCode == 'without') { priceStr = priceConfig.Without; }
  else if(accommodationCode == 'spacak')  { priceStr = priceConfig.SleepingBag; }
  else {
    logError('Invalid accommodationCode value: ' + accommodation);
  }

  var price = parseInt(priceStr) + support;

  return price;
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
	  'registration valid (not too old, ...)',
	  'upominka odeslana',
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

  sendEmail(userEmailAddress, emailObj.subject, plainText, htmlText, undefined, true);
}

