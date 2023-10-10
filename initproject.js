import cp from 'child_process';
import path from 'path';

const APP_NAME_TOKEN = '{{APP_NAME}}';
const APP_NAME = path.basename(process.cwd());

// replace occurrences of app name token
console.log(`Setting app name as ${APP_NAME}...`);
cp.execSync(`LC_ALL=C find . -type f ! -name "initproject.js" -exec sed -i '' s/${APP_NAME_TOKEN}/${APP_NAME}/g {} +`);
// TODO use template to replace README.md contents w/app-specific info
// install deps
console.log(`Installing dependencies, this may take some time...`);
cp.execSync('yarn install');
// initialize git repo
console.log(`Initializing new git repo...`);
cp.execSync('git init');
