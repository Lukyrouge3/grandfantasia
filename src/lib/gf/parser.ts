import fs from 'fs';
import iconv from 'iconv-lite';

export const gfParse = (path: string) => {
    const ini = iconv.decode(fs.readFileSync(path), 'win1252');
    const lines = ini.split("\|\r\n");
    if (!lines) throw new Error('No lines found in file');
    // lines.shift();
    return lines.map(convertFullWidthToAscii).map
    (line => line.split('|'));
}

export function convertFullWidthToAscii(numberString: string) {
    return numberString.replace(/[０-９]/g, function(match: string) {
        return String.fromCharCode(match.charCodeAt(0) - 65248);
    });
}