const path = require('path');
const https = require('https');
const sharp = require('sharp');

const TARGET_ID = 'indicadores-processo';
const DASHBOARD_IMAGE_URL = 'https://images.unsplash.com/photo-1559223607-b0f2c487d937?w=1600&q=80';

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return resolve(downloadImage(response.headers.location));
        }

        if (response.statusCode !== 200) {
          return reject(new Error(`Falha ao baixar imagem: ${url} (status ${response.statusCode})`));
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function createTextSVG(title) {
  return Buffer.from(`<svg width="1200" height="675">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0.18"/>
        <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.55"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#grad)" />
    <rect x="0" y="582" width="1200" height="12" fill="#f1c40f" />
    <text x="50%" y="330" font-family="Arial, sans-serif" font-size="62" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${title}</text>
    <text x="50%" y="540" font-family="Arial, sans-serif" font-size="30" fill="#e8e8e8" text-anchor="middle" dominant-baseline="middle">Riccourses - Online Education</text>
  </svg>`);
}

async function main() {
  const outputPath = path.join(__dirname, '..', 'public', 'img', 'capas_exclusivas', `${TARGET_ID}.jpg`);
  const imageBuffer = await downloadImage(DASHBOARD_IMAGE_URL);
  const overlay = createTextSVG('Indicadores de Processo');

  await sharp(imageBuffer)
    .resize(1200, 675, { fit: 'cover', position: 'attention' })
    .composite([{ input: overlay }])
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  console.log(`Capa atualizada: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
