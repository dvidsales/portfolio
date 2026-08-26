/* data.js — dados do portfólio de David Sales (projetos, softwares, traduções). Gerado a partir do index.html original; nenhum link de vídeo foi alterado. */

/* ============================================================
   COMO ADICIONAR UM VÍDEO A UM PROJETO JÁ EXISTENTE
   (ex.: colocar mais um vídeo/reel da Hemobrás)
   ============================================================
   Ache o projeto certo em PROJECTS (mais abaixo, procure por "id:'hemobras'"
   ou "id:'noticias-campus'" etc.) e adicione um item dentro do array "videos:[ ]":

   { caption:{pt:'legenda em pt', en:'caption in en', es:'leyenda en es'},
     embed:"COLE_AQUI_O_LINK_DE_PREVIEW_DO_GOOGLE_DRIVE" }

   → Isso cria um vídeo HORIZONTAL (16:9) — é o padrão, não precisa declarar nada a mais.

   Se o vídeo for um REEL VERTICAL (9:16, formato Instagram/TikTok), adicione
   também a propriedade orientation:'vertical':

   { caption:{pt:'legenda em pt', en:'caption in en', es:'leyenda en es'},
     embed:"COLE_AQUI_O_LINK_DE_PREVIEW_DO_GOOGLE_DRIVE",
     orientation:'vertical' }

   → O player se ajusta sozinho: 16:9 por padrão, 9:16 quando marcado assim.
     Pode misturar os dois formatos dentro do mesmo array "videos:[ ]" sem problema.

   Se quiser separar os vídeos do projeto em ABAS (ex.: "instagram" vs "tv
   corporativa"), adicione também category:'algum-nome' em cada vídeo:

   { caption:{...}, embed:"...", category:'tv' }

   → Assim que houver 2+ categorias diferentes num mesmo projeto, as abas
     aparecem sozinhas acima da galeria (não precisa fazer mais nada). Com só
     uma categoria (ou nenhuma definida), nenhuma aba aparece, mas o vídeo
     ainda ganha uma etiqueta discreta no canto (ex.: "youtube") — a etiqueta
     e a aba usam o mesmo texto, vindo do I18N logo abaixo, nas chaves
     "cat_instagram", "cat_tv", "cat_youtube" etc. — se criar uma categoria
     nova, adicione a tradução dela lá (pt/en/es) do mesmo jeito.

   IMPORTANTE: nunca edite um link "embed" já existente — só adicione itens novos.

   ============================================================
   COMO CRIAR UM PROJETO/EMPRESA NOVA DO ZERO
   ============================================================
   1. Adicione um objeto novo aqui em PROJECTS (copie a estrutura de um já existente).
   2. Se for uma empresa nova com página própria, crie um arquivo HTML novo
      (copie hemobras.html ou ufpe.html como modelo) e ajuste, perto do fim do
      arquivo, a linha: window.PROJECTS_FILTER_IDS = ['id-do-seu-projeto'];
   3. Adicione um link clicável até essa página na seção "experiência" do
      index.html e na seção "meus trabalhos" (procure por bin-org-link).
   ============================================================ */

const SOFTWARES = [
  { id:'pr', name:'Premiere Pro', color:'#00005b', abbr:'Pr', level:85 },
  { id:'ae', name:'After Effects', color:'#00005b', abbr:'Ae', level:65 },
  { id:'ps', name:'Photoshop', color:'#001e36', abbr:'Ps', level:75 },
  { id:'ai', name:'Illustrator', color:'#330000', abbr:'Ai', level:75 },
  { id:'fig', name:'Figma', color:'#1e1e1e', abbr:'Fi', level:70 },
];

