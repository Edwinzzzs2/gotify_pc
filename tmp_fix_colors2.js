const fs = require('fs');
const path = require('path');

const target = 'd:/code/github/gotify_pc/tauri-app/src/styles.css';
let css = fs.readFileSync(target, 'utf8');

// First replace the old variables with new standardized variables for both light and dark modes
const varsBlockRegex = /(:root\\s*\\{[\\s\\S]*?\\})\\s*(:root\\[data-theme="black"\\]\\s*\\{[\\s\\S]*?\\})/m;

const newVars = ":root {\\n\
  --bg: #f8fbff;\\n\
  --panel: #ffffff;\\n\
  --card: #ffffff;\\n\
  --card-hover: #fafafa;\\n\
  --card-hover-alt: #f5f5f5;\\n\
  --input: #ffffff;\\n\
  --border: #e0e0e0;\\n\
  --border-light: #f0f0f0;\\n\
  --text: #333333;\\n\
  --text-soft: #555555;\\n\
  --text-muted: #888888;\\n\
  --text-disabled: #aaaaaa;\\n\
  --primary: #3b82f6;\\n\
  --primary-hover: #2563eb;\\n\
  --btn-primary-text: #ffffff;\\n\
  --success-color: #22c55e;\\n\
  --success-bg: #e9fbf2;\\n\
  --success-text: #157347;\\n\
  --danger-border: #ffcccc;\\n\
  --danger-bg: #fff1f0;\\n\
  --danger-text: #ff4d4f;\\n\
  --modal-overlay: rgba(0, 0, 0, 0.42);\\n\
  --shadow-color: rgba(0,0,0,0.1);\\n\
  --feishu-toast-bg: #ffffff;\\n\
  --feishu-toast-hover: #fafafa;\\n\
  --feishu-toast-group-bg: #f5f5f5;\\n\
  --feishu-toast-code-bg: #f0f6ff;\\n\
  --feishu-toast-code-border: #d0e2ff;\\n\
  --feishu-toast-code-hover: #e3edff;\\n\
}\\n\
\\n\
:root[data-theme=\\"black\\"] {\\n\
  --bg: #0b111a;\\n\
  --panel: #162031;\\n\
  --card: #182436;\\n\
  --card-hover: #1e2c41;\\n\
  --card-hover-alt: #23344d;\\n\
  --input: #0f1622;\\n\
  --border: #2d3c54;\\n\
  --border-light: #233045;\\n\
  --text: #e2e8f0;\\n\
  --text-soft: #94a3b8;\\n\
  --text-muted: #64748b;\\n\
  --text-disabled: #475569;\\n\
  --primary: #3b82f6;\\n\
  --primary-hover: #60a5fa;\\n\
  --btn-primary-text: #ffffff;\\n\
  --success-color: #22c55e;\\n\
  --success-bg: #0f3521;\\n\
  --success-text: #6ee7b7;\\n\
  --danger-border: #7f1d1d;\\n\
  --danger-bg: #450a0a;\\n\
  --danger-text: #fca5a5;\\n\
  --modal-overlay: rgba(0, 0, 0, 0.7);\\n\
  --shadow-color: rgba(0,0,0,0.6);\\n\
  --feishu-toast-bg: #1e293b;\\n\
  --feishu-toast-hover: #334155;\\n\
  --feishu-toast-group-bg: #0f172a;\\n\
  --feishu-toast-code-bg: rgba(59, 130, 246, 0.1);\\n\
  --feishu-toast-code-border: #1e3a8a;\\n\
  --feishu-toast-code-hover: rgba(59, 130, 246, 0.2);\\n\
}";

css = css.replace(varsBlockRegex, newVars);

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
  { val: 'rgba\\\\(0,\\\\s*0,\\\\s*0,\\\\s*0\\\\.1\\\\)', color: 'var(--shadow-color)' },
  { val: 'rgba\\\\(0,\\\\s*0,\\\\s*0,\\\\s*0\\\\.42\\\\)', color: 'var(--modal-overlay)', bg: 'var(--modal-overlay)' },
  { val: 'rgba\\\\(0,\\\\s*0,\\\\s*0,\\\\s*0\\\\.08\\\\)', color: 'var(--shadow-color)' },
];

const toastColorMap = [
  { val: '#f0f6ff', bg: 'var(--feishu-toast-code-bg)' },
  { val: '#d0e2ff', border: 'var(--feishu-toast-code-border)' },
  { val: '#e3edff', bg: 'var(--feishu-toast-code-hover)' },
];

function doReplaces(cssStr) {
  let result = cssStr;
  
  for (const m of colorMap.concat(toastColorMap)) {
    if (m.bg) {
      const re = new RegExp("(background(-color)?\\\\s*:\\s*)" + m.val + "(;?)", 'gi');
      result = result.replace(re, "$1" + m.bg + "$3");
    }
    if (m.color) {
      const re = new RegExp("(color\\\\s*:\\s*)" + m.val + "(;?)", 'gi');
      result = result.replace(re, "$1" + m.color + "$3");
    }
    if (m.border) {
      const re = new RegExp("(border(-[a-z]+)?\\\\s*:[^;}]*)" + m.val + "([^;}]*;?)", 'gi');
      result = result.replace(re, "$1" + m.border + "$3");
    }
    if (m.val.includes('rgba')) {
      const re = new RegExp("(box-shadow\\\\s*:[^;}]*)" + m.val + "([^;}]*;?)", 'gi');
      result = result.replace(re, "$1" + m.color + "$3");
    }
  }

  result = result.replace(/background:\\s*transparent\\s+!important/g, 'background: transparent !important');
  return result;
}

css = doReplaces(css);

const feishuThemeBlock = /:root\\[data-theme="black"\\] \\.feishu-toast[\\s\\S]*?\\}\\s*/g;
css = css.replace(feishuThemeBlock, '');
const feishuThemeBlock2 = /:root\\[data-theme="black"\\] \\.toast-window-mode \\{\\s*background:\\s*transparent;\\s*\\}/g;
css = css.replace(feishuThemeBlock2, '');

css = css.replace(/\\.feishu-toast \\{\\n\\s*display: grid;/, ".feishu-toast {\\n  background: var(--feishu-toast-bg);\\n  border: 1px solid var(--border);\\n  box-shadow: 0 4px 12px var(--shadow-color);\\n  color: var(--text);\\n  display: grid;");
css = css.replace(/background:\\s*var\\(--panel\\);\\s*box-shadow/g, 'background: var(--feishu-toast-bg);\\n  box-shadow');

fs.writeFileSync(target, css);
console.log('Fixed styles.css');
