const CONFIRMATION_TEMPLATE = "pxkjn4172q4z7815";
const SUB_TEMPLATE = "x2p0347qwplzdrn7";
const REMINDER_VOLUNTEER_TEMPLATE = "pxkjn417k04z7815";
const REMINDER_TEMPLATE = "0r83ql3nw04zw1jm";
const PAYMENT_OK_TEMPLATE = "v69oxl5z6kl785kw";
const CANCELLED_TEMPLATE = "3zxk54v6dxgjy6v7";

function createOneSub(property, value)
{
  var valueString = value.toString();
  if(valueString.isEmpty())
  {
    valueString = "_";
  }
  return {
    "var": property,
    "value": valueString
  };
}

function getPlaceholdersJsonFromObject(obj)
{
  var subs = [];
  for (const property in obj) {
    var substitution = createOneSub(property, obj[property]);
    subs.push(substitution)
  }
  return subs;
}

function getSubsForMailerSend(obj)
{
  var subs = getPlaceholdersJsonFromObject(obj);
  var preSalutation = GetPreSalutation(obj[K_SEX]);
  subs.push(createOneSub(K_PRESALUTATION, preSalutation));
  var salutation = GetSalutation(obj[K_NAME]);
  subs.push(createOneSub(K_SALUTATION, salutation));
  if(typeof obj[K_ACCOMODATION_TYPE] !== "undefined" && !obj[K_ACCOMODATION_TYPE].isEmpty())
  {
    subs.push(createOneSub(K_ACCOMODATION, AccomondationType[obj[K_ACCOMODATION_TYPE]]));
  }
  return subs;
}

function sendEmailConfirmation(summaryVars)
{
  sendEmail(summaryVars[K_EMAIL], summaryVars, CONFIRMATION_TEMPLATE);
}

function sendEmailRegistrationCancelled(summaryVars)
{
  sendEmail(summaryVars[K_EMAIL], summaryVars, CANCELLED_TEMPLATE);
}

function sendEmailSub(summaryVars)
{
  sendEmail(summaryVars[K_EMAIL], summaryVars, SUB_TEMPLATE);
}

function sendEmailPaymentRemidner(summaryVars)
{
  sendEmail(summaryVars[K_EMAIL], summaryVars, REMINDER_TEMPLATE);
}

function sendEmailPaymentOk(summaryVars)
{
  sendEmail(summaryVars[K_EMAIL], summaryVars, PAYMENT_OK_TEMPLATE);
}

function sendEmail(mail, summaryVars, templateId)
{
  Logger.log(summaryVars);
  var subs = getSubsForMailerSend(summaryVars);
  sendEmailMailerSend(mail, subs, templateId);
}

function sendEmailMailerSend(recipient, templateData, templateId) {

  var body =
  {
    "to": [
      {
        "email": recipient,
      }
    ],
    "template_id": templateId,
    "reply_to": [
      {
        "email": 'info@absolventskyvelehrad.cz',
        "name": 'AV21'
      }
    ],
    "variables": [
      {
        "email": recipient,
        "substitutions": templateData
      }
    ]
  }
  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "authorization": "Bearer " + getMailerSendkey()
    },
    "payload": JSON.stringify(body)
  }

  var response = UrlFetchApp.fetch("https://api.mailersend.com/v1/email", options);
  Logger.log(response);
}