const CREDIT_LABELS = {
  pt:{ reportagem_producao:'reportagem e produção', imagens:'imagens', imagens_edicao:'imagens e edição',
       direcao:'direção', roteiro:'roteiro', captacao:'captação', montagem_edicao:'montagem e edição',
       producao:'produção', musica:'música', elenco:'elenco', camera1:'câmera 1', camera2:'câmera 2',
       imagens_finalizacao:'imagens e finalização', edicao:'edição', captacao_audio:'captação de áudio',
       captacao_imagens:'captação de imagens', edicao_imagem_som:'edição de imagem e som',
       mixagem:'mixagem e masterização', apoio_tecnico:'apoio técnico', locucao:'locução', agradecimentos:'agradecimentos' },
  en:{ reportagem_producao:'report & production', imagens:'footage', imagens_edicao:'footage & editing',
       direcao:'direction', roteiro:'script', captacao:'filming', montagem_edicao:'edit & assembly',
       producao:'production', musica:'music', elenco:'cast', camera1:'camera 1', camera2:'camera 2',
       imagens_finalizacao:'footage & finishing', edicao:'editing', captacao_audio:'audio recording',
       captacao_imagens:'camera work', edicao_imagem_som:'picture & sound editing',
       mixagem:'mixing & mastering', apoio_tecnico:'technical support', locucao:'narration', agradecimentos:'thanks to' },
  es:{ reportagem_producao:'reportaje y producción', imagens:'imágenes', imagens_edicao:'imágenes y edición',
       direcao:'dirección', roteiro:'guion', captacao:'captación', montagem_edicao:'montaje y edición',
       producao:'producción', musica:'música', elenco:'elenco', camera1:'cámara 1', camera2:'cámara 2',
       imagens_finalizacao:'imágenes y finalización', edicao:'edición', captacao_audio:'captación de audio',
       captacao_imagens:'captación de imágenes', edicao_imagem_som:'edición de imagen y sonido',
       mixagem:'mezcla y masterización', apoio_tecnico:'apoyo técnico', locucao:'locución', agradecimentos:'agradecimientos' }
};

