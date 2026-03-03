// routes/index.js
const express = require('express');
const router = express.Router();
const coursesData = require('../data/coursesData');
const cursosGratuitosData = require('../data/cursos_gratuitosData');

const DEFAULT_MONTHLY_REAJUSTE_INDEX = Number(process.env.PAYMENT_REAJUSTE_INDEX || 0.0199);
const CART_COOKIE_KEY = 'isoacademy_cart';
const PRICE_RANGES = ['ate-300', '301-900', 'acima-900'];
const CATEGORY_LABELS = {
    normas_iso: 'Normas ISO',
    auditoria_interna: 'Auditoria Interna',
    auditoria_lider: 'Auditoria Líder',
    implantacao_normas: 'Implantação de Normas',
    introducao_normas: 'Introdução às Normas',
    qualidade_melhoria: 'Qualidade e Melhoria',
    gestao_projetos: 'Gestão de Projetos',
    saude_seguranca: 'Saúde e Segurança',
    laboratorios_metrologia: 'Laboratórios e Metrologia',
    compliance_antissuborno: 'Compliance e Antissuborno',
    gestao_processos: 'Gestão de Processos',
    gestao_riscos: 'Gestão de Riscos',
    gestao_organizacional: 'Gestão Organizacional'
};
const LEVEL_LABELS = {
    basico: 'Básico',
    intermediario: 'Intermediário',
    avancado: 'Avançado'
};
const PRICE_LABELS = {
    'ate-300': 'Até R$300',
    '301-900': 'R$301–900',
    'acima-900': 'Acima de R$900'
};

const roundMoney = (value) => Number(value.toFixed(2));

const getCartIds = (req) => {
    const raw = req.cookies?.[CART_COOKIE_KEY];
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((id) => typeof id === 'string' && id.trim() !== '');
    } catch {
        return [];
    }
};

const saveCartIds = (res, ids) => {
    res.cookie(CART_COOKIE_KEY, JSON.stringify(ids), {
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    });
};

const buildCreditOptions = (baseValue, monthlyIndex) => {
    const options = [];

    for (let installment = 1; installment <= 10; installment += 1) {
        const hasIncrease = installment >= 5;
        const totalValue = hasIncrease
            ? baseValue * Math.pow(1 + monthlyIndex, installment - 4)
            : baseValue;

        options.push({
            parcelas: installment,
            semJuros: installment <= 4,
            acrescimo: roundMoney(totalValue - baseValue),
            total: roundMoney(totalValue),
            valorParcela: roundMoney(totalValue / installment)
        });
    }

    return options;
};

// Rota Home
router.get('/', (req, res) => {
    const cursosDestaque = coursesData.filter(c => c.destaque);
    res.render('home', {
        title: 'ISO Academy - Excelência em Normas',
        courses: cursosDestaque
    });
});

// Rota Login
router.get('/login', (req, res) => {
    res.render('login', { title: 'Acessar Conta - ISOAcademy' });
});

