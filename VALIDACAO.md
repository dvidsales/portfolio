# Validação end to end — 30/10/2026

Resultado da execução final: **357 verificações passaram**, sem erros JavaScript de página. Suíte: `tests/e2e.py`. Navegador: Chromium; ferramentas: Playwright 1.62.0 e axe-core 4.14.0.

## Cobertura e resultado

| Área | Resultado |
| --- | --- |
| Layout | 70 cenários sem transbordamento horizontal: páginas públicas × três idiomas × sete larguras, mais editor × sete larguras. |
| Telas | 320, 375, 768, 900, 1024, 1280 e 1920 px. Emulação de viewport no desktop; não são aparelhos físicos. |
| Acessibilidade automatizada | 10 cenários (três páginas × três idiomas, mais editor), sem violações nas tags WCAG 2 A, WCAG 2 AA e WCAG 2.1 AA. Auditoria realizada a 1280 px, com créditos/detalhes abertos. |
| Idiomas | Rótulos cadastrados, atributo `lang`, metadados, contagens, descrições e seleção de categoria conferidos. |
| Navegação | Links locais e âncoras, link direto para projeto dinâmico, menu móvel, seletor de idioma, Escape e foco verificados. |
| Categorias | Abas e painéis associados; setas selecionam categorias; escolha mantida ao trocar idioma; conteúdo tratado como texto. |
| Vídeos e destaque | Normalização de URLs, rejeição de protocolos/provedores inválidos, formato vertical, descrições por idioma, links externos e destaque oculto para coleção vazia. |
| Currículo | Download executado e assinatura PDF conferida; arquivo original preservado. |
| Editor | Adicionar, editar nos três idiomas, remover, arrastar, mover por setas, desfazer entre coleções, recuperar rascunho e exportar arquivo. |
| Publicação simulada | Commit, branch e SHA; envio subsequente; bloqueio de publicação intermediária; HTTP 403, conflito 409 e falha de conexão. |
| Token | Campo limpo após sucesso, validação, conflito e falha; ausência do token simulado no armazenamento e exportação. |
| Resiliência | Preferências e rascunhos corrompidos, armazenamento indisponível, falha de carga e estrutura inválida dos dados publicados; navegação estática sem JavaScript. |
| Cache | URL de carregamento dos dados muda após recarregar a página. |
| Arquivos | Sintaxe JavaScript conferida; scripts, estilos e ícone locais existem; `git diff --check` sem erros. |

## Correções confirmadas

A avaliação inicial encontrou violações de contraste (19 elementos na página inicial, 14 em cada página institucional e quatro no editor, nos cenários avaliados). Após os ajustes, os dez cenários de acessibilidade terminaram sem violações automáticas.

A suíte também confirmou e motivou a correção de um link direto que não rolava até um projeto criado dinamicamente. A revisão do código corrigiu o acesso por teclado a menus fechados, descrições e orientação inconsistentes no destaque, preferência de idioma inválida, histórico entre coleções, diferença entre commit e deploy e risco de sobrescrever uma publicação mais recente com rascunho antigo. Consulte `CHANGELOG.md` para a lista completa.

## Reproduzir

Siga `tests/README.md`. O teste gera um JSON com cada verificação e capturas das páginas. As dependências ficam restritas ao desenvolvimento; não há backend ou build de produção.

## Limites

A API do GitHub e os documentos dos players externos foram **simulados** durante a suíte. Os testes não publicam commits usando credenciais reais e não certificam a reprodução, as permissões de compartilhamento, legendas ou disponibilidade dos vídeos no Google Drive, YouTube ou Vimeo. Fontes externas são substituídas pelo fallback local no teste automatizado. Ausência de violações no axe-core não é certificação de acessibilidade integral.

O envio e a implantação reais desta revisão são acompanhados separadamente pelo workflow **pages build and deployment** do repositório, em GitHub Actions. O resultado da suíte se refere ao código desta revisão, preservando os vídeos e créditos publicados anteriormente.
