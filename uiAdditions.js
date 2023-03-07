function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Spravovat platby')
    .addItem('Zadat platbu', 'userPaidFunctionUI')
    .addItem('Poslat upomínky k zaplacení', 'onCheckNotRecievedPayments')
    .addItem('Stáhnout a spárovat platby', 'onGetBankingDataTick')
    .addItem('Stornovat registraci', 'sendRegistrationCancelledEmail')
    .addToUi();
}

function userPaidFunctionUI() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
    'Zadej variabilní symbol a částku oddělenou znakem ";" (např.: "9510234298;2000")',
    '',
    ui.ButtonSet.OK);

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();

  if (button == ui.Button.CLOSE || text == null || text == '') {
    return;
  }

  var matches = text.match(/^([0-9]+);([0-9]+)$/);
  if (matches == null || matches.length != 3) {
    ui.alert("Nesprávný formát :(. #matches");
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

  var rowInfo = findRowIndexAndRangeInSheet(MONEY_INFO_SHEET, varSymbol, IndexMoneyInfo(K_VAR_SYMBOL)); 
  runtimeLog(rowInfo);
  if (rowInfo == null) { return; }

  writeDownInfoAboutDirectPayment(rowInfo, transactionObj);
  writeDownTransactionToBankInfo(transactionObj, rowInfo.range, rowInfo.indexInRange);
}

function writeDownInfoAboutDirectPayment(rowInfo, transactionObj) {

  var indexInRange = rowInfo.indexInRange;
  var currRange = rowInfo.range;

  var currUserEmail = Session.getActiveUser().getEmail();
  var newEntry = currUserEmail + ": " + transactionObj.amount + ' ' + transactionObj.currency;

  var cellValue = currRange.getValues()[indexInRange][IndexMoneyInfo(K_DETAILS)];
  if (cellValue != null || cellValue != undefined || !cellValue.isEmpty()) { cellValue += '\n'; }
  else { cellValue = ''; }

  cellValue += newEntry;
  currRange.getSheet().getRange(indexInRange + 1, IndexMoneyInfo(K_DETAILS) + 1).setValue(cellValue);
}

function sendRegistrationCancelledEmail(emailAddress) {

  if(emailAddress==null)
  {
    var ui = SpreadsheetApp.getUi();
    var result = ui.prompt(
      'Zadej e-mailovou adresu účastníka pro zaslání storno e-mailu:', '',
      ui.ButtonSet.OK);
  
    var button = result.getSelectedButton();
    emailAddress = result.getResponseText();
    if (button == ui.Button.CLOSE || emailAddress == null || emailAddress == '') {
      return;
    }
  }

  var row = findRowIndexAndRangeInSheet(MONEY_INFO_SHEET, emailAddress, IndexMoneyInfo(K_EMAIL)); 
  if (row == null) { return; }

  updateValueOnColumn(false, row.indexInRange, getTranslationConfig()[K_REGISTRATION_VALID].title, getSheet(MONEY_INFO_SHEET));

  var rowMaster = findRowIndexAndRangeInSheet(DATA_MASTER_SHEET, emailAddress, DataMasterHeader.indexOf(K_EMAIL)); 
  if (rowMaster != null) 
  { 
    updateValueOnColumn(STORNO_TYPE, rowMaster.indexInRange, getTranslationConfig()[K_ACCOMODATION_TYPE].title, getSheet(DATA_MASTER_SHEET));
  }

  var summaryVars = addSummaryVars(emailAddress, getSheet(DATA_MASTER_SHEET));
  sendEmailRegistrationCancelled(summaryVars);
}

function getOptionString(type) {
  const splitter = ", ";
  const czk = " Kč";
  return AccommodationType[type] + splitter + AccommodationPrice[type] + czk;
}

