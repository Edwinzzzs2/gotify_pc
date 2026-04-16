const fs = require('fs');

const target = 'd:/code/github/gotify_pc/tauri-app/src/styles.css';
let css = fs.readFileSync(target, 'utf8');
const newVars = fs.readFileSync('d:/code/github/gotify_pc/tmp_vars.css', 'utf8');

const varsBlockRegex = /:root\s*\{[\s\S]*?\}\s*:root\[data-theme="black"\]\s*\{[\s\S]*?\}/m;
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
  { val: 'rgba\\(0,\\s*0,\\s*0,\\s*0\\.1\\)', color: 'var(--shadow-color)' },
  { val: 'rgba\\(0,\\s*0,\\s*0,\\s*0\\.42\\)', color: 'var(--modal-overlay)', bg: 'var(--modal-overlay)' },
  { val: 'rgba\\(0,\\s*0,\\s*0,\\s*0\\.08\\)', color: 'var(--shadow-color)' },
];

const toastColorMap = [
  { val: '#f0f6ff', bg: 'var(--feishu-toast-code-bg)' },
  { val: '#d0e2ff', border: 'var(--feishu-toast-code-border)' },
  { val: '#e3edff', bg: 'var(--feishu-toast-code-hover)' },
];

for (const m of colorMap.concat(toastColorMap)) {
  if (m.bg) {
    const re = new RegExp('(\\bbackground(-color)?\\s*:\\s*)' + m.val + '([^;}]*)', 'gi');
    css = css.replace(re, '$1' + m.bg + '$3');
  }
  if (m.color) {
    const re = new RegExp('(\\bcolor\\s*:\\s*)' + m.val + '([^;}]*)', 'gi');
    css = css.replace(re, '$1' + m.color + '$2');
  }
  if (m.border) {
    const re = new RegExp('(\\bborder(-[a-z]+)?\\s*:[^;}]*)' + m.val + '([^;}]*)', 'gi');
    css = css.replace(re, '$1' + m.border + '$3');
  }
  if (m.val.includes('rgba')) {
    const re = new RegExp('(\\bbox-shadow\\s*:[^;}]*)' + m.val + '([^;}]*)', 'gi');
    css = css.replace(re, '$1' + m.color + '$2');
  }
}

css = css.replace(/background:\s*transparent\s+!important/g, 'background: transparent !important');

// Fix toast blocks specifically
css = css.replace(/:root\[data-theme="black"\]\s*\.feishu-toast[\s\S]*?\}\s*/g, '');
css = css.replace(/:root\[data-theme="black"\]\s*\.toast-window-mode\s*\{\s*background:\s*transparent;\s*\}\s*/g, '');
css = css.replace(/\.feishu-toast\s*\{\s*\n\s*display:\s*grid;/g, '.feishu-toast {\n  background: var(--feishu-toast-bg);\n  border: 1px solid var(--border);\n  box-shadow: 0 4px 12px var(--shadow-color);\n  color: var(--text);\n  display: grid;');
css = css.replace(/background:\s*var\(--panel\);\s*\n\s*box-shadow/g, 'background: var(--feishu-toast-bg);\n  box-shadow');

fs.writeFileSync(target, css);
console.log('Fixed css perfectly!');
