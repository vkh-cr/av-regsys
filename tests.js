function testLoadingFromTableByEmail()
{
  var answersSheet = getSheet(ANSWERS_SHEET);
  var summaryVars = getSummaryVars("bujnmi@gmail.com", answersSheet);
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

// important VS on beginning, date, amount, VS at the end
function mondayBugFixMoneyArrival(){
  var transactionDictionary = {
      "210393000":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":3000,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210393000"}],
      "210161520":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":1520,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210161520"}],
      "210481520":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":1520,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210481520"}],
      "210030004":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":4,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210030004"}],
      "210160005":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":5,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210160005"}],
      "210230500":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":10500,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210230500"}],
      "210282215":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":2215,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210282215"}],
      "210332515":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":2515,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210332515"}],
      //someone sent 3 czk, but cannot be found
      "210070003":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":3,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210070003"}],
      "210421520":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":1520,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210421520"}],
      "210173515":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":3515,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210173515"}],
      "210294495":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":4495,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210294495"}],
      "210272315":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":2315,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210272315"}],
      "210362495":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":2500,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210362495"}],
      "210542500":[{"transferId":11331926089,"date":"2021-03-29+0200","amount":2500,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"210542500"}],
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
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
  [K_NAME] : "Jan",
  [K_SURNAME] : "Maria",
  [K_SEX] : "Muž",
  [K_EMAIL] : "bujnmi@gmail.com",
  [K_BIRTH_YEAR] : "1901",
  [K_ADDRESS] : "17. listopadu 27",
  [K_REGION] : "Moravskoslezský kraj",
  [K_CITY] : "Ostrava",
  [K_ACCOMODATION_TYPE] : PROGRAM_ONLY_TYPE,
  [K_ROOMMATE] : "Jenda Šťastný",
  [K_SUPPORT] : 0,
  [K_PHONE] : "+420 731 805 186",
  [K_HEALTH_CONDITION] : "ne",
  [K_NOTE] : " ",
  [K_VOLUNTEER_PREFERENCE] : "Recepce / informace, Stravování, Technik, Moderování modlitebních skupinek",
  [K_VOLUNTEER_WEEKEND] : "Ano, pojedu v termínu 14. - 16. 5.",
  [K_AFTER_AV_INFO] : "Ano",
  [K_PRICE] : 2000,
  [K_VAR_SYMBOL] : getVariableSymbol(1, 2000),
  [K_DEADLINE] : getDeadlineFromCurrentDate()
};