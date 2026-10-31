# Testes end to end

Dependências apenas de desenvolvimento; o site continua estático, sem build ou backend.

Na raiz do repositório:

```sh
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm install --prefix tests --no-audit --no-fund
python tests/e2e.py
```

O teste inicia e encerra um servidor HTTP local. O Chromium deve estar instalado; é possível definir `PORTFOLIO_CHROMIUM` com seu caminho. `PORTFOLIO_AXE_PATH` permite usar outra instalação de `axe.min.js`.

Use `--output /caminho/para/relatorios` para escolher onde salvar `results.json` e capturas de tela, ou `--port 8772` se a porta padrão estiver ocupada. Sem `--output`, os resultados ficam em uma nova pasta temporária cujo caminho é informado ao final. Não envie relatórios gerados para o repositório.

A suíte cobre:

- Páginas públicas em português, inglês e espanhol, editor e sete larguras de tela.
- Contraste e outras regras axe-core com as tags WCAG 2 A, WCAG 2 AA e WCAG 2.1 AA; tradução das interfaces, links locais, âncoras e download de PDF.
- Menu móvel, seletor de idiomas, Escape, setas, filtros da biblioteca e abas móveis do editor.
- Biblioteca, busca sem acentos entre idiomas, grade/lista, seleção de vídeo, descrições por idioma, formato vertical, contagens, propriedades e links compartilháveis.
- CRUD de vídeos, arraste e setas, idiomas, rascunho, histórico entre coleções, exportação, abas móveis e validações.
- GitHub API simulada: commit, SHA e branch, envio subsequente, alteração remota concorrente, permissão negada, conflito e falha de conexão.
- Limpeza e ausência de token no armazenamento/exportação; texto HTML tratado como conteúdo.
- Preferências/rascunhos inválidos, armazenamento indisponível, falha de carga dos dados e navegação sem JavaScript.
- Normalização de URLs e rejeição de provedores e protocolos inválidos.

A suíte intercepta a API do GitHub e os players externos. **Não cria commits reais nem valida a reprodução dos arquivos nos provedores.** O token utilizado é fictício e nunca deve ser substituído por um token real. Falhas da auditoria geram saída diferente de zero; a ausência de violações automáticas não substitui avaliação manual nem certifica conformidade integral.
