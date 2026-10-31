# Validação — versão inspirada no Premiere — 30/10/2026

A suíte `tests/e2e.py` terminou com **406 verificações aprovadas**, sem erros JavaScript de página. As fontes, os players e a API externa são tratados conforme os limites descritos abaixo.

## Cobertura

| Área | Resultado |
| --- | --- |
| Layout | 70 cenários sem transbordamento horizontal: três páginas públicas × três idiomas × sete larguras, mais editor × sete larguras. |
| Larguras | 320, 375, 768, 900, 1024, 1280 e 1920 px; emulação no Chromium. |
| Acessibilidade desktop | 10 cenários sem violações nas tags axe-core WCAG 2 A, WCAG 2 AA e WCAG 2.1 AA. |
| Acessibilidade móvel adicional | Seis cenários sem violações: biblioteca pública nos três idiomas e três abas do editor em 375 px. |
| Conferência visual | Fontes reais Instrument Serif, Inter e JetBrains Mono, nas quatro páginas em 375, 768, 1024 e 1440 px; 16 cenários. |
| Biblioteca | 21 vídeos atuais; filtros Todos/Hemobrás/UFPE/autorais, busca sem acentos entre idiomas, grade/lista, miniaturas com fallback e seleção. |
| Monitor | Um único iframe público, troca de vídeo, título/descrição por idioma, formato vertical e botões anterior/próximo para os resultados visíveis. |
| Propriedades | Créditos e participação, painel recolhível e preservação do link original da coleção. |
| Compartilhamento | Endereço com `?video=` recupera a seleção; links antigos de projeto continuam funcionando. |
| Timeline | Navegação real por seções; seletor compacto no celular e indicação da seção atual. |
| Editor | Biblioteca, monitor e propriedades; abas móveis com teclado; CRUD, arraste, setas, rascunho, histórico, exportação e tradução. |
| Validação móvel adicional | Adicionar abre a aba de detalhes; erro de tradução também abre essa aba e limpa o token. |
| GitHub API simulada | SHA e branch, segundo envio, alteração concorrente, HTTP 403/409, conexão interrompida e token limpo nos caminhos avaliados. |
| Resiliência | Preferências/rascunhos inválidos, armazenamento indisponível, falha de carga e estrutura de dados inválida. |
| Conteúdo | Dados originais de projetos, créditos e softwares conferidos contra a tag de backup, sem diferenças. `projects.js` e `curriculo.pdf` também são idênticos ao backup. |
| Arquivos | Sintaxe de todos os JavaScripts validada; scripts, estilos e ícones locais existentes; `git diff --check` sem erros. |

## Backup e reversão

A tag **`backup-before-premiere-workspace-2026-10-30`** foi enviada ao GitHub antes das alterações e aponta para `739195a4347f3e858449dc0477d7c9fb28e5da88`.

O redesign modifica a interface e as traduções de seus controles; os vídeos e as fichas técnicas publicados foram preservados. Se for necessário voltar ao visual anterior, a reversão deve ser feita por novo commit, preservando o histórico e as publicações posteriores em `projects.js`. O README descreve esse procedimento.

## Reproduzir e limites

A suíte reproduzível está em `tests/`; instruções em `tests/README.md`. Ferramentas: Playwright 1.62.0, axe-core 4.14.0 e Chromium.

A API do GitHub e os documentos dos players são simulados durante a suíte. Não são criados commits com credenciais reais nos testes. A disponibilidade das miniaturas, reprodução, permissões e legendas dos arquivos no Google Drive, YouTube e Vimeo continua dependendo dos provedores. Quando a miniatura falha, a interface usa um ícone e preserva título/formato.

A suíte principal usa fontes de fallback; a conferência visual complementar usa os arquivos reais das fontes. As verificações são em navegador desktop com emulação de viewport, não em aparelhos físicos. Ausência de violações automáticas não é certificação integral de acessibilidade.

O envio e a implantação reais desta revisão são acompanhados separadamente pelo workflow **pages build and deployment** no GitHub Actions.

## Histórico de validação

Antes do redesign, a revisão end to end anterior passou por 357 verificações. O ajuste do antigo destaque foi conferido em 12 cenários adicionais. As correções de contraste, proteção de publicação e rascunhos foram mantidas nesta versão e seus fluxos voltaram a ser testados.

## Correção posterior dos vídeos verticais

Foram medidos os seis vídeos verticais nas páginas inicial e Hemobrás, em 320, 375, 768, 1024, 1440 e 1920 px: **72 casos aprovados**. A medição verifica a largura e a altura reais do iframe (9:16), centralização, limites do monitor e ausência de transbordamento. Em cada página/largura também foi conferido o retorno a um vídeo horizontal em 16:9. O teste continua usando um documento de player simulado; não certifica o conteúdo interno ou as permissões do provedor. A suíte principal ganhou verificações da proporção real e da centralização, além da classe de orientação.

## Participações confirmadas — Hemobrás

Conferidas 21 combinações de vídeo/idioma: quatro vídeos da TV corporativa e três do YouTube, nos três idiomas. A TV mostra edição, animação e After Effects; o YouTube mostra edição e informa o uso de imagens fornecidas. Verificado que o editor preserva esses metadados na exportação. Os projetos, vídeos e créditos da UFPE foram comparados com a versão anterior e permanecem idênticos.

## Ferramentas e exceção do Super Plasma

Conferidas 63 combinações (21 vídeos × três idiomas): After Effects nos quatro vídeos da TV corporativa e no Jogo do Super Plasma; Premiere Pro nos outros 16 vídeos. O jogo exibe animação como participação e descrição própria nos três idiomas. A exportação do editor preserva as ferramentas; comparação com a versão anterior confirmou que os créditos dos outros trabalhos não foram alterados.

## Remoção do link do Instagram

O link do projeto para o Instagram foi ocultado na ficha dos vídeos verticais. O link para abrir o próprio vídeo no provedor continua disponível. A suíte foi atualizada para verificar essa escolha de interface.
