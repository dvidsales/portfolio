# Histórico de mudanças

## 30/10/2026 — Correção do monitor vertical

- O iframe passa a ocupar um viewport próprio, com dimensões definidas independentemente do tamanho intrínseco do player do provedor.
- Nos vídeos verticais, o viewport é centralizado em 9:16, com margens laterais; a alternância para vídeos horizontais volta a preencher o monitor em 16:9.
- Versões dos arquivos da biblioteca atualizadas para evitar reutilizar o CSS anterior.

## 30/10/2026 — Biblioteca e estação de edição inspiradas no Premiere

- Backup da versão anterior publicado como tag `backup-before-premiere-workspace-2026-10-30`, no commit `739195a4347f3e858449dc0477d7c9fb28e5da88`.
- Biblioteca pública com todos os trabalhos, miniaturas dos próprios provedores e fallback para imagens indisponíveis. Filtros Hemobrás/UFPE/autorais, busca entre idiomas sem depender de acentos e modos grade/lista.
- Monitor central carrega apenas o vídeo selecionado; botões anterior/próximo percorrem o filtro atual. Seleção, título, descrição e formato permanecem consistentes ao trocar o idioma.
- Painel recolhível com projeto, canal/categoria, formato, participação e créditos existentes. Conteúdo e créditos dos vídeos preservados.
- Links com identificadores de arquivo compartilham a seleção sem depender da ordem dos vídeos. Links antigos de projetos continuam funcionais.
- Páginas Hemobrás e UFPE adotam a mesma biblioteca, com escopo limitado às respectivas coleções e filtros por canal/projeto.
- Timeline inferior navega entre as seções e indica o progresso da página. No celular, transforma-se em seletor compacto.
- Editor administrativo reorganizado em biblioteca, monitor e propriedades; no celular, painéis em abas com navegação por teclado e rascunho compartilhado. A validação abre a aba que contém o campo com erro.
- Botões decorativos de transporte na apresentação foram substituídos por um rótulo. Não foram acrescentados controles de edição, medidores ou parâmetros sem função.
- Novos arquivos `workbench.js` e `workbench.css`; helper de miniaturas em `video-utils.js`; versões de carregamento atualizadas. Publicação e proteção contra conflitos do editor preservadas.
- Testes e documentação atualizados para a nova interface; instruções de reversão por novo commit no README.

## 30/10/2026 — Ajuste visual do destaque

- Vídeo e informações alinhados pelo topo, evitando espaço vazio acima do player quando o título é longo.
- Coluna de informações mais larga e título limitado a 30 px, com entrelinha controlada e hierarquia abaixo do título da seção.
- Espaçamentos mais compactos e link de abertura no provedor com tratamento secundário.
- Mantida a disposição em uma coluna no celular e tablet estreito.

## 30/10/2026 — Revisão end to end

### Dados, vídeo e consistência

- Regras únicas de links para a prévia, exportação e portfólio: Drive, YouTube e Vimeo. Links HTTPS são normalizados e credenciais embutidas são rejeitadas; preservam-se chaves de acesso de vídeos não listados.
- Carregamento de `projects.js` com URL renovada a cada navegação; avisos para erros de arquivo ou estrutura. O editor não permite publicar com a base de dados indisponível.
- Destaque da página inicial acompanha o título, formato e descrição do primeiro vídeo da coleção Hemobrás, sem manter a descrição de outro idioma. A coleção vazia oculta o destaque.
- Contagens de vídeos seguem os dados atuais, com singular/plural nos três idiomas.
- Links diretos para projetos dinâmicos passam a posicionar corretamente a página.
- Links de abertura no provedor em todos os vídeos e na prévia.
- Data resumida do estágio na Hemobrás corrigida de `2023` para `2023—2024`, de acordo com o texto já existente.

### Acessibilidade e navegação

- Contraste de textos secundários corrigido; foco visível também em selects, áreas de texto e painéis navegáveis.
- Menus fechados ficam fora da navegação por teclado. Escape fecha e devolve o foco; setas/Home/End funcionam no seletor de idiomas e nas abas de categoria.
- Abas com associação explícita aos painéis, seleção preservada ao mudar de idioma e painéis inativos ocultos.
- Títulos semânticos para os projetos e estado atual na navegação.
- Rótulos de navegação, link de salto e link do editor traduzidos. Títulos e descrições de página acompanham o idioma.
- Controles de toque ampliados; campos móveis usam fonte de 16 px para evitar zoom automático. O destaque vertical e textos longos mantêm limites da tela.
- Conteúdo estático e navegação continuam acessíveis quando o JavaScript está desativado; vídeos e editor mostram orientação para ativá-lo. Preferência por redução de movimento respeitada.
- Ícone local e metadados de compartilhamento/canônicos; editor marcado como `noindex`.

### Editor e publicação

- Preferências e rascunhos com estrutura inválida não derrubam a interface.
- Prévia textual atualiza durante a edição, mantendo o player montado quando a URL não muda.
- Desfazer recupera a seleção e coleção corretas; ações sem mudança de ordem não geram estados extras.
- Erros apontam o vídeo, idioma e campo que precisam de correção. É possível exportar backup incompleto, sem autorizar uma publicação inválida.
- Rascunhos novos guardam a base da publicação; a gravação bloqueia sobrescrita de uma atualização intermediária. A API continua recebendo o SHA para proteger a etapa entre leitura e escrita.
- Cada envio usa uma cópia consistente do conteúdo revisado. Alterações feitas enquanto o envio ocorre permanecem no rascunho e são sinalizadas.
- Após publicar, a base local é atualizada, permitindo nova publicação na mesma aba e restauração correta do rascunho.
- Mensagem distingue commit criado de deploy do Pages e inclui link para acompanhar Actions.
- Tempo limite, erros de conexão, permissões e conflitos são tratados; token limpo em todos os caminhos de saída do envio.
- Falhas de armazenamento e edições em outra aba recebem aviso; rascunho em memória sem backup aciona proteção ao sair.
- Textos e atributos gerados são escapados, URLs de iframe e links de projeto são validados e abas não inserem marcação arbitrária.

### Verificação e documentação

- Suíte de testes end to end reproduzível em `tests/`, sem dependências de produção.
- Checagens em sete larguras de tela, três idiomas, navegação por teclado, links locais, download do currículo, editor e respostas simuladas da API.
- Auditoria axe-core para WCAG 2 A/AA e WCAG 2.1 AA, com detalhes dos cenários em `VALIDACAO.md`.
- README e instruções locais atualizados com funcionamento real de rascunhos, conflitos, token, carregamento dos players e GitHub Pages.

## 30/10/2026 — Editor inicial e correções incrementais

- Editor separado para adicionar, remover e ordenar vídeos; três idiomas, prévia, orientação, rascunho local, exportação e publicação via GitHub Contents API.
- Arquivo `projects.js` separa as publicações do editor dos dados originais e das traduções gerais.
- Páginas originais e currículo preservados; layout de celular e tablet ajustado.
- Integração configurada para `dvidsales/portfolio`, branch `main`, raiz do repositório, mantendo GitHub Pages.
- Categoria herdada para novos vídeos; correção do vídeo institucional adicionado sem categoria.
- Campo explícito de categoria (Geral, YouTube, Instagram, TV corporativa), preservando categorias existentes.
