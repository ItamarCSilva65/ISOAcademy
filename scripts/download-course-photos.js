const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
let sharp = null;
try {
  sharp = require('sharp');
} catch {
  sharp = null;
}

const courses = require('../data/coursesData');
const freeCourses = require('../data/cursos_gratuitosData');

const COURSE_THEME_BY_ID = {
  'iso-9001': 'Equipe de gestão da qualidade analisando indicadores de desempenho em ambiente industrial',
  'iso-14001': 'Profissionais de sustentabilidade avaliando impactos ambientais na operação da empresa',
  'iso-45001': 'Especialistas em segurança ocupacional orientando trabalhadores na área produtiva',
  'iso-13485': 'Time técnico de dispositivos médicos revisando controle de qualidade regulatória',
  'iso-17025': 'Analistas de laboratório conduzindo calibração com rastreabilidade metrológica',
  'iso-19011': 'Auditores internos estruturando plano de auditoria com evidências documentais',
  'iso-31000': 'Comitê corporativo discutindo matriz de risco e tomada de decisão estratégica',

  'curso-5s': 'Colaboradores organizando estação de trabalho com disciplina e padronização visual',
  'curso-8d': 'Equipe multidisciplinar resolvendo problema crítico em sala de melhoria contínua',
  'curso-apr': 'Profissionais avaliando perigos operacionais antes do início da atividade de campo',

  'auditor-interno-9001': 'Auditor interno verificando conformidade de processos de qualidade no escritório',
  'auditor-interno-13485': 'Auditor da qualidade médica revisando registros técnicos de produção controlada',
  'auditor-interno-14001': 'Auditor ambiental avaliando práticas de conformidade legal em planta industrial',
  'auditor-interno-17025': 'Auditor laboratorial examinando procedimentos de ensaio e calibração',
  'auditor-interno-22001': 'Auditor de segurança de alimentos validando controles operacionais na fábrica',
  'auditor-interno-37001': 'Auditor de compliance verificando controles antissuborno em reunião corporativa',
  'auditor-interno-45001': 'Auditor de saúde ocupacional avaliando prevenção de acidentes no chão de fábrica',

  'auditor-lider-9001': 'Auditor líder conduzindo reunião de abertura com gestores da qualidade',
  'auditor-lider-14001': 'Auditor líder orientando equipe sobre desempenho ambiental e governança',
  'auditor-lider-13485': 'Auditor líder avaliando sistema da qualidade para produtos médicos',
  'auditor-lider-17025': 'Auditor líder revisando competência técnica com profissionais de laboratório',
  'auditor-lider-22001': 'Auditor líder coordenando avaliação de segurança de alimentos em operação',
  'auditor-lider-31000': 'Auditor líder conduzindo análise de maturidade da gestão de riscos corporativos',
  'auditor-lider-37001': 'Auditor líder supervisionando investigação de integridade e controles éticos',

  'boas-praticas-auditoria': 'Profissionais praticando entrevista de auditoria com registro de achados objetivos',
  'cep-controle-estatistico-processo': 'Engenheiros de processo analisando cartas de controle com dados reais',
  'indicadores-processo': 'Gestores monitorando painel de indicadores para melhorar desempenho operacional',
  'formacao-equipes': 'Líder facilitando desenvolvimento de equipe de alta performance na empresa',
  'gerenciamento-projetos': 'Gerente de projetos acompanhando cronograma, custos e entregas com o time',
  'nao-conformidade-processo': 'Analistas da qualidade tratando não conformidade com ação corretiva estruturada',

  'implantacao-37001': 'Equipe de compliance implantando política antissuborno e controles internos',
  'implantacao-9001': 'Consultores implantando sistema de gestão da qualidade com foco em processos',
  'implantacao-13485': 'Especialistas implantando requisitos de qualidade para dispositivos médicos',
  'implantacao-14001': 'Equipe técnica implantando práticas de gestão ambiental na indústria',
  'implantacao-17025': 'Profissionais implantando requisitos técnicos em laboratório de calibração',
  'implantacao-22001': 'Equipe implantando sistema de segurança de alimentos na linha produtiva',
  'implantacao-31000': 'Gestores implantando processo corporativo de avaliação e tratamento de riscos',
  'implantacao-45001': 'Equipe de segurança implantando controles preventivos no ambiente ocupacional',

  'contexto-organizacao': 'Gestores analisando contexto organizacional e expectativas de partes interessadas',
  'gestao-processos': 'Profissionais mapeando fluxo de processos para elevar eficiência operacional',
  'desvendando-pmbok': 'Equipe de projetos aplicando práticas do PMBOK em planejamento estruturado',
  'ferramentas-qualidade': 'Analistas aplicando ferramentas da qualidade para priorização de melhorias',
  'curso-fmea': 'Engenheiros conduzindo FMEA para prevenir modos de falha no processo',
  'incerteza-medicao': 'Metrologistas calculando incerteza de medição com instrumentos de precisão',
  'introducao-14300-1-2': 'Participantes em treinamento introdutório sobre requisitos normativos setoriais',
  'introducao-22001': 'Profissionais em capacitação inicial sobre fundamentos de segurança de alimentos',
  'introducao-37001': 'Colaboradores estudando princípios de integridade e prevenção de suborno',
  'mapeamento-processo': 'Time operacional desenhando mapa de processo ponta a ponta na empresa',
  'matrizes-swot-pestel': 'Equipe estratégica aplicando matrizes SWOT e PESTEL para análise de cenário',
  'curso-ppra': 'Técnicos de segurança avaliando riscos ambientais em área de trabalho',

  'free-nao-conformidades': 'Profissionais iniciando treinamento gratuito sobre tratamento de não conformidades',
  'free-auditoria-interna': 'Profissionais participando de introdução gratuita à auditoria interna'
};

