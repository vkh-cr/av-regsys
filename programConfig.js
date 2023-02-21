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
const K_ACCOMODATION_TYPE = "accommodationType";
const K_ACCOMODATION = "accommodation";
const K_ROOMMATE = "roommate";
const K_SUPPORT = "support";
const K_PHONE = "phone";
const K_PHONE2 = "phone2";
const K_HEALTH_CONDITION = "healthCondition";
const K_NOTE = "note";
const K_HIDDEN_NOTE = "hiddenNote";
const K_VOLUNTEER_PREFERENCE = "volunteerPreference";
const K_VOLUNTEER_WEEKEND = "volunteerWeekend";
const K_AFTER_AV_INFO = "afterAVinfo";
const K_PRICE = "finalPrice";
const K_VAR_SYMBOL = "varSymbol";
const K_DEADLINE = "deadline";
const K_SALUTATION = "salutation";
const K_PRESALUTATION = "presalutation";
const K_SUB_ORDER = "subOrder";
const K_MANUAL_OVERRIDE = "manualOverride";
const K_PAID = "paid";
const K_PAID_EVERYTHING = "paidEverything";
const K_PAID_EVERYTHING_TIMESTAMP = "paidEverythingTimestamp";
const K_PAID_EVERYTHING_ORDER = "paidEverythingOrder";
const K_REMINDER_SENT = "reminderSent";
const K_REGISTRATION_VALID = "registrationValid";
const K_EXPIRED_ALERT = "expiredAlert";
const K_DETAILS = "details";
const K_SUPPORT_CONFIRM = "supportConfirm";
const K_DISCUSS_GROUP = "discussGroup";
const K_BULLETIN = "bulletin";
const K_SHIRT = "shirt";
const K_ROLE = "role";



const GYMPL_TYPE = "gympl";
const VDCM_POSTEL_TYPE = "vdcmPostel";
const SPACAK_FOOD_TYPE = "spacakFood";
const SPACAK_ONLY_TYPE = "spacakOnly";
const PROGRAM_FOOD_TYPE = "programFood";
const PROGRAM_ONLY_TYPE = "programOnly";
const PROGRAM_ONLY_FRIDAY = "programOnlyFriday";
const PROGRAM_ONLY_SATURDAY = "programOnlySaturday";
const SUB_ACCOMODATION = "waiting";
const STORNO_TYPE = "storno";
const OTHERS_TYPE = "others";

const PAYMENT_DEADLINE_DAYS = 14;
const REMINDER_DAYS = 7;

const AccommodationLimits = {
  //extra for team
  //-15 pro hosty
  // [GYMPL_TYPE]: 23+92,
  // [VDCM_POSTEL_TYPE]: 51,
  // [SPACAK_FOOD_TYPE]: 130,
  // [SPACAK_ONLY_TYPE]: 100,
  // [PROGRAM_FOOD_TYPE]: 40,
  // [PROGRAM_ONLY_TYPE]: 300,
  // [PROGRAM_ONLY_FRIDAY]: 40,
  // [PROGRAM_ONLY_SATURDAY]: 40
  // test variant
  [GYMPL_TYPE]: 1,
  [VDCM_POSTEL_TYPE]: 2,
  [SPACAK_FOOD_TYPE]: 2,
  [SPACAK_ONLY_TYPE]: 2,
  [PROGRAM_FOOD_TYPE]: 2,
  [PROGRAM_ONLY_TYPE]: 2,
  [PROGRAM_ONLY_FRIDAY]: 2,
  [PROGRAM_ONLY_SATURDAY]: 2
};

const SHIRT_PRICE = 300;

