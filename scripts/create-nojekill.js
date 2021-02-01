const path = require('path');
const fs = require('fs');
const filePath = path.resolve(process.cwd(), 'docs', '.nojekyll');

fs.writeFile(filePath, '', (err) => {
    if (err) throw err;
    console.log('The file ".nojekyll" has been created');
});
