//MANUÁL
//Tady se všechno konfiguruje - položky formuláře, termíny turnusů, ceny jednotlivých položek. 
//Kdykoliv změníš nějakou kolonku ve formuláři, musíš ji změnit i tady. Jinak to přestane pracovat. Názvy kolonek ve formuláři se musí PŘESNĚ shodovat s jejich pojmenováním tady.


function getFormIdConfig(){
    return {
        "uniqueQuestionFormIdTest":{
            "en":"NotImplemented",
            "cz":"Jméno",
        },
    };
}

function getTranslationConfig(formID){
    var translateObj =
    {
        "cz":{
			"timestamp":{
                "title":"Časová značka",
            },
            "registrationType":{
                "title":"Typ registrace",
            },
            "lengthOfStay":{
                "title":"Délka pobytu",
            },
            "section":{
                "title":"Sekce",
            },
            "food":{
                "title":"Volba jídla",
            },
            "name":{
                "title":"Jméno",
            },
            "surname":{
                "title":"Příjmení",
            },
            "email":{
                "title":"Email",
            },
            "phone":{
                "title":"Telefon",
            },
            "sex":{
                "title":"Pohlaví",
            },
            "street":{
                "title":"Ulice a č.p.",
            },
            "city":{
                "title":"Město",
            },
            "postalCode":{
                "title":"PSČ",
            },
            "city":{
                "title":"Město",
            },
            "birthDate":{
                "title":"Datum narození",
            },
            "parish":{
                "title":"Vysokoškolské společenství",
            },
            "message":{
                "title":"Vzkaz organizátorům",
            },
        },
        "en":{},
    };

    return translateObj[formID];
}


function getPriceConfig(){
    return {
        "WeekFoodFull":1099,
        "WeekendFoodFull":899,
        "WeekNofoodFull":799,
        "WeekendNofoodFull":699,
        "WeekFoodFavored":899,
        "WeekendFoodFavored":699,
        "WeekNofoodFavored":699,
        "WeekendNofoodFavored":599,
        //"WeekFairTrade":1650,
        //"WeekendFairTrade":1430,
    };
}