const AccommodationPrice = {
  // [GYMPL_TYPE]: 2575,
  // [VDCM_POSTEL_TYPE]: 3000,
  // [SPACAK_FOOD_TYPE]: 1950,
  // [SPACAK_ONLY_TYPE]: 1060,
  // [PROGRAM_FOOD_TYPE]: 1575,
  // [PROGRAM_ONLY_TYPE]: 700,
  // [PROGRAM_ONLY_FRIDAY]: 300,
  // [PROGRAM_ONLY_SATURDAY]: 300

  //test variant
  [GYMPL_TYPE]: 2,
  [VDCM_POSTEL_TYPE]: 2,
  [SPACAK_FOOD_TYPE]: 2,
  [SPACAK_ONLY_TYPE]: 2,
  [PROGRAM_FOOD_TYPE]: 2,
  [PROGRAM_ONLY_TYPE]: 2,
  [PROGRAM_ONLY_FRIDAY]: 2,
  [PROGRAM_ONLY_SATURDAY]: 2
};

const AccommodationType = {
  [GYMPL_TYPE]: "Program + strava + ubytování gympl",
  [VDCM_POSTEL_TYPE]: "Program + strava + ubytování VDCM postel",
  [SPACAK_FOOD_TYPE]: "Program + strava + ubytování spacák (ZŠ)",
  [SPACAK_ONLY_TYPE]: "Program + ubytování spacák (ZŠ)",
  [PROGRAM_FOOD_TYPE]: "Program + strava (bez ubytování)",
  [PROGRAM_ONLY_TYPE]: "Jen program",
  [PROGRAM_ONLY_FRIDAY]: "Jen program pátek",
  [PROGRAM_ONLY_SATURDAY]: "Jen program sobota"
};

const MAIN_FORM = '17og9s0uXymeekEGz48A6JVXapnnTZf7Tm1S_jT7y-pI';
const MAIN_SPREADSHEET = '1IccxjwQ-2xaUwm8JR7KEEp_E9fzt7Dj9w56y2_4U3vc';
const ANSWERS_SHEET = 'Odpovědi formuláře 8';
const DATA_MASTER_SHEET = 'Data master';
const MONEY_INFO_SHEET = 'money info';
const BANK_LOG_SHEET = 'bank log';

const testSummaryVars = {
  [K_TIMESTAMP] : new Date(),
  [K_SUB_ORDER] : 275,
  [K_NAME] : "Václav",
  [K_SURNAME] : "Čáp",
  [K_SEX] : "Muž",
  [K_EMAIL] : "bujnmi@gmail.com",
  [K_BIRTH_YEAR] : "1992",
  [K_ADDRESS] : "Švábenice 81",
  [K_REGION] : "Jihomoravský kraj",
  [K_CITY] : "Vyškov",
  [K_ACCOMODATION_TYPE] : PROGRAM_FOOD_TYPE,
  [K_ROOMMATE] : "",
  [K_VOLUNTEER_PREFERENCE] : "",
  [K_DISCUSS_GROUP] : "Ano",
  [K_PHONE] : "+420720373969",
  [K_PHONE2] : "+420123456789",
  [K_HEALTH_CONDITION] : "nicnicnic",
  [K_BULLETIN] : "Ano",
  [K_SHIRT] : "XL",
  [K_SUPPORT] : 0,
  [K_SUPPORT_CONFIRM] : "",
  [K_NOTE] : "",
  [K_AFTER_AV_INFO] : "Ne",
  [K_PRICE] : 1360,
  [K_VAR_SYMBOL] : 232751360,
  [K_DEADLINE] : getDeadlineFromCurrentDate()
};

const RegistrationFormQuestions = 
  [ 
    K_NAME,
    K_SURNAME,
    K_SEX,
    K_EMAIL,
    K_BIRTH_YEAR,
    K_ADDRESS,
    K_REGION,
    K_CITY,
    K_ACCOMODATION_TYPE,
    K_ROOMMATE,
    K_VOLUNTEER_PREFERENCE,
    K_DISCUSS_GROUP,
    K_PHONE,
    K_PHONE2,
    K_HEALTH_CONDITION,
    K_BULLETIN,
    K_SHIRT,
    K_SUPPORT,
    K_SUPPORT_CONFIRM,
    K_NOTE,
    K_AFTER_AV_INFO
  ];

