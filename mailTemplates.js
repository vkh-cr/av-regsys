
function getConfirmationEmailTemplate() {
    return {
      'subject': "[av19] Confirmation email TEST",
      'text': "Ahoj!\n\
This is testing text of confirmation email after registration.\n\
It should contains these static information:\n\
link to av website\n\
bank account number\n\
info regarding payment deadline\n\
\n\
Then it contains these variables values:\n\
timestamp #timestamp\n\
accommodation #accommodation\n\
name #name\n\
email #email\n\
phone #phone\n\
address #address\n\
roommate #roommate\n\
support #support\n\
note #note\n\
birthYear #birthYear\n\
price #price\n\
varSymbol #varSymbol"

    };
}

//POTVRZENÍ PLATBY
function getPaidEverythingtEmail(formID) {
  if (formID == "cz") {
    return {
      'subject': "Potvrzení o zaplacení Studentského velehradu 2018!",
      'text': "Ahoj,\n\
\n\
potvrzujeme, že jsme od Tebe přijali platbu za Studentský Velehrad 2018. \n\
Děkujeme.\n\
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

//VÝZVA K ZAPLACENÍ
function notRecievedPayment(formID) {
  if (formID == "cz") {
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
