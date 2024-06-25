export function xssFilter(str: string) {
  const patterns = [
    /<script.*?>.*?<\/script>/gi,    // Remove <script> tags and their content
    /<.*?on\w+.*?=.*?>/gi,           // Remove tags with event handlers
    /<.*?href\s*=\s*['"].*?javascript:.*?['"]/gi, // Remove href="javascript:"
    /<iframe.*?>.*?<\/iframe>/gi,    // Remove <iframe> tags and their content
    /<style.*?>.*?<\/style>/gi,      // Remove <style> tags and their content
    /<.*?style\s*=\s*['"].*?expression\(.*?['"]/gi, // Remove style="expression()"
    /<.*?style\s*=\s*['"].*?behaviour\s*:\s*url.*?['"]/gi, // Remove style="behaviour:url()"
    /<.*?formaction\s*=\s*['"].*?javascript:.*?['"]/gi, // Remove formaction="javascript:"
    /<.*?src\s*=\s*['"].*?javascript:.*?['"]/gi, // Remove src="javascript:"
    /<.*?src\s*=\s*['"].*?data:.*?['"]/gi, // Remove src="data:"
    /<.*?lowsrc\s*=\s*['"].*?javascript:.*?['"]/gi, // Remove lowsrc="javascript:"
    /<.*?data\s*=\s*['"].*?data:.*?['"]/gi, // Remove data="data:"
    /<.*?dynsrc\s*=\s*['"].*?javascript:.*?['"]/gi, // Remove dynsrc="javascript:"
    /<object.*?>.*?<\/object>/gi,    // Remove <object> tags and their content
    /<embed.*?>.*?<\/embed>/gi,      // Remove <embed> tags and their content
    /<applet.*?>.*?<\/applet>/gi,    // Remove <applet> tags and their content
    /<meta.*?>/gi,                   // Remove <meta> tags
    /<xml.*?>.*?<\/xml>/gi,          // Remove <xml> tags and their content
    /<base.*?>/gi,                   // Remove <base> tags
    /<img.*?>/gi,                    // Remove <img> tags
    /<svg.*?>.*?<\/svg>/gi,          // Remove <svg> tags and their content
    /<math.*?>.*?<\/math>/gi,        // Remove <math> tags and their content
    /<link.*?>/gi,                   // Remove <link> tags
    /<form.*?>.*?<\/form>/gi,        // Remove <form> tags and their content
    /<input.*?>/gi,                  // Remove <input> tags
    /<button.*?>.*?<\/button>/gi,    // Remove <button> tags and their content
    /<textarea.*?>.*?<\/textarea>/gi, // Remove <textarea> tags and their content
    /<select.*?>.*?<\/select>/gi,    // Remove <select> tags and their content
    /<option.*?>.*?<\/option>/gi,    // Remove <option> tags and their content
    /<iframe.*?>.*?<\/iframe>/gi,    // Remove <iframe> tags and their content
    /<frameset.*?>.*?<\/frameset>/gi,// Remove <frameset> tags and their content
    /<frame.*?>.*?<\/frame>/gi,      // Remove <frame> tags and their content
    /<noframes.*?>.*?<\/noframes>/gi,// Remove <noframes> tags and their content
    /<noscript.*?>.*?<\/noscript>/gi,// Remove <noscript> tags and their content
    /<embed.*?>/gi,                  // Remove <embed> tags
    /<applet.*?>/gi,                 // Remove <applet> tags
    /<object.*?>/gi,                 // Remove <object> tags
    /<audio.*?>/gi,                  // Remove <audio> tags
    /<video.*?>/gi,                  // Remove <video> tags
    /<base.*?>/gi,                   // Remove <base> tags
    /<marquee.*?>/gi,                // Remove <marquee> tags
    /<blink.*?>/gi,                  // Remove <blink> tags
    /<bgsound.*?>/gi,                // Remove <bgsound> tags
    /<isindex.*?>/gi,                // Remove <isindex> tags
    /<plaintext.*?>/gi,              // Remove <plaintext> tags
    /<template.*?>.*?<\/template>/gi,// Remove <template> tags and their content
    /<xmp.*?>.*?<\/xmp>/gi,          // Remove <xmp> tags and their content
    /<noembed.*?>.*?<\/noembed>/gi,  // Remove <noembed> tags and their content
    /<command.*?>/gi,                // Remove <command> tags
    /<keygen.*?>/gi,                 // Remove <keygen> tags
    /<track.*?>/gi,                  // Remove <track> tags
    /<datalist.*?>.*?<\/datalist>/gi,// Remove <datalist> tags and their content
    /<canvas.*?>.*?<\/canvas>/gi,    // Remove <canvas> tags and their content
    /<data.*?>.*?<\/data>/gi,        // Remove <data> tags and their content
    /<details.*?>.*?<\/details>/gi,  // Remove <details> tags and their content
    /<dialog.*?>.*?<\/dialog>/gi,    // Remove <dialog> tags and their content
    /<menu.*?>.*?<\/menu>/gi,        // Remove <menu> tags and their content
    /<menuitem.*?>.*?<\/menuitem>/gi,// Remove <menuitem> tags and their content
    /<meter.*?>.*?<\/meter>/gi,      // Remove <meter> tags and their content
    /<progress.*?>.*?<\/progress>/gi,// Remove <progress> tags and their content
    /<rp.*?>.*?<\/rp>/gi,            // Remove <rp> tags and their content
    /<rt.*?>.*?<\/rt>/gi,            // Remove <rt> tags and their content
    /<ruby.*?>.*?<\/ruby>/gi,        // Remove <ruby> tags and their content
    /<slot.*?>.*?<\/slot>/gi,        // Remove <slot> tags and their content
    /<summary.*?>.*?<\/summary>/gi,  // Remove <summary> tags and their content
    /<time.*?>.*?<\/time>/gi,        // Remove <time> tags and their content
    /<var.*?>.*?<\/var>/gi,          // Remove <var> tags and their content
    /<wbr.*?>.*?<\/wbr>/gi,          // Remove <wbr> tags and their content
    // /<.*?>/gi,                       // Remove all remaining HTML tags
    /on\w+\s*=\s*['"].*?['"]/gi,     // Remove any inline event handlers
    /javascript\s*:/gi,              // Remove javascript: protocols
    /data\s*:/gi                     // Remove data: protocols
  ];
  let clean = str;
  patterns.forEach(pattern => {
    clean = clean.replace(pattern, '');
  });


  clean = clean
    .replace(/<script>/g, '')
    .replace(/<a/g, '').replace(/<a>/g, '').replace(/<\/a>/g, '')
    .replace(/<link>/g, '')
    .replace(/<img>/g, '')
    .replace(/<h1>/g, '').replace(/<h2>/g, '').replace(/<h3>/g, '')
    .replace(/<\/h1>/g, '').replace(/<\/h2>/g, '').replace(/<\/h3>/g, '')
    .replace(/<p>/g, '').replace(/<body>/g, '').replace(/<html>/g, '').replace(/<div>/g, '')
    .replace(/\/p>/g, '').replace(/<\/body>/g, '').replace(/<\/html>/g, '').replace(/<\/div>/g, '')
    .replace(/<\/>/g, '')
    .replace(/<button>/g, '').replace(/onclick/g, '')
    .replace(/<\/button>/g, '')
    .replace(/alert\(/g, '').replace(/document\./g, '')
    .replace(/window\./g, '').replace(/findBy\./g, '')
    .replace(/${/g, '')
    // .replace(/function/g, '')

  return clean;

}