const BankInfoDataHeader = 
  [ 
    K_TIMESTAMP,
    K_NAME,
    K_SURNAME,
    K_VAR_SYMBOL,
    K_MANUAL_OVERRIDE,
    K_EMAIL,
    K_PRICE,
    K_PAID,
    K_PAID_EVERYTHING,
    K_PAID_EVERYTHING_TIMESTAMP, 
    K_REMINDER_SENT,
    K_REGISTRATION_VALID,
    K_DETAILS,
    K_EXPIRED_ALERT,
    K_HIDDEN_NOTE
  ];

const DataMasterHeader = 
[ 
  K_TIMESTAMP,
  K_SUB_ORDER,
  K_VAR_SYMBOL,

  K_NAME,
  K_SURNAME,
  K_SEX,
  K_EMAIL,
  K_BIRTH_YEAR,
  K_ADDRESS,
  K_REGION,
  K_CITY,
  K_ACCOMODATION_TYPE,
  K_ROOMMATE,
  K_VOLUNTEER_PREFERENCE,
  K_DISCUSS_GROUP,
  K_PHONE,
  K_PHONE2,
  K_HEALTH_CONDITION,
  K_BULLETIN,
  K_SHIRT,
  K_SUPPORT,
  K_SUPPORT_CONFIRM,
  K_NOTE,
  K_AFTER_AV_INFO,
  K_PRICE,

  K_HIDDEN_NOTE
];

// Kdykoliv změníš nějakou kolonku ve formuláři, musíš ji změnit i tady. 
// Jinak to přestane pracovat. 
// Názvy kolonek ve formuláři se musí PŘESNĚ shodovat s jejich pojmenováním tady.

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
      [K_ACCOMODATION_TYPE]: { "title": "Varianta ubytování", "typeTranslations": AccommodationType },
      [K_ROOMMATE]: { "title": "Chceme bydlet spolu" },
      [K_VOLUNTEER_PREFERENCE]: { "title": "Oblast dobrovolnické pomoci" },
      [K_DISCUSS_GROUP]: { "title": "Diskuzní skupinky" },
      [K_PHONE]: { "title": "Telefon" },
      [K_PHONE2]: { "title": "Telefon v případě ohrožení" },
      [K_HEALTH_CONDITION]: { "title": "Zdravotní omezení a diety" },
      [K_BULLETIN]: { "title": "Tištěná brožura" },
      [K_SHIRT]: { "title": "Triko" },
      [K_SUPPORT]: { "title": "Dobrovolný příspěvek" },
      [K_SUPPORT_CONFIRM]: { "title": "Potvrzení o daru" },
      [K_NOTE]: { "title": "Poznámka" },
      [K_AFTER_AV_INFO]: { "title": "Informace po AV" },
      [K_HIDDEN_NOTE]: { "title": "Skrytá poznámka" },
      [K_ROLE]: { "title": "Role" },
      
      [K_VOLUNTEER_WEEKEND]: { "title": "Pojedu na víkendovku pro dobrovolníky" },
      [K_VAR_SYMBOL]: { "title": "Id" },
      [K_MANUAL_OVERRIDE]: { "title": "Manuální změna" },
      [K_PAID]: { "title": "Zaplaceno" },
      [K_PRICE]: { "title": "Celková cena" },
      [K_PAID_EVERYTHING]: { "title": "Zaplaceno vše" },
      [K_PAID_EVERYTHING_TIMESTAMP]: { "title": "Datum zaplacení všeho" },
      [K_REMINDER_SENT]: { "title": "Upomínka odeslána" },
      [K_REGISTRATION_VALID]: { "title": "Platná registrace" },
      [K_EXPIRED_ALERT]: { "title": "Upozornění zasláno" },
      [K_DETAILS]: { "title": "Detaily" },
      [K_SUB_ORDER]: { "title": "Číslo registrace" },
    }
  }
  
  function getKeyByTranslationValue(object, value) {
    return Object.keys(object).find(key => object[key].title === value);
  }
  

