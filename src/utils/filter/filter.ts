import xss from 'xss';
import SqlString from 'sqlstring'
import { sqlinjectionFilter } from './sqliFilter';

export function filter(dirtyMessage: string) {

  let cleanHTML = xss(dirtyMessage);

  let cleanSQL = sqlinjectionFilter(cleanHTML);

  let clean = xss(cleanSQL);

  return clean;
}


export function attackValidate(str: string) {
  const filteredString = filter(str);

  return str == filteredString;
}