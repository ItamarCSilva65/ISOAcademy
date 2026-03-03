const fs = require('fs');
const path = require('path');

const courses = require('../data/coursesData');

const outDir = path.join(__dirname, '..', 'public', 'img', 'courses');
fs.mkdirSync(outDir, { recursive: true });

const palettes = [
  ['#0B2A4A', '#1E6A8A'],
  ['#1E293B', '#2563EB'],
  ['#0F172A', '#0EA5E9'],
  ['#1F2937', '#14B8A6'],
  ['#111827', '#06B6D4'],
  ['#1E1B4B', '#4F46E5'],
  ['#164E63', '#0EA5E9'],
  ['#3F3F46', '#0F766E'],
  ['#172554', '#0369A1'],
  ['#083344', '#0E7490']
];

const categoryTag = {
  auditoria_interna: 'AUDITORIA INTERNA',
  auditoria_lider: 'AUDITORIA LÍDER',
  implantacao_normas: 'IMPLANTAÇÃO',
  introducao_normas: 'INTRODUÇÃO',
  qualidade_melhoria: 'QUALIDADE',
  gestao_projetos: 'PROJETOS',
  saude_seguranca: 'SAÚDE E SEGURANÇA',
  laboratorios_metrologia: 'LABORATÓRIO',
  compliance_antissuborno: 'COMPLIANCE',
  gestao_processos: 'PROCESSOS',
  gestao_riscos: 'RISCOS',
  normas_iso: 'NORMAS ISO',
  gestao_organizacional: 'GESTÃO'
};

function hash(input) {
  let value = 0;
  for (let i = 0; i < input.length; i += 1) {
    value = ((value << 5) - value) + input.charCodeAt(i);
    value |= 0;
  }
  return Math.abs(value);
}

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(text, max = 54) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function toLine2(title) {
  const words = title.split(' ');
  if (words.length < 6) return '';
  const half = Math.ceil(words.length / 2);
  return words.slice(half).join(' ');
}

function createCover(course) {
  const title = course.nome?.pt || course.id;
  const subtitle = course.titulo_completo?.pt || '';
  const tag = categoryTag[course.categoria] || 'CURSO';

  const colorIndex = hash(course.id) % palettes.length;
  const [c1, c2] = palettes[colorIndex];

  const firstLine = truncate(title, 42);
  const secondLine = truncate(toLine2(title), 42);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="1030" cy="96" r="220" fill="#ffffff" fill-opacity="0.09"/>
  <circle cx="930" cy="640" r="210" fill="#ffffff" fill-opacity="0.08"/>

  <rect x="64" y="64" width="1072" height="547" rx="24" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.25"/>

  <rect x="104" y="102" width="280" height="52" rx="26" fill="#ffffff" fill-opacity="0.18"/>
  <text x="244" y="136" fill="#E6F8FF" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" text-anchor="middle">${esc(tag)}</text>

  <text x="104" y="258" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="800">${esc(firstLine)}</text>
  ${secondLine ? `<text x="104" y="328" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="60" font-weight="700">${esc(secondLine)}</text>` : ''}

  <text x="104" y="414" fill="#D7F3FF" font-family="Arial, Helvetica, sans-serif" font-size="33" font-weight="500">${esc(truncate(subtitle, 72))}</text>

  <rect x="104" y="458" width="992" height="2" fill="#ffffff" fill-opacity="0.35"/>

  <text x="104" y="540" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">ISOAcademy</text>
  <text x="104" y="578" fill="#D7F3FF" font-family="Arial, Helvetica, sans-serif" font-size="24">Especialização em Normas e Sistemas de Gestão</text>

  <text x="1096" y="578" fill="#D7F3FF" font-family="Arial, Helvetica, sans-serif" font-size="22" text-anchor="end">${esc(course.id)}</text>
</svg>`;
}

const newCourses = courses.filter((course) => !course.id.startsWith('iso-'));

newCourses.forEach((course) => {
  const content = createCover(course);
  const target = path.join(outDir, `${course.id}.svg`);
  fs.writeFileSync(target, content, 'utf8');
});

console.log(`Generated ${newCourses.length} course covers at ${outDir}`);
