const fs = require('fs');
const path = require('path');
(function() {
  const NODE_MODULES = path.join(__dirname, '../node_modules');
  // remove browser declaration in tesseract.js/package.json, to fix vite's resolver always loading browser version issue.
  const tesseractjs_package_json = path.join(NODE_MODULES, 'tesseract.js/package.json');
  if(fs.existsSync(tesseractjs_package_json)) {
    fs.writeFileSync(tesseractjs_package_json, fs.readFileSync(tesseractjs_package_json, {encoding: 'utf-8'}).replace(/"browser":\s*{\s*"[^"]+": "[^"]+"\s*},/, ''), {encoding: 'utf-8'});
  }
  const tesseractjs_defaultOptions_js = path.join(NODE_MODULES, 'tesseract.js/src/worker/node/defaultOptions.js');
  if(fs.existsSync(tesseractjs_defaultOptions_js)) {
    fs.writeFileSync(tesseractjs_defaultOptions_js, fs.readFileSync(tesseractjs_defaultOptions_js, {encoding: 'utf-8'}).replace(/workerPath:[^\r\n]+/, `workerPath: ${JSON.stringify(path.join(NODE_MODULES, 'tesseract.js/src/worker-script/node/index.js'))}`), {encoding: 'utf-8'});
  }
}());
