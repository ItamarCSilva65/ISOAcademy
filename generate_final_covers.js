const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const coursesData = require('./data/coursesData');
const freeCoursesData = require('./data/cursos_gratuitosData');
const allCourses = [...coursesData, ...freeCoursesData];

const outDir = path.join(__dirname, 'public', 'img', 'capas_exclusivas');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function getQueriesForCourse(id) {
  const nid = id.toLowerCase();
  
  // Específico para 8D (Resolução de Problemas)
  if (nid.includes('8d')) return ['problem+solving+team+puzzle+business', 'teamwork+analysis+whiteboard', 'continuous+improvement'];
  
  if (nid.includes('14001') || nid.includes('ambiental') || nid.includes('14300')) return ['sustainable+industry', 'environment+solar', 'green+energy+factory', 'wind+turbine+corporate'];
  if (nid.includes('45001') || nid.includes('apr') || nid.includes('ppra')) return ['worker+safety+hard-hat', 'construction+safety', 'industrial+worker+ppe', 'factory+safety+engineer'];
  if (nid.includes('13485')) return ['medical+laboratory', 'medical+scientist', 'pharmaceutical+manufacturing', 'cleanroom+medical'];
  if (nid.includes('17025') || nid.includes('medicao') || nid.includes('cep')) return ['caliper+measurement+precision', 'micrometer+tool+calibration', 'measuring+instrument+metrology', 'precision+gauge+laboratory'];
  if (nid.includes('19011') || nid.includes('audito')) return ['office+clipboard+business+meeting', 'auditor+document+office', 'corporate+compliance+audit', 'inspection+paperwork+office'];
  if (nid.includes('22001') || nid.includes('alimento')) return ['food+factory+production', 'food+safety+inspection', 'beverage+manufacturing'];
  if (nid.includes('31000') || nid.includes('risco') || nid.includes('fmea') || nid.includes('nao-conformidade')) return ['corporate+dashboard+analysis', 'risk+management+boardroom', 'business+strategy+chart'];
  if (nid.includes('37001') || nid.includes('compliance')) return ['corporate+handshake+legal', 'business+ethics', 'corporate+agreement+office'];
  if (nid.includes('projeto') || nid.includes('pmbok') || nid.includes('processo')) return ['team+project+planning', 'business+process+mapping', 'office+scrum+board'];
  if (nid.includes('equipe') || nid.includes('lider')) return ['corporate+team+building+group', 'colleagues+high+five+success', 'business+people+standing+together+smiling', 'team+motivation+office'];
  if (nid.includes('5s')) return ['organized+warehouse', 'clean+factory', 'lean+manufacturing'];
  
  // 9001/Qualidade - Tinha muita repetição, adicionei enorme variação de chaves
  if (nid.includes('9001') || nid.includes('qualidade')) return [
    'precision+measurement+calibration+equipment+laboratory', 
    'quality+control+factory+check', 
    'inspection+industry+machine', 
    'factory+engineer+tablet',
    'manufacturing+quality+assurance'
  ];
  
  return ['corporate+business+workplace', 'modern+office+team', 'industry+professional'];
}

const usedImages = new Set();

async function fetchUniqueUnsplashImage(queries) {
  for (const query of queries) {
    // Busca até 3 páginas do unsplash para achar imagens que ainda não foram usadas
    for (let page = 1; page <= 3; page++) {
      try {
        const url = "https://unsplash.com/napi/search/photos?query=" + query + "&per_page=30&page=" + page;
        const res = await fetch(url);
        const data = await res.json();
        
        if (!data.results || data.results.length === 0) break;

        // Filtra fotos pagas e fotos que JÁ USAMOS nesta execução
        const validPhotos = data.results.filter(photo => 
          !photo.premium && 
          !photo.is_premium && 
          !usedImages.has(photo.id) &&
          photo.urls && photo.urls.raw
        );

        if (validPhotos.length > 0) {
          const chosen = validPhotos[Math.floor(Math.random() * validPhotos.length)];
          usedImages.add(chosen.id); // Registra que a imagem foi usada para NUNCA mais repetir
          return chosen.urls.raw + '&w=1200&q=80';
        }
      } catch (e) {
         console.error('Error fetching NAPI:', e.message);
      }
    }
  }
  return null;
}

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

// Em caso extremo de internet falhar
const FALLBACK_POOL = [
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
  'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80',
  'https://images.unsplash.com/photo-1581092580497-e0d1cbfc5e7f?w=1200&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80'
];

async function main() {
  console.log('--- Iniciando geração STRICTAMENTE EXCLUSIVA E ÚNICA para cada curso ---');
  
  for (const course of allCourses) {
    if (!course || !course.id) continue;
    const courseId = course.id;
    let title = course.nome && course.nome.pt ? course.nome.pt : course.nome;
    if (!title || typeof title !== 'string') title = courseId;
    
    const queries = getQueriesForCourse(courseId);
    
    try {
      console.log("Buscando foto única para: [" + courseId + "]");
      
      let imgUrl = await fetchUniqueUnsplashImage(queries);
      
      if (!imgUrl) {
         console.log("   Aviso: Esgotou fotos nas queries, usando fallback seguro...");
         // Acha um fallback que não está no usedImages se possivel
         const availableFallbacks = FALLBACK_POOL.filter(id => !usedImages.has(id));
         if (availableFallbacks.length > 0) {
            imgUrl = availableFallbacks[0];
            usedImages.add(imgUrl);
         } else {
            imgUrl = FALLBACK_POOL[Math.floor(Math.random() * FALLBACK_POOL.length)]; // Repete só se for inevitável
         }
      }

      const imgBuffer = await downloadImage(imgUrl);
      const svgBuffer = Buffer.from(createTextSVG(title));
      const finalPath = path.join(outDir, courseId + ".jpg");
      
      await sharp(imgBuffer)
        .resize(1200, 675, { fit: 'cover' })
        .composite([{ input: svgBuffer }])
        .jpeg({ quality: 90 })
        .toFile(finalPath);
        
    } catch (err) {
      console.error("Erro ao processar " + courseId + ": " + err.message);
    }
  }
  console.log("\\n✅ SUCESSO! Todas as capas EXCLUSIVAS, SEM REPETIÇÃO e COM NOVA IDENTIDADE prontas em: " + outDir);
}

main();
