const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const coursesData = require('./data/coursesData');
const freeCoursesData = require('./data/cursos_gratuitosData');

const allCourses = [...coursesData, ...freeCoursesData];

// Banco de imagens definitivo escolhido a dedo, focado em operações/locais de trabalho reais (4K Unsplash)
const baseImages = {
  // As validadas
  '9001': 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80',   // Qualidade/Processos/Auditoria em campo
  '14001': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80', // Meio Ambiente/Sustentabilidade
  '13485': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80', // Médicos/Laboratórios Controlados
  '19011': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80', // Auditoria de Sistema (Mesa/Prancheta/Documentos)
  '45001': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80', // Segurança do Trabalho (EPIs em campo)
  
  // As novas expansões na mesma temática
  '17025': 'https://images.unsplash.com/photo-1582719478250-c89402bb73e9?w=1200&q=80', // Laboratório/Ciência (atualizado pois a antiga deu 404)
  '22001': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&q=80', // Segurança de Alimentos/Controle de Produção Alimentícia
  '31000': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',   // Riscos/Dashboard Tático
  '37001': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80', // Compliance/Antissuborno Corporativo
  'projetos': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80',// Projetos/Design/Mapeamento
  'gestao': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80', // Liderança/Formação de equipes
  'default': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80'  // Indústria genérica/Operacional
};

function getImgForCourse(id) {
  const nid = id.toLowerCase();
  if (nid.includes('14001') || nid.includes('ambiental') || nid.includes('14300')) return baseImages['14001'];
  if (nid.includes('13485')) return baseImages['13485'];
  if (nid.includes('45001') || nid.includes('apr') || nid.includes('ppra')) return baseImages['45001'];
  if (nid.includes('19011') || nid.includes('audito')) return baseImages['19011'];
  if (nid.includes('9001') || nid.includes('5s') || nid.includes('qualidade')) return baseImages['9001'];
  if (nid.includes('17025') || nid.includes('medicao') || nid.includes('cep')) return baseImages['17025'];
  if (nid.includes('22001') || nid.includes('alimento')) return baseImages['22001'];
  if (nid.includes('31000') || nid.includes('risco') || nid.includes('fmea') || nid.includes('nao-conformidade')) return baseImages['31000'];
  if (nid.includes('37001') || nid.includes('compliance')) return baseImages['37001'];
  if (nid.includes('projeto') || nid.includes('pmbok') || nid.includes('processo') || nid.includes('8d')) return baseImages['projetos'];
  if (nid.includes('equipes') || nid.includes('lider')) return baseImages['gestao'];
  return baseImages['default'];
}

const outDir = path.join(__dirname, 'public', 'img', 'todas_as_capas');
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
  console.log('--- Iniciando a geração definitiva de TODAS as capas da ISOAcademy ---');
  
  for (const course of allCourses) {
    if (!course || !course.id) continue;
    const courseId = course.id;
    let title = course.nome && course.nome.pt ? course.nome.pt : course.nome;
    if (!title || typeof title !== 'string') title = courseId; // fallback
    
    // Tratamentos de nomes grandes
    if (title.length > 55) {
        // Se couber, ok. O SVG escala razoavelmente
    }

    const imgUrl = getImgForCourse(courseId);

    try {
      console.log(`Buscando e processando: [${courseId}]...`);
      const imgBuffer = await downloadImage(imgUrl);
      
      const svgBuffer = Buffer.from(createTextSVG(title));
      
      // Vamos tentar usar jpg como definitivo para site (melhor compressão e qualidade pra foto)
      const finalPath = path.join(outDir, `${courseId}.jpg`);
      
      await sharp(imgBuffer)
        .resize(1200, 675, { fit: 'cover' })
        .composite([{ input: svgBuffer }])
        .jpeg({ quality: 90 })
        .toFile(finalPath);
        
    } catch (err) {
      console.error(`Erro ao processar ${courseId}: ${err.message}`);
    }
  }
  console.log(`\n✅ PRONTO! Todas as imagens (mais claras, nítidas e direcionadas) foram salvas em: ${outDir}`);
}

main();
