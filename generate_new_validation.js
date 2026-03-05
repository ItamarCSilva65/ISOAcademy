const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const coursesData = require('./data/coursesData');
const freeCoursesData = require('./data/cursos_gratuitosData');

const allCourses = [...coursesData, ...freeCoursesData];

// Análise criteriosa e rigorosa das URLs baseada nos temas solicitados
const IMAGES_BY_THEME = {
  'iso-9001': 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80', // Qualidade: Prancheta/Checklist de auditoria em operação logística/fábrica
  'iso-14001': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80', // Meio Ambiente: Painéis solares em ambiente natural
  'iso-13485': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80', // Dispositivos Médicos: Laboratório avançado médico
  'iso-19011': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80', // Auditoria 19011: Documentos, gráficos, mesa de projeto de auditoria
  'iso-45001': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80', // Saúde e Segurança Ocupacional (45001): Equipamento de proteção, prancheta de avaliação no campo
};

const TARGET_ISOS = ['iso-9001', 'iso-14001', 'iso-13485', 'iso-19011', 'iso-45001'];

const outDir = path.join(__dirname, 'public', 'img', 'novas_capas_validacao');

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
          <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0.25"/>
          <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.75"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#grad)" />
      <!-- Barra decorativa com a estampa da ISO -->
      <rect x="0" y="580" width="1200" height="15" fill="#f1c40f" />
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="70" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
        ${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </text>
      <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="34" font-weight="normal" fill="#cccccc" text-anchor="middle" dominant-baseline="middle">
        ISOAcademy
      </text>
    </svg>
  `;
}

async function main() {
  console.log('Gerando NOVAS AMOSTRAS SUPERIORES baseadas exatamente nos temas requisitados...');
  
  for (const courseId of TARGET_ISOS) {
    const imgUrl = IMAGES_BY_THEME[courseId];
    
    // Tentar resgatar o nome do banco de dados, senão colocar manual
    const course = allCourses.find(c => c.id === courseId);
    let title = course ? (course.nome && course.nome.pt ? course.nome.pt : course.nome) : null;
    
    // Fallbacks elegantes caso o ID no banco não bata ou não exista a property
    if (!title || typeof title !== 'string') {
      if (courseId === 'iso-9001') title = 'ISO 9001 Qualidade';
      if (courseId === 'iso-14001') title = 'ISO 14001 Ambiental';
      if (courseId === 'iso-13485') title = 'ISO 13485 Disp. Médicos';
      if (courseId === 'iso-19011') title = 'ISO 19011 Audit. de Sist. de Gestão';
      if (courseId === 'iso-45001') title = 'ISO 45001 Saúde e Segurança Ocup.';
    }

    try {
      console.log(`Baixando e processando capa para: ${title}...`);
      const imgBuffer = await downloadImage(imgUrl);
      
      const svgBuffer = Buffer.from(createTextSVG(title));

      const finalPath = path.join(outDir, `${courseId}.jpg`);
      
      await sharp(imgBuffer)
        .resize(1200, 675, { fit: 'cover' })
        .composite([{ input: svgBuffer }])
        .jpeg({ quality: 95 })
        .toFile(finalPath);
        
    } catch (err) {
      console.error(`Erro ao processar ${courseId}: ${err.message}`);
    }
  }
  console.log(`Pronto! As novas imagens foram salvas na pasta: ${outDir}`);
}

main();
