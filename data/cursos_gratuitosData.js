// data/cursos_gratuitosData.js — campos multilíngues (PT / EN / FR / ES)

const cursos_gratuitos = [
    {
        id: 'free-nao-conformidades',
        nome: {
            pt: 'Tratamento de Não Conformidades',
            en: 'Non-Conformity Treatment',
            fr: 'Traitement des Non-Conformités',
            es: 'Tratamiento de No Conformidades'
        },
        titulo_completo: {
            pt: 'ISO 9001:2015 — Introdução Gratuita',
            en: 'ISO 9001:2015 — Free Introduction',
            fr: 'ISO 9001:2015 — Introduction Gratuite',
            es: 'ISO 9001:2015 — Introducción Gratuita'
        },
        preco: 0.00,
        desc: {
            pt: 'Trate não conformidades de forma eficiente e eficaz. Aprenda os conceitos fundamentais da norma.',
            en: 'Handle non-conformities efficiently and effectively. Learn the fundamental concepts of the standard.',
            fr: 'Traitez les non-conformités de manière efficace et efficiente. Apprenez les concepts fondamentaux de la norme.',
            es: 'Trate las no conformidades de forma eficiente y eficaz. Aprenda los conceptos fundamentales de la norma.'
        },
        img: 'Não-conformidade-tratativa.png',
        destaque: false
    },
    {
        id: 'free-auditoria-interna',
        nome: {
            pt: 'Auditoria Interna — Conceitos Básicos',
            en: 'Internal Audit — Basic Concepts',
            fr: 'Audit Interne — Concepts de Base',
            es: 'Auditoría Interna — Conceptos Básicos'
        },
        titulo_completo: {
            pt: 'ISO 19011:2018 — Introdução Gratuita',
            en: 'ISO 19011:2018 — Free Introduction',
            fr: 'ISO 19011:2018 — Introduction Gratuite',
            es: 'ISO 19011:2018 — Introducción Gratuita'
        },
        preco: 0.00,
        desc: {
            pt: 'Entenda o que é uma auditoria interna e como contribui para a melhoria contínua do sistema de gestão.',
            en: 'Understand what an internal audit is and how it contributes to the continuous improvement of the management system.',
            fr: 'Comprenez ce qu\'est un audit interne et comment il contribue à l\'amélioration continue du système de management.',
            es: 'Comprenda qué es una auditoría interna y cómo contribuye a la mejora continua del sistema de gestión.'
        },
        img: 'Não-conformidade-tratativa.png',
        destaque: false
    }
];

module.exports = cursos_gratuitos;