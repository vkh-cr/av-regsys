function testLoadingFromTableByEmail()
{
  var answersSheet = getSheet(DATA_MASTER_SHEET);
  var summaryVars = addSummaryVars("bujnmi@gmail.com", answersSheet);
  Logger.log(summaryVars);
}

function testConfirmationEmail()
{
  sendEmailConfirmation(testSummaryVars);
}

function testBankAccess(){

  var data = getTestingDataFromBank();
  var transactionsRaw = data.accountStatement.transactionList.transaction;
  var transactionsDictionary = extactTransactions(transactionsRaw);
  bankLog(transactionsDictionary);
}

function testBankWriteDown(){
  var transactionDictionary = {
      "230051675":[{"transferId":11331926089,"date":"2016-09-08+0200","amount":2,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"230051675"}],
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
}

function testCancelledRegistration(){
  sendRegistrationCancelledEmail("pavel.vicha@sykora.cz");
}
function testReminder(){
  onCheckNotRecievedPayments();
}

function invalidVS(){
  var transactionDictionary = {
      "213390700":[{"transferId":11331926089,"date":"2021-08-11+0200","amount":1300,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"213390700"}]
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
}

function invalidVS2(){
  //211881120
  var transactionDictionary = {
      "211881720":[{"transferId":11331926089,"date":"2021-05-26+0200","amount":1720,"currency":"CZK","accountNumber":"2166890217","variableSymbol":"19-211881720"}]
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
}

function invalidVS3(){
  //211881120
  var transactionDictionary = {
      "211791720":[{"transferId":11331926089,"date":"2021-06-04+0200","amount":1720,"currency":"CZK","accountNumber":"2166890217","variableSymbol":"211791720"}]
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
}


function fixSubstituteBug(){
  var transactionDictionary = {
      "211472000":[{"transferId":11331926089,"date":"2021-05-21+0200","amount":2000,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"211472000"}],
      "211812215":[{"transferId":11331926089,"date":"2021-05-22+0200","amount":2215,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"211812215"}],
      "211901720":[{"transferId":11331926089,"date":"2021-05-23+0200","amount":1720,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"211901720"}]
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
}

function testOnFormSubmitSub()
{
  var testData = 
  { "authMode": "FULL", 
  "namedValues": 
    { 
      "Časová značka": ["20.3.2021 13:30:21"],
      "Jméno": ["Ondřej"],
      "Příjmení": ["Příjmenný"],
      "Pohlaví": ["Žena"],
      "Email": ["bujnmi@gmail.com"],
      "Rok narození": ["1995"],
      "Adresa trvalého bydliště": ["Ulice 89"],
      "Kraj": ["Zlínský kraj"],
      "Město, kde trávíš čas": ["Opava ř#@"],
      "Chceme bydlet spolu": ["vichapavel@gmail.com"],
      "Oblast dobrovolnické pomoci": ["Je mi to jedno, rád/a pomůžu, kde bude potřeba"],
      "Diskuzní skupinky": ["Ano"],
      "Telefon": ["+420731805186"],
      "Telefon v případě ohrožení": ["+420123456789"],
      "Zdravotní omezení a diety": ["string_string+:)"],
      "Tištěná brožura": ["Ne"],
      "Triko": ["XL"],
      "Poznámka": ["Text poznámky;)"],
      "Informace po AV": ["Ne"],
    },
  "range": { "columnEnd": 18, "columnStart": 1, "rowEnd": 14, "rowStart": 14 }, 
  "source": {}, 
  "triggerUid": "6513079", 
  "values": ["7.2.2023 20:30:21", "Ondřej", "Příjmenný", "Žena", "bujnmi@gmail.com", "1995", "Ulice 89", "Zlínský kraj", "Opava ř#@", "vichapavel@gmail.com", "Je mi to jedno, rád/a pomůžu, kde bude potřeba", "Ano", "+420731805186", "+420123456789", "string_string+:)", "Ne", "XL", "Text poznámky;)", "Ne"] };
  
  onFormSubmit(testData);
}

function testOnFormSubmit()
{
  var testData = 
  { "authMode": "FULL", 
  "namedValues": 
    { 
      "Časová značka": ["20.3.2021 13:30:21"],
      "Jméno": ["Ondřej"],
      "Příjmení": ["Příjmenný"],
      "Pohlaví": ["Žena"],
      "Email": ["bujnmi@gmail.com"],
      "Rok narození": ["1995"],
      "Adresa trvalého bydliště": ["Ulice 89"],
      "Kraj": ["Zlínský kraj"],
      "Město, kde trávíš čas": ["Opava ř#@"],
      "Varianta ubytování": ["Jen program"],
      "Chceme bydlet spolu": ["vichapavel@gmail.com"],
      "Oblast dobrovolnické pomoci": ["Je mi to jedno, rád/a pomůžu, kde bude potřeba"],
      "Diskuzní skupinky": ["Ano"],
      "Telefon": ["+420731805186"],
      "Telefon v případě ohrožení": ["+420123456789"],
      "Zdravotní omezení a diety": ["string_string+:)"],
      "Tištěná brožura": ["Ne"],
      "Triko": ["XL"],
      "Dobrovolný příspěvek": [""],
      "Potvrzení o daru": ["Ano"],
      "Poznámka": ["Text poznámky;)"],
      "Informace po AV": ["Ne"],
    },
  "range": { "columnEnd": 18, "columnStart": 6, "rowEnd": 2, "rowStart": 2 }, 
  "source": {}, 
  "triggerUid": "6513079", 
  "values": ["7.2.2023 20:30:21", "Ondřej", "Příjmenný", "Žena", "bujnmi@gmail.com", "1995", "Ulice 89", "Zlínský kraj", "Opava ř#@", "vichapavel@gmail.com", "Je mi to jedno, rád/a pomůžu, kde bude potřeba", "Ano", "+420731805186", "+420123456789", "string_string+:)", "Ne", "XL", "350", "Ano", "Text poznámky;)", "Ne"] };
  
  onFormSubmit(testData);
}