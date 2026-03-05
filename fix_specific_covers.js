const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const coursesData = require('./data/coursesData');
const freeCoursesData = require('./data/cursos_gratuitosData');
const allCourses = [...coursesData, ...freeCoursesData];

// Os cursos específicos que precisamos alterar:
const targets = {
    'auditor-interno-22001': 'https://images.unsplash.com/photo-1609819390597-783ccdfc2529?w=1200&q=80', // Food safety factory inspector
    'auditor-interno-9001': 'https://images.unsplash.com/photo-1702625835613-ad7fa6bb5194?w=1200&q=80', // Quality inspector factory
    'indicadores-processo': 'https://images.unsplash.com/photo-1559223607-b0f2c487d937?w=1200&q=80', // Dashboard analysis meeting two people
    'iso-9001': 'https://images.unsplash.com/photo-1764114908655-9a26d32750a0?w=1200&q=80', // Two engineers/workers on production line
    'matrizes-swot-pestel': 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=1200&q=80' // Strategy/SWOT Chart Business
};

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(downloadImage(response.headers.location));
      }
      if (response.statusCode !== 200) {
        return reject(new Error("Failed to GET " + url + ", status: " + response.statusCode));
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

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

async function main() {
  console.log('Aplicando os ajustes pontuais solicitados...');
  const outDir = path.join(__dirname, 'public', 'img', 'capas_exclusivas');
  
  for (const [courseId, imgUrl] of Object.entries(targets)) {
      const course = allCourses.find(c => c.id === courseId);
      if (!course) {
        console.log(`Curso ${courseId} não achado.`); continue;
      }
      let title = course.nome && course.nome.pt ? course.nome.pt : course.nome;
      if (!title || typeof title !== 'string') title = courseId;
      
      try {
        console.log(`Refazendo imagem para ${courseId}...`);
        const imgBuffer = await downloadImage(imgUrl);
        const svgBuffer = Buffer.from(createTextSVG(title));
        
        const finalPath = path.join(outDir, courseId + ".jpg");
        
        await sharp(imgBuffer)
          .resize(1200, 675, { fit: 'cover' })
          .composite([{ input: svgBuffer }])
          .jpeg({ quality: 90 })
          .toFile(finalPath);
          
        console.log(`-> ${courseId} ajustado com sucesso!`);
      } catch (err) {
        console.error(`Erro em ${courseId}`, err.message);
      }
  }
}

main();