// Rota para listar todos os cursos
router.get('/cursos', (req, res) => {
    const categoria = (req.query.categoria || '').trim();
    const nivel = (req.query.nivel || '').trim();
    const faixaPreco = (req.query.faixa_preco || '').trim();

    const categoriasDisponiveis = Array.from(new Set(coursesData.map(c => c.categoria))).sort();
    const niveisDisponiveis = Array.from(new Set(coursesData.map(c => c.nivel))).sort();

    const categoriaValida = categoriasDisponiveis.includes(categoria) ? categoria : '';
    const nivelValido = niveisDisponiveis.includes(nivel) ? nivel : '';
    const faixaPrecoValida = PRICE_RANGES.includes(faixaPreco) ? faixaPreco : '';

    const filteredCourses = coursesData.filter((course) => {
        const categoryOk = !categoriaValida || course.categoria === categoriaValida;
        const levelOk = !nivelValido || course.nivel === nivelValido;
        const priceOk = !faixaPrecoValida
            || (faixaPrecoValida === 'ate-300' && course.preco <= 300)
            || (faixaPrecoValida === '301-900' && course.preco > 300 && course.preco <= 900)
            || (faixaPrecoValida === 'acima-900' && course.preco > 900);
        return categoryOk && levelOk && priceOk;
    });

    const categoryOptions = categoriasDisponiveis.map((value) => ({
        value,
        label: CATEGORY_LABELS[value] || value,
        selected: value === categoriaValida
    }));

    const levelOptions = [
        { value: 'basico', label: 'Básico', selected: 'basico' === nivelValido },
        { value: 'intermediario', label: 'Intermediário', selected: 'intermediario' === nivelValido },
        { value: 'avancado', label: 'Avançado', selected: 'avancado' === nivelValido }
    ].filter(option => niveisDisponiveis.includes(option.value));

    const priceOptions = [
        { value: 'ate-300', label: 'Até R$300', selected: 'ate-300' === faixaPrecoValida },
        { value: '301-900', label: 'R$301–900', selected: '301-900' === faixaPrecoValida },
        { value: 'acima-900', label: 'Acima de R$900', selected: 'acima-900' === faixaPrecoValida }
    ];

    const activeFilterChips = [];
    if (categoriaValida) {
        activeFilterChips.push({
            key: 'categoria',
            label: `Categoria: ${CATEGORY_LABELS[categoriaValida] || categoriaValida}`
        });
    }
    if (nivelValido) {
        activeFilterChips.push({
            key: 'nivel',
            label: `Nível: ${LEVEL_LABELS[nivelValido] || nivelValido}`
        });
    }
    if (faixaPrecoValida) {
        activeFilterChips.push({
            key: 'faixa_preco',
            label: `Preço: ${PRICE_LABELS[faixaPrecoValida] || faixaPrecoValida}`
        });
    }

    res.render('home', {
        title: 'Todos os Nossos Cursos',
        courses: filteredCourses,
        isFullList: true,
        filters: {
            categoria: categoriaValida,
            nivel: nivelValido,
            faixaPreco: faixaPrecoValida,
            hasActive: Boolean(categoriaValida || nivelValido || faixaPrecoValida)
        },
        categoryOptions,
        levelOptions,
        priceOptions,
        activeFilterChips,
        totalFiltered: filteredCourses.length,
        totalCourses: coursesData.length
    });
});

// Rota Cursos Gratuitos
router.get('/cursos_gratuitos', (req, res) => {
    res.render('cursos_gratuitos', { coursos_gratuitos: cursosGratuitosData });
});

// Outras páginas estáticas
router.get('/cursos_in_company', (req, res) => {
    res.render('cursos_in_company', {
        title: 'Treinamentos In Company - ISOAcademy',
        courses: coursesData
    });
});

router.get('/cursos_em_destaque', (req, res) => {
    const cursosDestaque = coursesData.filter(c => c.destaque);
    res.render('cursos_em_destaque', {
        title: 'Cursos em Destaque - ISOAcademy',
        courses: cursosDestaque
    });
});

router.get('/nossos_numeros', (req, res) => {
    res.render('nossos_numeros');
});

router.get('/depoimentos', (req, res) => {
    res.render('depoimentos');
});

router.get('/sobre_nos', (req, res) => {
    res.render('sobre_nos', { title: 'Sobre Nós - ISOAcademy' });
});

// Rota Detalhes do Produto
router.get('/curso/:id', (req, res) => {
    const courseId = req.params.id;
    const course = coursesData.find(c => c.id === courseId);

    if (!course) {
        return res.status(404).render('404', { title: 'Curso não encontrado' });
    }

    res.render('product', {
        title: `${course.nome.pt || 'Curso'} - Detalhes`,
        course
    });
});

// Mantemos /product para compatibilidade com a home se houver links antigos
router.get('/product/:id', (req, res) => {
    // Tenta encontrar usando o padrão antigo (index-1) ou fallback
    const idx = parseInt(req.params.id) - 1;
    let course = coursesData[idx] || coursesData.find(c => c.id === req.params.id);

    if (!course) return res.redirect('/');
    // Renderizando layout original product que precisa da variavel `product`
    res.render('product', { course });
});


