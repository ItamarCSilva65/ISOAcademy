// data/coursesData.js — campos multilíngues (PT / EN / FR / ES)

const localized = (pt, en, fr, es) => ({
    pt,
    en: en || pt,
    fr: fr || pt,
    es: es || pt
});

const IMG = {
    qualidade: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    auditoria: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    laboratorio: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80',
    saude: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&q=80',
    ambiental: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80',
    processos: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    melhoria: 'https://images.unsplash.com/photo-1551281044-8b0a5d5f8f95?w=1200&q=80',
    projetos: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    riscos: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80',
    seguranca: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80',
    compliance: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80'
};

const course = ({ id, nome, titulo, preco, desc, img, destaque = false }) => ({
    id,
    nome: localized(nome),
    titulo_completo: localized(titulo),
    preco,
    desc: localized(desc),
    img,
    destaque
});

const courses = [
    course({
        id: 'iso-9001',
        nome: 'ISO 9001:2015',
        titulo: 'Sistema de Gestão da Qualidade (SGQ)',
        preco: 299.90,
        desc: 'Domine os requisitos para implementar um sistema de gestão da qualidade com foco em satisfação do cliente e melhoria contínua.',
        img: '/img/iso-9001-cover.png',
        destaque: true
    }),
    course({
        id: 'iso-14001',
        nome: 'ISO 14001:2015',
        titulo: 'Sistema de Gestão Ambiental (SGA)',
        preco: 299.90,
        desc: 'Aprenda a estruturar e manter um sistema ambiental eficaz, com redução de impactos e conformidade legal.',
        img: '/img/iso-14001-cover.png',
        destaque: true
    }),
    course({
        id: 'iso-45001',
        nome: 'ISO 45001:2018',
        titulo: 'Gestão de Saúde e Segurança Ocupacional',
        preco: 349.90,
        desc: 'Implemente práticas para reduzir riscos ocupacionais e fortalecer uma cultura de segurança no trabalho.',
        img: '/img/iso-45001-cover.png',
        destaque: true
    }),
    course({
        id: 'iso-13485',
        nome: 'ISO 13485:2016',
        titulo: 'Sistema de Gestão da Qualidade para Dispositivos Médicos',
        preco: 399.90,
        desc: 'Entenda os requisitos da indústria de dispositivos médicos para garantir qualidade, rastreabilidade e conformidade regulatória.',
        img: '/img/iso-13485-cover.png'
    }),
    course({
        id: 'iso-17025',
        nome: 'ISO/IEC 17025:2017',
        titulo: 'Competência de Laboratórios de Ensaio e Calibração',
        preco: 450.00,
        desc: 'Desenvolva competência técnica em laboratórios e aprimore a confiabilidade de ensaios e calibrações.',
        img: '/img/iso-17025-cover.png'
    }),
    course({
        id: 'iso-19011',
        nome: 'ISO 19011:2018',
        titulo: 'Diretrizes para Auditoria de Sistemas de Gestão',
        preco: 250.00,
        desc: 'Planeje e execute auditorias internas com abordagem baseada em risco e evidências objetivas.',
        img: '/img/iso-19011-cover.png'
    }),
    course({
        id: 'iso-31000',
        nome: 'ISO 31000:2018',
        titulo: 'Gestão de Riscos — Diretrizes',
        preco: 329.90,
        desc: 'Aplique gestão de riscos em decisões estratégicas e operacionais para aumentar resiliência organizacional.',
        img: '/img/iso-31000-cover-v2.svg',
        destaque: true
    }),

    course({
        id: 'curso-5s',
        nome: 'Curso 5S',
        titulo: 'Programa 5S para Organização e Produtividade',
        preco: 219.90,
        desc: 'Implemente o 5S para elevar disciplina operacional, organização do ambiente e produtividade.',
        img: IMG.processos
    }),
    course({
        id: 'curso-8d',
        nome: 'Curso 8D',
        titulo: 'Metodologia 8D para Solução de Problemas',
        preco: 289.90,
        desc: 'Aplique o método 8D para tratar causas-raiz e prevenir recorrência de problemas críticos.',
        img: IMG.melhoria
    }),
    course({
        id: 'curso-apr',
        nome: 'Curso APR',
        titulo: 'Análise Preliminar de Riscos (APR)',
        preco: 249.90,
        desc: 'Identifique perigos, avalie riscos e defina controles antes da execução das atividades.',
        img: IMG.seguranca
    }),

    course({
        id: 'auditor-interno-9001',
        nome: 'Curso Auditor Interno ISO 9001',
        titulo: 'Formação de Auditor Interno em SGQ',
        preco: 699.90,
        desc: 'Capacitação completa para conduzir auditorias internas da ISO 9001 com técnica e imparcialidade.',
        img: IMG.auditoria,
        destaque: true
    }),
    course({
        id: 'auditor-interno-13485',
        nome: 'Curso Auditor Interno ISO 13485',
        titulo: 'Formação de Auditor Interno para Dispositivos Médicos',
        preco: 799.90,
        desc: 'Conduza auditorias internas em sistemas da qualidade aplicados ao setor de dispositivos médicos.',
        img: IMG.saude
    }),
    course({
        id: 'auditor-interno-14001',
        nome: 'Curso Auditor Interno ISO 14001',
        titulo: 'Formação de Auditor Interno em Gestão Ambiental',
        preco: 729.90,
        desc: 'Audite aspectos ambientais, controles operacionais e conformidade legal com objetividade.',
        img: IMG.ambiental
    }),
    course({
        id: 'auditor-interno-17025',
        nome: 'Curso Auditor Interno ISO/IEC 17025',
        titulo: 'Formação de Auditor Interno para Laboratórios',
        preco: 849.90,
        desc: 'Aprimore auditorias internas em laboratórios com foco em competência técnica e rastreabilidade metrológica.',
        img: IMG.laboratorio
    }),
    course({
        id: 'auditor-interno-22001',
        nome: 'Curso Auditor Interno ISO 22001',
        titulo: 'Formação de Auditor Interno em Segurança de Alimentos',
        preco: 759.90,
        desc: 'Avalie perigos, controles e eficácia do SGSA segundo requisitos da ISO 22001.',
        img: IMG.qualidade
    }),
    course({
        id: 'auditor-interno-37001',
        nome: 'Curso Auditor Interno ISO 37001',
        titulo: 'Formação de Auditor Interno em Sistema Antissuborno',
        preco: 789.90,
        desc: 'Planeje e execute auditorias internas de compliance e controles antissuborno.',
        img: IMG.compliance
    }),
    course({
        id: 'auditor-interno-45001',
        nome: 'Curso Auditor Interno ISO 45001',
        titulo: 'Formação de Auditor Interno em Saúde e Segurança Ocupacional',
        preco: 729.90,
        desc: 'Realize auditorias internas robustas em saúde e segurança com foco em prevenção e desempenho.',
        img: IMG.seguranca
    }),

    course({
        id: 'auditor-lider-9001',
        nome: 'Curso Auditor Líder ISO 9001',
        titulo: 'Formação de Auditor Líder em SGQ',
        preco: 1390.90,
        desc: 'Desenvolva competências avançadas para liderar auditorias de certificação e equipes auditoras.',
        img: IMG.auditoria,
        destaque: true
    }),
    course({
        id: 'auditor-lider-14001',
        nome: 'Curso Auditor Líder ISO 14001',
        titulo: 'Formação de Auditor Líder em Gestão Ambiental',
        preco: 1449.90,
        desc: 'Conduza auditorias líderes em SGA com visão estratégica, técnica e foco em resultados.',
        img: IMG.ambiental
    }),
    course({
        id: 'auditor-lider-13485',
        nome: 'Curso Auditor Líder ISO 13485',
        titulo: 'Formação de Auditor Líder para Dispositivos Médicos',
        preco: 1599.90,
        desc: 'Atue em auditorias líderes do setor médico com profundidade regulatória e técnica.',
        img: IMG.saude
    }),
    course({
        id: 'auditor-lider-17025',
        nome: 'Curso Auditor Líder ISO/IEC 17025',
        titulo: 'Formação de Auditor Líder para Laboratórios',
        preco: 1649.90,
        desc: 'Lidere auditorias de laboratórios com consistência metrológica e análise crítica de evidências.',
        img: IMG.laboratorio
    }),
    course({
        id: 'auditor-lider-22001',
        nome: 'Curso Auditor Líder ISO 22001',
        titulo: 'Formação de Auditor Líder em Segurança de Alimentos',
        preco: 1499.90,
        desc: 'Capacitação avançada para liderar auditorias em sistemas de segurança de alimentos.',
        img: IMG.qualidade
    }),
    course({
        id: 'auditor-lider-31000',
        nome: 'Curso Auditor Líder ISO 31000',
        titulo: 'Auditoria Líder em Gestão de Riscos',
        preco: 1449.90,
        desc: 'Lidere avaliações de maturidade e efetividade da gestão de riscos organizacionais.',
        img: IMG.riscos
    }),
    course({
        id: 'auditor-lider-37001',
        nome: 'Curso Auditor Líder ISO 37001',
        titulo: 'Formação de Auditor Líder Antissuborno',
        preco: 1549.90,
        desc: 'Conduza auditorias líderes em sistemas antissuborno e compliance corporativo.',
        img: IMG.compliance
    }),

    course({
        id: 'boas-praticas-auditoria',
        nome: 'Curso de Boas Práticas de Auditoria',
        titulo: 'Técnicas Práticas para Auditorias Eficazes',
        preco: 319.90,
        desc: 'Aprimore planejamento, condução de entrevistas e redação de achados em auditoria.',
        img: IMG.auditoria
    }),
    course({
        id: 'cep-controle-estatistico-processo',
        nome: 'Curso Controle Estatístico de Processo (CEP)',
        titulo: 'CEP Aplicado à Melhoria da Qualidade',
        preco: 389.90,
        desc: 'Utilize cartas de controle e análise estatística para reduzir variabilidade de processos.',
        img: IMG.melhoria
    }),
    course({
        id: 'indicadores-processo',
        nome: 'Curso Como Criar Indicadores para o seu Processo',
        titulo: 'KPI e Métricas para Gestão por Resultados',
        preco: 279.90,
        desc: 'Defina indicadores claros, mensuráveis e alinhados aos objetivos estratégicos.',
        img: IMG.processos
    }),
    course({
        id: 'formacao-equipes',
        nome: 'Curso Formação de Equipes',
        titulo: 'Desenvolvimento de Times de Alta Performance',
        preco: 259.90,
        desc: 'Fortaleça liderança, comunicação e colaboração para elevar desempenho da equipe.',
        img: IMG.projetos
    }),
    course({
        id: 'gerenciamento-projetos',
        nome: 'Curso Gerenciamento de Projetos',
        titulo: 'Fundamentos e Práticas de Gestão de Projetos',
        preco: 419.90,
        desc: 'Planeje, execute e controle projetos com foco em prazo, custo, escopo e qualidade.',
        img: IMG.projetos
    }),
    course({
        id: 'nao-conformidade-processo',
        nome: 'Curso Como Identificar e Tratar Não Conformidades em Processo',
        titulo: 'Tratativa de Não Conformidades com Ação Eficaz',
        preco: 299.90,
        desc: 'Detecte desvios, analise causa-raiz e implemente ações corretivas sustentáveis.',
        img: IMG.melhoria,
        destaque: true
    }),

    course({
        id: 'implantacao-37001',
        nome: 'Curso Como Implantar a ISO 37001',
        titulo: 'Implantação de Sistema de Gestão Antissuborno',
        preco: 839.90,
        desc: 'Construa e implemente o sistema ISO 37001 com governança, controles e monitoramento.',
        img: IMG.compliance
    }),
    course({
        id: 'implantacao-9001',
        nome: 'Curso Como Implantar a ISO 9001',
        titulo: 'Implantação do Sistema de Gestão da Qualidade',
        preco: 799.90,
        desc: 'Implemente um SGQ completo com planejamento, processos e gestão de desempenho.',
        img: IMG.qualidade,
        destaque: true
    }),
    course({
        id: 'implantacao-13485',
        nome: 'Curso Como Implantar a ISO 13485',
        titulo: 'Implantação da Qualidade para Dispositivos Médicos',
        preco: 929.90,
        desc: 'Aplique requisitos da ISO 13485 na prática para atender mercado e órgãos reguladores.',
        img: IMG.saude
    }),
    course({
        id: 'implantacao-14001',
        nome: 'Curso Como Implantar a ISO 14001',
        titulo: 'Implantação do Sistema de Gestão Ambiental',
        preco: 829.90,
        desc: 'Estruture políticas, objetivos e controles ambientais para desempenho sustentável.',
        img: IMG.ambiental
    }),
    course({
        id: 'implantacao-17025',
        nome: 'Curso Como Implantar a ISO/IEC 17025',
        titulo: 'Implantação de Requisitos para Laboratórios',
        preco: 949.90,
        desc: 'Implante processos técnicos e gerenciais para competência laboratorial.',
        img: IMG.laboratorio
    }),
    course({
        id: 'implantacao-22001',
        nome: 'Curso Como Implantar a ISO 22001',
        titulo: 'Implantação de Sistema de Segurança de Alimentos',
        preco: 859.90,
        desc: 'Implemente requisitos e controles para fortalecer a segurança de alimentos.',
        img: IMG.qualidade
    }),
    course({
        id: 'implantacao-31000',
        nome: 'Curso Como Implantar a ISO 31000',
        titulo: 'Implantação da Gestão de Riscos',
        preco: 819.90,
        desc: 'Estruture governança e processo de riscos para apoiar decisões organizacionais.',
        img: IMG.riscos
    }),
    course({
        id: 'implantacao-45001',
        nome: 'Curso Como Implantar a ISO 45001',
        titulo: 'Implantação de Gestão de Saúde e Segurança Ocupacional',
        preco: 839.90,
        desc: 'Implemente controles de SST para prevenir incidentes e melhorar desempenho ocupacional.',
        img: IMG.seguranca
    }),

    course({
        id: 'contexto-organizacao',
        nome: 'Curso Contexto da Organização',
        titulo: 'Análise de Contexto e Partes Interessadas',
        preco: 239.90,
        desc: 'Mapeie fatores internos e externos para fortalecer estratégia e sistemas de gestão.',
        img: IMG.processos
    }),
    course({
        id: 'gestao-processos',
        nome: 'Curso de Gestão de Processo',
        titulo: 'Gestão por Processos com Foco em Eficiência',
        preco: 299.90,
        desc: 'Estruture processos com indicadores e ciclos de melhoria para ganhos sustentáveis.',
        img: IMG.processos
    }),
    course({
        id: 'desvendando-pmbok',
        nome: 'Curso Desvendando o PMBOK',
        titulo: 'Guia PMBOK na Prática',
        preco: 389.90,
        desc: 'Compreenda áreas de conhecimento e processos do PMBOK com aplicação prática.',
        img: IMG.projetos
    }),
    course({
        id: 'ferramentas-qualidade',
        nome: 'Curso Ferramentas da Qualidade',
        titulo: 'Aplicação das Ferramentas Clássicas da Qualidade',
        preco: 259.90,
        desc: 'Use ferramentas da qualidade para análise, priorização e solução de problemas.',
        img: IMG.melhoria
    }),
    course({
        id: 'curso-fmea',
        nome: 'Curso FMEA',
        titulo: 'Análise de Modo e Efeito de Falha',
        preco: 349.90,
        desc: 'Aplique FMEA para prevenção de falhas e redução de riscos em produtos e processos.',
        img: IMG.melhoria
    }),
    course({
        id: 'incerteza-medicao',
        nome: 'Curso Incerteza de Medição',
        titulo: 'Fundamentos e Cálculo de Incerteza',
        preco: 449.90,
        desc: 'Desenvolva competência para estimar e declarar incerteza de medição em laboratório.',
        img: IMG.laboratorio
    }),
    course({
        id: 'introducao-14300-1-2',
        nome: 'Curso Introdução à ISO 14300-1-2',
        titulo: 'Conceitos Iniciais da ISO 14300-1-2',
        preco: 299.90,
        desc: 'Conheça os princípios e requisitos iniciais da ISO 14300-1-2 com foco aplicado.',
        img: IMG.qualidade
    }),
    course({
        id: 'introducao-22001',
        nome: 'Curso Introdução à ISO 22001',
        titulo: 'Fundamentos da Segurança de Alimentos',
        preco: 289.90,
        desc: 'Aprenda os conceitos essenciais para iniciar na ISO 22001 com segurança e clareza.',
        img: IMG.qualidade
    }),
    course({
        id: 'introducao-37001',
        nome: 'Curso Introdução à ISO 37001',
        titulo: 'Fundamentos de Sistema Antissuborno',
        preco: 309.90,
        desc: 'Compreenda os requisitos introdutórios da ISO 37001 para prevenção de suborno.',
        img: IMG.compliance
    }),
    course({
        id: 'mapeamento-processo',
        nome: 'Curso Mapeamento de Processo',
        titulo: 'Modelagem e Mapeamento de Fluxos',
        preco: 269.90,
        desc: 'Mapeie fluxos ponta a ponta para eliminar desperdícios e melhorar resultados.',
        img: IMG.processos
    }),
    course({
        id: 'matrizes-swot-pestel',
        nome: 'Curso Matrizes SWOT e PESTEL',
        titulo: 'Análise Estratégica com SWOT e PESTEL',
        preco: 249.90,
        desc: 'Utilize matrizes estratégicas para avaliar cenário, riscos e oportunidades.',
        img: IMG.riscos
    }),
    course({
        id: 'curso-ppra',
        nome: 'Curso PPRA',
        titulo: 'Programa de Prevenção de Riscos Ambientais',
        preco: 239.90,
        desc: 'Aprenda fundamentos e aplicação do PPRA para prevenção de riscos no ambiente laboral.',
        img: IMG.seguranca
    })
];

