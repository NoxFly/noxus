const fs = require('fs');
const path = require('path');

const frameworkName = 'noxus';

function removeDuplicateCopyrights(filename) {
    const filepath = path.join(__dirname, '../dist/' + filename);
    const content = fs.readFileSync(filepath, 'utf8');

    const reg = /\/\*\*[\t ]*\n(?: \*.*\n)*? \* *@copyright.*\n(?: \*.*\n)*? \*\/\n?/gm;

    let first = true;
    const deduped = content.replace(reg, (match) => {
        if (first) {
            first = false;
            return match; // keep the first
        }
        return ''; // remove others
    });

    fs.writeFileSync(filepath, deduped);
}


removeDuplicateCopyrights(`${frameworkName}.d.mts`);
removeDuplicateCopyrights(`${frameworkName}.d.ts`);