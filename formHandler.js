
function onFormSubmit(formSubmitObj) {
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
  var price = getTicketPrice(formData, priceConfig);

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

  var summaryVars = {
    'timestamp' : timestamp,
    'accommodation' : accommodation,
    'name' : name + ' ' + surname,
    'email' : userEmailAddress,
    'phone' : phone,
    'address' : address,
    'roommate' : roommate,
    'support' : support,
    'note' : note,
    'birthYear' : birthYear,
    'price' : price,
    'varSymbol' : varSymbolId
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

function getTicketPrice(formData, priceConfig){

  var accommodation = formData['accommodation'].value;
  var support = parseInt(formData['support'].value);

  var priceStr = undefined

  if(accommodation == 'Postel s příslušenstvím')       { priceStr = priceConfig.With; }
  else if(accommodation == 'Postel bez příslušenství') { priceStr = priceConfig.Without; }
  else if(accommodation == 'Spacák')                   { priceStr = priceConfig.SleepingBag; }
  else { logError('Invalid accommodation value: ' + accommodation); }

  var price = parseInt(priceStr) + support
  runtimeLog("price inferrect: " + price)

  return price
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

  var template = getConfirmationEmailTemplate();
  var templatedData = fillInTemplate(template.text, summaryVars);

  var subject = template.subject;

  sendEmail(userEmailAddress, subject, templatedData, undefined, true);
}
