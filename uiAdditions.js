function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Manage payments')
    .addItem('Zadat platbu', 'userPaidFunctionUI')
    .addItem('Poslat upominky k zaplaceni', 'onCheckNotRecievedPayments')
    .addItem('Stahnout a sparovat platby', 'onGetBankingDataTick')
    .addItem('Poslat email zrusena registrace', 'sendRegistrationCancelledEmail')
    .addToUi();
}

function userPaidFunctionUI() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.prompt(
    'Enter information about payment',
    'Please enter var. symbol and amount paid separated by ; (E.g.: "9510234298;2000"',
    ui.ButtonSet.OK);

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();

  if (button == ui.Button.CLOSE || text == null || text == '') {
    return;
  }

  var matches = text.match(/^([0-9]+);([0-9]+)$/);
  if (matches == null || matches.length != 3) {
    ui.alert("Incorrect format :(. #matches");
    return;
  }

  var varSymbol = matches[1];
  var transactionObj = {
    // we want CZK here so downstream is not marking this payment as 'needs attention'
    // because of payment not in czk
    'currency': 'CZK',
    'amount': matches[2],
    'variableSymbol': varSymbol,
  };

  runtimeLog(varSymbol);
  runtimeLog(transactionObj);
  updateBankInfoWithTransactionObj(varSymbol, transactionObj);
}

function updateBankInfoWithTransactionObj(varSymbol, transactionObj) {
  var sheetName = 'money info';

  var varSymbolIndex = 2;
  var searchValue = varSymbol;

  var rowInfo = findRowIndexAndRangeInSheet(sheetName, searchValue, varSymbolIndex); runtimeLog(rowInfo);
  if (rowInfo == null) { return; }

  writeDownInfoAboutDirectPayment(rowInfo, transactionObj);
  writeDownTransactionToBankInfo(transactionObj, rowInfo.range, rowInfo.indexInRange);
}

function writeDownInfoAboutDirectPayment(rowInfo, transactionObj) {

  var otherNotesIndex = 11;
  var indexInRange = rowInfo.indexInRange;
  var currRange = rowInfo.range;

  var currUserEmail = Session.getActiveUser().getEmail();
  var newEntry = currUserEmail + ": " + transactionObj.amount + ' ' + transactionObj.currency;

  var cellValue = currRange.getValues()[indexInRange][otherNotesIndex];
  if (cellValue != null || cellValue != undefined) { cellValue += '\n'; }
  else { cellValue = ''; }

  cellValue += newEntry;
  currRange.getSheet().getRange(indexInRange + 1, otherNotesIndex + 1).setValue(cellValue);

}

function sendRegistrationCancelledEmail() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.prompt(
    'Email address please', '',
    ui.ButtonSet.OK);

  var button = result.getSelectedButton();
  var emailAddress = result.getResponseText();

  if (button == ui.Button.CLOSE || emailAddress == null || emailAddress == '') {
    return;
  }

  var emailObj = emailRegistrationCancelled();
  sendEmail(
    emailAddress,
    emailObj.subject,
    emailObj.textPlain,
    emailObj.textHtml, undefined, true);
}


function getOptionString(type, remainings) {
  const splitter = ", ";
  const czk = " Kč (zbývájící kapacita: ";
  const end = ")"
  return AccomondationType[type] + splitter + AccomondationPrice[type] + czk + remainings + end;
}

function updateSignInForm() {
  var form = FormApp.getActiveForm();
  var allItems = form.getItems();

  for (var i = 0; i < allItems.length; i += 1) {
    var thisItem = allItems[i];
    if (thisItem.getTitle() == "Varianta ubytování" && thisItem.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
      var multipleChoice = thisItem.asMultipleChoiceItem();

      var choices = [];
      var counts = getCurrentAccomodationTypeCounts();

      Object.keys(counts).forEach((key) => {
          if (counts[key] < AccomondationLimits[key]) {
            var remainings = AccomondationLimits[key] - counts[key];
            if (key == PROGRAM_TYPE) {
              choices.push(getOptionString(PROGRAM_FOOD_ONLY_TYPE, remainings));
              choices.push(getOptionString(PROGRAM_ONLY_TYPE, remainings));
              return;
            }
            choices.push(getOptionString(key, remainings));
          }
        });

      if (choices.length == 0) {
        form.deleteItem(thisItem);
        return;
      }
      multipleChoice.setHelpText("");
      multipleChoice.setChoiceValues(choices);
    }
  }
}
