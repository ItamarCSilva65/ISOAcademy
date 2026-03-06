const fs = require('fs');
const path = require('path');

const courses = require('../data/coursesData');
const freeCourses = require('../data/cursos_gratuitosData');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const outputFile = path.join(publicDir, 'amostra_capas_validacao.html');

const samplePaidIds = [
  'iso-9001',
  'iso-14001',
  'iso-17025',
  'auditor-interno-9001',
  'auditor-interno-22001',
  'indicadores-processo',
  'gestao-processos',
  'gerenciamento-projetos',
  'matrizes-swot-pestel',
  'formacao-equipes',
  'implantacao-9001',
  'implantacao-17025'
];

const sampleFreeIds = ['free-nao-conformidades', 'free-auditoria-interna'];

const selectedPaid = samplePaidIds
  .map((id) => courses.find((courseItem) => courseItem.id === id))
  .filter(Boolean);

const selectedFree = sampleFreeIds
  .map((id) => freeCourses.find((courseItem) => courseItem.id === id))
  .filter(Boolean);

const selectedCourses = [...selectedPaid, ...selectedFree].map((courseItem) => {
  const coverPath = path.join(publicDir, courseItem.img.replace(/^\//, '').replace(/\//g, path.sep));
  return {
    id: courseItem.id,
    nome: courseItem.nome.pt,
    titulo: courseItem.titulo_completo.pt,
    img: courseItem.img,
    exists: fs.existsSync(coverPath)
  };
});

const cards = selectedCourses
  .map((courseItem) => `
    <article class="card">
      <img src="${courseItem.img}" alt="${courseItem.nome}">
      <div class="content">
        <h3>${courseItem.nome}</h3>
        <p>${courseItem.titulo}</p>
        <span class="meta">ID: ${courseItem.id}</span>
        <span class="status ${courseItem.exists ? 'ok' : 'missing'}">${courseItem.exists ? 'Imagem encontrada' : 'Imagem ausente'}</span>
      </div>
    </article>
  `)
  .join('');

const missingCount = selectedCourses.filter((courseItem) => !courseItem.exists).length;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Amostra de Capas - Validação</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f6f7f9; color: #1e1e1e; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    p { margin: 0 0 20px; }
    .summary { margin-bottom: 20px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .card { background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #ddd; }
    .card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
    .content { padding: 12px; }
    .content h3 { margin: 0 0 8px; font-size: 16px; }
    .content p { margin: 0 0 8px; font-size: 13px; color: #444; min-height: 34px; }
    .meta { display: block; font-size: 12px; color: #666; margin-bottom: 8px; }
    .status { display: inline-block; padding: 4px 8px; border-radius: 8px; font-size: 12px; }
    .status.ok { background: #e9f7ef; color: #17643a; }
    .status.missing { background: #fcebec; color: #9b1c1c; }
  </style>
</head>
<body>
  <h1>Amostra de validação das capas atualizadas</h1>
  <p>Pré-visualização das trocas para <strong>capas_exclusivas</strong>.</p>
  <div class="summary">Total na amostra: ${selectedCourses.length} | Ausentes: ${missingCount}</div>
  <section class="grid">
    ${cards}
  </section>
</body>
</html>`;

fs.writeFileSync(outputFile, html, 'utf8');
console.log(`Amostra gerada em: ${outputFile}`);
console.log(`Itens na amostra: ${selectedCourses.length}`);
console.log(`Imagens ausentes: ${missingCount}`);
