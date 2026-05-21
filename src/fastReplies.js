const CONTACT_EMAIL = "contact@astroqodelabs.com";

const CATEGORY_ORDER = [
  "meta",
  "negative",
  "contact",
  "pricing",
  "timeline",
  "lifecycle",
  "objections",
  "process",
  "tech",
  "services",
  "greetings",
];

function normalizeLanguage(language = "en") {
  return language === "fr" || language === "ar" ? language : "en";
}

function reply(language, en, fr, ar) {
  const normalizedLanguage = normalizeLanguage(language);
  if (normalizedLanguage === "fr") return fr || en;
  if (normalizedLanguage === "ar") return ar || en;
  return en;
}

function hasArabic(text = "") {
  return /[\u0600-\u06FF]/.test(text);
}

function buildIntent({ key, category, patterns, responses, context }) {
  return { key, category, patterns, responses, context };
}

const INTENTS = [
  buildIntent({
    key: "identity",
    category: "meta",
    patterns: [/\b(who are you|what are you|are you human|are you real)\b/i, /\b(qui es-tu|vous etes qui|humain)\b/i, /من أنت|هل أنت انسان/i],
    responses: {
      en: "I'm Astro Assistant, built for astroqodelabs.com. How can we help with your project?",
      fr: "Je suis Astro Assistant, cree pour astroqodelabs.com. Comment pouvons-nous aider votre projet ?",
      ar: "أنا Astro Assistant الخاص بـ astroqodelabs.com. كيف يمكننا مساعدتك في مشروعك؟",
    },
  }),
  buildIntent({
    key: "model",
    category: "meta",
    patterns: [/\b(gpt|chatgpt|claude|model|llama|ollama|ai model|language model)\b/i, /\b(mod[èe]le|ia|intelligence artificielle)\b/i, /نموذج|ذكاء اصطناعي/i],
    responses: {
      en: "I'm Astro Assistant, focused on ASTROQODELABS projects. What are you looking to build?",
      fr: "Je suis Astro Assistant, dedie aux projets ASTROQODELABS. Que voulez-vous creer ?",
      ar: "أنا Astro Assistant ومهمتي توجيه مشاريع ASTROQODELABS. ماذا تريد أن تبني؟",
    },
  }),
  buildIntent({
    key: "internal_prompt",
    category: "meta",
    patterns: [/\b(system prompt|hidden prompt|internal prompt|instructions|router|knowledge base|developer message)\b/i, /\b(prompt|instructions internes|base de connaissance)\b/i],
    responses: {
      en: "I can't share internal instructions. I can help shape your project brief instead. What do you want to build?",
      fr: "Je ne peux pas partager les instructions internes. Je peux plutot structurer votre brief. Que voulez-vous creer ?",
      ar: "لا يمكنني مشاركة التعليمات الداخلية. يمكنني مساعدتك في تلخيص مشروعك. ماذا تريد أن تبني؟",
    },
  }),
  buildIntent({
    key: "action_limit",
    category: "negative",
    patterns: [/\b(send|submit|forward|email this|store this|save this|upload|post|publish|delete|change|buy|purchase)\b/i, /\b(envoie|envoyer|soumettre|transmettre|stocker|sauvegarder|publier|supprimer|modifier|acheter)\b/i, /ارسل|احفظ|انشر|احذف|اشتر/i],
    responses: {
      en: "I can't send or change anything from chat. I can prepare a clear project brief. What email should our team use?",
      fr: "Je ne peux rien envoyer ou modifier depuis le chat. Je peux preparer un brief clair. Quel email doit utiliser notre equipe ?",
      ar: "لا أستطيع الإرسال أو التغيير من المحادثة. يمكنني تجهيز ملخص واضح. ما البريد الذي يستخدمه فريقنا؟",
    },
  }),
  buildIntent({
    key: "off_topic",
    category: "negative",
    patterns: [/\b(homework|essay|recipe|weather|crypto|trading|medical|legal advice|python script|scraping|instagram)\b/i, /\b(devoir|recette|meteo|crypto|trading|medical|juridique|scraper)\b/i],
    responses: {
      en: "I can only help with ASTROQODELABS services and project intake. What digital product are you considering?",
      fr: "Je peux seulement aider avec les services ASTROQODELABS et le cadrage projet. Quel produit digital envisagez-vous ?",
      ar: "يمكنني المساعدة فقط في خدمات ASTROQODELABS وتحديد المشروع. ما المنتج الرقمي الذي تفكر فيه؟",
    },
  }),
  buildIntent({
    key: "business_platform_tech",
    category: "tech",
    patterns: [/\b(booking dashboard|admin dashboard|business dashboard|portal|workflow platform|staff roles)\b/i, /\b(tableau de bord|portail|plateforme|rendez-vous|reservation)\b/i],
    responses: {
      en: "We can build web apps with dashboards, accounts, admin panels, databases, APIs, and integrations. What workflow should it improve?",
      fr: "Nous creons des apps web avec dashboards, comptes, panels admin, bases de donnees, APIs et integrations. Quel workflow doit-elle ameliorer ?",
      ar: "نبني تطبيقات ويب بلوحات تحكم وحسابات وإدارة وقواعد بيانات وAPIs وتكاملات. ما سير العمل الذي يجب تحسينه؟",
    },
  }),
  buildIntent({
    key: "frustration",
    category: "negative",
    patterns: [/\b(bad answer|wrong|useless|hallucinating|not helpful|stupid|shit)\b/i, /\b(mauvaise reponse|faux|inutile|hallucine|pas utile)\b/i],
    responses: {
      en: "You're right to expect clearer answers. I'll keep it focused. What is the project you want our team to understand?",
      fr: "Vous avez raison d'attendre une reponse plus claire. Je vais rester precis. Quel projet doit comprendre notre equipe ?",
      ar: "معك حق، يجب أن تكون الإجابة أوضح. سأبقى مركزا. ما المشروع الذي تريد أن يفهمه فريقنا؟",
    },
  }),
  buildIntent({
    key: "human",
    category: "contact",
    patterns: [/\b(human|person|talk to someone|call me|book a call|meeting|schedule)\b/i, /\b(humain|personne|appel|rendez-vous|reunion)\b/i, /شخص|مكالمة|موعد/i],
    responses: {
      en: "We can prepare a handoff for our team. What email should they use to contact you?",
      fr: "Nous pouvons preparer le relais pour notre equipe. Quel email doit-elle utiliser pour vous contacter ?",
      ar: "يمكننا تجهيز تحويل لفريقنا. ما البريد المناسب للتواصل معك؟",
    },
  }),
  buildIntent({
    key: "contact",
    category: "contact",
    patterns: [/\b(contact|email|mail|phone|whatsapp|reach you)\b/i, /\b(contacter|telephone|whatsapp|email|mail)\b/i, /تواصل|هاتف|واتساب|بريد/i],
    responses: {
      en: `You can reach us at ${CONTACT_EMAIL}. I can also collect a short brief first. What are you building?`,
      fr: `Vous pouvez nous joindre a ${CONTACT_EMAIL}. Je peux aussi collecter un court brief. Que construisez-vous ?`,
      ar: `يمكنك التواصل معنا عبر ${CONTACT_EMAIL}. ويمكنني أولا جمع ملخص قصير. ماذا تبني؟`,
    },
  }),
  buildIntent({
    key: "proposal",
    category: "contact",
    patterns: [/\b(proposal|quote|estimate|send offer|commercial offer)\b/i, /\b(proposition|devis|offre commerciale|estimation)\b/i, /عرض سعر|تقدير|اقتراح/i],
    responses: {
      en: "We can shape the details needed for a proposal. What is the project type?",
      fr: "Nous pouvons structurer les details necessaires pour une proposition. Quel est le type de projet ?",
      ar: "يمكننا ترتيب التفاصيل اللازمة لعرض مناسب. ما نوع المشروع؟",
    },
  }),
  buildIntent({
    key: "pricing_general",
    category: "pricing",
    patterns: [/\b(price|pricing|cost|how much|budget|investment|rate)\b/i, /\b(prix|tarif|co[ûu]t|combien|budget|investissement)\b/i, /سعر|تكلفة|ميزانية|كم/i],
    responses: {
      en: "Pricing depends on scope, features, integrations, timeline, and support. Is your range starter, growth, premium, or not defined yet?",
      fr: "Le prix depend du scope, des fonctions, integrations, delais et support. Votre fourchette est starter, growth, premium ou pas encore definie ?",
      ar: "السعر يعتمد على النطاق والميزات والتكاملات والوقت والدعم. هل الميزانية starter أو growth أو premium أم غير محددة؟",
    },
  }),
  buildIntent({
    key: "cheap",
    category: "pricing",
    patterns: [/\b(cheap|low budget|small budget|affordable|starter)\b/i, /\b(petit budget|pas cher|abordable|starter)\b/i],
    responses: {
      en: "For a starter range, we should focus on the smallest version that proves value. What is the must-have outcome?",
      fr: "Avec un budget starter, il faut viser la plus petite version utile. Quel resultat est indispensable ?",
      ar: "للميزانية starter نركز على أصغر نسخة تثبت القيمة. ما النتيجة الأساسية؟",
    },
  }),
  buildIntent({
    key: "premium_budget",
    category: "pricing",
    patterns: [/\b(premium|custom solution|high quality|enterprise|serious budget)\b/i, /\b(premium|sur mesure|haute qualite|entreprise)\b/i],
    responses: {
      en: "For a premium build, we can prioritize strategy, design quality, robust architecture, and support. What business goal matters most?",
      fr: "Pour un projet premium, nous priorisons strategie, design, architecture robuste et support. Quel objectif business compte le plus ?",
      ar: "في مشروع premium نركز على الاستراتيجية والتصميم والبنية القوية والدعم. ما الهدف التجاري الأهم؟",
    },
  }),
  buildIntent({
    key: "timeline_general",
    category: "timeline",
    patterns: [/\b(timeline|deadline|duration|how long|delivery|launch date|when can)\b/i, /\b(d[ée]lai|combien de temps|livraison|date de lancement|quand)\b/i, /مدة|موعد|تسليم|إطلاق/i],
    responses: {
      en: "Timeline depends on complexity, content readiness, integrations, and feedback speed. When would you like to launch?",
      fr: "Le delai depend de la complexite, du contenu, des integrations et des retours. Quand souhaitez-vous lancer ?",
      ar: "المدة تعتمد على التعقيد والمحتوى والتكاملات وسرعة الملاحظات. متى تريد الإطلاق؟",
    },
  }),
  buildIntent({
    key: "urgent",
    category: "timeline",
    patterns: [/\b(asap|urgent|this week|immediately|fast|quickly)\b/i, /\b(urgent|vite|cette semaine|rapidement|immediatement)\b/i, /عاجل|بسرعة|هذا الأسبوع/i],
    responses: {
      en: "If it is urgent, we should reduce scope to the launch essentials. What must be live first?",
      fr: "Si c'est urgent, il faut reduire le scope aux essentiels du lancement. Qu'est-ce qui doit etre en ligne d'abord ?",
      ar: "إذا كان عاجلا، نختصر النطاق لأولويات الإطلاق. ما الذي يجب أن يكون جاهزا أولا؟",
    },
  }),
  buildIntent({
    key: "maintenance",
    category: "lifecycle",
    patterns: [/\b(maintenance|support|after launch|post launch|retainer|updates)\b/i, /\b(maintenance|support|apres lancement|mises a jour)\b/i, /صيانة|دعم|بعد الإطلاق/i],
    responses: {
      en: "We can include maintenance, updates, monitoring, and improvements after launch. What level of support do you expect?",
      fr: "Nous pouvons inclure maintenance, mises a jour, suivi et ameliorations apres lancement. Quel niveau de support attendez-vous ?",
      ar: "يمكننا تضمين الصيانة والتحديثات والمتابعة بعد الإطلاق. ما مستوى الدعم المتوقع؟",
    },
  }),
  buildIntent({
    key: "ownership",
    category: "lifecycle",
    patterns: [/\b(own the code|ownership|handover|source code|transfer)\b/i, /\b(propriete|code source|transfert|handover|livraison)\b/i, /ملكية|الكود|تسليم/i],
    responses: {
      en: "Ownership and handover can be defined clearly in the scope. Do you need full source code handover?",
      fr: "La propriete et le transfert peuvent etre definis clairement dans le scope. Voulez-vous le code source complet ?",
      ar: "يمكن توضيح الملكية والتسليم في النطاق. هل تحتاج تسليم الكود بالكامل؟",
    },
  }),
  buildIntent({
    key: "scale",
    category: "lifecycle",
    patterns: [/\b(scale|scalable|growth|many users|performance later)\b/i, /\b(scalable|evolutif|croissance|beaucoup d'utilisateurs|performance)\b/i],
    responses: {
      en: "We can design for a clear first version and a path to scale. How many users or transactions do you expect first?",
      fr: "Nous pouvons concevoir une premiere version claire avec une trajectoire scalable. Combien d'utilisateurs ou transactions au depart ?",
      ar: "يمكننا بناء نسخة أولى واضحة مع مسار للتوسع. كم مستخدما أو معاملة تتوقع في البداية؟",
    },
  }),
  buildIntent({
    key: "portfolio",
    category: "objections",
    patterns: [/\b(portfolio|examples|past work|case studies|show work)\b/i, /\b(portfolio|exemples|realisations|cas client)\b/i, /أعمال|أمثلة|مشاريع سابقة/i],
    responses: {
      en: "You can review our work on the site, and our team can share relevant examples after the scope is clear. What industry is your project in?",
      fr: "Vous pouvez voir nos realisations sur le site, et notre equipe peut partager des exemples selon le scope. Quel est votre secteur ?",
      ar: "يمكنك مراجعة أعمالنا على الموقع، ويمكن لفريقنا مشاركة أمثلة مناسبة بعد فهم النطاق. ما مجال مشروعك؟",
    },
  }),
  buildIntent({
    key: "why_us",
    category: "objections",
    patterns: [/\b(why choose you|why astro|better than|competitor|agency)\b/i, /\b(pourquoi vous|pourquoi astro|concurrent|agence)\b/i],
    responses: {
      en: "We focus on clear strategy, strong engineering, polished UX, and practical launch execution. What matters most for your decision?",
      fr: "Nous misons sur strategie claire, engineering solide, UX soignee et execution pratique. Qu'est-ce qui compte le plus pour votre choix ?",
      ar: "نركز على استراتيجية واضحة وهندسة قوية وتجربة مستخدم دقيقة وتنفيذ عملي. ما أهم معيار لاختيارك؟",
    },
  }),
  buildIntent({
    key: "language",
    category: "objections",
    patterns: [/\b(do you speak|language|french|english|arabic)\b/i, /\b(langue|francais|anglais|arabe)\b/i, /لغة|فرنسي|انجليزي|عربي/i],
    responses: {
      en: "We can continue in English, French, or Arabic. Which language should we use for your project brief?",
      fr: "Nous pouvons continuer en francais, anglais ou arabe. Quelle langue preferez-vous pour le brief ?",
      ar: "يمكننا المتابعة بالعربية أو الفرنسية أو الإنجليزية. ما اللغة المناسبة لملخص المشروع؟",
    },
  }),
  buildIntent({
    key: "process",
    category: "process",
    patterns: [/\b(process|workflow|how do you work|steps|methodology)\b/i, /\b(processus|methode|comment travaillez|etapes)\b/i, /طريقة العمل|خطوات|منهجية/i],
    responses: {
      en: "Our process is discovery, scope, design, build, testing, launch, then support. Which stage are you in now?",
      fr: "Notre process: discovery, scope, design, developpement, tests, lancement, puis support. A quelle etape etes-vous ?",
      ar: "طريقتنا: اكتشاف، تحديد نطاق، تصميم، تطوير، اختبار، إطلاق، ثم دعم. في أي مرحلة أنت الآن؟",
    },
  }),
  buildIntent({
    key: "discovery",
    category: "process",
    patterns: [/\b(discovery|brief|requirements|specification|scope)\b/i, /\b(discovery|brief|besoins|specification|scope|cadrage)\b/i],
    responses: {
      en: "Discovery clarifies goals, users, features, timeline, and investment range. What problem should the project solve first?",
      fr: "Le cadrage clarifie objectifs, utilisateurs, fonctions, delai et budget. Quel probleme faut-il resoudre d'abord ?",
      ar: "مرحلة الاكتشاف توضح الهدف والمستخدمين والميزات والوقت والميزانية. ما المشكلة الأولى التي يجب حلها؟",
    },
  }),
  buildIntent({
    key: "communication",
    category: "process",
    patterns: [/\b(slack|discord|communication|updates|project management)\b/i, /\b(communication|suivi|updates|gestion projet)\b/i],
    responses: {
      en: "Communication can be set around your workflow, with clear updates and milestones. What contact method do you prefer?",
      fr: "La communication peut s'adapter a votre workflow, avec points clairs et jalons. Quel canal preferez-vous ?",
      ar: "يمكن تنظيم التواصل حسب عملك مع تحديثات ومراحل واضحة. ما وسيلة التواصل المفضلة؟",
    },
  }),
  buildIntent({
    key: "frontend",
    category: "tech",
    patterns: [/\b(react|next\.?js|vue|typescript|tailwind|frontend|front-end)\b/i],
    responses: {
      en: "Yes, we build modern frontends with strong UX, performance, and maintainability. What experience should users have?",
      fr: "Oui, nous creons des frontends modernes avec UX, performance et maintenabilite. Quelle experience voulez-vous offrir ?",
      ar: "نعم، نبني واجهات حديثة مع تجربة قوية وأداء وقابلية صيانة. ما التجربة المطلوبة للمستخدم؟",
    },
  }),
  buildIntent({
    key: "backend",
    category: "tech",
    patterns: [/\b(node|express|spring boot|python|api|backend|back-end|microservices?)\b/i, /\b(api|backend|microservices|spring boot|node)\b/i],
    responses: {
      en: "We can build robust APIs, backends, and microservices around your workflow. What data or process should the backend manage?",
      fr: "Nous pouvons creer APIs, backends et microservices robustes autour de votre workflow. Quelles donnees ou processus faut-il gerer ?",
      ar: "يمكننا بناء APIs وأنظمة خلفية وخدمات مصغرة حول سير عملك. ما البيانات أو العمليات التي يجب إدارتها؟",
    },
  }),
  buildIntent({
    key: "database",
    category: "tech",
    patterns: [/\b(postgres|postgresql|mongodb|mysql|redis|database|db|elasticsearch)\b/i, /\b(base de donnees|postgresql|mongodb|redis)\b/i],
    responses: {
      en: "We can design the database around reporting, speed, and future growth. What information will the system store?",
      fr: "Nous pouvons concevoir la base autour du reporting, de la vitesse et de l'evolution. Quelles informations faut-il stocker ?",
      ar: "يمكننا تصميم قاعدة البيانات للتقارير والسرعة والنمو. ما المعلومات التي سيخزنها النظام؟",
    },
  }),
  buildIntent({
    key: "cloud_devops",
    category: "tech",
    patterns: [/\b(docker|kubernetes|terraform|ci\/cd|devops|aws|gcp|azure|vercel|cloud)\b/i, /\b(devops|cloud|docker|kubernetes|aws|azure|gcp)\b/i],
    responses: {
      en: "We can plan deployment, CI/CD, containers, and cloud infrastructure. Do you already have hosting or a cloud provider?",
      fr: "Nous pouvons planifier deploiement, CI/CD, containers et infrastructure cloud. Avez-vous deja un hebergeur ou cloud ?",
      ar: "يمكننا تخطيط النشر و CI/CD والحاويات والبنية السحابية. هل لديك استضافة أو مزود سحابي؟",
    },
  }),
  buildIntent({
    key: "security",
    category: "tech",
    patterns: [/\b(security|auth|login|jwt|oauth|saml|keycloak|rbac|mfa|roles)\b/i, /\b(securite|authentification|connexion|roles|keycloak)\b/i],
    responses: {
      en: "We can include authentication, roles, permissions, and security reviews. What users or roles will the system need?",
      fr: "Nous pouvons inclure authentification, roles, permissions et revue securite. Quels utilisateurs ou roles faut-il ?",
      ar: "يمكننا تضمين المصادقة والأدوار والصلاحيات ومراجعة الأمان. ما أنواع المستخدمين المطلوبة؟",
    },
  }),
  buildIntent({
    key: "payments",
    category: "tech",
    patterns: [/\b(stripe|paypal|cmi|payment|checkout|subscription|billing|woocommerce|shopify)\b/i, /\b(paiement|checkout|abonnement|facturation|stripe|paypal|cmi)\b/i],
    responses: {
      en: "We can integrate payments like Stripe, PayPal, CMI, Shopify, WooCommerce, or custom checkout. What do customers pay for?",
      fr: "Nous pouvons integrer Stripe, PayPal, CMI, Shopify, WooCommerce ou checkout sur mesure. Que paient vos clients ?",
      ar: "يمكننا دمج Stripe أو PayPal أو CMI أو Shopify أو WooCommerce أو دفع مخصص. مقابل ماذا سيدفع العملاء؟",
    },
  }),
  buildIntent({
    key: "custom_stack",
    category: "tech",
    patterns: [/\b(no wordpress|not wordpress|without wordpress|dont want wordpress|don't want wordpress|robust tech|robuste tech|custom stack|from scratch)\b/i, /\b(pas wordpress|sans wordpress|tech robuste|stack robuste|sur mesure)\b/i],
    responses: {
      en: "Absolutely. We can build a custom robust stack instead of WordPress. What should the platform do first?",
      fr: "Oui. Nous pouvons creer une stack robuste sur mesure au lieu de WordPress. Que doit faire la plateforme d'abord ?",
      ar: "نعم. يمكننا بناء بنية مخصصة وقوية بدل WordPress. ما أول وظيفة يجب أن تنفذها المنصة؟",
    },
  }),
  buildIntent({
    key: "services_general",
    category: "services",
    patterns: [/\b(what do you do|services|offer|can you do|help me with)\b/i, /\b(que faites-vous|services|offres|vous faites quoi|aidez-moi)\b/i],
    responses: {
      en: "We build websites, web apps, SaaS platforms, e-commerce, dashboards, AI assistants, automation, APIs, and cloud-ready software. What do you want to create?",
      fr: "Nous creons sites web, apps web, SaaS, e-commerce, dashboards, assistants IA, automatisations, APIs et logiciels cloud-ready. Que voulez-vous creer ?",
      ar: "نبني مواقع وتطبيقات ويب وSaaS ومتاجر ولوحات تحكم ومساعدين وأتمتة وAPIs وبرمجيات سحابية. ماذا تريد أن تنشئ؟",
    },
  }),
  buildIntent({
    key: "explain_website",
    category: "services",
    patterns: [/\b(what is a website|what are websites|dont know what website|don't know what website|you tell me)\b/i, /\b(c'est quoi un site|je ne sais pas quel site|dites-moi)\b/i],
    responses: {
      en: "A website explains your offer, builds trust, and guides visitors to act. Should visitors contact you, book, buy, or learn?",
      fr: "Un site explique votre offre, rassure et guide les visiteurs vers une action. Ils doivent contacter, reserver, acheter ou decouvrir ?",
      ar: "الموقع يشرح عرضك ويبني الثقة ويوجه الزائر لاتخاذ إجراء. هل تريد أن يتواصل أو يحجز أو يشتري أو يتعلم؟",
    },
  }),
  buildIntent({
    key: "website",
    category: "services",
    patterns: [/\b(website|business site|site web|portfolio|wordpress|redesign)\b/i, /\b(site vitrine|site internet|portfolio|refonte)\b/i],
    responses: {
      en: "We can build business websites, landing pages, portfolios, WordPress, or custom websites focused on clarity and leads. What should the site achieve?",
      fr: "Nous pouvons creer sites vitrines, landing pages, portfolios, WordPress ou sites sur mesure axes clarte et leads. Quel objectif pour le site ?",
      ar: "يمكننا بناء مواقع أعمال وصفحات هبوط وبورتفوليو وWordPress أو مواقع مخصصة للوضوح وجذب العملاء. ما هدف الموقع؟",
    },
  }),
  buildIntent({
    key: "landing_page",
    category: "services",
    patterns: [/\b(landing page|landing|product launch|product lauch|launch page)\b/i, /\b(landing page|page de vente|lancement produit)\b/i],
    responses: {
      en: "A landing page is best for one focused offer, launch, or campaign. What are you promoting?",
      fr: "Une landing page est ideale pour une offre, un lancement ou une campagne precise. Que voulez-vous promouvoir ?",
      ar: "صفحة الهبوط مناسبة لعرض أو إطلاق أو حملة محددة. ما الشيء الذي تريد الترويج له؟",
    },
  }),
  buildIntent({
    key: "product_device",
    category: "services",
    patterns: [/\b(mechanical device|mecanical device|device for builders|construction device|builders)\b/i, /\b(appareil mecanique|outil pour constructeurs|batiment)\b/i],
    context: ({ conversationText }) => /\b(landing|launch|lancement|page|product)\b/i.test(conversationText),
    responses: {
      en: "That fits a focused product landing page: problem, use cases, visuals, proof, and quote request. Who should buy it?",
      fr: "Cela convient a une landing page produit: probleme, usages, visuels, preuves et demande de devis. Qui doit l'acheter ?",
      ar: "هذا يناسب صفحة هبوط للمنتج: المشكلة، الاستخدامات، الصور، الإثبات، وطلب عرض. من المشتري المستهدف؟",
    },
  }),
  buildIntent({
    key: "web_app",
    category: "services",
    patterns: [/\b(web app|application|dashboard|portal|admin panel|booking|reservation|workflow|platform)\b/i, /\b(application web|tableau de bord|portail|reservation|workflow|plateforme)\b/i],
    responses: {
      en: "We build web apps with dashboards, accounts, admin panels, databases, APIs, and integrations. What workflow should it improve?",
      fr: "Nous creons des apps web avec dashboards, comptes, panels admin, bases de donnees, APIs et integrations. Quel workflow doit-elle ameliorer ?",
      ar: "نبني تطبيقات ويب بلوحات تحكم وحسابات وإدارة وقواعد بيانات وAPIs وتكاملات. ما سير العمل الذي يجب تحسينه؟",
    },
  }),
  buildIntent({
    key: "saas",
    category: "services",
    patterns: [/\b(saas|mvp|subscription app|multi-tenant|startup platform)\b/i, /\b(saas|mvp|abonnement|plateforme startup)\b/i],
    responses: {
      en: "We can build a SaaS or MVP with accounts, roles, billing, analytics, and launch architecture. What problem will users pay to solve?",
      fr: "Nous pouvons creer un SaaS ou MVP avec comptes, roles, billing, analytics et architecture de lancement. Quel probleme les utilisateurs paient-ils pour resoudre ?",
      ar: "يمكننا بناء SaaS أو MVP بحسابات وأدوار وفوترة وتحليلات وبنية إطلاق. ما المشكلة التي سيدفع المستخدمون لحلها؟",
    },
  }),
  buildIntent({
    key: "ecommerce",
    category: "services",
    patterns: [/\b(e-?commerce|online store|shop|storefront|catalog|sell online|product catalog)\b/i, /\b(boutique|e-commerce|catalogue|vendre en ligne|produits)\b/i],
    responses: {
      en: "We can build stores with catalog, checkout, payments, subscriptions, Shopify, WooCommerce, or custom e-commerce. What do you sell?",
      fr: "Nous pouvons creer catalogue, checkout, paiements, abonnements, Shopify, WooCommerce ou e-commerce sur mesure. Que vendez-vous ?",
      ar: "يمكننا بناء متجر بكتالوج ودفع واشتراكات أو Shopify/WooCommerce أو نظام مخصص. ماذا تبيع؟",
    },
  }),
  buildIntent({
    key: "ai_automation",
    category: "services",
    patterns: [/\b(ai assistant|chatbot|automation|automate|agent|rag|llm|n8n)\b/i, /\b(assistant ia|chatbot|automatisation|automatiser|agent|rag)\b/i],
    responses: {
      en: "We can build AI assistants, lead qualification, automation workflows, RAG knowledge bases, and integrations. What task should be automated?",
      fr: "Nous pouvons creer assistants IA, qualification de leads, automatisations, bases RAG et integrations. Quelle tache faut-il automatiser ?",
      ar: "يمكننا بناء مساعدين وأتمتة وتأهيل عملاء وقواعد معرفة RAG وتكاملات. ما المهمة التي تريد أتمتتها؟",
    },
  }),
  buildIntent({
    key: "mobile",
    category: "services",
    patterns: [/\b(mobile app|ios|android|react native|expo)\b/i, /\b(application mobile|ios|android)\b/i],
    responses: {
      en: "We can scope mobile experiences when they support the business goal. Is this mobile-only or paired with a web platform?",
      fr: "Nous pouvons cadrer une experience mobile si elle sert l'objectif business. Mobile seul ou avec plateforme web ?",
      ar: "يمكننا تحديد تجربة موبايل تخدم الهدف التجاري. هل هي موبايل فقط أم مع منصة ويب؟",
    },
  }),
  buildIntent({
    key: "idea_plan",
    category: "services",
    patterns: [/\b(idea|not sure|where to start|clear plan|help me choose|guide me|dont know|don't know)\b/i, /\b(idee|pas sur|par quoi commencer|plan clair|guidez-moi|je ne sais pas)\b/i],
    responses: {
      en: "No problem. We can turn the idea into a clear first version. What is the idea in one sentence?",
      fr: "Pas de souci. Nous pouvons transformer l'idee en premiere version claire. Quelle est l'idee en une phrase ?",
      ar: "لا مشكلة. يمكننا تحويل الفكرة إلى نسخة أولى واضحة. ما الفكرة في جملة واحدة؟",
    },
  }),
  buildIntent({
    key: "greeting",
    category: "greetings",
    patterns: [/\b(hi|hello|hey|good morning|good evening)\b/i, /\b(bonjour|salut|bonsoir)\b/i, /مرحبا|السلام عليكم|أهلا/i],
    responses: {
      en: "Hi, welcome to ASTROQODELABS. What are you looking to build?",
      fr: "Bonjour, bienvenue chez ASTROQODELABS. Que voulez-vous creer ?",
      ar: "مرحبا بك في ASTROQODELABS. ماذا تريد أن تبني؟",
    },
  }),
];

const INTERNAL_LEAK_PATTERNS = [
  /widget behavior/i,
  /boundaries:/i,
  /compact company brief/i,
  /company knowledge/i,
  /system prompt/i,
  /developer message/i,
  /intent router/i,
  /llm conversational layer/i,
];

function getLatestUserMessage(messages = []) {
  return [...messages].reverse().find((message) => message?.role === "user")?.content || "";
}

function getConversationText(messages = []) {
  return messages.map((message) => message?.content || "").join("\n").slice(-1600);
}

function selectLanguage(language, latestUserMessage) {
  if (hasArabic(latestUserMessage)) return "ar";
  return normalizeLanguage(language);
}

export function getFastReply({ messages, language = "en" }) {
  const cleanMessages = Array.isArray(messages) ? messages : [];
  const latestUserMessage = getLatestUserMessage(cleanMessages).trim();

  if (!latestUserMessage || latestUserMessage.length > 380) {
    return "";
  }

  const normalizedLanguage = selectLanguage(language, latestUserMessage);
  const conversationText = getConversationText(cleanMessages);

  for (const category of CATEGORY_ORDER) {
    for (const intent of INTENTS) {
      if (intent.category !== category) continue;
      if (intent.context && !intent.context({ latestUserMessage, conversationText, messages: cleanMessages })) continue;

      if (intent.patterns.some((pattern) => pattern.test(latestUserMessage))) {
        return intent.responses[normalizedLanguage] || intent.responses.en;
      }
    }
  }

  return "";
}

export function getIntentRouterStats() {
  return {
    categories: CATEGORY_ORDER.length,
    intentGroups: INTENTS.length,
    scriptedPatterns: INTENTS.reduce((total, intent) => total + intent.patterns.length, 0),
  };
}

export function getSafeFallbackReply(language = "en") {
  return reply(
    language,
    "Let's keep this simple. What do you want to build, and what should it achieve?",
    "Restons simple. Que voulez-vous creer, et quel resultat attendez-vous ?",
    "لنبق الأمر بسيطا. ماذا تريد أن تبني، وما النتيجة المطلوبة؟",
  );
}

export function looksLikeInternalLeak(replyText) {
  return typeof replyText === "string" && INTERNAL_LEAK_PATTERNS.some((pattern) => pattern.test(replyText));
}
