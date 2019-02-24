function bankLog(message){
  sheetLog('bankLog', message);
}

function getNewDataFromBank(token){
  var url = "https://www.fio.cz/ib_api/rest/last/" + token + "/transactions.json";
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
  var url = "https://www.fio.cz/ib_api/rest/periods/" + token + "/2019-01-01/2019-01-31/transactions.json";
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

  // log payment in bank log
  var variablesObject = {
    'varSymbol' : transactionObj.variableSymbol,
    'alreadyPaidOld' : alreadyPaid,
    'alreadyPaidNew' : alreadyPaidNew,
    'currency' : transactionObj.currency,
    'finalPrice' : finalPrice,
    'leftToBePaid' : finalPrice - alreadyPaidNew,
  };

  bankLog("New payment: " + JSON.stringify(variablesObject));

  // insufficient payment case
  if (alreadyPaidNew < finalPrice) {
    logNeedsAttention('Nekdo zaplatil min nez je potreba', userEmail, transactionObj.variableSymbol);
    return;
  }

  // now we alredy know that everyting was paid (possibly more)
  sheet.getRange(rowIndexInRange + 1, paidEverythingIndex + 1).setValue(true);

  // paid more then expected case
  if (alreadyPaidNew > finalPrice) {
    logNeedsAttention('Nekdo zaplatil vic nez je potreba', userEmail, transactionObj.variableSymbol);
    // no return. We want to continue to send confirmation email
  }

  // send email

  var emailObj = emailPaymentArrived();

  var plainText = fillInTemplate(emailObj.textPlain, variablesObject);
  var htmlText  = fillInTemplate(emailObj.textHtml,  variablesObject);

  sendEmail(userEmail, emailObj.subject, plainText, htmlText, undefined, true);
}

function onGetBankingDataTick(){
  var tokens = getBankSecret();
  for(var i = 0; i < tokens.length; ++i){

    var data = getNewDataFromBank(tokens[i]);
    var transactionsRaw = data.accountStatement.transactionList.transaction;
    bankLog("All downloaded payments: " + JSON.stringify(transactionsRaw));
    var transactionsDictionary = extactTransactions(transactionsRaw);

    writeDownTransactionsToBankInfo(transactionsDictionary);

  }
}

//NASTAVENÍ ODESLÁNÍ VÝZVY K ZAPLACENÍ

function onCheckNotRecievedPayments(){
  var timestampIndex = 0;
  // name 1
  // variable id 2
  var manualOverrideIndex = 3;
  var userEmailIndex = 4;
  // price 5
  // amounth paid 6
  var paidEverythingIndex = 7;
  // registration valid 8
  var paymentReminderSentDateIndex = 9;
  // notes 10

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('money info');

  if (sheet == null) { return null; }
  var bankSheetRange = sheet.getDataRange();
  if(bankSheetRange == null) { return; } //No info to be processed

  var bankSheetData = bankSheetRange.getValues();
  //First row is header;
  for(var i = 1; i < bankSheetData.length; ++i){

    var bankData = bankSheetData[i];

    var manOverride = bankData[manualOverrideIndex];
    if(manOverride) { continue; }

    var reminderAlreadySent = bankData[paymentReminderSentDateIndex];
    if(reminderAlreadySent != '') { continue; }

    var paidEverything = bankData[paidEverythingIndex];
    if(paidEverything) { continue; }

    var timestamp = new Date(bankData[timestampIndex]);
    var today = new Date();
    var timeDiff = Math.abs(today.getTime() - timestamp.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if(diffDays < 7) { continue; }

    timestamp.setDate(timestamp.getDate() + 11);
    var deadline = Utilities.formatDate(timestamp, 'Europe/Prague', 'dd.MM.yyyy');
  
    // save 'today' date as timstamp of when payment reminder email was sent
    var cellObject = sheet.getRange(i+1, paymentReminderSentDateIndex + 1);
    var originalValue = cellObject.getValue();
    if (originalValue !== '') {
      logError(['Cell for date was not empty:', originalValue, i, today]);
      runtimeLog(originalValue);
    }
    cellObject.setValue(today);

    // send email
    var userEmail = bankData[userEmailIndex];
    var summaryVars = { 'deadline' : deadline };
    var emailObj = emailPaymentReminder();

    var plainBody = fillInTemplate(emailObj.textPlain, summaryVars);
    var htmlBody  = fillInTemplate(emailObj.textHtml,  summaryVars);

    sendEmail(userEmail, emailObj.subject, plainBody, htmlBody, undefined);
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
