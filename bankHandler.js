function bankLog(message){
  sheetLog('bankLog', message);
}

function getNewDataFromBank(token){
  var url = "https://www.fio.cz/ib_api/rest/last/" + token + "/transactions.json";
 // var url = "https://www.fio.cz/ib_api/rest/periods/" + token + "/2018-03-23/2018-03-25/transactions.json"
  var data = UrlFetchApp.fetch(url);

  var decodedData = processDataFromBank(data);
  if(decodedData !== null) {
    var dataInfo = decodedData.accountStatement.info;
    runtimeLog("Data ids from:" + dataInfo.idFrom + "to:" + dataInfo.idTo); 
    bankLog(["Data ids from to", dataInfo.idFrom , dataInfo.idTo]);
  }

  return decodedData;
}

function getTestingDataFromBank(){
  var token = getBankSecret();
  var url = "https://www.fio.cz/ib_api/rest/periods/" + token + "/2016-07-25/2016-09-10/transactions.json";
  var data = UrlFetchApp.fetch(url);

  return processDataFromBank(data);
}

function processDataFromBank(data){

  var responseCode = data.getResponseCode();
  var contentText = data.getContentText();
  if(responseCode != 200){
    logError(['Could not connect to bank API:', responseCode, contentText]);
    return null;
  }

  var responseObject = JSON.parse(contentText);
  return responseObject;
}

function extactTransactions(transactionsRaw){

  var transactionDictionary = {};
  runtimeLog('transactions' + transactionsRaw.length);
  for(var i = 0; i < transactionsRaw.length; ++i){

    var currTransaction = transactionsRaw[i];
    var processedTransaction = extractTransaction(currTransaction);
    if (processedTransaction == null) { continue; }

    //filter the ones that we don't wont (don't have variable symbol, transfer id, or date')
    if (!(processedTransaction.hasOwnProperty('accountNumber') && processedTransaction.hasOwnProperty('variableSymbol'))){ continue; }

    var variableSymbol = processedTransaction.variableSymbol;
    if(!transactionDictionary.hasOwnProperty(variableSymbol)){
      transactionDictionary[variableSymbol] = [];
    }

    transactionDictionary[variableSymbol].push(processedTransaction);
  }

  return transactionDictionary;
}

function extractTransaction(transaction){

  var bankConfig = getBankConfig();

  var transactionObject = {};
  var transactionParametersArray = objectValuesToArray(transaction);

  for(var i = 0; i < transactionParametersArray.length; ++i){

    var currParameter = transactionParametersArray[i];
    if(currParameter == null) {continue;}

    var currParameterName = currParameter.name;
    var currParameterValue = currParameter.value;

    if(bankConfig.hasOwnProperty(currParameterName)){
      var properPropertyName = bankConfig[currParameterName];
      transactionObject[properPropertyName] = currParameterValue;
    }

  }

  return transactionObject;
}

function writeDownTransactionsToBankInfo(transactionDictionary){
  var varSymbolIndex = 2;
  var manualOverrideIndex = 3;

  var bankSheetRange = getActiveRange('money info');
  if(bankSheetRange == null) { return; } //No info to be processed

  var bankSheetData = bankSheetRange.getValues();
  //First row is header;
  for(var i = 1; i < bankSheetData.length; ++i){

    var bankData = bankSheetData[i];

    var manOverride = bankData[manualOverrideIndex];
    if(manOverride) { continue; }

    var varSymbol = bankData[varSymbolIndex];
    if(!transactionDictionary.hasOwnProperty(varSymbol)){ continue; }

    var transactionsForVarSymbol = transactionDictionary[varSymbol];
    for(var j = 0; j < transactionsForVarSymbol.length; ++j){

      var currTransaction = transactionsForVarSymbol[j];
      writeDownTransactionToBankInfo(currTransaction, bankSheetRange, i);

    }
  }
}

//KONTROLA PLATBY

