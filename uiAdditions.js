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

  var rowInfo = findRowIndexAndRangeInSheet(MONEY_INFO_SHEET, varSymbol, IndexMoneyInfo(K_VAR_SYMBOL)); runtimeLog(rowInfo);
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
  if (cellValue != null || cellValue != undefined) { cellValue += '\n'; }
  else { cellValue = ''; }

  cellValue += newEntry;
  currRange.getSheet().getRange(indexInRange + 1, IndexMoneyInfo(K_DETAILS) + 1).setValue(cellValue);
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

  var summaryVars = addSummaryVars(userEmail, getSheet(ANSWERS_SHEET));
  sendEmailRegistrationCancelled(summaryVars);
}

function getOptionString(type) {
  const splitter = ", ";
  const czk = " Kč";
  return AccomondationType[type] + splitter + AccomondationPrice[type] + czk;
}

function updateSignInForm() {
  var form = FormApp.getActiveForm();
  if(!form)
  {
    form = FormApp.openById(MAIN_FORM);
  }
  var allItems = form.getItems();
  var counts = getCurrentAccomodationTypeCounts();
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
        if (counts[key] < AccomondationLimits[key])
        {
          if (key == PROGRAM_TYPE) 
          {
            choices.push(getOptionString(PROGRAM_FOOD_ONLY_TYPE));
            choices.push(getOptionString(PROGRAM_ONLY_TYPE));
            return;
          }
          choices.push(getOptionString(key));
        }
      });

      if (subMode) {
        form.deleteItem(thisItem);
        continue;
      }
      var helpTextAccomodationOpen = "Varianty s postelí a také veškeré stravování zajišťuje poutní dům Stojanov (www.stojanov.cz). Termín „příslušenství“ označuje sociální zařízení (sprcha a záchod). Pro pokoje bez příslušenství jsou k dispozici společná sociální zařízení na chodbě. Místa pro spacáky poskytuje Velehradský dům sv. Cyrila a Metoděje, zkráceně VDCM. U všech variant ubytování se automaticky počítá i se stravou. Více informací o ubytování a stravování najdeš na https://absolventskyvelehrad.cz/vse-o-registraci-na-av-21/. V ceně je započítána sleva pro dobrovolníky";
      var helpTextAccomodationClosed = "Naše kapacity ubytování jsou téměř vyčerpány. Přesto je možné si zajistit vlastní ubytování. Doporučujeme místní kemp a společnou domluvu spolubydlení přes http://bit.ly/spolubydleniAV. Více informací o ubytování a stravování najdeš na https://absolventskyvelehrad.cz/vse-o-registraci-na-av-21/.";
      // Varianta ubytování
      multipleChoice.setHelpText(helpTextAccomodationClosed);
      multipleChoice.setChoiceValues(choices);
    }
  }

  var newParSign = "\n\n";
  var par2 = "Podrobnosti k registraci, ubytování, stravování atd. najdeš na https://absolventskyvelehrad.cz/vse-o-registraci-na-av-21/";
  var par3 = "Proměnná kapacita z důvodu protiepidemických opatření:";
  var par4 = "Máme připravené tři scénáře: 350, 250 a 150 lidí. Registrace je otevřena v plné výši, avšak bude-li v létě podle aktuálních opatření nutné omezit počet účastníků, nezbývá než přejít k nižší variantě. Rozhodujícím kritériem pro účast bude čas podání přihlášky. Pokud se z tohoto důvodu na tebe nedostane, samozřejmostí je vrácení registračního poplatku. Podrobnosti najdeš na https://absolventskyvelehrad.cz/covid-situace/";
  var originalText = par2 + newParSign + par3 + newParSign + par4;
  if (!subMode) {
    // normal mode
    form.setTitle("AV21 - Registrace")
    form.setDescription(originalText);
  }
  else {
    // substitute mode
    form.setTitle("AV21 - Registrace - REŽIM NÁHRADNÍKŮ")
    var subsText = "Kapacita již byla vyčerpána, ale stále se můžeš hlásit jako náhradník. Pokud se nějaké místo uvolní, budeme Tě kontaktovat. Pořadí náhradníků je dáno časem odeslání přihlášky, tak neváhej!";
    form.setDescription(subsText + newParSign + originalText);
  }
}

function sendToEmails() {
  var templateId = SpreadsheetApp.getActiveSheet().getRange(9, 3).getValue();
  var activeSheet = SpreadsheetApp.getActiveSheet();
  var spreadsheet = SpreadsheetApp.openById(MAIN_SPREADSHEET);
  var answersSheet = spreadsheet.getSheetByName(ANSWERS_SHEET);
  var moneyInfoSheet = spreadsheet.getSheetByName(MONEY_INFO_SHEET);
  var youCanTouchSheet = spreadsheet.getSheetByName(YOU_CAN_TOUCH_SHEET);

  var emails = getStringsFromColumn(0, activeSheet);
  emails = emails.filter(e => !e.isEmpty());

  var ui = SpreadsheetApp.getUi();
  var message = 'Opravdu chcete rozeslat:' + '\nPočet emailů: ' + emails.length + '\nŠablona: ' + templateId;
  var response = ui.alert('Opravdu?', message, ui.ButtonSet.YES_NO);

  if (response == ui.Button.NO) {
    return;
  }

  emails.forEach(
    e => {
      var summaryVars = addSummaryVars(e, moneyInfoSheet);
      addSummaryVars(e, answersSheet, summaryVars);
      sendEmail(e, summaryVars, templateId);
    });
}