const inferCategory = (courseId) => {
    if (courseId.startsWith('auditor-interno-')) return 'auditoria_interna';
    if (courseId.startsWith('auditor-lider-')) return 'auditoria_lider';
    if (courseId.startsWith('implantacao-')) return 'implantacao_normas';
    if (courseId.startsWith('introducao-')) return 'introducao_normas';
    if (courseId.startsWith('iso-')) return 'normas_iso';

    const map = [
        ['curso-5s|curso-8d|ferramentas-qualidade|curso-fmea|cep-controle-estatistico-processo|boas-praticas-auditoria|nao-conformidade-processo', 'qualidade_melhoria'],
        ['gerenciamento-projetos|desvendando-pmbok|formacao-equipes', 'gestao_projetos'],
        ['apr|ppra|45001', 'saude_seguranca'],
        ['17025|incerteza-medicao|laboratorio', 'laboratorios_metrologia'],
        ['37001|compliance', 'compliance_antissuborno'],
        ['processo|indicadores|swot|pestel|contexto-organizacao|gestao-processos', 'gestao_processos'],
        ['31000|risco', 'gestao_riscos']
    ];

    const found = map.find(([pattern]) => new RegExp(pattern).test(courseId));
    return found ? found[1] : 'gestao_organizacional';
};

