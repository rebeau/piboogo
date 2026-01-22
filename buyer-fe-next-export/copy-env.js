// copy-env.js
const fs = require('fs');
const path = require('path');

const env = process.env.ENV;

if (!env) {
  console.error('ENV environment variable is not set');
  process.exit(1);
}

const envFile = `.env.${env}`;
const targetFile = '.env';

fs.copyFileSync(
  path.resolve(__dirname, envFile),
  path.resolve(__dirname, targetFile),
);
console.log(`Copied ${envFile} to ${targetFile}`);
