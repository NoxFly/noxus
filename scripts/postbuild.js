const fs = require('fs');
const path = require('path');

function uniqueDocBlocks(filepath) {
    if(!fs.existsSync(filepath)) {
        return;
    }

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

const distDir = path.join(__dirname, '../dist');

for(const filename of fs.readdirSync(distDir)) {
    if(filename.endsWith('.d.ts') || filename.endsWith('.d.mts')) {
        uniqueDocBlocks(path.join(distDir, filename));
    }
}
