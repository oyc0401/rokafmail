export function sqlinjectionFilter(str: string) {
  let cleanSQL = str;

  const patterns = [
    /--/g,            // Single line comment
    /\/\*/g,          // Block comment start
    /\*\//g,          // Block comment end
    /\/\//g,          // Another single line comment style
    // /'/g,             // Single quote
    // /"/g,             // Double quote
    // /;/g,             // Semicolon
    /OR\s+\d+=\d+/gi, // OR 1=1 pattern
    /UNION\s+SELECT/gi, // UNION SELECT pattern
    /SELECT.*FROM/gi, // SELECT ... FROM pattern
    /INSERT\s+INTO/gi, // INSERT INTO pattern
    /UPDATE\s+\w+\s+SET/gi, // UPDATE ... SET pattern
    /DELETE\s+FROM/gi, // DELETE FROM pattern
    /DROP\s+TABLE/gi, // DROP TABLE pattern
    /EXEC\s+/gi,       // EXEC command (executing commands)
    /XP_/gi,           // XP_ commands (common in MSSQL)
    /SP_/gi,           // SP_ commands (common in MSSQL)
    /;--/g,            // Comment and semicolon
    /--\s*$/g,         // End of line comment
    /%00/g,            // Null byte
    /\bOR\b.*\b=\b.*\bOR\b/gi, // Complex OR patterns
    /\bAND\b.*\b=\b.*\bAND\b/gi // Complex AND patterns
  ];

  patterns.forEach(pattern => {
    cleanSQL = cleanSQL.replace(pattern, '');
  });


  cleanSQL = cleanSQL
    .replace(/--/g, '')
    .replace(/\/\*/g, '').replace(/\*\//g, '')
    .replace(/\/\//g, '')
    .replace(/or ''/g, '').replace(/or ''/g, '')
    .replace(/or 1=1/g, '').replace(/OR 1=1/g, '')
    .replace(/select /g, '').replace(/OR 1=1/g, '')

  
  return cleanSQL;
}