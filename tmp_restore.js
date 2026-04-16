const fs = require('fs');

const target = 'd:/code/github/gotify_pc/tauri-app/src/styles.css';
let css = fs.readFileSync(target, 'utf8');
const newVars = fs.readFileSync('d:/code/github/gotify_pc/tmp_vars.css', 'utf8');

const varsBlockRegex = /:root\s*\{[\s\S]*?\}\s*:root\[data-theme="black"\]\s*\{[\s\S]*?\}/m;
css = css.replace(varsBlockRegex, newVars);

fs.writeFileSync(target, css);
console.log('Restored vars perfectly!');
