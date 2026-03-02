// data/coursesData.js — campos multilíngues (PT / EN / FR / ES)

const courses = [
    {
        id: 'iso-9001',
        nome: {
            pt: 'ISO 9001:2015',
            en: 'ISO 9001:2015',
            fr: 'ISO 9001:2015',
            es: 'ISO 9001:2015'
        },
        titulo_completo: {
            pt: 'Sistema de Gestão da Qualidade (SGQ)',
            en: 'Quality Management System (QMS)',
            fr: 'Système de Management de la Qualité (SMQ)',
            es: 'Sistema de Gestión de la Calidad (SGC)'
        },
        preco: 299.90,
        desc: {
            pt: 'Domine os requisitos para implementar um sistema de gestão da qualidade focado na satisfação do cliente e melhoria contínua.',
            en: 'Master the requirements to implement a quality management system focused on customer satisfaction and continuous improvement.',
            fr: 'Maîtrisez les exigences pour mettre en place un système de management de la qualité axé sur la satisfaction client et l\'amélioration continue.',
            es: 'Domine los requisitos para implementar un sistema de gestión de la calidad centrado en la satisfacción del cliente y la mejora continua.'
        },
        img: '/img/iso-9001-cover.png',
        destaque: true
    },
    {
        id: 'iso-14001',
        nome: {
            pt: 'ISO 14001:2015',
            en: 'ISO 14001:2015',
            fr: 'ISO 14001:2015',
            es: 'ISO 14001:2015'
        },
        titulo_completo: {
            pt: 'Sistema de Gestão Ambiental (SGA)',
            en: 'Environmental Management System (EMS)',
            fr: 'Système de Management Environnemental (SME)',
            es: 'Sistema de Gestión Ambiental (SGA)'
        },
        preco: 299.90,
        desc: {
            pt: 'Aprenda a gerenciar responsabilidades ambientais de forma sistemática, contribuindo para o pilar ambiental da sustentabilidade.',
            en: 'Learn to manage environmental responsibilities systematically, contributing to the environmental pillar of sustainability.',
            fr: 'Apprenez à gérer les responsabilités environnementales de manière systématique, contribuant au pilier environnemental du développement durable.',
            es: 'Aprenda a gestionar las responsabilidades medioambientales de forma sistemática, contribuyendo al pilar ambiental de la sostenibilidad.'
        },
        img: '/img/iso-14001-cover.png',
        destaque: true
    },
    {
        id: 'iso-45001',
        nome: {
            pt: 'ISO 45001:2018',
            en: 'ISO 45001:2018',
            fr: 'ISO 45001:2018',
            es: 'ISO 45001:2018'
        },
        titulo_completo: {
            pt: 'Gestão de Saúde e Segurança Ocupacional',
            en: 'Occupational Health and Safety Management',
            fr: 'Management de la Santé et Sécurité au Travail',
            es: 'Gestión de Salud y Seguridad Ocupacional'
        },
        preco: 349.90,
        desc: {
            pt: 'O padrão internacional para reduzir riscos ocupacionais e proporcionar locais de trabalho seguros e saudáveis.',
            en: 'The international standard for reducing occupational risks and providing safe and healthy workplaces.',
            fr: 'La norme internationale pour réduire les risques professionnels et créer des environnements de travail sûrs et sains.',
            es: 'El estándar internacional para reducir los riesgos laborales y proporcionar lugares de trabajo seguros y saludables.'
        },
        img: '/img/iso-45001-cover.png',
        destaque: true
    },
    {
        id: 'iso-13485',
        nome: {
            pt: 'ISO 13485:2016',
            en: 'ISO 13485:2016',
            fr: 'ISO 13485:2016',
            es: 'ISO 13485:2016'
        },
        titulo_completo: {
            pt: 'Dispositivos Médicos — SGQ',
            en: 'Medical Devices — QMS',
            fr: 'Dispositifs Médicaux — SMQ',
            es: 'Dispositivos Médicos — SGC'
        },
        preco: 399.90,
        desc: {
            pt: 'Requisitos específicos para sistemas de gestão da qualidade na indústria de dispositivos médicos.',
            en: 'Specific requirements for quality management systems in the medical devices industry.',
            fr: 'Exigences spécifiques aux systèmes de management de la qualité dans l\'industrie des dispositifs médicaux.',
            es: 'Requisitos específicos para sistemas de gestión de la calidad en la industria de dispositivos médicos.'
        },
        img: '/img/iso-13485-cover.png',
        destaque: false
    },
    {
        id: 'iso-17025',
        nome: {
            pt: 'ISO/IEC 17025:2017',
            en: 'ISO/IEC 17025:2017',
            fr: 'ISO/IEC 17025:2017',
            es: 'ISO/IEC 17025:2017'
        },
        titulo_completo: {
            pt: 'Competência de Laboratórios',
            en: 'Testing and Calibration Laboratory Competence',
            fr: 'Compétence des Laboratoires d\'Essais et d\'Étalonnage',
            es: 'Competencia de Laboratorios de Ensayo y Calibración'
        },
        preco: 450.00,
        desc: {
            pt: 'A norma essencial para laboratórios que desejam demonstrar competência técnica e resultados válidos.',
            en: 'The essential standard for laboratories wishing to demonstrate technical competence and produce valid results.',
            fr: 'La norme essentielle pour les laboratoires souhaitant démontrer leur compétence technique et produire des résultats valides.',
            es: 'La norma esencial para laboratorios que desean demostrar competencia técnica y producir resultados válidos.'
        },
        img: '/img/iso-17025-cover.png',
        destaque: false
    },
    {
        id: 'iso-19011',
        nome: {
            pt: 'ISO 19011:2018',
            en: 'ISO 19011:2018',
            fr: 'ISO 19011:2018',
            es: 'ISO 19011:2018'
        },
        titulo_completo: {
            pt: 'Diretrizes para Auditoria',
            en: 'Guidelines for Auditing Management Systems',
            fr: 'Lignes Directrices pour l\'Audit des Systèmes de Management',
            es: 'Directrices para la Auditoría de Sistemas de Gestión'
        },
        preco: 250.00,
        desc: {
            pt: 'Torne-se um auditor interno. Aprenda a planejar e realizar auditorias de acordo com as melhores práticas.',
            en: 'Become an internal auditor. Learn to plan and conduct audits according to best practices.',
            fr: 'Devenez auditeur interne. Apprenez à planifier et réaliser des audits conformément aux meilleures pratiques.',
            es: 'Conviértase en auditor interno. Aprenda a planificar y realizar auditorías de acuerdo con las mejores prácticas.'
        },
        img: '/img/iso-19011-cover.png',
        destaque: false
    }
];

module.exports = courses;
