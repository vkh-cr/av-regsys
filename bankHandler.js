function bankLog(message){
  sheetLog(BANK_LOG_SHEET, message);
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

  return processDataFromBank(data)
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

function writeDownTransactionsToBankInfo(transactionDictionary)
{
  var bankSheetRange = getActiveRange(MONEY_INFO_SHEET);
  if(bankSheetRange == null) { return; } //No info to be processed

  var bankSheetData = bankSheetRange.getValues();
  //First row is header;
  for(var i = 1; i < bankSheetData.length; ++i){

    var bankData = bankSheetData[i];

    var varSymbol = bankData[IndexMoneyInfo(K_VAR_SYMBOL)];
    if(typeof transactionDictionary[varSymbol] === "undefined"){ continue; }

    var transactionsForVarSymbol = transactionDictionary[varSymbol];
    for(var j = 0; j < transactionsForVarSymbol.length; ++j){

      var currTransaction = transactionsForVarSymbol[j];
      writeDownTransactionToBankInfo(currTransaction, bankSheetRange, i);
    }
  }
}

//KONTROLA PLATBY

function writeDownTransactionToBankInfo(transactionObj, bankSheetRange, rowIndexInRange){

  var config = getTranslationConfig();
  var moneyInfoSheet = bankSheetRange.getSheet();
  var row = bankSheetRange.getValues()[rowIndexInRange];

  var userEmail = row[IndexMoneyInfo(K_EMAIL)];

  if(transactionObj.currency != 'CZK') {
    logNeedsAttention(
      ['Someone paid in non-supported currency.', transactionObj.currency, transactionObj.amount],
      userEmail,
      transactionObj.variableSymbol);
    updateValueOnColumn(true, rowIndexInRange, config[K_MANUAL_OVERRIDE].title, moneyInfoSheet)
    return;
  }

  var alreadyPaid = reliableToInt(row[IndexMoneyInfo(K_PAID)]);
  var finalPrice = reliableToInt(row[IndexMoneyInfo(K_PRICE)]);

  var justPaid = reliableToInt(transactionObj.amount);
  var transactionDate = transactionObj.date;

  var alreadyPaidNew = alreadyPaid + justPaid;
  updateValueOnColumn(alreadyPaidNew, rowIndexInRange, config[K_PAID].title, moneyInfoSheet);

  // log payment in bank log
  var variablesObject = {
    'varSymbol' : transactionObj.variableSymbol,
    'alreadyPaidOld' : alreadyPaid,
    'alreadyPaidNew' : alreadyPaidNew,
    'currency' : transactionObj.currency,
    'finalPrice' : finalPrice,
    'leftToBePaid' : finalPrice - alreadyPaidNew,
    'dateOfTransaction' : transactionDate
  };

  bankLog("New payment: " + JSON.stringify(variablesObject));

  // insufficient payment case
  if (alreadyPaidNew < finalPrice) {
    logNeedsAttention('Nekdo zaplatil min nez je potreba', userEmail, transactionObj.variableSymbol);
    return;
  }

  // now we already know that everyting was paid (possibly more)
  updateValueOnColumn(true, rowIndexInRange, config[K_PAID_EVERYTHING].title, moneyInfoSheet)
  
  // add timestamp, when everything was paid
  if(!row[IndexMoneyInfo(K_PAID_EVERYTHING_TIMESTAMP)])
  {
    updateValueOnColumn(transactionDate, rowIndexInRange, config[K_PAID_EVERYTHING_TIMESTAMP].title, moneyInfoSheet)
  }

  // paid more then expected case
  if (alreadyPaidNew > finalPrice) {
    logNeedsAttention('Nekdo zaplatil vic nez je potreba', userEmail, transactionObj.variableSymbol);
    // no return. We want to continue to send confirmation email
  }

  // send email
  var summaryVarsBasic = getSummaryVars(userEmail, getSheet(ANSWERS_SHEET));
  var summaryVarsMoney = getSummaryVars(userEmail, moneyInfoSheet);
  var summaryVars = Object.assign({}, summaryVarsBasic, summaryVarsMoney);

  var paidEverythingOrder = getStringsFromColumn(IndexMoneyInfo(K_PAID_EVERYTHING), moneyInfoSheet).filter(e=>e).length;
  summaryVars[K_PAID_EVERYTHING_ORDER] = paidEverythingOrder;
  sendEmailPaymentOk(summaryVars);
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
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('money info');

  if (sheet == null) { return null; }
  var bankSheetRange = sheet.getDataRange();
  if(bankSheetRange == null) { return; } //No info to be processed

  var bankSheetData = bankSheetRange.getValues();
  //First row is header;
  for(var i = 1; i < bankSheetData.length; ++i){

    var bankData = bankSheetData[i];

    var manOverride = bankData[IndexMoneyInfo(K_MANUAL_OVERRIDE)];
    if(manOverride) { continue; }

    var paidEverything = bankData[IndexMoneyInfo(K_PAID_EVERYTHING)];
    if(paidEverything) { continue; }

    var regValid = bankData[IndexMoneyInfo(K_REGISTRATION_VALID)];
    if(!regValid) { continue; }

    var timestamp = new Date(bankData[IndexMoneyInfo(K_TIMESTAMP)]);
    var today = new Date();
    var timeDiff = Math.abs(today.getTime() - timestamp.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if(diffDays < REMINDER_DAYS) { continue; }
    if(diffDays > PAYMENT_DEADLINE_DAYS) 
    { 
      updateValueOnColumn(true, i, config[K_EXPIRED_ALERT].title, moneyInfoSheet);
    }

    var reminderAlreadySent = bankData[IndexMoneyInfo(K_REMINDER_SENT)];
    if(reminderAlreadySent != '') { continue; }

    timestamp.setDate(timestamp.getDate() + PAYMENT_DEADLINE_DAYS);
    var deadline = Utilities.formatDate(timestamp, 'Europe/Prague', 'dd.MM.yyyy');

    // send email
    var userEmail = bankData[IndexMoneyInfo(K_EMAIL)];
    var summaryVars = getSummaryVars(userEmail, getSheet(ANSWERS_SHEET));
    summaryVars[K_DEADLINE] = deadline;
    sendEmailPaymentRemidner(summaryVars);

    var config = getBankConfig();
    updateValueOnColumn(true, i, config[K_REMINDER_SENT].title, moneyInfoSheet);
  }
}