const inferLevel = (courseId, price) => {
    if (courseId.startsWith('auditor-lider-') || courseId.startsWith('implantacao-')) return 'avancado';
    if (courseId.startsWith('auditor-interno-')) return 'intermediario';
    if (courseId.startsWith('introducao-')) return 'basico';

    if (price <= 280) return 'basico';
    if (price <= 900) return 'intermediario';
    return 'avancado';
};

const buildTags = (courseId, category, level) => {
    const normalizedIdParts = courseId
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .split('-')
        .filter(Boolean);

    return Array.from(new Set([category, level, ...normalizedIdParts])).slice(0, 12);
};

const COURSE_IMAGE_BY_ID = {
    'curso-5s': 'https://source.unsplash.com/1600x900/?workspace,organization,lean&sig=501',
    'curso-8d': 'https://source.unsplash.com/1600x900/?problem-solving,team,meeting&sig=502',
    'curso-apr': 'https://source.unsplash.com/1600x900/?risk-assessment,industry,safety&sig=503',

    'auditor-interno-9001': 'https://source.unsplash.com/1600x900/?quality,audit,checklist&sig=511',
    'auditor-interno-13485': 'https://source.unsplash.com/1600x900/?medical-device,quality,documents&sig=512',
    'auditor-interno-14001': 'https://source.unsplash.com/1600x900/?environmental,audit,sustainability&sig=513',
    'auditor-interno-17025': 'https://source.unsplash.com/1600x900/?laboratory,technician,calibration&sig=614',
    'auditor-interno-22001': 'https://source.unsplash.com/1600x900/?food-safety,audit,production&sig=515',
    'auditor-interno-37001': 'https://source.unsplash.com/1600x900/?compliance,ethics,corporate&sig=516',
    'auditor-interno-45001': 'https://source.unsplash.com/1600x900/?occupational-safety,industry,ppe&sig=517',

    'auditor-lider-9001': 'https://source.unsplash.com/1600x900/?executive,boardroom,audit&sig=621',
    'auditor-lider-14001': 'https://source.unsplash.com/1600x900/?corporate,meeting,sustainability&sig=622',
    'auditor-lider-13485': '/img/auditor-lider-13485-cover.svg',
    'auditor-lider-17025': 'https://source.unsplash.com/1600x900/?executive,quality,laboratory-management&sig=624',
    'auditor-lider-22001': 'https://source.unsplash.com/1600x900/?corporate,food-industry,management&sig=625',
    'auditor-lider-31000': 'https://source.unsplash.com/1600x900/?executive,risk-management,conference&sig=626',
    'auditor-lider-37001': 'https://source.unsplash.com/1600x900/?corporate,ethics,compliance,boardroom&sig=627',

    'boas-praticas-auditoria': 'https://source.unsplash.com/1600x900/?audit,best-practice,notebook&sig=531',
    'cep-controle-estatistico-processo': 'https://source.unsplash.com/1600x900/?statistics,control-chart,data&sig=532',
    'indicadores-processo': 'https://source.unsplash.com/1600x900/?kpi,dashboard,analytics&sig=533',
    'formacao-equipes': 'https://source.unsplash.com/1600x900/?teamwork,collaboration,people&sig=534',
    'gerenciamento-projetos': 'https://source.unsplash.com/1600x900/?project-management,gantt,planning&sig=535',
    'nao-conformidade-processo': 'https://source.unsplash.com/1600x900/?nonconformity,quality,process&sig=536',

    'implantacao-37001': 'https://source.unsplash.com/1600x900/?compliance,policy,implementation&sig=541',
    'implantacao-9001': 'https://source.unsplash.com/1600x900/?quality-system,implementation,workflow&sig=542',
    'implantacao-13485': 'https://source.unsplash.com/1600x900/?medical-quality,implementation,regulation&sig=543',
    'implantacao-14001': 'https://source.unsplash.com/1600x900/?environmental-management,implementation,green&sig=544',
    'implantacao-17025': 'https://source.unsplash.com/1600x900/?metrology,laboratory,instrumentation&sig=645',
    'implantacao-22001': 'https://source.unsplash.com/1600x900/?food-safety-system,implementation,industry&sig=546',
    'implantacao-31000': 'https://source.unsplash.com/1600x900/?risk-management,implementation,business&sig=547',
    'implantacao-45001': 'https://source.unsplash.com/1600x900/?safety-management,implementation,factory&sig=548',

    'contexto-organizacao': 'https://source.unsplash.com/1600x900/?strategy,organization,analysis&sig=551',
    'gestao-processos': 'https://source.unsplash.com/1600x900/?business-process,flowchart,management&sig=552',
    'desvendando-pmbok': 'https://source.unsplash.com/1600x900/?pmbok,project,framework&sig=553',
    'ferramentas-qualidade': 'https://source.unsplash.com/1600x900/?quality-tools,improvement,analysis&sig=554',
    'curso-fmea': 'https://source.unsplash.com/1600x900/?fmea,engineering,risk-analysis&sig=555',
    'incerteza-medicao': 'https://source.unsplash.com/1600x900/?precision,measurement,metrology,lab&sig=656',
    'introducao-14300-1-2': 'https://source.unsplash.com/1600x900/?iso-standard,training,learning&sig=557',
    'introducao-22001': 'https://source.unsplash.com/1600x900/?food-quality,training,introduction&sig=558',
    'introducao-37001': 'https://source.unsplash.com/1600x900/?ethics,compliance,training&sig=559',
    'mapeamento-processo': 'https://source.unsplash.com/1600x900/?process-mapping,workflow,diagram&sig=560',
    'matrizes-swot-pestel': 'https://source.unsplash.com/1600x900/?swot,pestel,strategy&sig=561',
    'curso-ppra': 'https://source.unsplash.com/1600x900/?occupational-risk,prevention,workplace&sig=562'
};

const coursesWithMeta = courses.map((courseItem) => {
    const category = inferCategory(courseItem.id);
    const level = inferLevel(courseItem.id, courseItem.preco);
    const isNewCourse = !courseItem.id.startsWith('iso-');
    const generatedLocalCover = `/img/courses/${courseItem.id}.svg`;

    return {
        ...courseItem,
        img: generatedLocalCover,
        categoria: category,
        nivel: level,
        tags: buildTags(courseItem.id, category, level)
    };
});

module.exports = coursesWithMeta;
