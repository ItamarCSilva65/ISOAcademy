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

const categoryPalettes = {
  normas_iso: ['#0B2A4A', '#1E40AF'],
  auditoria_interna: ['#0F172A', '#0369A1'],
  auditoria_lider: ['#111827', '#1D4ED8'],
  implantacao_normas: ['#14532D', '#0F766E'],
  introducao_normas: ['#1E3A8A', '#0EA5E9'],
  qualidade_melhoria: ['#1E293B', '#2563EB'],
  gestao_projetos: ['#312E81', '#4F46E5'],
  saude_seguranca: ['#7C2D12', '#EA580C'],
  laboratorios_metrologia: ['#0C4A6E', '#0284C7'],
  compliance_antissuborno: ['#3F1D0B', '#B45309'],
  gestao_processos: ['#164E63', '#0891B2'],
  gestao_riscos: ['#1E1B4B', '#4338CA'],
  gestao_organizacional: ['#334155', '#0F766E']
};

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

const COURSE_SCENES = {
  'iso-9001': { type: 'factoryAudit', label: 'Sistema de gestão da qualidade em ambiente produtivo' },
  'iso-14001': { type: 'envAudit', label: 'Gestão ambiental orientada por desempenho e conformidade' },
  'iso-45001': { type: 'safety', label: 'Gestão de saúde e segurança com prevenção de riscos ocupacionais' },
  'iso-13485': { type: 'medicalAudit', label: 'Qualidade e rastreabilidade para dispositivos médicos' },
  'iso-17025': { type: 'metrology', label: 'Competência técnica e confiabilidade metrológica em laboratório' },
  'iso-19011': { type: 'checklist', label: 'Diretrizes práticas para auditoria de sistemas de gestão' },
  'iso-31000': { type: 'riskBoard', label: 'Governança e gestão estratégica de riscos organizacionais' },

  'curso-5s': { type: 'factory', label: 'Organização e padronização no posto de trabalho' },
  'curso-8d': { type: 'warroom', label: 'Equipe estruturando solução definitiva de problema' },
  'curso-apr': { type: 'safety', label: 'Análise preliminar de riscos antes da execução' },

  'auditor-interno-9001': { type: 'officeAudit', label: 'Auditor interno avaliando processos de qualidade' },
  'auditor-interno-13485': { type: 'medicalAudit', label: 'Auditoria interna em ambiente regulado de saúde' },
  'auditor-interno-14001': { type: 'envAudit', label: 'Auditor avaliando requisitos de gestão ambiental' },
  'auditor-interno-17025': { type: 'labAudit', label: 'Auditoria interna em laboratório de ensaio e calibração' },
  'auditor-interno-22001': { type: 'foodAudit', label: 'Auditoria de segurança de alimentos em operação' },
  'auditor-interno-37001': { type: 'compliance', label: 'Auditoria de controles e integridade corporativa' },
  'auditor-interno-45001': { type: 'safety', label: 'Auditoria de saúde e segurança ocupacional' },

  'auditor-lider-9001': { type: 'factoryAudit', label: 'Auditor realizando auditoria em setor de produção' },
  'auditor-lider-14001': { type: 'envAudit', label: 'Auditor líder conduzindo avaliação ambiental estratégica' },
  'auditor-lider-13485': { type: 'medicalAudit', label: 'Auditor líder conduzindo auditoria em dispositivos médicos' },
  'auditor-lider-17025': { type: 'labAudit', label: 'Auditor líder conduzindo auditoria técnica de laboratório' },
  'auditor-lider-22001': { type: 'foodAudit', label: 'Auditor líder em planta de segurança de alimentos' },
  'auditor-lider-31000': { type: 'riskBoard', label: 'Liderança em governança e gestão de riscos corporativos' },
  'auditor-lider-37001': { type: 'compliance', label: 'Liderança em auditoria de sistema antissuborno' },

  'boas-praticas-auditoria': { type: 'checklist', label: 'Aplicação de boas práticas e evidências de auditoria' },
  'cep-controle-estatistico-processo': { type: 'chart', label: 'Controle estatístico e estabilidade de processo' },
  'indicadores-processo': { type: 'dashboard', label: 'Definição e gestão de indicadores de desempenho' },
  'formacao-equipes': { type: 'team', label: 'Desenvolvimento de equipes para alta performance' },
  'gerenciamento-projetos': { type: 'project', label: 'Planejamento e controle de projetos com entregas' },
  'nao-conformidade-processo': { type: 'checklist', label: 'Identificação e tratativa eficaz de não conformidades' },

  'implantacao-37001': { type: 'compliance', label: 'Implantação prática de controles antissuborno' },
  'implantacao-9001': { type: 'factory', label: 'Implantação de SGQ em processos produtivos' },
  'implantacao-13485': { type: 'medicalAudit', label: 'Implantação da qualidade no setor de dispositivos médicos' },
  'implantacao-14001': { type: 'envAudit', label: 'Implantação de práticas ambientais e conformidade legal' },
  'implantacao-17025': { type: 'metrology', label: 'Implantação técnica em laboratório e rastreabilidade' },
  'implantacao-22001': { type: 'foodPlant', label: 'Implantação de sistema de segurança de alimentos' },
  'implantacao-31000': { type: 'riskBoard', label: 'Implantação de gestão de riscos e governança' },
  'implantacao-45001': { type: 'safety', label: 'Implantação de segurança ocupacional no chão de fábrica' },

  'contexto-organizacao': { type: 'strategy', label: 'Leitura de cenário, contexto e partes interessadas' },
  'gestao-processos': { type: 'processMap', label: 'Modelagem e gestão de fluxos de processo' },
  'desvendando-pmbok': { type: 'project', label: 'Aplicação prática da estrutura do PMBOK' },
  'ferramentas-qualidade': { type: 'qualityTools', label: 'Ferramentas clássicas para melhoria contínua' },
  'curso-fmea': { type: 'riskBoard', label: 'Análise preventiva de falhas e seus efeitos' },
  'incerteza-medicao': { type: 'metrology', label: 'Cálculo e interpretação de incerteza de medição' },
  'introducao-14300-1-2': { type: 'training', label: 'Introdução orientada aos requisitos da norma' },
  'introducao-22001': { type: 'foodPlant', label: 'Fundamentos de segurança de alimentos' },
  'introducao-37001': { type: 'compliance', label: 'Fundamentos de sistema antissuborno' },
  'mapeamento-processo': { type: 'processMap', label: 'Mapeamento visual de fluxos ponta a ponta' },
  'matrizes-swot-pestel': { type: 'strategy', label: 'Análise estratégica com SWOT e PESTEL' },
  'curso-ppra': { type: 'safety', label: 'Prevenção de riscos ambientais no trabalho' }
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

function titleFontSize(line) {
  if (!line) return 66;
  if (line.length > 34) return 50;
  if (line.length > 28) return 56;
  return 64;
}

function levelLabel(level) {
  const labels = {
    basico: 'NÍVEL BÁSICO',
    intermediario: 'NÍVEL INTERMEDIÁRIO',
    avancado: 'NÍVEL AVANÇADO'
  };
  return labels[level] || 'FORMAÇÃO PROFISSIONAL';
}

function sceneSVG(type) {
  const basePanel = `<rect x="730" y="120" width="390" height="360" rx="20" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.25"/>`;

  const scenes = {
    factoryAudit: `${basePanel}
      <rect x="760" y="340" width="330" height="110" rx="10" fill="#DDF3FF" fill-opacity="0.18"/>
      <rect x="785" y="270" width="80" height="70" fill="#DDF3FF" fill-opacity="0.28"/>
      <rect x="875" y="240" width="85" height="100" fill="#DDF3FF" fill-opacity="0.28"/>
      <rect x="972" y="290" width="80" height="50" fill="#DDF3FF" fill-opacity="0.28"/>
      <rect x="795" y="186" width="86" height="64" rx="8" fill="#E9FAFF" fill-opacity="0.35"/>
      <line x1="810" y1="206" x2="865" y2="206" stroke="#C7F0FF" stroke-width="4"/>
      <line x1="810" y1="220" x2="855" y2="220" stroke="#C7F0FF" stroke-width="4"/>
      <circle cx="980" cy="205" r="32" fill="#E9FAFF" fill-opacity="0.30"/>
      <path d="M965 205L977 217L998 194" stroke="#C7F0FF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,

    officeAudit: `${basePanel}
      <rect x="768" y="326" width="310" height="110" rx="12" fill="#E9FAFF" fill-opacity="0.16"/>
      <rect x="804" y="190" width="130" height="96" rx="10" fill="#E9FAFF" fill-opacity="0.30"/>
      <rect x="956" y="190" width="94" height="64" rx="8" fill="#E9FAFF" fill-opacity="0.26"/>
      <line x1="820" y1="214" x2="915" y2="214" stroke="#D1F4FF" stroke-width="5"/>
      <line x1="820" y1="236" x2="900" y2="236" stroke="#D1F4FF" stroke-width="5"/>
      <line x1="820" y1="258" x2="880" y2="258" stroke="#D1F4FF" stroke-width="5"/>
      <circle cx="1002" cy="289" r="22" fill="#E9FAFF" fill-opacity="0.28"/>
      <rect x="988" y="307" width="28" height="42" rx="8" fill="#E9FAFF" fill-opacity="0.28"/>`,

    medicalAudit: `${basePanel}
      <rect x="760" y="344" width="330" height="100" rx="12" fill="#E8F8FF" fill-opacity="0.16"/>
      <circle cx="835" cy="226" r="45" fill="#E8F8FF" fill-opacity="0.30"/>
      <rect x="822" y="202" width="26" height="48" fill="#CFF3FF"/>
      <rect x="810" y="214" width="50" height="24" fill="#CFF3FF"/>
      <rect x="920" y="186" width="140" height="120" rx="10" fill="#E8F8FF" fill-opacity="0.26"/>
      <line x1="940" y1="218" x2="1038" y2="218" stroke="#CFF3FF" stroke-width="5"/>
      <line x1="940" y1="242" x2="1020" y2="242" stroke="#CFF3FF" stroke-width="5"/>
      <line x1="940" y1="266" x2="1000" y2="266" stroke="#CFF3FF" stroke-width="5"/>`,

    labAudit: `${basePanel}
      <rect x="768" y="350" width="320" height="86" rx="12" fill="#E9FAFF" fill-opacity="0.16"/>
      <path d="M840 192V252L804 310C798 319 804 332 816 332H864C876 332 882 319 876 310L840 252V192" fill="#D2F4FF" fill-opacity="0.35"/>
      <path d="M975 190V242L948 290C942 298 948 310 960 310H990C1002 310 1008 298 1002 290L975 242V190" fill="#D2F4FF" fill-opacity="0.35"/>
      <circle cx="1045" cy="248" r="34" fill="#D2F4FF" fill-opacity="0.28"/>
      <line x1="1031" y1="248" x2="1059" y2="248" stroke="#BFEFFF" stroke-width="6"/>
      <line x1="1045" y1="234" x2="1045" y2="262" stroke="#BFEFFF" stroke-width="6"/>`,

    envAudit: `${basePanel}
      <rect x="768" y="338" width="320" height="102" rx="12" fill="#E8FFE8" fill-opacity="0.17"/>
      <circle cx="832" cy="236" r="52" fill="#D6FDD6" fill-opacity="0.30"/>
      <path d="M832 204C852 204 868 220 868 240C868 272 832 298 832 298C832 298 796 272 796 240C796 220 812 204 832 204Z" fill="#BFF4C3" fill-opacity="0.76"/>
      <path d="M832 218V286" stroke="#93E3A1" stroke-width="6"/>
      <path d="M832 244C852 242 862 232 872 218" stroke="#93E3A1" stroke-width="5" stroke-linecap="round"/>
      <path d="M832 258C812 254 800 246 790 234" stroke="#93E3A1" stroke-width="5" stroke-linecap="round"/>
      <rect x="928" y="188" width="132" height="118" rx="10" fill="#D6FDD6" fill-opacity="0.24"/>
      <line x1="952" y1="222" x2="1036" y2="222" stroke="#B0EEBC" stroke-width="5"/>
      <line x1="952" y1="248" x2="1024" y2="248" stroke="#B0EEBC" stroke-width="5"/>
      <line x1="952" y1="274" x2="1008" y2="274" stroke="#B0EEBC" stroke-width="5"/>`,

    foodAudit: `${basePanel}
      <rect x="768" y="340" width="320" height="98" rx="12" fill="#ECFFEF" fill-opacity="0.16"/>
      <ellipse cx="840" cy="240" rx="46" ry="62" fill="#D9FCDD" fill-opacity="0.35"/>
      <ellipse cx="840" cy="255" rx="16" ry="26" fill="#C6F8CD" fill-opacity="0.6"/>
      <circle cx="954" cy="250" r="54" fill="#D9FCDD" fill-opacity="0.28"/>
      <path d="M954 220C965 220 975 230 975 241C975 260 954 280 954 280C954 280 933 260 933 241C933 230 943 220 954 220Z" fill="#C6F8CD" fill-opacity="0.7"/>
      <rect x="1020" y="190" width="42" height="120" rx="8" fill="#D9FCDD" fill-opacity="0.28"/>`,

    compliance: `${basePanel}
      <rect x="768" y="340" width="320" height="98" rx="12" fill="#FFF4E5" fill-opacity="0.16"/>
      <rect x="790" y="188" width="128" height="92" rx="10" fill="#FFE9C9" fill-opacity="0.28"/>
      <line x1="810" y1="212" x2="900" y2="212" stroke="#FFE3B4" stroke-width="5"/>
      <line x1="810" y1="236" x2="888" y2="236" stroke="#FFE3B4" stroke-width="5"/>
      <circle cx="1008" cy="236" r="52" fill="#FFE9C9" fill-opacity="0.28"/>
      <rect x="990" y="226" width="36" height="44" rx="8" fill="#FFDCA3" fill-opacity="0.8"/>
      <path d="M998 226V214C998 205 1004 198 1008 198C1012 198 1018 205 1018 214V226" stroke="#FFDCA3" stroke-width="6"/>`,

    safety: `${basePanel}
      <rect x="768" y="340" width="320" height="98" rx="12" fill="#FFF6E8" fill-opacity="0.16"/>
      <path d="M842 186L792 286H892L842 186Z" fill="#FFE7BD" fill-opacity="0.36"/>
      <rect x="832" y="224" width="20" height="36" fill="#FFDFA8"/>
      <rect x="832" y="266" width="20" height="20" fill="#FFDFA8"/>
      <rect x="942" y="198" width="120" height="86" rx="10" fill="#FFE7BD" fill-opacity="0.28"/>
      <line x1="962" y1="222" x2="1040" y2="222" stroke="#FFDFA8" stroke-width="5"/>
      <line x1="962" y1="246" x2="1024" y2="246" stroke="#FFDFA8" stroke-width="5"/>`,

    riskBoard: `${basePanel}
      <rect x="770" y="178" width="318" height="150" rx="12" fill="#E7EEFF" fill-opacity="0.30"/>
      <line x1="830" y1="178" x2="830" y2="328" stroke="#CFDAFF" stroke-width="4"/>
      <line x1="930" y1="178" x2="930" y2="328" stroke="#CFDAFF" stroke-width="4"/>
      <line x1="1030" y1="178" x2="1030" y2="328" stroke="#CFDAFF" stroke-width="4"/>
      <line x1="770" y1="228" x2="1088" y2="228" stroke="#CFDAFF" stroke-width="4"/>
      <line x1="770" y1="278" x2="1088" y2="278" stroke="#CFDAFF" stroke-width="4"/>
      <rect x="768" y="340" width="320" height="98" rx="12" fill="#E7EEFF" fill-opacity="0.16"/>
      <circle cx="840" cy="388" r="12" fill="#D2DEFF"/>
      <circle cx="896" cy="388" r="12" fill="#D2DEFF"/>
      <circle cx="952" cy="388" r="12" fill="#D2DEFF"/>`,

    processMap: `${basePanel}
      <rect x="780" y="190" width="90" height="52" rx="10" fill="#E5F8FF" fill-opacity="0.30"/>
      <rect x="930" y="190" width="120" height="52" rx="10" fill="#E5F8FF" fill-opacity="0.30"/>
      <rect x="855" y="282" width="150" height="52" rx="10" fill="#E5F8FF" fill-opacity="0.30"/>
      <path d="M870 216H930M995 242V282M930 308H855" stroke="#C9F1FF" stroke-width="6" stroke-linecap="round"/>
      <polygon points="922,210 940,216 922,222" fill="#C9F1FF"/>
      <polygon points="989,274 995,292 1001,274" fill="#C9F1FF"/>
      <polygon points="863,302 845,308 863,314" fill="#C9F1FF"/>
      <rect x="768" y="350" width="320" height="86" rx="12" fill="#E5F8FF" fill-opacity="0.16"/>`,

    chart: `${basePanel}
      <rect x="786" y="192" width="286" height="174" rx="12" fill="#EAF9FF" fill-opacity="0.28"/>
      <line x1="816" y1="334" x2="1038" y2="334" stroke="#CFEFFF" stroke-width="4"/>
      <line x1="816" y1="334" x2="816" y2="218" stroke="#CFEFFF" stroke-width="4"/>
      <polyline points="834,308 888,286 942,294 996,250 1030,262" fill="none" stroke="#B8E9FF" stroke-width="6"/>
      <circle cx="888" cy="286" r="6" fill="#B8E9FF"/>
      <circle cx="996" cy="250" r="6" fill="#B8E9FF"/>
      <rect x="768" y="380" width="320" height="56" rx="12" fill="#EAF9FF" fill-opacity="0.16"/>`,

    dashboard: `${basePanel}
      <rect x="786" y="194" width="286" height="172" rx="12" fill="#E7F5FF" fill-opacity="0.30"/>
      <rect x="808" y="216" width="120" height="58" rx="8" fill="#D4ECFF" fill-opacity="0.6"/>
      <rect x="944" y="216" width="106" height="58" rx="8" fill="#D4ECFF" fill-opacity="0.6"/>
      <rect x="808" y="286" width="242" height="58" rx="8" fill="#D4ECFF" fill-opacity="0.6"/>
      <rect x="768" y="380" width="320" height="56" rx="12" fill="#E7F5FF" fill-opacity="0.16"/>`,

    team: `${basePanel}
      <circle cx="840" cy="240" r="34" fill="#EAF8FF" fill-opacity="0.34"/>
      <circle cx="925" cy="220" r="30" fill="#EAF8FF" fill-opacity="0.28"/>
      <circle cx="1008" cy="240" r="34" fill="#EAF8FF" fill-opacity="0.34"/>
      <rect x="800" y="282" width="80" height="94" rx="14" fill="#EAF8FF" fill-opacity="0.24"/>
      <rect x="888" y="270" width="74" height="106" rx="14" fill="#EAF8FF" fill-opacity="0.22"/>
      <rect x="970" y="282" width="80" height="94" rx="14" fill="#EAF8FF" fill-opacity="0.24"/>
      <rect x="768" y="392" width="320" height="44" rx="12" fill="#EAF8FF" fill-opacity="0.16"/>`,

    project: `${basePanel}
      <rect x="790" y="188" width="280" height="178" rx="12" fill="#EAF7FF" fill-opacity="0.30"/>
      <line x1="820" y1="224" x2="1040" y2="224" stroke="#CFEFFF" stroke-width="4"/>
      <line x1="820" y1="264" x2="1040" y2="264" stroke="#CFEFFF" stroke-width="4"/>
      <line x1="820" y1="304" x2="1040" y2="304" stroke="#CFEFFF" stroke-width="4"/>
      <rect x="834" y="210" width="78" height="14" rx="7" fill="#BEE8FF"/>
      <rect x="912" y="250" width="104" height="14" rx="7" fill="#BEE8FF"/>
      <rect x="860" y="290" width="154" height="14" rx="7" fill="#BEE8FF"/>
      <rect x="768" y="380" width="320" height="56" rx="12" fill="#EAF7FF" fill-opacity="0.16"/>`,

    checklist: `${basePanel}
      <rect x="812" y="174" width="200" height="258" rx="12" fill="#EAF9FF" fill-opacity="0.32"/>
      <line x1="848" y1="220" x2="980" y2="220" stroke="#CDEFFF" stroke-width="5"/>
      <line x1="848" y1="266" x2="980" y2="266" stroke="#CDEFFF" stroke-width="5"/>
      <line x1="848" y1="312" x2="980" y2="312" stroke="#CDEFFF" stroke-width="5"/>
      <path d="M824 214L832 222L844 208" stroke="#CDEFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M824 260L832 268L844 254" stroke="#CDEFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M824 306L832 314L844 300" stroke="#CDEFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,

    foodPlant: `${basePanel}
      <rect x="768" y="328" width="320" height="112" rx="12" fill="#ECFFEF" fill-opacity="0.16"/>
      <rect x="792" y="244" width="88" height="84" fill="#D7FDDC" fill-opacity="0.30"/>
      <rect x="888" y="224" width="100" height="104" fill="#D7FDDC" fill-opacity="0.30"/>
      <rect x="996" y="266" width="68" height="62" fill="#D7FDDC" fill-opacity="0.30"/>
      <circle cx="838" cy="212" r="22" fill="#C8F9D0" fill-opacity="0.8"/>
      <circle cx="1008" cy="214" r="22" fill="#C8F9D0" fill-opacity="0.8"/>
      <path d="M838 200C846 200 852 206 852 214C852 225 838 236 838 236C838 236 824 225 824 214C824 206 830 200 838 200Z" fill="#9EEAA8"/>
      <path d="M1008 202C1016 202 1022 208 1022 216C1022 227 1008 238 1008 238C1008 238 994 227 994 216C994 208 1000 202 1008 202Z" fill="#9EEAA8"/>`,

    metrology: `${basePanel}
      <rect x="768" y="336" width="320" height="104" rx="12" fill="#EEF9FF" fill-opacity="0.16"/>
      <circle cx="846" cy="240" r="54" fill="#DAF3FF" fill-opacity="0.28"/>
      <circle cx="846" cy="240" r="30" fill="#C7EBFF" fill-opacity="0.46"/>
      <line x1="846" y1="240" x2="874" y2="218" stroke="#B9E6FF" stroke-width="5"/>
      <rect x="930" y="190" width="132" height="120" rx="10" fill="#DAF3FF" fill-opacity="0.26"/>
      <line x1="954" y1="224" x2="1036" y2="224" stroke="#BFE9FF" stroke-width="5"/>
      <line x1="954" y1="252" x2="1020" y2="252" stroke="#BFE9FF" stroke-width="5"/>
      <line x1="954" y1="280" x2="1002" y2="280" stroke="#BFE9FF" stroke-width="5"/>`,

    strategy: `${basePanel}
      <rect x="790" y="184" width="280" height="178" rx="12" fill="#EEF3FF" fill-opacity="0.30"/>
      <line x1="930" y1="204" x2="930" y2="342" stroke="#D8E2FF" stroke-width="4"/>
      <line x1="810" y1="273" x2="1050" y2="273" stroke="#D8E2FF" stroke-width="4"/>
      <text x="838" y="242" fill="#D8E2FF" font-family="Arial" font-size="28" font-weight="700">S</text>
      <text x="992" y="242" fill="#D8E2FF" font-family="Arial" font-size="28" font-weight="700">O</text>
      <text x="838" y="318" fill="#D8E2FF" font-family="Arial" font-size="28" font-weight="700">W</text>
      <text x="992" y="318" fill="#D8E2FF" font-family="Arial" font-size="28" font-weight="700">T</text>
      <rect x="768" y="384" width="320" height="52" rx="12" fill="#EEF3FF" fill-opacity="0.16"/>`,

    warroom: `${basePanel}
      <rect x="780" y="190" width="300" height="170" rx="12" fill="#EAF7FF" fill-opacity="0.30"/>
      <circle cx="840" cy="248" r="26" fill="#CFEFFF" fill-opacity="0.7"/>
      <circle cx="930" cy="236" r="24" fill="#CFEFFF" fill-opacity="0.62"/>
      <circle cx="1008" cy="248" r="26" fill="#CFEFFF" fill-opacity="0.7"/>
      <rect x="812" y="278" width="56" height="46" rx="8" fill="#CFEFFF" fill-opacity="0.55"/>
      <rect x="904" y="268" width="52" height="56" rx="8" fill="#CFEFFF" fill-opacity="0.5"/>
      <rect x="980" y="278" width="56" height="46" rx="8" fill="#CFEFFF" fill-opacity="0.55"/>
      <rect x="768" y="384" width="320" height="52" rx="12" fill="#EAF7FF" fill-opacity="0.16"/>`,

    training: `${basePanel}
      <rect x="790" y="180" width="280" height="180" rx="12" fill="#EAF8FF" fill-opacity="0.30"/>
      <rect x="820" y="206" width="220" height="116" rx="8" fill="#D7F2FF" fill-opacity="0.62"/>
      <line x1="842" y1="236" x2="1008" y2="236" stroke="#BFEAFF" stroke-width="5"/>
      <line x1="842" y1="264" x2="988" y2="264" stroke="#BFEAFF" stroke-width="5"/>
      <line x1="842" y1="292" x2="962" y2="292" stroke="#BFEAFF" stroke-width="5"/>
      <rect x="768" y="384" width="320" height="52" rx="12" fill="#EAF8FF" fill-opacity="0.16"/>`,

    qualityTools: `${basePanel}
      <rect x="790" y="188" width="280" height="174" rx="12" fill="#EAF7FF" fill-opacity="0.30"/>
      <circle cx="846" cy="246" r="36" fill="#D0EDFF" fill-opacity="0.65"/>
      <rect x="914" y="212" width="132" height="28" rx="8" fill="#D0EDFF" fill-opacity="0.65"/>
      <rect x="914" y="252" width="102" height="28" rx="8" fill="#D0EDFF" fill-opacity="0.65"/>
      <rect x="914" y="292" width="74" height="28" rx="8" fill="#D0EDFF" fill-opacity="0.65"/>
      <rect x="768" y="384" width="320" height="52" rx="12" fill="#EAF7FF" fill-opacity="0.16"/>
      <circle cx="846" cy="246" r="10" fill="#B5E4FF"/>
      <line x1="846" y1="246" x2="866" y2="230" stroke="#A6DCFF" stroke-width="4"/>
      <line x1="846" y1="246" x2="828" y2="258" stroke="#A6DCFF" stroke-width="4"/>
      <line x1="846" y1="246" x2="858" y2="266" stroke="#A6DCFF" stroke-width="4"/>
      `,

    factory: `${basePanel}
      <rect x="768" y="334" width="320" height="106" rx="12" fill="#EAF9FF" fill-opacity="0.16"/>
      <rect x="792" y="260" width="90" height="74" fill="#D8F2FF" fill-opacity="0.30"/>
      <rect x="892" y="226" width="108" height="108" fill="#D8F2FF" fill-opacity="0.30"/>
      <rect x="1010" y="280" width="58" height="54" fill="#D8F2FF" fill-opacity="0.30"/>
      <rect x="914" y="178" width="18" height="48" fill="#C9ECFF" fill-opacity="0.5"/>
      <rect x="946" y="166" width="18" height="60" fill="#C9ECFF" fill-opacity="0.5"/>`
  };

  return scenes[type] || scenes.officeAudit;
}

function createCover(course) {
  const title = course.nome?.pt || course.id;
  const subtitle = course.titulo_completo?.pt || '';
  const tag = categoryTag[course.categoria] || 'CURSO';

  const paletteByCategory = categoryPalettes[course.categoria];
  const colorIndex = hash(course.id) % palettes.length;
  const [c1, c2] = paletteByCategory || palettes[colorIndex];

  const firstLine = truncate(title, 42);
  const secondLine = truncate(toLine2(title), 42);
  const scene = COURSE_SCENES[course.id] || { type: 'officeAudit', label: 'Aplicação prática orientada por resultados' };
  const sceneLabel = truncate(scene.label, 64);
  const level = levelLabel(course.nivel);
  const firstLineSize = titleFontSize(firstLine);
  const secondLineSize = secondLine ? Math.max(titleFontSize(secondLine) - 4, 44) : 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(248 190) rotate(28) scale(460 300)">
      <stop stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M26 0H0V26" fill="none" stroke="#FFFFFF" stroke-opacity="0.08"/>
    </pattern>
  </defs>

  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>
  <ellipse cx="242" cy="194" rx="420" ry="280" fill="url(#glow)"/>
  <circle cx="1030" cy="96" r="220" fill="#ffffff" fill-opacity="0.09"/>
  <circle cx="930" cy="640" r="210" fill="#ffffff" fill-opacity="0.08"/>
  <rect x="860" y="-60" width="420" height="420" rx="210" fill="#ffffff" fill-opacity="0.06" transform="rotate(8 860 -60)"/>

  <rect x="64" y="64" width="1072" height="547" rx="24" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.25"/>

  ${sceneSVG(scene.type)}

  <rect x="104" y="102" width="280" height="52" rx="26" fill="#ffffff" fill-opacity="0.18"/>
  <text x="244" y="136" fill="#E6F8FF" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" text-anchor="middle">${esc(tag)}</text>

  <rect x="404" y="102" width="280" height="52" rx="26" fill="#ffffff" fill-opacity="0.14"/>
  <text x="544" y="136" fill="#F1FBFF" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" text-anchor="middle">${esc(level)}</text>

  <text x="104" y="258" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${firstLineSize}" font-weight="800">${esc(firstLine)}</text>
  ${secondLine ? `<text x="104" y="328" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${secondLineSize}" font-weight="700">${esc(secondLine)}</text>` : ''}

  <text x="104" y="414" fill="#D7F3FF" font-family="Arial, Helvetica, sans-serif" font-size="33" font-weight="500">${esc(truncate(subtitle, 58))}</text>

  <text x="104" y="458" fill="#E8FBFF" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600">Cenário: ${esc(sceneLabel)}</text>

  <rect x="104" y="492" width="992" height="2" fill="#ffffff" fill-opacity="0.35"/>

  <text x="104" y="548" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">ISOAcademy</text>
  <text x="104" y="586" fill="#D7F3FF" font-family="Arial, Helvetica, sans-serif" font-size="24">Especialização em Normas e Sistemas de Gestão</text>

  <text x="1096" y="586" fill="#D7F3FF" font-family="Arial, Helvetica, sans-serif" font-size="22" text-anchor="end">${esc(course.id)}</text>
</svg>`;
}

courses.forEach((course) => {
  const content = createCover(course);
  const target = path.join(outDir, `${course.id}.svg`);
  fs.writeFileSync(target, content, 'utf8');
});

console.log(`Generated ${courses.length} course covers at ${outDir}`);
