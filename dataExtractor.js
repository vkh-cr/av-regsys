
function logErrorOnUndefined(variable, logMsg) {
  if (typeof variable === "undefined") {
    logError(logMsg);
    return false;
  } else {
    return true;
  }
}

function translateAnswerElseLog(answersConfig, answerValue, propertyName){

  var answerId = answersConfig[answerValue];

  if(typeof answerId === "undefined"){
    if (answerValue == '') { return null; }
    else { logError(['Answer can not be translated:', propertyName, answerValue]); return undefined; }
  }
  else { return answerId; }
}

function getInfoFromIndexes(dataConfig, indexArray, propertyName){

  var dataArray = [];
  for(var i = 0; i < indexArray.length; ++i ){

    var currIndex = indexArray[i];
    var dataForIndex = getInfoFromIndex(dataConfig, currIndex, propertyName);
    if(dataForIndex == null) {continue;}
    else {dataArray.push(dataForIndex);}

  }
  return dataArray;
}

function getInfoFromIndex(dataConfig, index, propertyName){
  var dataForIndex = dataConfig[index];
  if(!logErrorOnUndefined(dataForIndex, ['Can not find data for:', propertyName, index ])){return null;}
  return dataForIndex;
}

function getFormData(formSubmitObj, translationConfig) {
  var formData = {};
  var formAnswers = formSubmitObj.namedValues;

  runtimeLog(translationConfig);
  for (var propertyName in translationConfig) {
    runtimeLog(propertyName);

    formData[propertyName] = { originalValue: null, value: null };
    var propertyData = formData[propertyName];

    var translationInfo = translationConfig[propertyName];

    if(translationInfo.hasOwnProperty('staticValue')){
      var staticValue = translationInfo['staticValue'];

      propertyData.value = staticValue;
      propertyData.originalValue = staticValue;
      continue;
    }

    var formFieldName = translationInfo.title;
    if(!logErrorOnUndefined(formFieldName, ['Missing title in translation config:', propertyName])){continue;}

    var answerArrInForm = formAnswers[formFieldName];
    if(!logErrorOnUndefined(answerArrInForm, ['Missing answer in form:', propertyName, formFieldName])){continue;}

    answerArrInForm = answerArrInForm.filter(function(item) {return (item !== '');});

    //Answers are stored in first element of an array (always)
    var answerInForm = (answerArrInForm.length > 0) ? answerArrInForm[0] : '';
    propertyData.originalValue = answerInForm;

    if(translationInfo.hasOwnProperty('answers') &&
    (translationInfo.hasOwnProperty('multiple') && translationInfo.multiple == true)) {

      var splitedAnswers = answerInForm.split(', ');
      var translatedAnswers = [];

      //Translates batch answers to batch ids
      var answersTranslation = translationInfo.answers;
      for (var i = 0; i < splitedAnswers.length; ++i) {

        var individualAnswer = splitedAnswers[i];

        var answerId = translateAnswerElseLog(translationInfo.answers, individualAnswer, propertyName);
        if(answerId == undefined) {continue;}

        translatedAnswers.push(answerId);

      }

      propertyData.value = translatedAnswers;

    }
    else if(translationInfo.hasOwnProperty('answers')){

      var answerId = translateAnswerElseLog(translationInfo.answers, answerInForm, propertyName);
      if(answerId == undefined) {continue;}

      propertyData.value = answerId;

    }
    else {
      propertyData.value = answerInForm;
    }

  }

  return formData;
}

///
// Old functions that are not used anymore but might be usesful at some point in the future
///
function getAnswerFromSubmitObj(formSubmitObj, questionTranslationConfig){
  var titleTranslation = questionTranslationConfig['Title'];
  var answerFromFormSubmit = formSubmitObj.namedValues[titleTranslation][0];

  return answerFromFormSubmit;
}

function getAnswerIdFromSubmitObj(formSubmitObj, questionTranslationConfig){
  var answerFromSubmit = getAnswerFromSubmitObj(formSubmitObj, questionTranslationConfig);
  var answerId = questionTranslationConfig['Answers'][answerFromSubmit];

  return answerId;
}
