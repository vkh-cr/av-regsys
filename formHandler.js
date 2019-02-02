
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
  var price = getTicketPriceInfo(formData, priceConfig);

  var userEmailAddress = formData.email.value;
  var timestamp = formData['timestamp'].value;
  var varSymbolId =

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
  sendEmailConfirmation(summaryVars, userEmailAddress, 'normal');
}

function getVarriableSymbol() {
  var otherData = formData.birthDate.toString();
  var email = formData.email.value;

  var varSymbolIndex = 2;

  var uniqueString = '';
  var hashValue = 0;
  do{
    uniqueString += otherData + email;
    hashValue = getStringHashCode(uniqueString);

  }while(findRowIndexAndRangeInSheet("money info", hashValue, varSymbolIndex) != null)


  return hashValue;
}

function getTicketPriceInfo(formData, priceConfig){

  var accommodation = formData['accommodation'].value
  var support = formData['support'].value

  if(accommodation == 'Postel s příslušenstvím')       { return {'price' : priceConfig.With + support }; }
  else if(accommodation == 'Postel bez příslušenství') { return {'price' : priceConfig.Without + support }; }
  else if(accommodation == 'Spacák')                   { return {'price' : priceConfig.SleepingBag + support }; }
  else { logError('Invalid accommodation value: ' + accommodation); }
}

function startTrackingPayment(summaryVars, name, email, registrationValid) {
  var moneyInfoSheetName = 'money info';

  var userDataHeader = ['timestamp','name', 'id', 'manual override', 'email', 'price CZK', 'paid CZK', 'paid everything', 'registration valid (not too old, ...)', 'other notes'];
  createSheetIfDoesntExist(moneyInfoSheetName, userDataHeader);

  var moneyInfo = {
    'name' : name,
    'id' : summaryVars.varSymbol,
    'manualOverrideReq' : false,
    'email' : email,
    'finalPriceCZK' : summaryVars.priceCZK,
    'paidCZK' : 0,
    'paidEverything' : false,
    'registrationValid' : registrationValid
  };
  sheetLog(moneyInfoSheetName, objectValuesToArray(moneyInfo));
}

function sendEmailConfirmation(summaryVars, userEmailAddress, emailType) {

  Logger.log(summaryVars);
  Logger.log(userEmailAddress);
  Logger.log(emailType);

//  var template = getConfirmationEmailTemplate()[emailType];
//  var templatedData = fillInTemplate(template.text, summaryVars);
//
//  var subject = template.subject;
//
//  sendEmail(userEmailAddress, subject, templatedData, undefined, true);
}
