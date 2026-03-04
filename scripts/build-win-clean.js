const { execSync } = require("node:child_process");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = path.join(projectRoot, "dist-installer", stamp);

function run(command) {
  execSync(command, { cwd: projectRoot, stdio: "inherit" });
}

function stopInstallerProcesses() {
  const command = "taskkill /IM GotifyClient.exe /F > $null 2>&1; $targets = Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -and ($_.ExecutablePath -like '*\\\\dist\\\\win-unpacked\\\\*' -or $_.ExecutablePath -like '*\\\\dist-repack\\\\*' -or $_.ExecutablePath -like '*\\\\dist-installer\\\\*') }; if ($targets) { $targets | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } }";
  run(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${command}"`);
}

stopInstallerProcesses();
run("npm run build:assets");
run("node scripts/prepare-icon.js");
run(`npx electron-builder --win --config.directories.output="${outputDir.replace(/\\/g, "\\\\")}"`);
console.log(`Installer output: ${outputDir}`);
