# Validação — 30/10/2026

Executada com Chromium e Playwright sobre servidor estático local.

- Ausência de transbordamento horizontal em `index.html`, `hemobras.html`, `ufpe.html` e `editor.html`, nas larguras 375, 768 e 1280 px (12 combinações).
- Adição de vídeo e edição dos títulos e descrições nos três idiomas.
- Conversão de URL curta do YouTube em URL de incorporação.
- Recuperação de rascunho após recarregar a página.
- Reordenação pelas setas, desfazer, remoção confirmada e recuperação pelo histórico.
- Publicação com GitHub API simulada: leitura do SHA e inclusão desse SHA na atualização do arquivo.
- Campo do token limpo após a tentativa e ausência do token em localStorage.
- Texto contendo marcação HTML tratado como texto na prévia.
- Nenhum erro JavaScript de página durante os testes.
- Sintaxe validada com `node --check` em `common.js`, `editor.js` e `projects.js`.

Limites: não foi realizado commit real no GitHub, deploy no Pages ou teste de permissões de reprodução dos vídeos externos. A API foi simulada para não exigir credenciais nem gravar em um repositório. O arraste por mouse está implementado; as setas são a alternativa para teclado e telas de toque.
