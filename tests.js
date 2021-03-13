function testEmail() {
  var subs = [{
    "var": "salutation",
    "value": "Mikael!!!"
}];
sendEmailMailerSend("bujnmi@gmail.com", subs, "pxkjn4172q4z7815")
}

function testSendAllEmails() {
  var values = SpreadsheetApp.getActiveSheet().getDataRange().getDisplayValues();

  for(n=1;n<values.length;++n){
    
    var email = values[n][0];
    if(email == ""){
          continue;
        }
    
    var salutation = values[n][1];
    var subs = [{
      "var": "salutation",
      "value": salutation
  }];
  var id = values[8][3];
  sendEmailMailerSend(email, subs, id);
}

}