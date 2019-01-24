
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
  runtimeLog(formData);
  var ticketPriceInfo = getTicketPriceInfo(formData, priceConfig);
  //var fairTradePrice = getFaireTradePrice(formData, priceConfig);

  var userEmailAddress = formData.email.value;
  //var varSymbolId = getVarriableSymbol(formData);
  var timestamp = formData['timestamp'].value;
  var dateTime = timestamp.split(" ");
  var date = dateTime[0].split(".");
  var time = dateTime[1].split(":");
  var varSymbolId = date[0] + date[1] + time[0] + time[1] + time[2];

  if(varSymbolId == null || varSymbolId == '') {
    varSymbolId = getVarriableSymbol(formData);
  }

  Logger.log("Email Jídlo: " + formData['food'].value);

  var registrationType = formData['registrationType'].value || ' ';
  var lengthOfStay = formData['lengthOfStay'].value || ' ';
  var section = formData['section'].value || ' ';
  var food = formData['food'].value || ' ';
  var name = formData['name'].value || ' ';
  var surname = formData['surname'].value || ' ';
  var phone = formData['phone'].value || ' ';
  var sex = formData['sex'].value || ' ';
  var street = formData['street'].value || ' ';
  var city = formData['city'].value || ' ';
  var postalCode = formData['postalCode'].value || ' ';
  var birthDate = formData['birthDate'].value || ' ';
  var parish = formData['parish'].value || ' ';
  var message = formData['message'].value || ' ';

  var summaryVars = {
    'timestamp' : timestamp,
    'registrationType' : registrationType,
    'lengthOfStay' : lengthOfStay,
    'section' : section,
    'food' : food,
    'name' : name + ' ' + surname,
    'email' : userEmailAddress,
    'phone' : phone,
    'sex' : sex,
    'street' : street,
    'city' : city,
    'postalCode' : postalCode,
    'birthDate' : birthDate,
    'parish' : parish,
    'message' : message,
    'priceCZK' : ticketPriceInfo.priceCZK,
    //'priceFairTrade' : fairTradePrice.priceFairTrade,
    'varSymbol' : varSymbolId
  };

  storeNewRelevantDataToOriginalSheet(formSubmitObj.range, varSymbolId);

  saveBankImportantData(summaryVars, name + ' ' + surname, userEmailAddress, formID, true); //ulozi do money_info
  sendEmailConfirmation(summaryVars, userEmailAddress, formID, 'normal');
}

// GENEROVÁNÍ ID ÚČASTNÍKA
function getVarriableSymbol(formData) {
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

//VÝPOČET CENY
function getTicketPriceInfo(formData, priceConfig){

  var res = formData['accommodation'].value

  if(res == 'Postel s příslušenstvím') { return {'price' : priceConfig.With }; }
  else if(res == 'Postel bez příslušenství') { return {'price' : priceConfig.Without }; }
  else if(res == 'Spacák') { return {'price' : priceConfig.SleepingBag }; }
  else { logError('Something is wrong with accommodation option settings'); }
}

// ULOŽÍ ID ÚČASTNÍKA DO TABULKY
function storeNewRelevantDataToOriginalSheet(currRange, varSymbolId){
  addDataToCurrentRow(currRange, 1, varSymbolId);
}


function saveBankImportantData(summaryVars, name, email, formId, registrationValid) {
  var moneyInfoSheetName = 'money info';

  var userDataHeader = ['timestamp','name', 'id', 'manual override', 'email', 'language', 'price CZK', 'paid CZK', 'paid everything', 'registration valid (not too old, ...)', 'other notes'];
  createSheetIfDoesntExist(moneyInfoSheetName, userDataHeader);

  var moneyInfo = {
    'name' : name,
    'id' : summaryVars.varSymbol,
    'manualOverrideReq' : false,
    'email' : email,
    'language' : formId,
    'finalPriceCZK' : summaryVars.priceCZK,
    'paidCZK' : 0,
    'paidEverything' : false,
    'registrationValid' : registrationValid

  };
  sheetLog(moneyInfoSheetName, objectValuesToArray(moneyInfo));
}


// POTVRZENÍ REGISTRACE
function sendEmailConfirmation(summaryVars, userEmailAddress, formID, emailType) {

  var template = getConfirmationEmailTemplate(formID)[emailType];
  var templatedData = fillInTemplate(template.text, summaryVars);

  var subject = template.subject;

  sendEmail(userEmailAddress, subject, templatedData, undefined, true);
}
