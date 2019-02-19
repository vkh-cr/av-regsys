
function getConfirmationEmailTemplate() {
  return {
    'subject': "AV19 - potvrzení registrace a detaily platby",
    'text': "Milá účastnice/ milý účastníku,\n\
\n\
\n\
úspěšně jsme zpracovali tvoji registraci na Absolventský Velehrad 2019.\n\
\n\
Při registraci sis vybral/a variantu #accommodation, proto prosíme o uhrazení částky #price Kč.\n\
\n\
Celou částku prosím pošli na účet VKH ČR, z.s. Číslo účtu je 2700062738/2010, variabilní symbol #varSymbol.\n\
\n\
Po připsání platby na účet ti zašleme potvrzovací email. Na připsání platby budeme čekat do #deadline. Jestli platba tou dobou nedorazí, bude registrace stornována.\n\
\n\
Protože registrační příspěvky nepokrývají 100 % nákladů na AV19, budeme rádi za jakékoli příspěvky na jeho realizaci. Dobrovolné příspěvky můžeš zaslat na účet 2700062738/2010 s variabilním symbolem 102 nebo předat osobně na místě v průběhu setkání.\n\
\n\
Novinky najdeš na webu www.absolventskyvelehrad.cz. Sleduj taky Facebook a Instagram. V případě změny nebo dotazů nás kontaktuj na e-mailu tym.realizace@absolventskyvelehrad.cz.\n\
\n\
Tématem AV19 je „Co je cíl?“. Inspiruj se příběhy obyčejně neobyčejných lidí, kteří se rozhodli nepromarnit svůj život.\n\
\n\
Díky a těšíme se na setkání\n\
\n\
Za přípravný tým AV19\n\
Anička a Jakub\n\
"
  };
}

function getPaidEverythingtEmail() {
    return {
      'subject': "[av19] Payment confirmation email TEST",
      'text': "Ahoj,\n\
this is test text of payment confirmation email. It can contain these values:\n\
variabilní symbol #varSymbol\n\
zaplaceno pred #alreadyPaidOld\n\
zaplaceno ted #alreadyPaidNew\n\
mena #currency\n\
cena celkem #finalPrice\n\
zbyva k zaplaceni #leftToBePaid"
    };
}

//VÝZVA K ZAPLACENÍ
function notRecievedPayment() {
    return {
      'subject': "Výzva k zaplacení Studentského velehradu 2018!",
      'text': "Ahoj!\n\
\n\
Doposud jsme neobdrželi Tvou platbu za registraci na Studentský Velehrad 2018.\n\
\n\
Pokud jsi již zaplatil(a), dej nám prosíme vědět a Tvou platbu dohledáme.\n\
V opačném případě Tě prosíme o uhrazení registračního poplatku co nejdříve\n\
\n\
Pokud máš jakékoli dotazy, neváhej nás kontaktovat.\n\
\n\
Za tým registrace a ubytování.\n\
\n\
Jan Rychtár\n\
Registrace Studentský Velehrad 2018\n\
registrace@studentskyvelehrad.cz\n\
www.studentskyvelehrad.cz\n\
"
    };
}

//VÝZVA K ZAPLACENÍ ZBYTKU
function getNotYetEverythingEmail(formID) {
  if (formID == "cz") {
    return {
      'subject': "Příchozí platba za Studentský velehrad 2018",
      'text': "Ahoj!\n\
\n\
Příjali jsme tvoji platbu za Studentský velehrad 2018 ve výši #alreadyPaidNew CZK. Nicméně jsi stále nezaplatil celou částku #finalPrice CZK. Prosíme tedy ještě o doplatek #leftToBePaid CZK. Díky. \n\
Pokud jsi již částku zaplatil celou, neprodleně nás kontaktuj na emailu registrace@studentskyvelehrad.cz.\n\
\n\
Za tým registrace a ubytování.\n\
\n\
Jan Rychtár\n\
Registrace Studentský Velehrad 2018\n\
registrace@studentskyvelehrad.cz\n\
www.studentskyvelehrad.cz\n\
"
    };
  };
}
