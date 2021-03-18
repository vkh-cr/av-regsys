const CONFIRMATION_TEMPLATE = "pxkjn4172q4z7815";
const REMINDER_VOLUNTEER_TEMPLATE = "pxkjn417k04z7815";
const REMINDER_TEMPLATE = "0r83ql3nw04zw1jm";
const PAYMENT_VOLUNTEER_OK_TEMPLATE = "v69oxl5z6kl785kw";
const PAYMENT_OK_TEMPLATE = "vywj2lpjqpl7oqzd";


String.prototype.isEmpty = function() {
  return (this.length === 0 || !this.trim());
};

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
  return subs;
}

function sendEmailConfirmation(summaryVars)
{
  sendEmail(summaryVars, CONFIRMATION_TEMPLATE);
}

function sendEmail(summaryVars, templateId)
{
  Logger.log(summaryVars);
  var subs = getSubsForMailerSend(summaryVars);
  sendEmailMailerSend(summaryVars[K_EMAIL], subs, templateId);
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
