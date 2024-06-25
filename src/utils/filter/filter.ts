import xss from 'xss';
import SqlString from 'sqlstring'

export function filter(dirtyMessage: string) {

  let cleanHTML = xss(dirtyMessage);


  let cleanSQL = cleanHTML.replace(/--/g, '');
  cleanSQL = cleanSQL.replace(/\/\*/g, '').replace(/\*\//g, '');
  cleanSQL = cleanSQL.replace(/--/g, '');
  cleanSQL = cleanSQL.replace(/\/\//g, '');

  let clean = xss(cleanSQL);

  return clean;
}


export function attackValidate(str:string) {
  const filteredString = filter(str);

  return str == filteredString;
}