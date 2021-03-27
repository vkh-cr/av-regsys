function getGeneralConfig() {
  return {
    'attentionEmail' : 'tym.realizace@absolventskyvelehrad.cz',
    'attentionSubject' : 'AV21 - problematicka registrace',
    'replyToEmail' : 'tym.realizace@absolventskyvelehrad.cz',
  };
}

const WITH_TYPE = "with";
const WITHOUT_TYPE = "without";
const SPACAK_TYPE = "spacak";
const PROGRAM_TYPE = "program";
const PROGRAM_ONLY_TYPE = "programOnly";
const PROGRAM_FOOD_ONLY_TYPE = "programFoodOnly";

const AccomondationLimits = {
  //extra for team
  [WITH_TYPE]: 12+15,
  [WITHOUT_TYPE]: 100,
  [SPACAK_TYPE]: 80,
  // minus team and quests
  [PROGRAM_TYPE]: 158-17
  // test variant
  // [WITH_TYPE]: 12,
  // [WITHOUT_TYPE]: 12,
  // [SPACAK_TYPE]: 12,
  // [PROGRAM_TYPE]: 12
};

const AccomondationPrice = {
  [WITH_TYPE]: 2495,
  [WITHOUT_TYPE]: 2015,
  [SPACAK_TYPE]: 1520,
  [PROGRAM_FOOD_ONLY_TYPE]: 1160,
  [PROGRAM_ONLY_TYPE]: 500
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
  [PROGRAM_ONLY_TYPE]: "Jen program (bez ubytování a bez stravy)"
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
    K_EXPIRED_ALERT
  ];

  function IndexMoneyInfo(key)
  {
    if(key==K_TIMESTAMP)
    {
      return 0;
    }
    return BankInfoDataHeader.indexOf(key)+1;
  }