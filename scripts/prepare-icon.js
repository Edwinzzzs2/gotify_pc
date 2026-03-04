const fs = require("node:fs");
const path = require("node:path");
const pngToIco = require("png-to-ico");

async function run() {
  const projectRoot = path.resolve(__dirname, "..");
  const pngPath = path.join(projectRoot, "defaultapp.png");
  const buildDir = path.join(projectRoot, "build");
  const icoPath = path.join(buildDir, "defaultapp.ico");
  if (!fs.existsSync(pngPath)) {
    throw new Error(`Icon source not found: ${pngPath}`);
  }
  fs.mkdirSync(buildDir, { recursive: true });
  const icoBuffer = await pngToIco(pngPath);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`Prepared icon: ${icoPath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
