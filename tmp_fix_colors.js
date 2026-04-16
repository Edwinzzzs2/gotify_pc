const fs = require('fs');
const path = require('path');

const target = 'd:/code/github/gotify_pc/tauri-app/src/styles.css';
let css = fs.readFileSync(target, 'utf8');

// First replace the old variables with new standardized variables for both light and dark modes
const varsBlockRegex = /(:root\s*\{[\s\S]*?\})\s*(:root\[data-theme="black"\]\s*\{[\s\S]*?\})/m;

const newVars = `:root {
  --bg: #f8fbff;
  --panel: #ffffff;
  --card: #ffffff;
  --card-hover: #fafafa;
  --card-hover-alt: #f5f5f5;
  --input: #ffffff;
  --border: #e0e0e0;
  --border-light: #f0f0f0;
  --text: #333333;
  --text-soft: #555555;
  --text-muted: #888888;
  --text-disabled: #aaaaaa;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --btn-primary-text: #ffffff;
  --success-color: #22c55e;
  --success-bg: #e9fbf2;
  --success-text: #157347;
  --danger-border: #ffcccc;
  --danger-bg: #fff1f0;
  --danger-text: #ff4d4f;
  --modal-overlay: rgba(0, 0, 0, 0.42);
  --shadow-color: rgba(0,0,0,0.1);
  --feishu-toast-bg: #ffffff;
  --feishu-toast-hover: #fafafa;
  --feishu-toast-group-bg: #f5f5f5;
  --feishu-toast-code-bg: #f0f6ff;
  --feishu-toast-code-border: #d0e2ff;
  --feishu-toast-code-hover: #e3edff;
}

:root[data-theme="black"] {
  --bg: #0b111a;
  --panel: #162031;
  --card: #182436;
  --card-hover: #1e2c41;
  --card-hover-alt: #23344d;
  --input: #0f1622;
  --border: #2d3c54;
  --border-light: #233045;
  --text: #e2e8f0;
  --text-soft: #94a3b8;
  --text-muted: #64748b;
  --text-disabled: #475569;
  --primary: #3b82f6;
  --primary-hover: #60a5fa;
  --btn-primary-text: #ffffff;
  --success-color: #22c55e;
  --success-bg: #0f3521;
  --success-text: #6ee7b7;
  --danger-border: #7f1d1d;
  --danger-bg: #450a0a;
  --danger-text: #fca5a5;
  --modal-overlay: rgba(0, 0, 0, 0.7);
  --shadow-color: rgba(0,0,0,0.6);
  --feishu-toast-bg: #1e293b;
  --feishu-toast-hover: #334155;
  --feishu-toast-group-bg: #0f172a;
  --feishu-toast-code-bg: rgba(59, 130, 246, 0.1);
  --feishu-toast-code-border: #1e3a8a;
  --feishu-toast-code-hover: rgba(59, 130, 246, 0.2);
}`;

css = css.replace(varsBlockRegex, newVars);

// Now do precise replacements using regex
// For each property, replace the color with the variable
const colorMap = [
  { val: '#ffffff', bg: 'var(--panel)', color: 'var(--btn-primary-text)', border: 'var(--panel)' },
  { val: '#333333', color: 'var(--text)', border: 'var(--border)' },
  { val: '#555555', color: 'var(--text-soft)' },
  { val: '#888888', color: 'var(--text-muted)' },
  { val: '#aaaaaa', color: 'var(--text-disabled)' },
  { val: '#e0e0e0', bg: 'var(--border)', border: 'var(--border)' },
  { val: '#f0f0f0', bg: 'var(--border-light)', border: 'var(--border-light)' },
  { val: '#fafafa', bg: 'var(--card-hover)' },
  { val: '#f5f5f5', bg: 'var(--card-hover-alt)' },
  { val: '#3b82f6', bg: 'var(--primary)', color: 'var(--primary)', border: 'var(--primary)' },
  { val: '#2563eb', bg: 'var(--primary-hover)', color: 'var(--primary-hover)' },
  { val: '#ffcccc', border: 'var(--danger-border)' },
  { val: '#fff1f0', bg: 'var(--danger-bg)' },
  { val: '#ff4d4f', color: 'var(--danger-text)' },
  { val: '#22c55e', bg: 'var(--success-color)', color: 'var(--success-color)' },
  { val: 'rgba\\(0,\\s*0,\\s*0,\\s*0\\.1\\)', color: 'var(--shadow-color)' },
  { val: 'rgba\\(0,\\s*0,\\s*0,\\s*0\\.42\\)', color: 'var(--modal-overlay)', bg: 'var(--modal-overlay)' },
  { val: 'rgba\\(0,\\s*0,\\s*0,\\s*0\\.08\\)', color: 'var(--shadow-color)' },
];

// Special toast colors
const toastColorMap = [
  { val: '#f0f6ff', bg: 'var(--feishu-toast-code-bg)' },
  { val: '#d0e2ff', border: 'var(--feishu-toast-code-border)' },
  { val: '#e3edff', bg: 'var(--feishu-toast-code-hover)' },
];

function doReplaces(cssStr) {
  let result = cssStr;
  
  // Replace backgrounds
  for (const m of colorMap.concat(toastColorMap)) {
    if (m.bg) {
      const re = new RegExp(\`(background(-color)?\\s*:\\s*)\` + m.val + \`(;?)\`, 'gi');
      result = result.replace(re, \`$1\` + m.bg + \`$3\`);
    }
    if (m.color) {
      const re = new RegExp(\`(color\\s*:\\s*)\` + m.val + \`(;?)\`, 'gi');
      result = result.replace(re, \`$1\` + m.color + \`$3\`);
    }
    if (m.border) {
      const re = new RegExp(\`(border(-[a-z]+)?\\s*:[^;}]*)\` + m.val + \`([^;}]*;?)\`, 'gi');
      result = result.replace(re, \`$1\` + m.border + \`$3\`);
    }
    // Handle box-shadow colors
    if (m.val.includes('rgba')) {
      const re = new RegExp(\`(box-shadow\\s*:[^;}]*)\` + m.val + \`([^;}]*;?)\`, 'gi');
      result = result.replace(re, \`$1\` + m.color + \`$3\`);
    }
  }

  // Handle some specific missing values:
  result = result.replace(/background:\\s*transparent\\s+!important/g, 'background: transparent !important');
  return result;
}

css = doReplaces(css);

// Remove specific rule block overrides for data-theme="black" at the end of the file
// since css variables now handle it automatically.
const feishuThemeBlock = /:root\\[data-theme="black"\\] \\.feishu-toast[\\s\\S]*?\\}\\s*/g;
css = css.replace(feishuThemeBlock, '');
const feishuThemeBlock2 = /:root\\[data-theme="black"\\] \\.toast-window-mode {\\s*background:\\s*transparent;\\s*}/g;
css = css.replace(feishuThemeBlock2, '');

// Also we should make feishu-toast use variables explicitly
css = css.replace('.feishu-toast {\\n  display: grid;', \`.feishu-toast {
  background: var(--feishu-toast-bg);
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px var(--shadow-color);
  color: var(--text);
  display: grid;\`);
css = css.replace(/background:\\s*var\\(--panel\\);\\s*box-shadow/g, 'background: var(--feishu-toast-bg);\n  box-shadow'); // Prevent double background replacing

// Write the fixed css back
fs.writeFileSync(target, css);
console.log('Fixed styles.css');
