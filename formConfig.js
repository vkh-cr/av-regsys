//MANUÁL
//Tady se všechno konfiguruje - položky formuláře, termíny turnusů, ceny jednotlivých položek.
//Kdykoliv změníš nějakou kolonku ve formuláři, musíš ji změnit i tady. Jinak to přestane pracovat. Názvy kolonek ve formuláři se musí PŘESNĚ shodovat s jejich pojmenováním tady.

function getTranslationConfig(formID){
  return {
    "timestamp":       { "title":"Timestamp" },
    "name":            { "title":"Jméno" },
    "surname":         { "title":"Příjmení" },
    "email":           { "title":"Email" },
    "birthYear":       { "title":"Rok narození" },
    "address":         { "title":"Adresa trvalého bydliště" },
    "roommate":        { "title":"Chi bydlet s" },
    "accommodation":   { "title":"Varianta ubytování" },
    "phone":           { "title":"Telefon" },
    "support":         { "title":"Dobrovolný příspěvek" },
    "note":            { "title":"Poznámka" },
    }
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
