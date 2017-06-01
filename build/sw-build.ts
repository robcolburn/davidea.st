const swBuild = require('workbox-build');
import * as utils from '../server/build/utils';

const ROUTES = [/posts/, /tags/, /index/, /404/];

async function buildSW() {
  try {
    let fileDetails = await swBuild.getFileManifestEntries({
      globDirectory: './public',
      globPatterns: ['**\/*.{html,js,css,png,jpg}']
    });
    fileDetails = cleanRoutes(fileDetails);
    const detailsJSON = JSON.stringify(fileDetails);
    const template = await utils.readFile(__dirname + '/sw.txt');
    const replaced = template.replace('/** ::CACHED_ITEMS:: */', detailsJSON);
    await utils.writeFile(__dirname + '/sw.js', replaced);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function cleanRoutes(fileDetails: { url: string }[]) {
  return fileDetails.map(file => {
    const isMatch = ROUTES.some(rx => rx.test(file.url));
    if(isMatch) {
      file.url = file.url.replace('.html', '');
    }
    return file;
  });
}

try {
  buildSW();
} catch(e) {
  console.log(e);
}
