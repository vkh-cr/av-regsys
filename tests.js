function testSendAllEmails() {
  var values = SpreadsheetApp.getActiveSheet().getDataRange().getDisplayValues();

  var spreadsheet = SpreadsheetApp.openById(MAIN_SPREADSHEET);
  var answersSheet = spreadsheet.getSheetByName(ANSWERS_SHEET);

  for(n=1;n<values.length;++n){
    
    var email = values[n][0];
    if(email == ""){
          continue;
        }
    var summaryVars = getSummaryVars(email, answersSheet);
    sendEmailConfirmation(summaryVars);

    var id = values[8][3];
    sendEmail(summaryVars, id);
}
}

function testLoadingFromTableByEmail()
{
  var spreadsheet = SpreadsheetApp.openById(MAIN_SPREADSHEET);
  var answersSheet = spreadsheet.getSheetByName(ANSWERS_SHEET);
  var summaryVars = getSummaryVars("bujnmi@gmail.com", answersSheet);
  sendEmailConfirmation(summaryVars);
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
      "1441690989":[{"transferId":11331926089,"date":"2016-09-08+0200","amount":40,"currency":"CZK","accountNumber":"2300203634","variableSymbol":"1441690989"}],
      "210101650":[{"transferId":1234567890,"date":"2019-02-02+0200","amount":11450,"currency":"CZK","accountNumber":"3400304745","variableSymbol":"210101650"}]
  };

  writeDownTransactionsToBankInfo(transactionDictionary);
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
  [K_ACCOMODATION] : AccomondationType[PROGRAM_ONLY_TYPE],
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
  [K_DEADLINE] : getDeadlineFromCurrentDate(),
  [K_SUPPORTMSG] : "supportMsg"
};