const FALLBACK_KEYWORDS_BY_CATEGORY = {
  normas_iso: 'quality,manager,team,industry,workplace',
  auditoria_interna: 'internal,audit,office,professionals,compliance',
  auditoria_lider: 'lead,auditor,meeting,boardroom,professionals',
  implantacao_normas: 'implementation,project,team,company,workflow',
  introducao_normas: 'corporate,training,classroom,professionals,learning',
  qualidade_melhoria: 'quality,improvement,engineer,process,factory',
  gestao_projetos: 'project,manager,planning,office,teamwork',
  saude_seguranca: 'occupational,safety,engineer,industry,workers',
  laboratorios_metrologia: 'laboratory,technician,measurement,instrument,calibration',
  compliance_antissuborno: 'compliance,ethics,corporate,meeting,professionals',
  gestao_processos: 'process,mapping,operations,business,team',
  gestao_riscos: 'risk,assessment,corporate,analysis,team',
  gestao_organizacional: 'business,professionals,office,strategy,team'
};

const PHOTO_KEYWORDS_BY_ID = {
  'iso-9001': 'quality,management,team,factory,kpi',
  'iso-14001': 'environmental,management,professionals,industry,sustainability',
  'iso-45001': 'occupational,safety,team,factory,ppe',
  'iso-13485': 'medical,quality,engineers,regulated,manufacturing',
  'iso-17025': 'laboratory,calibration,scientist,instrument,precision',
  'iso-19011': 'audit,planning,checklist,office,professionals',
  'iso-31000': 'risk,committee,analysis,corporate,meeting',
  'curso-5s': 'workplace,organization,lean,factory,team',
  'curso-8d': 'problem,solving,team,meeting,analysis',
  'curso-apr': 'risk,assessment,safety,field,professionals',
  'auditor-interno-9001': 'internal,auditor,quality,documents,office',
  'auditor-interno-13485': 'medical,auditor,quality,records,compliance',
  'auditor-interno-14001': 'environmental,auditor,industry,compliance,inspection',
  'auditor-interno-17025': 'laboratory,auditor,testing,calibration,records',
  'auditor-interno-22001': 'food,safety,auditor,factory,inspection',
  'auditor-interno-37001': 'compliance,auditor,ethics,corporate,controls',
  'auditor-interno-45001': 'safety,auditor,industry,workers,inspection',
  'auditor-lider-9001': 'lead,auditor,quality,meeting,managers',
  'auditor-lider-14001': 'lead,auditor,environmental,governance,team',
  'auditor-lider-13485': 'lead,auditor,medical,quality,team',
  'auditor-lider-17025': 'lead,auditor,laboratory,technical,team',
  'auditor-lider-22001': 'lead,auditor,food,safety,operation',
  'auditor-lider-31000': 'lead,auditor,risk,maturity,corporate',
  'auditor-lider-37001': 'lead,auditor,integrity,compliance,meeting',
  'boas-praticas-auditoria': 'audit,interview,evidence,notes,professionals',
  'cep-controle-estatistico-processo': 'statistical,process,control,engineer,data',
  'indicadores-processo': 'dashboard,kpi,operations,managers,analysis',
  'formacao-equipes': 'leadership,team,development,workplace,training',
  'gerenciamento-projetos': 'project,management,schedule,cost,team',
  'nao-conformidade-processo': 'quality,nonconformity,corrective,action,team',
  'implantacao-37001': 'compliance,implementation,policy,corporate,team',
  'implantacao-9001': 'quality,implementation,process,consulting,team',
  'implantacao-13485': 'medical,quality,implementation,regulatory,team',
  'implantacao-14001': 'environmental,implementation,industry,sustainability,team',
  'implantacao-17025': 'laboratory,implementation,technical,calibration,team',
  'implantacao-22001': 'food,safety,implementation,production,team',
  'implantacao-31000': 'risk,implementation,corporate,framework,team',
  'implantacao-45001': 'safety,implementation,occupational,industry,team',
  'contexto-organizacao': 'strategic,analysis,stakeholders,business,meeting',
  'gestao-processos': 'process,mapping,business,operations,professionals',
  'desvendando-pmbok': 'project,framework,planning,team,office',
  'ferramentas-qualidade': 'quality,tools,analysis,improvement,engineers',
  'curso-fmea': 'fmea,engineering,failure,analysis,risk',
  'incerteza-medicao': 'metrology,measurement,uncertainty,laboratory,scientist',
  'introducao-14300-1-2': 'training,standards,classroom,professionals,learning',
  'introducao-22001': 'food,safety,training,professionals,introduction',
  'introducao-37001': 'compliance,ethics,training,corporate,introduction',
  'mapeamento-processo': 'process,map,workflow,operations,team',
  'matrizes-swot-pestel': 'swot,pestel,strategy,analysis,executives',
  'curso-ppra': 'occupational,risk,prevention,safety,industry',
  'free-nao-conformidades': 'free,training,quality,nonconformity,professionals',
  'free-auditoria-interna': 'free,training,internal,audit,office'
};

