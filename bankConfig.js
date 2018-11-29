
// This just maps field names from form names to internal names (account statement json?)
function getBankConfig(){
  return {
    'Měna':"currency",
    'Protiúčet':'accountNumber',
    'Datum' : 'date',
    'VS' : 'variableSymbol',
    'ID pohybu' : 'transferId',
    'Objem': 'amount',
    'Upřesnění' : 'additionalInfo'
  }
}
