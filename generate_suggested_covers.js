const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const coursesData = require('./data/coursesData');
const freeCoursesData = require('./data/cursos_gratuitosData');

const allCourses = [...coursesData, ...freeCoursesData];

const IMAGES_BY_THEME = {
  'iso-9001': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80', // dashboard/process
  'iso-14001': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80', // environment
  'iso-45001': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80', // safety/factory
  'iso-13485': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80', // laboratory
  'iso-17025': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&q=80', // lab/calibration
  'iso-19011': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80', // audit/office
  'iso-31000': 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80', // risk/meeting
  'curso-5s': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', // organized office
  'curso-8d': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80', // team problem solving
  'curso-apr': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80', // field/safety
  'auditor-interno-9001': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80', // desk/documents
  'auditor-lider-9001': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80', // boardroom
  'contexto-organizacao': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80', // business strategy
  'gestao-processos': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80', // mapping operations
  'indicadores-processo': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', // analysis/dashboard
};

// Fallback image for workplace
const DEFAULT_WORKSPACE_IMG = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80';

const outDir = path.join(__dirname, 'public', 'img', 'sugestoes_capas');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(downloadImage(response.headers.location));
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to GET ${url}, status: ${response.statusCode}`));
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function createTextSVG(title) {
  return `
    <svg width="1200" height="675">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0.3"/>
          <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.8"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#grad)" />
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
        ${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </text>
    </svg>
  `;
}

async function main() {
  console.log('Gerando capas personalizadas com fotos de locais de trabalho...');
  let count = 0;
  for (const course of allCourses) {
    if (!course.id) continue;
    
    // Pick the most relevant image
    let imgUrl = DEFAULT_WORKSPACE_IMG;
    for (const [key, value] of Object.entries(IMAGES_BY_THEME)) {
      if (course.id.includes(key)) {
        imgUrl = value;
        break;
      }
    }

    try {
      console.log(`Baixando e processando capa para: ${course.id}...`);
      const imgBuffer = await downloadImage(imgUrl);
      
      const title = course.nome && course.nome.pt ? course.nome.pt : course.id;
      const svgBuffer = Buffer.from(createTextSVG(title));

      const finalPath = path.join(outDir, `${course.id}.jpg`);
      
      await sharp(imgBuffer)
        .resize(1200, 675, { fit: 'cover' })
        .composite([{ input: svgBuffer }])
        .jpeg({ quality: 90 })
        .toFile(finalPath);
        
      count++;
    } catch (err) {
      console.error(`Erro ao processar ${course.id}: ${err.message}`);
    }
    
    // Limit to exactly 5 generated covers so the user can quickly validate without waiting 10 minutes
    if (count >= 5) {
      console.log('--- 5 amostras geradas para validação inicial ---');
      break;
    }
  }
  console.log(`Pronto! As imagens foram salvas na pasta: ${outDir}`);
  console.log('Por favor, verifique as imagens e nos avise se estão aprovadas.');
}

main();
