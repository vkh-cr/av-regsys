function testLoadingFromTableByEmail()
{
  var answersSheet = getSheet(ANSWERS_SHEET);
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
      "210200003":[{"transferId":11331926089,"date":"2016-09-08+0200","amount":40,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210200003"}],
      "210181520":[{"transferId":1234567890,"date":"2019-02-02+0200","amount":11450,"currency":"CZK","accountNumber":"3400304745","variableSymbol":"210181520"}]
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
}

function invalidVS(){
  var transactionDictionary = {
      "210831520":[{"transferId":11331926089,"date":"2021-04-09+0200","amount":1520,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210831520"}]
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
      "Adresa trvalého bydliště": ["dsfa"], 
      "Poznámka": [""], 
      "Máš nějaké zdravotní omezení či dietu?": [""], 
      "Pojedu na víkendovku pro dobrovolníky": [""], 
      "Telefon": [""], 
      "Preferovaná oblast tvé pomoci": ["Je mi to jedno, rád/a pomůžu, kde bude potřeba"], 
      "Email": ["bujnmi@gmail.com"], 
      "Příjmení": ["fdas"], 
      "Chceme bydlet spolu": ["bujnmi@gmail.com"], 
      "Jméno": ["Ondřej"], 
      "Rok narození": ["1995"], 
      "Kraj": ["Zlínský kraj"], 
      "Město, kde trávíš čas": ["dfas"], 
      "Časová značka": ["20.3.2021 13:30:21"], 
      "Informace po AV": ["Ne"], 
      "Pohlaví": ["Žena"]
    },
  "range": { "columnEnd": 18, "columnStart": 1, "rowEnd": 14, "rowStart": 14 }, 
  "source": {}, 
  "triggerUid": "6513079", 
  "values": ["20.3.2021 13:30:21", "dfdf", "fdas", "Žena", "bujnmi@gmail.com", "1995", "dsfa", "Zlínský kraj", "dfas", "bujnmi@gmail.com", "", "", "", "", "Je mi to jedno, rád/a pomůžu, kde bude potřeba"] };
  
  onFormSubmit(testData);
}

function testOnFormSubmit()
{
  var testData = 
  { "authMode": "FULL", 
  "namedValues": 
    { 
      "Adresa trvalého bydliště": ["dsfa"], 
      "Poznámka": [""], 
      "Varianta ubytování": ["Spacák, 1520 Kč (zbývájící kapacita: 76)"], 
      "Máš nějaké zdravotní omezení či dietu?": [""], 
      "Pojedu na víkendovku pro dobrovolníky": [""], 
      "Telefon": [""], 
      "Preferovaná oblast tvé pomoci": ["Je mi to jedno, rád/a pomůžu, kde bude potřeba"], 
      "Email": ["bujnmi@gmail.com"], 
      "Příjmení": ["fdas"], 
      "Chceme bydlet spolu": ["bujnmi@gmail.com"], 
      "Jméno": ["Ondřej"], 
      "Rok narození": ["1995"], 
      "Kraj": ["Zlínský kraj"], 
      "Město, kde trávíš čas": ["dfas"], 
      "Časová značka": ["20.3.2021 13:30:21"], 
      "Informace po AV": ["Ne"], 
      "Pohlaví": ["Žena"], 
      "Dobrovolný příspěvek": [""],
      "Potvrzení o daru": ["Ano"] },
  "range": { "columnEnd": 18, "columnStart": 1, "rowEnd": 14, "rowStart": 14 }, 
  "source": {}, 
  "triggerUid": "6513079", 
  "values": ["20.3.2021 13:30:21", "dfdf", "fdas", "Žena", "bujnmi@gmail.com", "1995", "dsfa", "Zlínský kraj", "dfas", "Spacák, 1520 Kč (zbývájící kapacita: 76)", "bujnmi@gmail.com", "", "", "", "", "Je mi to jedno, rád/a pomůžu, kde bude potřeba", "", "Ne"] };
  
  onFormSubmit(testData);
}

const testSummaryVars = {
  [K_TIMESTAMP] : new Date(),
  [K_SUB_ORDER] : 275,
  [K_NAME] : "Václav",
  [K_SURNAME] : "Čáp",
  [K_SEX] : "Muž",
  [K_EMAIL] : "bujnmi@gmail.com",
  [K_BIRTH_YEAR] : "1992",
  [K_ADDRESS] : "Švábenice 81",
  [K_REGION] : "Jihomoravský kraj",
  [K_CITY] : "Vyškov",
  [K_ACCOMODATION_TYPE] : PROGRAM_FOOD_ONLY_TYPE,
  [K_ROOMMATE] : "",
  [K_SUPPORT] : 0,
  [K_SUPPORT_CONFIRM] : "",
  [K_PHONE] : "+420720373969",
  [K_HEALTH_CONDITION] : "",
  [K_NOTE] : "",
  [K_VOLUNTEER_PREFERENCE] : "",
  [K_AFTER_AV_INFO] : "Ne",
  [K_PRICE] : 1360,
  [K_VAR_SYMBOL] : 212751360,
  [K_DEADLINE] : getDeadlineFromCurrentDate()
};