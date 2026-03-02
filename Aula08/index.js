const express = require('express')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const SUPPORTED_LANGS = ['pt', 'en', 'fr', 'es']

// Middlewares
app.use(cookieParser())
app.engine('handlebars', exphbs.engine({
    helpers: {
        // Format currency in BRL
        formatCurrency: (value) => {
            if (typeof value !== 'number') return value;
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        },
        // t(translations, lang) — picks the right language field
        // Usage in template: {{t this.nome lang}}
        t: (obj, lang) => {
            if (!obj || typeof obj !== 'object') return obj || '';
            if (!lang || !SUPPORTED_LANGS.includes(lang)) lang = 'pt';
            return obj[lang] || obj['pt'] || '';
        }
    }
}));
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

// Language middleware — reads lang cookie and exposes to all templates
app.use((req, res, next) => {
    const lang = req.cookies.isoacademy_lang;
    res.locals.lang = SUPPORTED_LANGS.includes(lang) ? lang : 'pt';
    next();
})

// Import routes
const router = require('./routes/index');

// Use routes
app.use('/', router);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`O servidor está rodando na porta ${port}`)
    })
}

module.exports = app