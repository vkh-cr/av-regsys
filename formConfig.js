//MANUÁL
//Tady se všechno konfiguruje - položky formuláře, termíny turnusů, ceny jednotlivých položek.
//Kdykoliv změníš nějakou kolonku ve formuláři, musíš ji změnit i tady. Jinak to přestane pracovat. Názvy kolonek ve formuláři se musí PŘESNĚ shodovat s jejich pojmenováním tady.

function getTranslationConfig(formID) {
  return {
    "timestamp": { "title": "Časová značka" },
    "name": { "title": "Jméno" },
    "surname": { "title": "Příjmení" },
    "email": { "title": "Email" },
    "birthYear": { "title": "Rok narození" },
    "address": { "title": "Adresa trvalého bydliště" },
    "roommate": { "title": "Chceme bydlet spolu" },
    "accommodation": { "title": "Varianta ubytování" },
    "phone": { "title": "Telefon" },
    "support": { "title": "Dobrovolný příspěvek" },
    "healthCondition": { "title": "Máš nějaké zdravotní omezení či dietu?" },
    "note": { "title": "Poznámka" },
  }
}

function getPriceConfig() {
  return {
    "With": 2495,
    "Without": 2015,
    "SleepingBag": 1500,
  };
}

const MAX_WITH = 12;
const MAX_WITHOUT = 100;
const MAX_SPACAK = 80;
const MAX_PROGRAM = 158;

const PAYMENT_DEADLINE_DAYS = 18;
const REMINDER_DAYS = 7;