function updateSignInForm() {
  var form = FormApp.getActiveForm();
  if(!form)
  {
    form = FormApp.openById(MAIN_FORM);
  }
  var allItems = form.getItems();
  var counts = getCurrentAccommodationTypeCounts();
  var subMode = isFullCapacity(counts);

  var config = getTranslationConfig();

  for (var i = 0; i < allItems.length; i += 1) {
    var thisItem = allItems[i];
    if (thisItem.getTitle() == config[K_SUPPORT_CONFIRM].title)
    {
      if (subMode) {
        form.deleteItem(thisItem);
        continue;
      }
      else{
        //Potvrzení o daru > Ano - Ne
        thisItem.setHelpText("Budeš chtít vystavit potvrzení o daru?");
      }
    }
    if (thisItem.getTitle() == config[K_SUPPORT].title)
    {
      if (subMode) {
        form.deleteItem(thisItem);
        continue;
      }
      else{
        //Dobrovolný příspěvek > Číslo Větší než 0 Zadejte platné číslo
        thisItem.setHelpText("Chceš-li nás podpořit, vlož sem částku v Kč.");
      }
    }
    if (thisItem.getTitle() == config[K_ACCOMODATION_TYPE].title && thisItem.getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
      var multipleChoice = thisItem.asMultipleChoiceItem();

      var choices = [];

      Object.keys(counts).forEach((key) => {
        if (counts[key] < AccommodationLimits[key])
        {
          choices.push(getOptionString(key));
        }
      });

      if (subMode) {
        form.deleteItem(thisItem);
        continue;
      }
      var helpTextAccomodationOpen = "Vyber jednu z dostupných variant ubytování. Údaje pro platbu přijdou hned po odeslání přihlášky na Tvůj e-mail. Více informací o ubytování a stravování najdeš na absolventskyvelehrad.cz.";
      // var helpTextAccomodationClosed = "Naše kapacity ubytování jsou téměř vyčerpány. Přesto je možné si zajistit vlastní ubytování. Doporučujeme místní kemp a společnou domluvu spolubydlení přes http://bit.ly/spolubydleniAV. Více informací o ubytování a stravování najdeš na https://absolventskyvelehrad.cz/vse-o-registraci-na-av-21/.";
      // Varianta ubytování
      multipleChoice.setHelpText(helpTextAccomodationOpen);
      multipleChoice.setChoiceValues(choices);
    }
  }

  var newParSign = "\n\n";
  var par2 = "Chceš jet na AV23? Jsi na správném místě! Stačí vyplnit tuto přihlášku a postupovat podle pokynů, které Ti pošleme na e-mail. Podrobnosti k registraci, ubytování, stravování atd., najdeš na absolventskyvelehrad.cz. Těšíme se na Tebe.";
  //var par3 = "Proměnná kapacita z důvodu protiepidemických opatření:";
  //var par4 = "Máme připravené tři scénáře: 350, 250 a 150 lidí. Registrace je otevřena v plné výši, avšak bude-li v létě podle aktuálních opatření nutné omezit počet účastníků, nezbývá než přejít k nižší variantě. Rozhodujícím kritériem pro účast bude čas podání přihlášky. Pokud se z tohoto důvodu na tebe nedostane, samozřejmostí je vrácení registračního poplatku. Podrobnosti najdeš na https://absolventskyvelehrad.cz/covid-situace/";
  var originalText = par2; //+ newParSign + par3 + newParSign + par4;
  if (!subMode) {
    // normal mode
    form.setTitle("AV23 - Přihláška - Dobrovolníci")
    form.setDescription(originalText);
  }
  else {
    // substitute mode
    form.setTitle("AV23 - Přihláška - REŽIM NÁHRADNÍKŮ")
    var subsText = "Kapacita již byla vyčerpána, ale stále se můžeš hlásit jako náhradník. Pokud se nějaké místo uvolní, budeme Tě kontaktovat. Pořadí náhradníků je dáno časem odeslání přihlášky, tak neváhej!";
    form.setDescription(subsText + newParSign + originalText);
  }
}

function sendToEmails() {
  var templateId = SpreadsheetApp.getActiveSheet().getRange(9, 3).getValue();
  var activeSheet = SpreadsheetApp.getActiveSheet();
  var spreadsheet = SpreadsheetApp.openById(MAIN_SPREADSHEET);
  var moneyInfoSheet = spreadsheet.getSheetByName(MONEY_INFO_SHEET);
  var youCanTouchSheet = spreadsheet.getSheetByName(DATA_MASTER_SHEET);

  var emails = getStringsFromColumn(0, activeSheet);
  emails = emails.filter(e => !e.isEmpty());

  var ui = SpreadsheetApp.getUi();
  var message = 'Opravdu chcete rozeslat:' + '\nPočet e-mailů: ' + emails.length + '\nŠablona: ' + templateId;
  var response = ui.alert('Opravdu?', message, ui.ButtonSet.YES_NO);

  if (response == ui.Button.NO) {
    return;
  }

  emails.forEach(
    e => {
      var summaryVars = addSummaryVars(e, moneyInfoSheet);
      addSummaryVars(e, youCanTouchSheet, summaryVars);
      sendEmail(e, summaryVars, templateId);
    });
}
