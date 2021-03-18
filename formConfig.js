//MANUÁL
//Tady se všechno konfiguruje - položky formuláře, termíny turnusů, ceny jednotlivých položek.
//Kdykoliv změníš nějakou kolonku ve formuláři, musíš ji změnit i tady. Jinak to přestane pracovat. Názvy kolonek ve formuláři se musí PŘESNĚ shodovat s jejich pojmenováním tady.

function getTranslationConfig() {
  return {
    [K_TIMESTAMP]: { "title": "Časová značka" },
    [K_NAME]: { "title": "Jméno" },
    [K_SURNAME]: { "title": "Příjmení" },
    [K_SEX]: { "title": "Pohlaví" },
    [K_EMAIL]: { "title": "Email" },
    [K_BIRTH_YEAR]: { "title": "Rok narození" },
    [K_ADDRESS]: { "title": "Adresa trvalého bydliště" },
    [K_REGION]: { "title": "Kraj" },
    [K_CITY]: { "title": "Město, kde trávíš čas" },
    [K_ACCOMODATION]: { "title": "Varianta ubytování" },
    [K_ROOMMATE]: { "title": "Chceme bydlet spolu" },
    [K_SUPPORT]: { "title": "Dobrovolný příspěvek" },
    [K_PHONE]: { "title": "Telefon" },
    [K_HEALTH_CONDITION]: { "title": "Máš nějaké zdravotní omezení či dietu?" },
    [K_NOTE]: { "title": "Poznámka" },
    [K_VOLUNTEER_PREFERENCE]: { "title": "Preferovaná oblast tvé pomoci" },
    [K_VOLUNTEER_WEEKEND]: { "title": "Pojedu na víkendovku pro dobrovolníky" },
    [K_AFTER_AV_INFO]: { "title": "Informace po AV" },
  }
}

function getKeyByTranslationValue(object, value) {
  return Object.keys(object).find(key => object[key].title === value);
}

// keys
const K_TIMESTAMP = "timestamp";
const K_NAME = "name";
const K_SURNAME = "surname";
const K_SEX = "sex";
const K_EMAIL = "email";
const K_BIRTH_YEAR = "birthYear";
const K_ADDRESS = "address";
const K_REGION = "region";
const K_CITY = "city";
const K_ACCOMODATION = "accommodation";
const K_ROOMMATE = "roommate";
const K_SUPPORT = "support";
const K_PHONE = "phone";
const K_HEALTH_CONDITION = "healthCondition";
const K_NOTE = "note";
const K_VOLUNTEER_PREFERENCE = "volunteerPreference";
const K_VOLUNTEER_WEEKEND = "volunteerWeekend";
const K_AFTER_AV_INFO = "afterAVinfo";
const K_PRICE = "finalPrice";
const K_VAR_SYMBOL = "varSymbol";
const K_DEADLINE = "deadline";
const K_SUPPORTMSG = "supportMsg";
const K_SALUTATION = "salutation";
const K_PRESALUTATION = "presalutation";


const PAYMENT_DEADLINE_DAYS = 18;
const REMINDER_DAYS = 7;
