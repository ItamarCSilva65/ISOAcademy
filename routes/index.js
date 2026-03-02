// routes/index.js
const express = require('express');
const router = express.Router();
const coursesData = require('../data/coursesData');
const cursosGratuitosData = require('../data/cursos_gratuitosData');

const DEFAULT_MONTHLY_REAJUSTE_INDEX = Number(process.env.PAYMENT_REAJUSTE_INDEX || 0.0199);

const roundMoney = (value) => Number(value.toFixed(2));

const buildCreditOptions = (baseValue, monthlyIndex) => {
    const options = [];

    for (let installment = 1; installment <= 10; installment += 1) {
        if (installment === 5) continue;

        const hasIncrease = installment >= 6;
        const totalValue = hasIncrease
            ? baseValue * Math.pow(1 + monthlyIndex, installment - 5)
            : baseValue;

        options.push({
            parcelas: installment,
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
    res.render('home', {
        title: 'Todos os Nossos Cursos',
        courses: coursesData,
        isFullList: true
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
    // Verifica se veio um ID pela URL (ex: /carrinho?add=iso-9001)
    const addedId = req.query.add;

    let cartItems = [];

    if (addedId) {
        // Se o usuário clicou em comprar, mostra SÓ aquele curso no carrinho (Simulação)
        const item = coursesData.find(c => c.id === addedId);
        if (item) cartItems.push(item);
    }

    // Calcula total
    const total = cartItems.reduce((acc, item) => acc + item.preco, 0);

    res.render('carrinho', {
        title: 'Seu Carrinho de Compras',
        cartItems,
        total: total.toFixed(2),
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
                tipo: 'a_vista',
                total: roundMoney(valor),
                valorParcela: roundMoney(valor),
                acrescimo: 0
            },
            {
                tipo: 'debito',
                total: roundMoney(valor),
                valorParcela: roundMoney(valor),
                acrescimo: 0
            },
            {
                tipo: 'pix',
                total: roundMoney(valor),
                valorParcela: roundMoney(valor),
                acrescimo: 0
            },
            {
                tipo: 'cartao_credito',
                regras: {
                    semAcrescimoAte: 4,
                    acrescimoAPartirDe: 6,
                    maximoParcelas: 10,
                    indiceReajusteMensal: monthlyIndex,
                    observacao: 'Parcelamento de 5x não é ofertado nesta regra comercial.'
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