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

const MAX_WITH = 12;
const MAX_WITHOUT = 100;
const MAX_SPACAK = 80;
const MAX_PROGRAM = 158;

const AccomondationLimits = {
  [WITH_TYPE]: 12,
  [WITHOUT_TYPE]: 100,
  [SPACAK_TYPE]: 80,
  [PROGRAM_TYPE]: 158
};

const AccomondationPrice = {
  [WITH_TYPE]: 2495,
  [WITHOUT_TYPE]: 2015,
  [SPACAK_TYPE]: 1520,
  [PROGRAM_FOOD_ONLY_TYPE]: 1160,
  [PROGRAM_ONLY_TYPE]: 500
};

const AccomondationType = {
  [WITH_TYPE]: "Postel s příslušenstvím",
  [WITHOUT_TYPE]: "Postel bez příslušenství",
  [SPACAK_TYPE]: "Spacák",
  [PROGRAM_FOOD_ONLY_TYPE]: "Program a strava (bez ubytování)",
  [PROGRAM_ONLY_TYPE]: "Jen program (bez ubytování a bez stravy)"
};

const MAIN_SPREADSHEET = '1OZ65MpjlksqZfOeUHlVsmZ-S0UhDfPaOf4I6hJ3vJnE';