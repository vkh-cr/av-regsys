function testEmail() {
  var subs = {
    "salutation": "Mikael!!!"
};
  sendEmailSendGrid("bujnmi@gmail.com", subs, "d-a5e5fba642d649449c3c745d5e56744f")
}

function testSendAllEmails() {
  var values = SpreadsheetApp.getActiveSheet().getDataRange().getDisplayValues();

  for(n=0;n<values.length;++n){
    
    var email = values[n][0];
    if(email == ""){
          continue;
        }
    
    var salutation = values[n][1];
    var subs = {
        "salutation": salutation
    };
    sendEmailSendGrid(email, subs, "d-a5e5fba642d649449c3c745d5e56744f");
}

}