const PROJECTS = [
  { id:'hemobras', kind:{pt:'youtube · vídeos institucionais', en:'youtube · institutional videos', es:'youtube · vídeos institucionales'},
    title:{pt:'hemobrás — youtube', en:'hemobrás — youtube', es:'hemobrás — youtube'},
    desc:{ pt:'vídeos institucionais para veiculação no youtube.',
           en:'corporate videos for distribution on youtube.',
           es:'vídeos institucionales videos institucionales para su difusión en youtube.' },
    link:null,
    videos:[
      /* 👉 pra adicionar um vídeo aqui, veja as instruções no topo deste arquivo */
      { caption:{pt:'hemobrás em um minuto', en:'hemobrás in one minute', es:'hemobrás en un minuto'}, embed:"https://drive.google.com/file/d/1wNEM2RUJwKO6dW5ZJnRGFhnYJN2ezjl4/preview", category:'youtube' },
      { caption:{pt:'inauguração da fábrica de hemoderivados — super plasma', en:'opening of the blood-products factory — super plasma', es:'inauguración de la fábrica de hemoderivados — super plasma'}, embed:"https://drive.google.com/file/d/1ejgGxSmHspLxAmW0eLaRLE9KRJAK9Kqk/preview", category:'youtube' }
    ], credits:[] },
  { id:'hemobras-tv', kind:{pt:'comunicação interna · tv corporativa', en:'internal communications · corporate tv', es:'comunicación interna · tv corporativa'},
    title:{pt:'hemobrás — tv corporativa', en:'hemobrás — corporate tv', es:'hemobrás — tv corporativa'},
    desc:{ pt:'vídeos tutoriais e institucionais exibidos nas telas internas da Hemobrás, voltados para os colaboradores da empresa.',
           en:'tutorial and institutional videos shown on Hemobrás\' internal screens, aimed at company employees.',
           es:'vídeos tutoriales e institucionales exhibidos en las pantallas internas de Hemobrás, dirigidos a los colaboradores de la empresa.' },
    link:null,
    videos:[
      { caption:{pt:'como abrir um chamado no GLIP', en:'how to open a support ticket in GLIP', es:'cómo abrir un ticket en GLIP'}, embed:"https://drive.google.com/file/d/1QNVd32SE92kKs-8IeMnwazbQCoay5lqS/preview" },
      { caption:{pt:'como entrar no Hemozap', en:'how to log into Hemozap', es:'cómo ingresar a Hemozap'}, embed:"https://drive.google.com/file/d/1-2JEwWHCWp6quOXgKNIbV9LttEiRL-Cf/preview" },
      { caption:{pt:'como solicitar uma publicação', en:'how to request a publication', es:'cómo solicitar una publicación'}, embed:"https://drive.google.com/file/d/1HNKOpJR62t7WZeULXn8nX70Ngxy1MRPo/preview" },
      { caption:{pt:'você que faz!', en:'you make it happen!', es:'¡tú lo haces posible!'}, embed:"https://drive.google.com/file/d/14JojR0DahqXHvRK_TZqNTVIp8uZRtacD/preview" }
    ], credits:[] },
  { id:'hemobras-instagram', kind:{pt:'instagram · reels', en:'instagram · reels', es:'instagram · reels'},
    title:{pt:'hemobrás — instagram', en:'hemobrás — instagram', es:'hemobrás — instagram'},
    desc:{ pt:'vídeos verticais publicados no feed e nos reels do instagram da Hemobrás.',
           en:'vertical videos posted to Hemobrás\' Instagram feed and reels.',
           es:'vídeos verticales publicados en el feed y los reels de instagram de Hemobrás.' },
    link:{ href:'https://instagram.com/hemobras', label:{pt:'ver no instagram', en:'view on instagram', es:'ver en instagram'} },
    videos:[
      /* 👉 espaço reservado — substitua estes dois itens pelos vídeos reais assim que
         escolher quais reels/posts do instagram entram aqui. mantenha orientation:'vertical'.
         basta trocar caption e adicionar embed:"LINK_DO_DRIVE" em cada um. */
      { caption:{pt:'giro 360º na hemobrás', en:'360º tour on hemobrás', es:'giro de 360º en hemobrás'}, embed: "https://drive.google.com/file/d/1E-4Z8DSho3n9JyX3hdVKEh0d4n-e95xN/preview", orientation:'vertical' },
      { caption:{pt:'jogo do super plasma', en:'super plasma game', es:'juego del super plasma'}, embed: "https://drive.google.com/file/d/1fYktSbheXIA4p3c9y3nQxuH-HH5vAuLW/preview", orientation:'vertical' },
    { caption:{pt:'super plasma em o "agente secreto"', en:'super plasma on "the secret agent"', es:'super plasma en "el agente secreto"'}, embed: "https://drive.google.com/file/d/1C0yu0E8MTV16mpibNR8ix0X-hotc84Ud/preview", orientation:'vertical' },
      { caption:{pt:'joao pedro dias', en:'joao pedro dias', es:'joao pedro dias'}, embed: "https://drive.google.com/file/d/1S4QHahx2nI4dDyY3RQOUm25pv6CB2RnY/preview", orientation:'vertical' },
      { caption:{pt:'boas práticas de fabricação - bpf', en:'good manufacturing practices - gmp', es:'prácticas de fabricación adecuadas - pfa'}, embed: "https://drive.google.com/file/d/1AmJlXbQM-U_r_z0dVPIBNWJbFUND-1Q7/preview", orientation:'vertical' },
      { caption:{pt:'por dentro do sgsaa', en:'inside the sgsaa', es:'por dentro del sgsaa'}, embed: "https://drive.google.com/file/d/16GuNvY-mTg6tsfiS0GEsnz2r7qYmxQTV/preview", orientation:'vertical' }
    ], credits:[] },
  { id:'noticias-campus', kind:{pt:'ascom ufpe · jornalismo', en:'ufpe press office · journalism', es:'ascom ufpe · periodismo'},
    title:{pt:'notícias do campus', en:'notícias do campus', es:'notícias do campus'},
    desc:{ pt:'reportagens realizadas durante o estágio em audiovisual na ASCOM – UFPE.',
           en:'news pieces produced during the audiovisual internship at UFPE\'s press office (ASCOM).',
           es:'reportajes realizados durante la pasantía en audiovisual en la ASCOM – UFPE.' },
    link:null,
    videos:[
      { caption:{pt:'estudantes de arquitetura projetam praças de descanso para a 23ª FENEARTE', en:'architecture students design rest plazas for the 23rd FENEARTE', es:'estudiantes de arquitectura diseñan plazas de descanso para la 23ª FENEARTE'}, embed:"https://drive.google.com/file/d/12zTWAsTg_RtUS9CpfEM4m2zU9qbojtMK/preview",
        credits:[['reportagem_producao','eugênia bezerra'],['imagens','evelyn carolina'],['imagens_edicao','david sales']] },
      { caption:{pt:'clínica escola da UFPE oferece fisioterapia para gestantes', en:'UFPE\'s teaching clinic offers physiotherapy for pregnant patients', es:'clínica escuela de la UFPE ofrece fisioterapia para gestantes'}, embed:"https://drive.google.com/file/d/1UDz4BfScoV7rlHL0xpq1XBc5l0wdPie3/preview",
        credits:[['reportagem_producao','eliza brito'], ['imagens', 'catarina albertim'], ['edicao', 'david sales']] },
      { caption:{pt:'festival de ópera de pernambuco apresenta a obra "La Traviata"', en:'Pernambuco Opera Festival presents "La Traviata"', es:'festival de ópera de pernambuco presenta la obra "La Traviata"'}, embed:"https://drive.google.com/file/d/1qYtAOyIQVg3F0WLGpZs5dn9anxAkE6Z6/preview",
        credits:[['reportagem_producao','amanda dantas'], ['imagens', 'bernardo sampaio'], ['edicao', 'david sales']] },
    ], credits:[] },
  { id:'documenta-ufpe', kind:{pt:'ascom ufpe · programa mensal', en:'ufpe press office · monthly program', es:'ascom ufpe · programa mensual'},
    title:{pt:'documenta ufpe', en:'documenta ufpe', es:'documenta ufpe'},
    desc:{ pt:'programa mensal que trata de temas importantes e atuais na sociedade, produzido pela ASCOM da UFPE. formato de entrevista com professores, pesquisadores e especialistas.',
           en:'a monthly program covering relevant, current social topics, produced by UFPE\'s press office. the format is an interview with professors, researchers and specialists.',
           es:'programa mensual que aborda temas importantes y actuales en la sociedad, producido por la ASCOM de la UFPE. formato de entrevista con profesores, investigadores y especialistas.' },
    link:null,
    videos:[ 
      { caption:{pt:'transtornos mentais e o espírito da nossa geração', en:'mental health disorders and the spirit of our generation', es:'trastornos mentales y el espíritu de nuestra generación'}, embed:"https://drive.google.com/file/d/1ckHK35ZB2IXFZmXdLbMWRKJzFBdtjChl/preview",
        credits:[['reportagem_producao','eliza brito'],['imagens_finalizacao','bernardo sampaio'],['edicao','david sales e evelyn carolina']] },
      { caption:{pt:'conflito entre israel e o hamas completa dois meses e chega a mais de 17 mil mortos', en:'israel–hamas conflict marks two months, death toll passes 17,000', es:'conflicto entre israel y hamás cumple dos meses y supera los 17 mil muertos'}, embed:"https://drive.google.com/file/d/1SnlT0ATvDb8y3fzOhfobpllygRQB4_SX/preview", 
      credits:[['reportagem_producao','amanda dantas'],['roteiro_edicao','bernardo sampaio'],['camera1','david sales'], ['camera2', 'rayman phelipe']] },
      { caption:{pt:'por que os prédios tipo "caixão" caem?', en:'why do "coffin-style" buildings collapse?', es:'¿por qué se derrumban los edificios tipo "ataúd"?'}, embed:"https://drive.google.com/file/d/1N_7C8IhkHfyvgBkf_5aRTPxrN6Y5eTQQ/preview",
        credits:[['reportagem_producao','amanda dantas'],['imagens_edicao','bernardo sampaio'],['camera１','david sales e ana clara botelho'],['camera2','juno anjos']] } ], credits:[] },
  { id:'a-stalker', kind:{pt:'curta-metragem', en:'short film', es:'cortometraje'},
    title:{pt:'a stalker', en:'a stalker', es:'a stalker'},
    desc:{ pt:'curta-metragem autoral.', en:'an original short film.', es:'cortometraje de autoría propia.' },
    link:null,
    videos:[ { caption:{pt:'a stalker — curta metragem', en:'a stalker — short film', es:'a stalker — cortometraje'}, embed:"https://drive.google.com/file/d/1bUgVcP1eg01dD7SmItrc9bRl4c1z-LYw/preview" } ],
    credits:[ ['elenco','matheus dos santos e reneé patriota'], ['direcao','david sales'], ['roteiro','david sales'],
      ['captacao','david sales e matheus dos santos'], ['montagem_edicao','david sales'],
      ['producao','joão marcelo e marta rafael'], ['musica','"psycho killer", talking heads'] ] },
  { id:'rolou-olinda', kind:{pt:'mini documentário', en:'mini documentary', es:'mini documental'},
    title:{pt:'rolou em olinda: bajado lembrado', en:'rolou em olinda: bajado lembrado', es:'rolou em olinda: bajado lembrado'},
    desc:{ pt:'mini documentário colaborativo sobre memória e cultura popular em olinda.', en:'a collaborative mini-documentary about memory and popular culture in Olinda.', es:'mini documental colaborativo sobre memoria y cultura popular en olinda.' },
    link:null,
    videos:[ { caption:{pt:'rolou em olinda: bajado lembrado', en:'rolou em olinda: bajado lembrado', es:'rolou em olinda: bajado lembrado'}, embed:"https://drive.google.com/file/d/1UezpsAHU2OawnRwNnraMSXvuVfBOO7LI/preview" } ],
    credits:[ ['direcao','matheus dos santos'], ['roteiro','andré da cunha, mariana fernandes, joão roberto e matheus dos santos'],
      ['producao','clara avelina, david sales e anthony gabriel'], ['captacao_audio','raudney josé e alexandre barbosa'],
      ['captacao_imagens','maria eduarda e matheus dos santos'], ['edicao_imagem_som','david sales'], ['mixagem','joão marcelo'],
      ['apoio_tecnico','samara cristine e ana jade'], ['locucao','anthony santana'],
      ['musica','"frevo da saudade", bloco da saudade — licenciado por mediamuv'],
      ['agradecimentos','jacemira monteiro, joão batista e nilton correia'] ] }
];

