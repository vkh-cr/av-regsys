function onOpenAddUI() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Manage payments')
      .addItem('User paid', 'userPaidFunctionUI')
      .addToUi();
}

function userPaidFunctionUI(){
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.prompt(
      'Enter information about payment',
      'Please user id, amount paid, and currency (CZK or EUR); all separated with ";".\n E.g.: "9510234298;CZK;2000"',
      ui.ButtonSet.OK);

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();

  if (button == ui.Button.CLOSE || text == null || text == '') {
    return;
  }

  var matches = text.match(/^([0-9]+);((CZK)|(EUR));([0-9]+)$/);
  if(matches == null || matches.length != 6){
    ui.alert("Incorrect format :(. #matches");
    return;
  }

  var varSymbol = matches[1];
  var transactionObj = {
    'currency' : matches[2],
    'amount' : matches[5],
    'variableSymbol' : varSymbol,
  };

  runtimeLog(varSymbol);
  runtimeLog(transactionObj);
  updateBankInfoWithTransactionObj(varSymbol, transactionObj);
}

function updateBankInfoWithTransactionObj(varSymbol, transactionObj){
  var sheetName = 'money info';

  var varSymbolIndex = 2;
  var searchValue = varSymbol;

  var rowInfo = findRowIndexAndRangeInSheet(sheetName, searchValue, varSymbolIndex); runtimeLog(rowInfo);
  if(rowInfo == null) {return;}

  writeDownInfoAboutDirectPayment(rowInfo, transactionObj);
  writeDownTransactionToBankInfo(transactionObj, rowInfo.range, rowInfo.indexInRange);
}

function writeDownInfoAboutDirectPayment(rowInfo, transactionObj){

  var otherNotesIndex = 15;
  var indexInRange = rowInfo.indexInRange;
  var currRange = rowInfo.range;

  var currUserEmail = Session.getActiveUser().getEmail();
  var newEntry = currUserEmail + ": " + transactionObj.amount + ' ' + transactionObj.currency;

  var cellValue = currRange.getValues()[indexInRange][otherNotesIndex];
  if(cellValue != null || cellValue != undefined) { cellValue += '\n'; }
  else {cellValue = '';}

  cellValue += newEntry;
  currRange.getSheet().getRange(indexInRange + 1, otherNotesIndex + 1).setValue(cellValue);

}

