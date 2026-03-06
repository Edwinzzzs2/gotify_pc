const path = require('path');
const fs = require('fs');
const { rcedit } = require('rcedit');

async function patchElectronIcon() {
  const electronPath = path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron.exe');
  const iconPath = path.join(__dirname, '..', 'build', 'defaultapp.ico');

  if (!fs.existsSync(electronPath)) {
    console.error('Electron executable not found at:', electronPath);
    return;
  }

  if (!fs.existsSync(iconPath)) {
    console.error('Icon not found at:', iconPath);
    // Try to generate it if missing (though prepare:icon should have run)
    return;
  }

  console.log('Patching development Electron icon...');
  // Copy electron.exe to a temp location to avoid permission issues if it's running
  const tempPath = path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron-patched.exe');
  
  try {
    fs.copyFileSync(electronPath, tempPath);
    await rcedit(tempPath, {
      icon: iconPath,
      'version-string': {
        'CompanyName': 'Gotify',
        'FileDescription': 'Gotify Client',
        'ProductName': 'Gotify Client',
        'OriginalFilename': 'GotifyClient.exe'
      }
    });
    // Move back
    // Ensure original is not running (though we should be running before it starts)
    // Wait a tiny bit to ensure file handles are released
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      try {
        const { execSync } = require('child_process');
        execSync('taskkill /IM electron.exe /F', { stdio: 'ignore' });
      } catch {}
      await new Promise(resolve => setTimeout(resolve, 1000));
      fs.copyFileSync(tempPath, electronPath);
    } catch (err) {
      if (err.code === 'EBUSY') {
        console.log('File busy, force killing electron processes and retrying...');
        try {
          const { execSync } = require('child_process');
          execSync('taskkill /IM electron.exe /F', { stdio: 'ignore' });
        } catch {}
        await new Promise(resolve => setTimeout(resolve, 1000));
        fs.copyFileSync(tempPath, electronPath);
      } else {
        throw err;
      }
    }
    fs.unlinkSync(tempPath);
    console.log('Successfully patched Electron executable icon for development.');
  } catch (error) {
    console.error('Failed to patch Electron icon:', error);
    // Try to cleanup
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch {}
    // Don't fail the build/start process just for this
  }
}

patchElectronIcon();
