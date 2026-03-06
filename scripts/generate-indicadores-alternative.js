const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '..', 'public', 'img', 'capas_exclusivas');
const currentCover = path.join(outputDir, 'indicadores-processo.jpg');
const altCover = path.join(outputDir, 'indicadores-processo-alt.jpg');
const compareHtml = path.join(__dirname, '..', 'public', 'amostra_indicadores_comparativo.html');

const candidateUrls = [
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80'
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

function createMinimalOverlay() {
  return Buffer.from(`<svg width="1200" height="675">
    <defs>
      <linearGradient id="grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0.38"/>
        <stop offset="50%" style="stop-color:rgb(0,0,0);stop-opacity:0.12"/>
        <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.04"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#grad)" />
    <rect x="0" y="590" width="1200" height="10" fill="#f1c40f" />
    <text x="52" y="560" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">Indicadores de Processo</text>
    <text x="52" y="612" font-family="Arial, sans-serif" font-size="24" fill="#f0f0f0">Riccourses - Online Education</text>
  </svg>`);
}

async function fetchFirstValidImage() {
  for (const url of candidateUrls) {
    try {
      const buffer = await downloadImage(url);
      return { buffer, url };
    } catch (error) {
      console.log(`Tentativa falhou (${url}): ${error.message}`);
    }
  }

  throw new Error('Nenhuma URL de imagem retornou com sucesso.');
}

function writeComparisonPage() {
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Comparativo - Indicadores de Processo</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f5f7fa; color: #1f2937; }
    h1 { margin: 0 0 8px; }
    p { margin: 0 0 18px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .card { background: #fff; border: 1px solid #d1d5db; border-radius: 10px; overflow: hidden; }
    .card h2 { margin: 0; font-size: 16px; padding: 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
    .card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
    .note { padding: 10px 12px; font-size: 13px; color: #4b5563; }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <h1>Comparativo de capa — Indicadores de Processo</h1>
  <p>Escolha a versão que representa melhor “duas pessoas em sala + dashboard” com menos texto na arte.</p>
  <section class="grid">
    <article class="card">
      <h2>Versão Atual</h2>
      <img src="/img/capas_exclusivas/indicadores-processo.jpg" alt="Versão atual" />
      <div class="note">Arquivo: indicadores-processo.jpg</div>
    </article>
    <article class="card">
      <h2>Versão Alternativa</h2>
      <img src="/img/capas_exclusivas/indicadores-processo-alt.jpg" alt="Versão alternativa" />
      <div class="note">Arquivo: indicadores-processo-alt.jpg</div>
    </article>
  </section>
</body>
</html>`;

  fs.writeFileSync(compareHtml, html, 'utf8');
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const { buffer, url } = await fetchFirstValidImage();
  const overlay = createMinimalOverlay();

  await sharp(buffer)
    .resize(1200, 675, { fit: 'cover', position: 'attention' })
    .composite([{ input: overlay }])
    .jpeg({ quality: 93 })
    .toFile(altCover);

  if (!fs.existsSync(currentCover)) {
    console.warn('Aviso: capa atual não encontrada para comparativo.');
  }

  writeComparisonPage();

  console.log(`Imagem base usada: ${url}`);
  console.log(`Alternativa criada: ${altCover}`);
  console.log(`Comparativo gerado: ${compareHtml}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
