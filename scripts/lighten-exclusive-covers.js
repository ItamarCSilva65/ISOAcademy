const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const coversDir = path.join(projectRoot, 'public', 'img', 'capas_exclusivas');

const parsePercentArg = (argName, fallbackValue) => {
  const rawArg = process.argv.find((entry) => entry.startsWith(`${argName}=`));
  if (!rawArg) return fallbackValue;
  const parsed = Number(rawArg.split('=')[1]);
  return Number.isFinite(parsed) ? parsed : fallbackValue;
};

const brightnessPercent = parsePercentArg('--brightness', 5);
const saturationPercent = parsePercentArg('--saturation', 5);

const brightnessFactor = 1 + brightnessPercent / 100;
const saturationFactor = 1 + saturationPercent / 100;

const now = new Date();
const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
const backupDir = path.join(projectRoot, 'public', 'img', `capas_exclusivas_backup_${stamp}`);

const isImage = (fileName) => /\.(jpg|jpeg|png)$/i.test(fileName);

async function ensureBackup(files) {
  fs.mkdirSync(backupDir, { recursive: true });

  for (const fileName of files) {
    const src = path.join(coversDir, fileName);
    const dst = path.join(backupDir, fileName);
    fs.copyFileSync(src, dst);
  }
}

async function processFile(fileName) {
  const filePath = path.join(coversDir, fileName);
  const parsed = path.parse(filePath);
  const tempPath = path.join(parsed.dir, `${parsed.name}.tmp${parsed.ext}`);
  const image = sharp(filePath, { failOn: 'none' });

  const buffer = await image
    .modulate({
      brightness: brightnessFactor,
      saturation: saturationFactor
    })
    .gamma(1.08)
    .linear(1.06, 0)
    .sharpen({
      sigma: 0.7,
      m1: 0.8,
      m2: 2,
      x1: 2,
      y2: 10,
      y3: 20
    })
    .toBuffer();

  await sharp(buffer).toFile(tempPath);
  fs.renameSync(tempPath, filePath);
}

async function main() {
  if (!fs.existsSync(coversDir)) {
    throw new Error(`Pasta não encontrada: ${coversDir}`);
  }

  const files = fs.readdirSync(coversDir).filter(isImage);

  if (!files.length) {
    console.log('Nenhuma imagem encontrada para processar.');
    return;
  }

  await ensureBackup(files);

  let successCount = 0;
  for (const fileName of files) {
    try {
      await processFile(fileName);
      successCount += 1;
      console.log(`OK: ${fileName}`);
    } catch (error) {
      console.error(`ERRO: ${fileName} -> ${error.message}`);
    }
  }

  console.log('----------------------------------------');
  console.log(`Imagens processadas: ${successCount}/${files.length}`);
  console.log(`Ajuste aplicado: brilho ${brightnessPercent > 0 ? '+' : ''}${brightnessPercent}% | saturação ${saturationPercent > 0 ? '+' : ''}${saturationPercent}%`);
  console.log(`Backup criado em: ${backupDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
