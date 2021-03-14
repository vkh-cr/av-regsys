//MANUÁL
//Tady se všechno konfiguruje - položky formuláře, termíny turnusů, ceny jednotlivých položek.
//Kdykoliv změníš nějakou kolonku ve formuláři, musíš ji změnit i tady. Jinak to přestane pracovat. Názvy kolonek ve formuláři se musí PŘESNĚ shodovat s jejich pojmenováním tady.

function getTranslationConfig(formID) {
  return {
    "timestamp": { "title": "Časová značka" },
    "name": { "title": "Jméno" },
    "surname": { "title": "Příjmení" },
    "sex": { "title": "Pohlaví" },
    "email": { "title": "Email" },
    "birthYear": { "title": "Rok narození" },
    "address": { "title": "Adresa trvalého bydliště" },
    "region": { "title": "Kraj" },
    "city": { "title": "Město, kde trávíš čas" },
    "accommodation": { "title": "Varianta ubytování" },
    "roommate": { "title": "Chceme bydlet spolu" },
    "support": { "title": "Dobrovolný příspěvek" },
    "phone": { "title": "Telefon" },
    "healthCondition": { "title": "Máš nějaké zdravotní omezení či dietu?" },
    "note": { "title": "Poznámka" },
    "volunteerPreference": { "title": "Preferovaná oblast tvé pomoci" },
    "volunteerWeekend": { "title": "Pojedu na víkendovku pro dobrovolníky" },
    "afterAVinfo": { "title": "Informace po AV" },
  }
}

const PAYMENT_DEADLINE_DAYS = 18;
const REMINDER_DAYS = 7;
