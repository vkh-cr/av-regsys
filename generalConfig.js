const WITH_TYPE = "with";
const WITHOUT_TYPE = "without";
const SPACAK_TYPE = "spacak";
const PROGRAM_TYPE = "program";
const STORNO_TYPE = "storno";

const PROGRAM_ONLY_TYPE = "programOnly";
const PROGRAM_FOOD_ONLY_TYPE = "programFoodOnly";

const PROGRAM_ONLY_FRIDAY = "programOnlyFriday";
const PROGRAM_ONLY_SATURDAY = "programOnlySaturday";
const SUB_ACCOMODATION = "waiting";


const AccomondationLimits = {
  //extra for team
  [WITH_TYPE]: 12+15,
  //extra for families
  [WITHOUT_TYPE]: 100+2,
  [SPACAK_TYPE]: 80,
  // minus team and guests
  [PROGRAM_TYPE]: 158-19,
  [PROGRAM_ONLY_FRIDAY]: 30,
  [PROGRAM_ONLY_SATURDAY]: 30,
  [SUB_ACCOMODATION]: 0

  // test variant
  // [WITH_TYPE]: 12,
  // [WITHOUT_TYPE]: 12,
  // [SPACAK_TYPE]: 12,
  // [PROGRAM_TYPE]: 12
};

const AccomondationPrice = {
  [WITH_TYPE]: 2695,
  [WITHOUT_TYPE]: 2215,
  [SPACAK_TYPE]: 1720,
  [PROGRAM_FOOD_ONLY_TYPE]: 1360,
  [PROGRAM_ONLY_TYPE]: 700,
  [PROGRAM_ONLY_FRIDAY]: 300,
  [PROGRAM_ONLY_SATURDAY]: 300,
  [SUB_ACCOMODATION]: 0
  // test variant
  // [WITH_TYPE]: 5,
  // [WITHOUT_TYPE]: 4,
  // [SPACAK_TYPE]: 3,
  // [PROGRAM_FOOD_ONLY_TYPE]: 2,
  // [PROGRAM_ONLY_TYPE]: 2
};

const AccomondationType = {
  [WITH_TYPE]: "Postel s příslušenstvím",
  [WITHOUT_TYPE]: "Postel bez příslušenství",
  [SPACAK_TYPE]: "Spacák",
  [PROGRAM_FOOD_ONLY_TYPE]: "Program a strava (bez ubytování)",
  [PROGRAM_ONLY_TYPE]: "Jen program (bez ubytování a bez stravy)",
  [PROGRAM_ONLY_FRIDAY]: "Jen program pátek",
  [PROGRAM_ONLY_SATURDAY]: "Jen program sobota",
  [SUB_ACCOMODATION]: "Zatím neznámé"
};

const MAIN_FORM = '1q8kRtBRwmzo9DNhnVtzBPp1-uyZ7EZOqGJRglThPWG8';
const MAIN_SPREADSHEET = '1OZ65MpjlksqZfOeUHlVsmZ-S0UhDfPaOf4I6hJ3vJnE';
const ANSWERS_SHEET = 'Odpovědi formuláře 6';
const YOU_CAN_TOUCH_SHEET = 'You CAN touch this';
const MONEY_INFO_SHEET = 'money info';
const BANK_LOG_SHEET = 'bank log';

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

  function IndexMoneyInfo(key)
  {
    return BankInfoDataHeader.indexOf(key);
  }