function writeDownTransactionToBankInfo(transactionObj, bankSheetRange, rowIndexInRange){

  var manualOverrideIndex = 3;
  var userEmailIndex = 4;
  var finalPriceIndex = 5;
  var alreadyPaidIndex = 6;
  var paidEverythingIndex = 7;

  var sheet = bankSheetRange.getSheet();
  var values = bankSheetRange.getValues()[rowIndexInRange];

  var userEmail = values[userEmailIndex];

  if(transactionObj.currency != 'CZK') {
    logNeedsAttention(
      ['Someone paid in non-supportd currency.', transactionObj.currency, transactionObj.amount],
      userEmail,
      transactionObj.variableSymbol);
    sheet.getRange(rowIndexInRange + 1, manualOverrideIndex + 1).setValue(true);
    return;
  }

  var alreadyPaid = reliableToInt(values[alreadyPaidIndex]);
  var finalPrice = reliableToInt(values[finalPriceIndex]);

  var justPaid = reliableToInt(transactionObj.amount);

  var alreadyPaidNew = alreadyPaid + justPaid;
  sheet.getRange(rowIndexInRange + 1, alreadyPaidIndex + 1).setValue(alreadyPaidNew);

  var paidEverything = (alreadyPaidNew >= finalPrice);

  if(alreadyPaidNew > finalPrice) {
    logNeedsAttention('Someone paid more then expected', userEmail, transactionObj.variableSymbol);
  }

  var paidEverythingBefore = values[paidEverythingIndex];

  var variablesObject = {
    'varSymbol' : transactionObj.variableSymbol,
    'alreadyPaidOld' : alreadyPaid,
    'alreadyPaidNew' : alreadyPaidNew,
    'currency' : transactionObj.currency,
    'finalPrice' : finalPrice,
    'leftToBePaid' : finalPrice - alreadyPaidNew,
  };

  if(paidEverything){
    sheet.getRange(rowIndexInRange + 1, paidEverythingIndex + 1).setValue(true);
  }

  var emailTemplate = getPaidEverythingtEmail();
  bankLog("New payment: " + JSON.stringify(variablesObject));
  var templatedData = fillInTemplate(emailTemplate.text, variablesObject);
  var subject = emailTemplate.subject;
  sendEmail(userEmail, subject, templatedData, undefined);
}

function onGetBankingDataTick(){
  var tokens = getBankSecret();
  for(var i = 0; i < tokens.length; ++i){

    var data = getNewDataFromBank(tokens[i]);
    var transactionsRaw = data.accountStatement.transactionList.transaction;
    var transactionsDictionary = extactTransactions(transactionsRaw);

    writeDownTransactionsToBankInfo(transactionsDictionary);

  }
}

//NASTAVENÍ ODESLÁNÍ VÝZVY K ZAPLACENÍ

function onCheckNotRecievedPayments(){
  var timestampIndex = 0;
  var manualOverrideIndex = 3;
  var userLanguageIndex = 5;
  var userEmailIndex = 4;
  var paidEverythingIndex = 8;

  var bankSheetRange = getActiveRange('money info');
  if(bankSheetRange == null) { return; } //No info to be processed

  var bankSheetData = bankSheetRange.getValues();
  //First row is header;
  for(var i = 1; i < bankSheetData.length; ++i){

    var bankData = bankSheetData[i];

    var manOverride = bankData[manualOverrideIndex];
    if(manOverride) { continue; }

    var userLanguage = bankData[userLanguageIndex];
    var userEmail = bankData[userEmailIndex];
    var paidEverything = bankData[paidEverythingIndex];

    var timestamp = new Date(bankData[timestampIndex]);
    var today = new Date();

    var timeDiff = Math.abs(today.getTime() - timestamp.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

   /* if(diffDays == 5 && !paidEverything) {
      var variablesObject = {};
      var emailTemplate = notRecievedPayment(userLanguage);
      var templatedData = fillInTemplate(emailTemplate.text, variablesObject);
      var subject = emailTemplate.subject;
      sendEmail(userEmail, subject, templatedData, undefined);
    }

    if(diffDays == 30 && !paidEverything) {
      var variablesObject = {};
      var emailTemplate = notRecievedPayment(userLanguage);
      var templatedData = fillInTemplate(emailTemplate.text, variablesObject);
      var subject = emailTemplate.subject;
      sendEmail(userEmail, subject, templatedData, undefined);
    }
    */
    if(!paidEverything) {
      var variablesObject = {};
      var emailTemplate = notRecievedPayment(userLanguage);
      var templatedData = fillInTemplate(emailTemplate.text, variablesObject);
      var subject = emailTemplate.subject;
      sendEmail(userEmail, subject, templatedData, undefined);
    }
  }
}


function testBankAccess(){

    var data = getTestingDataFromBank();
    var transactionsRaw = data.accountStatement.transactionList.transaction;
    var transactionsDictionary = extactTransactions(transactionsRaw);
    bankLog(transactionsDictionary);
}

function testBankWriteDown(){
    var transactionDictionary = {
        "1441690989":[{"transferId":11331926089,"date":"2016-09-08+0200","amount":40,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"1441690989"}],
        "190021450":[{"transferId":1234567890,"date":"2019-02-02+0200","amount":11450,"currency":"CZK","accountNumber":"3400304745","variableSymbol":"190021450"}]
    };

    writeDownTransactionsToBankInfo(transactionDictionary);
}