function hash(input) {
  let value = 0;
  for (let i = 0; i < input.length; i += 1) {
    value = ((value << 5) - value) + input.charCodeAt(i);
    value |= 0;
  }
  return Math.abs(value);
}

function inferFreeCategory(freeCourse) {
  if (freeCourse.id.includes('auditoria')) return 'auditoria_interna';
  if (freeCourse.id.includes('conformidade')) return 'qualidade_melhoria';
  return 'introducao_normas';
}

function normalizeFreeCourse(freeCourse) {
  return {
    id: freeCourse.id,
    categoria: inferFreeCategory(freeCourse)
  };
}

function sanitizeKeywords(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z,\-]/g, '')
    .replace(/,+/g, ',')
    .replace(/^,|,$/g, '');
}

function buildPhotoSourceUrl(course, attempt = 0) {
  const keywords = sanitizeKeywords(
    PHOTO_KEYWORDS_BY_ID[course.id]
      || FALLBACK_KEYWORDS_BY_CATEGORY[course.categoria]
      || FALLBACK_KEYWORDS_BY_CATEGORY.gestao_organizacional
  );
  // Add an attempt offset to ensure different locks if we retry
  const lock = (hash(`${course.id}-${attempt}`) % 1000) + 1 + (attempt * 1000);
  return `https://loremflickr.com/1600/900/${keywords}/all?lock=${lock}`;
}

function contentHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function diversifyBuffer(buffer, courseId, attempt) {
  if (!sharp) return buffer;

  const base = hash(`${courseId}-${attempt}`);
  const left = base % 20;
  const top = Math.floor(base / 7) % 12;
  const saturation = 1 + (((base % 9) - 4) / 100);
  const brightness = 1 + (((base % 7) - 3) / 100);

  return sharp(buffer)
    .resize(1620, 920, { fit: 'cover' })
    .extract({ left, top, width: 1600, height: 900 })
    .modulate({ saturation, brightness })
    .jpeg({ quality: 90 })
    .toBuffer();
}

function requestBuffer(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 6) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }

    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'ISOAcademy-Cover-Downloader/1.0'
      }
    }, (res) => {
      const code = res.statusCode || 0;

      if ([301, 302, 303, 307, 308].includes(code) && res.headers.location) {
        const location = new URL(res.headers.location, url).toString();
        res.resume();
        requestBuffer(location, redirectCount + 1).then(resolve).catch(reject);
        return;
      }

      if (code < 200 || code >= 300) {
        res.resume();
        reject(new Error(`Request failed (${code}) for ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
  });
}

async function main() {
  const force = process.argv.includes('--force');
  const photosDir = path.join(__dirname, '..', 'public', 'img', 'courses', 'photos');
  fs.mkdirSync(photosDir, { recursive: true });

  const allCourses = [
    ...courses,
    ...freeCourses.map(normalizeFreeCourse)
  ];

  let downloaded = 0;
  let skipped = 0;
  const usedHashes = new Set();

  for (const course of allCourses) {
    const targetPath = path.join(photosDir, `${course.id}.jpg`);

    if (!force && fs.existsSync(targetPath)) {
      const existingBuffer = fs.readFileSync(targetPath);
      usedHashes.add(contentHash(existingBuffer));
      skipped += 1;
      continue;
    }

    let saved = false;
    for (let attempt = 0; attempt < 25; attempt += 1) {
      const imageUrl = buildPhotoSourceUrl(course, attempt);

      try {
        const buffer = await requestBuffer(imageUrl);
        let finalBuffer = buffer;
        let bufferHash = contentHash(finalBuffer);

        if (usedHashes.has(bufferHash)) {
          if (attempt < 20) {
            console.log(`[Duplicate image fetched] retrying for ${course.id}... (attempt ${attempt + 1})`);
            continue; // fetched a duplicate, retry immediately from web
          }
          finalBuffer = await diversifyBuffer(buffer, course.id, attempt);
          bufferHash = contentHash(finalBuffer);
        }

        if (!usedHashes.has(bufferHash)) {
          fs.writeFileSync(targetPath, finalBuffer);
          usedHashes.add(bufferHash);
          downloaded += 1;
          saved = true;
          console.log(`Downloaded: ${course.id}.jpg <- ${imageUrl}`);
          break;
        }
      } catch {
        // tenta nova variação
      }
    }

    if (!saved) {
      console.error(`Failed: ${course.id} -> não foi possível obter imagem única após múltiplas tentativas.`);
      process.exitCode = 1;
    }
  }

  console.log(`Done. Downloaded: ${downloaded}. Skipped: ${skipped}. Total: ${allCourses.length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
