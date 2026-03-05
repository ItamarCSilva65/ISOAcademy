const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const coursesData = require('./data/coursesData');
const courseId = 'iso-9001';

// Pegar as infos do curso
const course = coursesData.find(c => c.id === courseId);
const title = course.nome && course.nome.pt ? course.nome.pt : 'ISO 9001:2015';

function wrapText(text, maxLineLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + word).length > maxLineLength) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

function createTextSVG(title) {
  const cleanTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  const wrapLimit = title.length > 40 ? 28 : (title.length > 25 ? 32 : 40);
  const lines = wrapText(cleanTitle, wrapLimit);
  
  let fontSize = 42;
  if (lines.length === 1 && cleanTitle.length < 25) fontSize = 68;
  else if (lines.length === 1) fontSize = 56;
  else if (lines.length === 2) fontSize = 55;
  else if (lines.length === 3) fontSize = 48;
  
  const lineHeight = fontSize + 10;
  const totalTextHeight = lines.length * lineHeight;
  let startY = 320 - (totalTextHeight / 2) + (lineHeight / 2);

  const tspans = lines.map((line, index) => {
     return `<tspan x="50%" dy="${index === 0 ? 0 : lineHeight}">${line}</tspan>`;
  }).join('');

  return `<svg width="1200" height="675">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0.35"/>
          <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.90"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#grad)" />
      <rect x="0" y="580" width="1200" height="15" fill="#f1c40f" />
      <text x="50%" y="${startY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
        ${tspans}
      </text>
      <text x="50%" y="540" font-family="Arial, sans-serif" font-size="30" font-weight="normal" fill="#cccccc" text-anchor="middle" dominant-baseline="middle">
        Riccourses - Online Education
      </text>
    </svg>`;
}

async function fetchMetrologyImage() {
  // Query bem específica para calibração, metrologia e equipamentos precisos
  const res = await fetch('https://unsplash.com/napi/search/photos?query=precision+measurement+calibration+equipment+laboratory&per_page=15');
  const data = await res.json();
  const validPhotos = data.results.filter(photo => !photo.premium && !photo.is_premium);
  return validPhotos[0].urls.raw + '&w=1200&q=80';
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(downloadImage(response.headers.location));
      }
      if (response.statusCode !== 200) {
        return reject(new Error('Falhou!'));
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Recriando exclusivamente a capa para 9001 (Técnico de Metrologia)...');
  
  const outDir = path.join(__dirname, 'public', 'img', 'capas_exclusivas');
  
  try {
    const imgUrl = await fetchMetrologyImage();
    console.log('Imagem de metrologia mapeada:', imgUrl);
    
    const imgBuffer = await downloadImage(imgUrl);
    const svgBuffer = Buffer.from(createTextSVG(title));
    
    // O usuário mencionou ppng mas o padrao que adotamos aqui era jpg pra ficar limpo, vou garantir jpg e avisar.
    const finalPath = path.join(outDir, `${courseId}.jpg`);
    const finalPathPng = path.join(outDir, `${courseId}.png`);
    
    await sharp(imgBuffer)
      .resize(1200, 675, { fit: 'cover' })
      .composite([{ input: svgBuffer }])
      .jpeg({ quality: 90 })
      .toFile(finalPath);
      
    // Criar versão em PNG tb só pra garantir caso o sistema dele exija especificamente o .png
    await sharp(imgBuffer)
      .resize(1200, 675, { fit: 'cover' })
      .composite([{ input: svgBuffer }])
      .png({ quality: 90 })
      .toFile(finalPathPng);
      
    console.log(`Capa substituída com SUCESSO. Verifique na pasta ${outDir}`);
  } catch (e) {
    console.error('Erro:', e.message);
  }
}

main();
