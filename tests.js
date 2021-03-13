function testEmail() {
  var subs = [{
    "var": "salutation",
    "value": "Mikael!!!"
}];
sendEmailMailerSend("bujnmi@gmail.com", subs, "pxkjn4172q4z7815")
}

function testSendAllEmails() {
  var values = SpreadsheetApp.getActiveSheet().getDataRange().getDisplayValues();

  for(n=1;n<values.length;++n){
    
    var email = values[n][0];
    if(email == ""){
          continue;
        }
    
    var salutation = values[n][1];
    var subs = [{
      "var": "salutation",
      "value": salutation
  }];
  var id = values[8][3];
  sendEmailMailerSend(email, subs, id);
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
      "210101650":[{"transferId":1234567890,"date":"2019-02-02+0200","amount":11450,"currency":"CZK","accountNumber":"3400304745","variableSymbol":"210101650"}]
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
}