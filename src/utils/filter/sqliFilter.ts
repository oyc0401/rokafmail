export function sqlinjectionFilter(str: string) {
  let cleanSQL = str.replace(/--/g, '');
  cleanSQL = cleanSQL.replace(/\/\*/g, '').replace(/\*\//g, '');
  cleanSQL = cleanSQL.replace(/--/g, '');
  cleanSQL = cleanSQL.replace(/\/\//g, '');
  cleanSQL = cleanSQL.replace(/or ''/g, '').replace(/or ''/g, '');
  cleanSQL = cleanSQL.replace(/or 1=1/g, '').replace(/OR 1=1/g, '');
  cleanSQL = cleanSQL.replace(/${/g, '');

  return cleanSQL;
}