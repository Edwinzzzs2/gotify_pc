const { execSync } = require("node:child_process");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const repackOutputDir = path.join(projectRoot, "dist-repack", stamp);

function run(command) {
  execSync(command, { cwd: projectRoot, stdio: "inherit" });
}

function stopUnpackedProcesses() {
  const command = "taskkill /IM GotifyClient.exe /F > $null 2>&1; $targets = Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -and ($_.ExecutablePath -like '*\\\\dist\\\\win-unpacked\\\\*' -or $_.ExecutablePath -like '*\\\\dist-repack\\\\*') }; if ($targets) { $targets | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } }";
  run(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${command}"`);
}

stopUnpackedProcesses();
run("npm run build:assets");
run("node scripts/prepare-icon.js");
run(`npx electron-builder --dir --config.directories.output="${repackOutputDir.replace(/\\/g, "\\\\")}"`);
console.log(`Repack output: ${repackOutputDir}`);
