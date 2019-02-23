
function emailRegistrationCreated() {
  return {
    'subject': "AV19 - Potvrzení registrace a detaily platby",
    'textPlain': 'Milá účastnice / milý účastníku,\n\n' +
      'úspěšně jsme zpracovali tvoji registraci na Absolventský Velehrad 2019.\n\n' +
      'Při registraci sis vybral/a variantu ##accommodation##supportMsg, proto prosíme o uhrazení částky ##price Kč.\n\n' +
      'Celou částku prosím pošli na účet VKH ČR, z.s. Číslo účtu je 2700062738/2010, variabilní symbol ##varSymbol.\n\n' +
      'Po připsání platby na účet ti zašleme potvrzovací email. Na připsání platby budeme čekat do ##deadline. ' +
      'Jestli platba tou dobou nedorazí, bude registrace stornována.\n\n' +
      'Budeme velmi vděční za dobrovolné příspěvky na realizaci AV19, které můžeš zaslat na účet 2700062738/2010 s variabilním symbolem 102 nebo předat osobně na místě v průběhu setkání.\n\n' + plainTextSignature(),
    'textHtml': htmlHeader('templateAV2_allok.jpg') + '<h1>Milá účastnice / milý účastníku,</h1>' +
      pStart() + 'úspěšně jsme zpracovali tvoji registraci na Absolventský Velehrad 2019.' + pEnd() +
      pStart() + 'Při registraci sis vybral/a variantu "##accommodation"##supportMsg, proto prosíme o uhrazení částky <b>##price Kč</b>.' + pEnd() +
      pStart() +
      'Celou částku prosím pošli na účet VKH ČR, z.s. Číslo účtu je <b>2700062738/2010</b>, variabilní symbol <b>##varSymbol</b>.' +
      pEnd() + pStart() +
      'Po připsání platby na účet ti zašleme potvrzovací email. Na připsání platby budeme čekat do <b>##deadline</b>. ' +
      'Jestli platba tou dobou nedorazí, bude tvoje registrace stornována.' + pEnd() +
      pStart() +
      'Budeme velmi vděční za dobrovolné příspěvky na realizaci AV19, které můžeš zaslat na účet 2700062738/2010 s variabilním symbolem 102 nebo předat osobně na místě v průběhu setkání.' + pEnd() + htmlSignature() + htmlFooter()
  };
}

function emailPaymentArrived() {
  return {
    'subject': 'AV19 - Potvrzení platby',
    'textPlain': 'Milý účastníku / milá účastnice,\n\n' +
      'potvrzujeme, že tvoje platba dorazila na náš účet. Už se na tebe těšíme.\n\n' +
      'Registrace na AV19 bude probíhat v pátek 17. 5. 2019 od 17 do 20 hodin v poutním a exercičním domě Stojanov na Velehradě. ' +
      'Vezmi si s sebou občanský průkaz.\n\n' +
      'Při registraci na místě dostaneš veškeré potřebné informace o AV19 i o ubytování. Pokud jsi ještě nebyl/a na Velehradě ' +
      'a nevíš, kde je Stojanov, mrkni do mapy (https://en.mapy.cz/s/3p8hx).' + plainTextSignature(),
    'textHtml': htmlHeader('templateAV2_pay.jpg') + '<h1>Milý účastníku / milá účastnice,</h1>' +
      pStart() + 'potvrzujeme, že tvoje platba dorazila na náš účet. Už se na tebe těšíme.' + pEnd() +
      pStart() + 'Registrace na AV19 bude probíhat <b>v pátek 17. 5. 2019 od 17 do 20 hodin</b> v poutním a exercičním domě Stojanov ' +
        'na Velehradě. Vezmi si s sebou občanský průkaz.' + pEnd() +
      pStart() + 'Při registraci na místě dostaneš veškeré potřebné informace o AV19 i o ubytování. Pokud jsi ještě nebyl/a na Velehradě ' +
        'a nevíš, kde je Stojanov, mrkni do <a href="https://en.mapy.cz/s/3p8hx" target="_blank" style="text-decoration: none; ' +
        'color: #f2583a;">mapy</a>.' + pEnd() + htmlSignature() + htmlFooter()
  }
}

function emailPaymentReminder() {
  return {
    'subject': 'AV19 - Zapomenutá platba?',
    'textPlain': 'Milý účastníku / milá účastnice,\n\n' +
      'bohužel nám zatím nepřišla tvoje platba registračního poplatku.\n\n' +
      'Dovolujeme si tě upozornit,  že tvoje registrace je splatná ##deadline. ' +
      'Nenajdeme-li k tomuto datu tvoji platbu na našem účtu, budeme muset tvoji registraci zrušit.\n\n' +
      'Máš problém s platbou? Napiš nám a zkusíme to vyřešit.\n\n' +
      'Pokud se pořád chystáš na AV19, tak prosím pošli platbu co nejdřív. ' +
      'Jestliže už teď víš, že se nemúžeš zůčastnit, napiš nám, ' +
      'abychom mohli tvoje místo nabídnout někomu jinému.' + plainTextSignature(),
    'textHtml': htmlHeader('templateAV2_warning.jpg') + '<h1>Milý účastníku / milá účastnice,</h1>' +
      pStart() + 'bohužel nám zatím nepřišla tvoje platba registračního poplatku.' + pEnd() +
      pStart() + 'Dovolujeme si tě upozornit, že tvoje <b>registrace je splatná ##deadline</b>. ' +
       'Nenajdeme-li k tomuto datu tvoji platbu na našem účtu, ' +
       'budeme muset tvoji registraci zrušit.' + pEnd() +
      pStart() + 'Máš problém s platbou? Napiš nám a zkusíme to vyřešit.' + pEnd() +
      pStart() + 'Pokud se pořád chystáš na AV19, tak prosím pošli platbu co nejdřív. ' +
        'Jestliže už teď víš, že se nemúžeš zůčastnit, napiš nám, abychom mohli tvoje místo nabídnout někomu jinému.' + pEnd() +
      htmlSignature() + htmlFooter()
  }
}