// Rota Carrinho (Conectada com o botão de compra)
router.get('/carrinho', (req, res) => {
    const addedId = req.query.add;
    const removeId = req.query.remove;
    const clearCart = req.query.clear === '1';
    let cartIds = getCartIds(req);

    if (clearCart) {
        cartIds = [];
    }

    if (removeId) {
        cartIds = cartIds.filter((id) => id !== removeId);
    }

    if (addedId) {
        const itemExists = coursesData.some((c) => c.id === addedId);
        if (itemExists) {
            cartIds.push(addedId);
        }
    }

    if (addedId || removeId || clearCart) {
        saveCartIds(res, cartIds);
        return res.redirect('/carrinho');
    }

    const groupedItems = new Map();
    cartIds.forEach((id) => {
        const item = coursesData.find((course) => course.id === id);
        if (!item) return;

        const current = groupedItems.get(id);
        if (current) {
            current.quantidade += 1;
            current.subtotal = roundMoney(current.preco * current.quantidade);
            return;
        }

        groupedItems.set(id, {
            ...item,
            quantidade: 1,
            subtotal: roundMoney(item.preco)
        });
    });

    const cartItems = Array.from(groupedItems.values());

    const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    res.render('carrinho', {
        title: 'Seu Carrinho de Compras',
        cartItems,
        total: total.toFixed(2),
        totalNumber: roundMoney(total),
        hasItems: cartItems.length > 0
    });
});

// Rota Checkout
router.get('/checkout', (req, res) => {
    res.render('checkout', { title: 'Finalizar Matrícula' });
});

// API Formas de Pagamento
router.get('/api/pagamentos', (req, res) => {
    const valor = Number(req.query.valor);

    if (!Number.isFinite(valor) || valor <= 0) {
        return res.status(400).json({
            error: 'Informe um valor válido no parâmetro "valor". Exemplo: /api/pagamentos?valor=329.9'
        });
    }

    const indexFromQuery = Number(req.query.indice);
    const monthlyIndex = Number.isFinite(indexFromQuery) && indexFromQuery >= 0
        ? indexFromQuery
        : DEFAULT_MONTHLY_REAJUSTE_INDEX;

    const creditOptions = buildCreditOptions(valor, monthlyIndex);

    res.json({
        valorBaseCurso: roundMoney(valor),
        moeda: 'BRL',
        formasPagamento: [
            {
                tipo: 'pix',
                descricao: 'Pagamento via PIX',
                total: roundMoney(valor),
                valorParcela: roundMoney(valor),
                acrescimo: 0
            },
            {
                tipo: 'boleto',
                descricao: 'Pagamento no boleto',
                total: roundMoney(valor),
                valorParcela: roundMoney(valor),
                acrescimo: 0
            },
            {
                tipo: 'cartao_credito',
                descricao: 'Pagamento com cartão de crédito à vista ou parcelado',
                regras: {
                    semAcrescimoAte: 4,
                    acrescimoAPartirDe: 5,
                    maximoParcelas: 10,
                    indiceReajusteMensal: monthlyIndex,
                    observacao: 'À vista ou até 4x sem juros. De 5x a 10x com juros.'
                },
                opcoes: creditOptions
            }
        ]
    });
});

// Rota Processamento de Compra
router.post('/finalizar-compra', (req, res) => {
    const { nomeCliente, emailCliente } = req.body;
    res.send(`
        <div style="text-align: center; padding: 50px; font-family: sans-serif;">
            <div style="font-size: 60px; color: #27ae60;">✓</div>
            <h1 style="color: #2c3e50;">Matrícula Confirmada!</h1>
            <p>Obrigado, <strong>${nomeCliente}</strong>.</p>
            <p>Os dados de acesso foram enviados para <strong>${emailCliente}</strong>.</p>
            <br>
            <a href="/" style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">Voltar para a Home</a>
        </div>
    `);
});

module.exports = router;