const I18N = {
  pt:{ nav_about:'sobre', nav_formacao:'formação', nav_experiencia:'experiência', nav_softwares:'softwares', nav_trabalhos:'trabalhos', nav_contatos:'contato',
    nav_formacao_full:'minha formação', nav_experiencia_full:'experiência profissional', nav_softwares_full:'softwares', nav_trabalhos_full:'meus trabalhos', nav_contatos_full:'contatos',
    sidebar_title:'project: portfolio_2026', tree_about:'00_sobre-mim', tree_formacao:'01_formação', tree_experiencia:'02_experiência',
    tree_softwares:'03_softwares', tree_trabalhos:'04_trabalhos', tree_contatos:'05_contatos',
    hero_role:'editor de vídeo', hero_title:'bem-vindo ao meu <span class="accent">portfólio</span>', hero_scroll_hint:'role para reproduzir ↓',
    about_eyebrow:'// sobre', about_title:'sobre mim',
    card1_title:'quem sou', card1_body:'david, 26 anos. formado em comunicação social (rádio, tv e internet) pela ufpe.',
    card2_title:'o que me move', card2_body:'sou apaixonado por cinema e pelo universo do audiovisual, especialmente pela forma como histórias ganham vida através de imagens.',
    card3_title:'o que estou aprendendo', card3_body:'estudo sistemas de informações na ufpe e me interesso por design centrado no usuário, interfaces e experiências digitais.',
    card4_title:'além da tela', card4_body:'nos tempos livres, faço crochê e bordado livre, gosto de ver imagens se formando ponto a ponto, com calma e atenção nos detalhes.',
    edu_eyebrow:'// formação acadêmica', edu_school:'universidade federal de pernambuco',
    edu_course:'sistemas de informação.',
    edu_course2:'comunicação social com habilitação em rádio, tv e internet.', 
    exp_eyebrow:'// trajetória',
    exp1_org:'hemobrás — empresa brasileira de hemoderivados e biotecnologia',
    exp1_l1:'editor audiovisual | estágio, nov. 2023 – set. 2024', exp1_l2:'editor audiovisual | terceirizado, out. 2024 – atual',
    exp2_org:'ufpe — universidade federal de pernambuco', exp2_l1:'editor audiovisual | estágio, jun. 2023 – nov. 2023',
    exp3_org:'júnior rações | rações cantoria', exp3_l1:'designer gráfico | estágio, ago. 2021 – abr. 2023',
    exp4_org:'grid design e estratégia', exp4_l1:'social media | estágio, jan. 2021 – ago. 2021',
    work_eyebrow:'// timeline', render_label:'renderizando portfólio', mark_reviewed:'marcar como revisado', reviewed:'revisado',
    embed_hint:'espaço reservado para o embed do vídeo', contact_eyebrow:'// export', thanks_title:'obrigado!', thanks_sub:'valeu por rolar até aqui!',
    export_email_label:'e-mail', export_linkedin_label:'linkedin',
    footer_text:'feito por david sales — portfólio pessoal · 2026', credits_label:'ficha técnica',
    goto_label:'ver trabalhos →', breadcrumb_back:'← voltar ao portfólio', company_works_title:'trabalhos para',
    hemobras_kind:'empresa pública · redes sociais',
    hemobras_desc:'vídeos produzidos para a Hemobrás, empresa brasileira de hemoderivados e biotecnologia, como editor audiovisual terceirizado (out. 2024 – atual) após estágio (nov. 2023 – set. 2024). organizados abaixo por canal: youtube, tv corporativa e instagram.',
    ufpe_kind:'ascom ufpe · jornalismo e programas',
    ufpe_desc:'reportagens e o programa mensal "documenta ufpe" produzidos durante o estágio em audiovisual na ASCOM – UFPE (jun. 2023 – nov. 2023).',
    featured_eyebrow:'// um exemplo', featured_caption:'hemobrás em um minuto',
    explore_more:'quer ver mais? explore os projetos completos nas pastas abaixo ↓',
    bin_hemobras_count:'6 vídeos', bin_ufpe_count:'6 vídeos', personal_projects_label:'projetos pessoais',
    cat_instagram:'instagram', cat_tv:'tv corporativa', cat_geral:'geral', cat_youtube:'youtube' },
  en:{ nav_about:'about', nav_formacao:'education', nav_experiencia:'experience', nav_softwares:'software', nav_trabalhos:'work', nav_contatos:'contact',
    nav_formacao_full:'education', nav_experiencia_full:'professional experience', nav_softwares_full:'software', nav_trabalhos_full:'my work', nav_contatos_full:'contact',
    sidebar_title:'project: portfolio_2026', tree_about:'00_about-me', tree_formacao:'01_education', tree_experiencia:'02_experience',
    tree_softwares:'03_software', tree_trabalhos:'04_work', tree_contatos:'05_contact',
    hero_role:'video editor', hero_title:'welcome to my <span class="accent">portfolio</span>', hero_scroll_hint:'scroll to play ↓',
    about_eyebrow:'// about', about_title:'about me',
    card1_title:'who i am', card1_body:'david, 26. graduated in social communication (radio, tv & internet) from ufpe.',
    card2_title:'what drives me', card2_body:'i\'m passionate about cinema and the world of audiovisual media, especially the way stories come to life through images.',
    card3_title:'what i\'m learning', card3_body:'i study systems of information at ufpe and am interested in user-centered design, interfaces and digital experiences.',
    card4_title:'beyond the screen', card4_body:'in my free time, i do crochet and free-style embroidery; I enjoy watching images take shape stitch by stitch, with patience and attention to detail.',
    edu_eyebrow:'// academic background', edu_school:'federal university of pernambuco',
    edu_course:'systems of information.',
    edu_course2:'social communication, radio/tv/internet track.',
    exp_eyebrow:'// career path',
    exp1_org:'hemobrás — brazilian blood-products & biotechnology company',
    exp1_l1:'video editor | internship, nov 2023 – sept 2024', exp1_l2:'video editor | outsourced, oct 2024 – present',
    exp2_org:'ufpe — federal university of pernambuco', exp2_l1:'video editor | internship, jun 2023 – nov 2023',
    exp3_org:'júnior rações | rações cantoria', exp3_l1:'graphic designer | internship, aug 2021 – apr 2023',
    exp4_org:'grid design e estratégia', exp4_l1:'social media | internship, jan 2021 – aug 2021',
    work_eyebrow:'// timeline', render_label:'rendering portfolio', mark_reviewed:'mark as reviewed', reviewed:'reviewed',
    embed_hint:'reserved space for the video embed', contact_eyebrow:'// export', thanks_title:'thank you!', thanks_sub:'thanks for scrolling!',
    export_email_label:'email', export_linkedin_label:'linkedin',
    footer_text:'made by david sales — personal portfolio · 2026', credits_label:'credits',
    goto_label:'view work →', breadcrumb_back:'← back to portfolio', company_works_title:'work for',
    hemobras_kind:'public company · social media',
    hemobras_desc:'videos produced for Hemobrás, a Brazilian blood-products and biotechnology company, as an outsourced video editor (oct 2024 – present) following an internship (nov 2023 – sept 2024). organized below by channel: youtube, corporate tv and instagram.',
    ufpe_kind:'ufpe press office · journalism & programs',
    ufpe_desc:'news pieces and the monthly program "documenta ufpe" produced during the audiovisual internship at UFPE\'s press office, ASCOM (jun 2023 – nov 2023).',
    featured_eyebrow:'// a sample', featured_caption:'hemobrás in one minute',
    explore_more:'want to see more? explore the full folders below ↓',
    bin_hemobras_count:'6 videos', bin_ufpe_count:'6 videos', personal_projects_label:'personal projects',
    cat_instagram:'instagram', cat_tv:'corporate tv', cat_geral:'general', cat_youtube:'youtube' },
  es:{ nav_about:'sobre', nav_formacao:'formación', nav_experiencia:'experiencia', nav_softwares:'programas', nav_trabalhos:'trabajos', nav_contatos:'contacto',
    nav_formacao_full:'formación', nav_experiencia_full:'experiencia profesional', nav_softwares_full:'programas', nav_trabalhos_full:'mis trabajos', nav_contatos_full:'contacto',
    sidebar_title:'project: portfolio_2026', tree_about:'00_sobre-mí', tree_formacao:'01_formación', tree_experiencia:'02_experiencia',
    tree_softwares:'03_programas', tree_trabalhos:'04_trabajos', tree_contatos:'05_contacto',
    hero_role:'editor de vídeo', hero_title:'bienvenido a mi <span class="accent">portafolio</span>', hero_scroll_hint:'desplázate para reproducir ↓',
    about_eyebrow:'// sobre', about_title:'sobre mí',
    card1_title:'quién soy', card1_body:'david, 26 años. graduado en comunicación social (radio, tv e internet) por la ufpe.',
    card2_title:'qué me mueve', card2_body:'me apasiona el cine y el universo audiovisual, especialmente la forma en que las historias cobran vida a través de las imágenes.',
    card3_title:'qué estoy aprendiendo', card3_body:'estudio sistemas de información en la ufpe y me interesa el diseño centrado en el usuario, interfaces y experiencias digitales.',
    card4_title:'más allá de la pantalla', card4_body:'en mi tiempo libre hago crochet y bordado libre, me gusta ver cómo la imagen se forma punto a punto, con calma y atención a los detalles.',
    edu_eyebrow:'// formación académica', edu_school:'universidad federal de pernambuco',
    edu_course:'comunicación social con especialización en radio, tv e internet.',
    edu_course2:'sistemas de información.',
    exp_eyebrow:'// trayectoria',
    exp1_org:'hemobrás — empresa brasileña de hemoderivados y biotecnología',
    exp1_l1:'editor audiovisual | pasantía, nov. 2023 – sept. 2024', exp1_l2:'editor audiovisual | tercerizado, oct. 2024 – actualidad',
    exp2_org:'ufpe — universidad federal de pernambuco', exp2_l1:'editor audiovisual | pasantía, jun. 2023 – nov. 2023',
    exp3_org:'júnior rações | rações cantoria', exp3_l1:'diseñador gráfico | pasantía, ago. 2021 – abr. 2023',
    exp4_org:'grid design e estratégia', exp4_l1:'social media | pasantía, ene. 2021 – ago. 2021',
    work_eyebrow:'// timeline', render_label:'renderizando portafolio', mark_reviewed:'marcar como revisado', reviewed:'revisado',
    embed_hint:'espacio reservado para insertar el vídeo', contact_eyebrow:'// exportar', thanks_title:'¡gracias!', thanks_sub:'¡gracias por llegar hasta aquí!',
    export_email_label:'correo', export_linkedin_label:'linkedin',
    footer_text:'hecho por david sales — portafolio personal · 2026', credits_label:'ficha técnica',
    goto_label:'ver trabajos →', breadcrumb_back:'← volver al portafolio', company_works_title:'trabajos para',
    hemobras_kind:'empresa pública · redes sociales',
    hemobras_desc:'vídeos producidos para Hemobrás, empresa brasileña de hemoderivados y biotecnología, como editor audiovisual tercerizado (oct. 2024 – actualidad) tras una pasantía (nov. 2023 – sept. 2024). organizados abajo por canal: youtube, tv corporativa e instagram.',
    ufpe_kind:'ascom ufpe · periodismo y programas',
    ufpe_desc:'reportajes y el programa mensual "documenta ufpe" producidos durante la pasantía en audiovisual en la ASCOM – UFPE (jun. 2023 – nov. 2023).',
    featured_eyebrow:'// un ejemplo', featured_caption:'hemobrás en un minuto',
    explore_more:'¿quieres ver más? explora los proyectos completos en las carpetas de abajo ↓',
    bin_hemobras_count:'6 vídeos', bin_ufpe_count:'6 vídeos', personal_projects_label:'proyectos personales',
    cat_instagram:'instagram', cat_tv:'tv corporativa', cat_geral:'general', cat_youtube:'youtube' }
};