function emailRegistrationCancelled() {
  return {
    'subject': 'AV19 - Zrušená registrace',
    'textPlain': 'Milý účastníku/ milá účastnice,\n\n' +
      'bohužel nám v průběhu 11 dní nepřišla tvoje platba registračního poplatku. Z tohoto důvodu byla tvoje registrace zrušena.\n\n' +
      'Je to nějaký omyl? Ozvi sa nám a vyřešíme to.\n\n' + plainTextSignature(),
    'textHtml': htmlHeader('graphic_info.png') + '<h1>Milý účastníku/ milá účastnice,</h1>' +
      pStart() + 'bohužel nám v průběhu 11 dní nepřišla tvoje platba registračního poplatku. ' +
        'Z tohoto důvodu byla tvoje registrace zrušena.' + pEnd() +
      pStart() + 'Je to nějaký omyl? Ozvi  se nám a vyřešíme to.' + pEnd() + htmlSignature() + htmlFooter()
  }
}

function plainTextSignature() {
  return '\n\nNovinky najdeš na webu www.absolventskyvelehrad.cz. Sleduj taky Facebook a Instagram. V případě změny nebo dotazů nás kontaktuj na e-mailu tym.realizace@absolventskyvelehrad.cz.\n' +
      '\n' +
      'Tématem AV19 je „Co je cíl?“. Inspiruj se příběhy obyčejně neobyčejných lidí, kteří se rozhodli nepromarnit svůj život.\n' +
      '\n' +
      'Díky a těšíme se na setkání\n' +
      '\n' +
      'Za přípravný tým AV19\n' +
      'Anička a Jakub\n';
}

function htmlSignature() {
  return pStart() +
      'V případě změny nebo dotazů k registraci nás kontaktuj na emailu tym.realizace@absolventskyvelehrad.cz.' + pEnd() +
      pStart() + 'Díky a těšíme se na setkání' + pEnd() +
      pStart() + 'Za přípravný tým AV19<br>Anička a Jakub' + pEnd();
}

function pStart() { return '<p style="text-align: justify;">'; }
function pEnd() { return '</p>'; }

function htmlHeader(pictureName) {
    return '<!DOCTYPE html> <html>' +
'<head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>AV19 email</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet"> --> <style type="text/css"> @media screen {'+
'@font-face { font-family: \'Muli\'; font-style: normal; font-weight: 400; src: url(https://fonts.gstatic.com/l/font?kit=7Auwp_0qiz-aTTDUiiP262YuHHwg-3Aa2sGY6F-zlgBLNsFnDh1U1hNHmw7L081bFWw7rgDTvo1-khvslqKcUWe8nd_aAC5nlYPglunG_MzYSGvSOqX0hr9THiJxnZzAYeHVynF6fLtp4Pj036zC2W-Pmj1XsI_Uc_dOe_lcdpRm-TAUvedn32T9RB9ca5mqJm2wdmXkZleQmHMcVVprRYILiPfK68BID6wGXvY2Ia0&skey=2b55aa3f2f059b75&v=v12) format(\'woff2\'); } } </style> </head>'+
'<body> <div>' +
'<div style="background: #EEEEEE; font-family: \'Muli\', sans-serif; margin: 0; padding: 10px 0;"> <div class="emailbody" style="margin: 40px auto; max-width: 700px;"> <div class="whitepart"> <div class="header" style="background: #585A89; color: #FFF; font-size: x-large; padding: 10px;"> <img src="http://absolventskyvelehrad.cz/wp-content/uploads/2019/02/logo.png" width="25px" style="vertical-align: middle; padding-left: 10px;" /> <span style="padding-left: 10px; vertical-align: middle;">Absolventský Velehrad 2019</span> </div> <div class="picture" style="background: #FFF;"> <img src="http://absolventskyvelehrad.cz/wp-content/uploads/2019/02/'+ pictureName + '" width="100%" /> </div> <div class="text" style="background: #FFF; padding: 20px; font-size: 120%;">';
}

function htmlFooter() {
  return ' </div> </div> <div class="footer" style="padding: 20px; text-align: center; color: #5c5c5c;"> <div style="margin-bottom: 20px;"> <a href="http://absolventskyvelehrad.cz" target="_blank" style="text-decoration: none; color: #f2583a;">AV19</a> | <a href="http://pribehy.absolventskyvelehrad.cz" target="_blank" style="text-decoration: none; color: #f2583a;">NEOBYČEJNÉ PŘÍBĚHY</a> </div> <div style="margin-bottom: 10px;"> Chceš přiložit pomocnou ruku? <a href="http://absolventskyvelehrad.cz/ruce-k-dilu/" target="_blank" style="text-decoration: none; color: #f2583a;">Dej nám vědět! </a> </div> <div> Sleduj nás na <a href="https://www.facebook.com/absolventskyvelehrad/" target="_blank" style="text-decoration: none; color: #f2583a;">FACEBOOKU</a> nebo <a href="https://www.instagram.com/absolventskyvelehrad/" target="_blank" style="text-decoration: none; color: #f2583a;">INSTAGRAMU</a>. </div> </div> </div> <div class="footer" style="width: \'100%\'; background: #585A89; color: #FFF; padding: 20px; text-align: center"> Vytvořeno s ❤ pro AV19 </div> </div> </div> </body>'+
'</html>';
}

