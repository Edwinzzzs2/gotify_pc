const path = require('path');
const { rcedit } = require('rcedit');

module.exports = async function(context) {
  if (context.electronPlatformName === 'win32') {
    const appName = context.packager.appInfo.productFilename;
    const exePath = path.join(context.appOutDir, `${appName}.exe`);
    const iconPath = path.join(context.packager.projectDir, 'build', 'defaultapp.ico');
    
    console.log(`Manually patching executable icon: ${exePath} -> ${iconPath}`);
    try {
      await rcedit(exePath, {
        icon: iconPath
      });
      console.log('Successfully updated executable icon');
    } catch (error) {
      console.error('Failed to update executable icon', error);
      throw error;
    }
  }
};
