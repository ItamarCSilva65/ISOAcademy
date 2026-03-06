const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '..', 'public', 'img', 'capas_exclusivas');

const now = new Date();
const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
const backupDir = path.join(__dirname, '..', 'public', 'img', `capas_exclusivas_backup_processo_${stamp}`);

const targets = [
  {
    id: 'gestao-processos',
    title: 'Gestão de Processos',
    candidates: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80'
    ]
  },
  {
    id: 'gerenciamento-projetos',
    title: 'Gerenciamento de Projetos',
    candidates: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80'
    ]
  }
];

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return resolve(downloadImage(response.headers.location));
        }

        if (response.statusCode !== 200) {
          return reject(new Error(`status ${response.statusCode}`));
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function createOverlay(title) {
  const escaped = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return Buffer.from(`<svg width="1200" height="675">
    <defs>
      <linearGradient id="grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0.40"/>
        <stop offset="60%" style="stop-color:rgb(0,0,0);stop-opacity:0.16"/>
        <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.05"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#grad)"/>
    <rect x="0" y="590" width="1200" height="10" fill="#f1c40f"/>
    <text x="52" y="554" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="#ffffff">${escaped}</text>
    <text x="52" y="608" font-family="Arial, sans-serif" font-size="24" fill="#f0f0f0">Riccourses - Online Education</text>
  </svg>`);
}

async function fetchFirstValid(candidates) {
  for (const url of candidates) {
    try {
      const buffer = await downloadImage(url);
      return { buffer, url };
    } catch (error) {
      console.log(`URL indisponível (${url}): ${error.message}`);
    }
  }

  throw new Error('Nenhuma URL disponível para este curso.');
}

function backupFile(fileName) {
  const source = path.join(outputDir, fileName);
  if (!fs.existsSync(source)) return;

  fs.mkdirSync(backupDir, { recursive: true });
  const target = path.join(backupDir, fileName);
  fs.copyFileSync(source, target);
}

async function updateTarget(target) {
  const fileName = `${target.id}.jpg`;
  const outputPath = path.join(outputDir, fileName);

  backupFile(fileName);

  const { buffer, url } = await fetchFirstValid(target.candidates);
  const overlay = createOverlay(target.title);

  await sharp(buffer)
    .resize(1200, 675, { fit: 'cover', position: 'attention' })
    .composite([{ input: overlay }])
    .jpeg({ quality: 93 })
    .toFile(outputPath);

  console.log(`Atualizada: ${target.id}.jpg`);
  console.log(`Imagem usada: ${url}`);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  for (const target of targets) {
    try {
      await updateTarget(target);
    } catch (error) {
      console.error(`Falha em ${target.id}: ${error.message}`);
    }
  }

  if (fs.existsSync(backupDir)) {
    console.log(`Backup salvo em: ${backupDir}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
