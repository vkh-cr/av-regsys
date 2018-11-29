// ŠABLONY E-MAILOVÉ KOMUNIKACE


//POTVRZENÍ REGISTRACE
function getConfirmationEmailTemplate(formID) {
  if (formID == "cz") {
    return { 'normal' :{

      'subject': "KAPACITA NAPLNĚNA Studentský velehrad 2018 – potvrzení přihlášky KAPACITA NAPLNĚNA",
      'text': "Ahoj!\n\
      \n\
Děkujeme za registraci...\n\
Níže nalezneš Tebou zadané údaje, prosím zkontroluj je. Pokud objevíš nesrovnalosti, neprodleně nás kontaktuj na emailu registrace@studentskyvelehrad.cz.\n\
\n\
Kapacita Studentského Velehradu byla naplněna, ale nezoufej. Zařadíme Tě mezi náhradníky a při uvolnění místa Tě budeme kontaktovat. \n\
Níže máš údaje pro platbu. Částku teď neposílej. Je to pro případ, že Tě kontaktujeme s volným místem. \n\
\n\
Na číslo účtu 2700062738/2010 prosím zatím neposílej částku #priceCZK CZK. Jako variabilní symbol uveď: #varSymbol. Jiné položky nevyplňuj (případně do zprávy můžeš napsat jméno). Platbu proveď nejpozdějido 5 dnů od provedení registrace. \n\
Reálná cena na účastníka je 1650 CZK (na víkendového 1430 CZK). Pokud tedy můžeš dát víc a podpořit tím Studentský Velehrad, budeme moc rádi. Není třeba nás na to nějak upozorňovat. Přeplatek budeme brát jako dar, děkujeme!\n\
\n\
Měj se hezky a třeba se uvidíme Velehradě! ;o)\n\
\n\
Za tým registrace a ubytování.\n\
\n\
Jan Rychtár\n\
Registrace Studentský Velehrad 2018\n\
registrace@studentskyvelehrad.cz\n\
www.studentskyvelehrad.cz\n\
\n\
\n\
Časová značka: #timestamp\n\
Tvoje ID: #varSymbol\n\
Typ registrace: #registrationType\n\
Délka pobytu: #lengthOfStay\n\
Sekce: #section\n\
Volba jídla: #food\n\
Jméno a příjmení: #name\n\
Email: #email\n\
Telefon: #phone\n\
Pohlaví: #sex\n\
Ulice a č.p.: #street\n\
Město: #city\n\
PSČ: #postalCode\n\
Datum narození: #birthDate\n\
Akademická farnost: #parish\n\
Vzkaz organizátorům: #message"


      },
    };
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
