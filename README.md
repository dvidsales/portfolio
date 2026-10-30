# Portfólio de David Sales — editor visual

HTML, CSS e JavaScript puros, sem backend, dependências de execução ou build. O portfólio original, currículo, páginas institucionais e créditos foram preservados.

## Executar

Na pasta do site, execute `python -m http.server 8000` e abra `http://localhost:8000`. O Python serve apenas os arquivos durante o teste local; em produção basta hospedagem estática HTTPS. Abra `editor.html` pelo link no rodapé.

## Editar

1. Selecione um projeto existente e um vídeo ou clique em **Adicionar vídeo**.
2. Cole um link HTTPS de arquivo do Google Drive, vídeo do YouTube ou Vimeo. O botão **Salvar vídeo** normaliza o link para incorporação.
3. Alterne entre Português, English e Español para preencher os títulos e descrições. As traduções são manuais. Títulos nos três idiomas são exigidos para publicar; descrições são opcionais.
4. Escolha horizontal ou vertical. A prévia usa o idioma selecionado.
5. Arraste os vídeos ou use as setas para mudar a ordem dentro do projeto. As setas funcionam por teclado e toque. Remoção pede confirmação; **Desfazer** mantém até 30 estados durante a sessão.

O rascunho é salvo automaticamente em localStorage, inclusive antes de trocar de vídeo/idioma. Ele não altera o site público. **Descartar rascunho local** recupera os dados carregados do site. **Exportar dados** baixa `projects.js` sem credenciais; substitua o arquivo de mesmo nome para publicar manualmente. O editor administra vídeos dos projetos existentes; não cria novos projetos nem hospeda arquivos de vídeo. Acesso aos vídeos continua dependente das permissões do provedor.

## Preparar o GitHub uma vez

Envie **todos os arquivos desta versão** ao repositório, mantendo-os juntos na raiz ou em uma pasta. Inclua `projects.js`, os arquivos do editor e o currículo. Configure GitHub Pages em **Settings → Pages**, escolhendo a branch/pasta compatível, ou mantenha o fluxo de hospedagem estática existente. O editor publica dados; não instala o site nem habilita Pages.

Crie em GitHub **Settings → Developer settings → Personal access tokens → Fine-grained tokens** um token com validade curta, acesso **somente ao repositório desejado**, permissão **Contents: Read and write** e Metadata de leitura (automática). Não conceda acesso a todos os repositórios. Políticas da organização podem exigir aprovação. Branch protegida pode impedir commits diretos; escolha uma branch permitida e use o fluxo de revisão do repositório.

No editor, preencha proprietário, repositório, branch e pasta do site (vazia se os arquivos estão na raiz). Insira o token no campo de senha, revise o destino, marque a confirmação e clique em **Publicar no GitHub**. A aplicação lê o SHA atual de `projects.js` e faz um PUT na Contents API, com mensagem de commit, conteúdo UTF-8 em base64 e branch explícita. Se o arquivo não existir, tenta criá-lo. Conflitos e falhas são mostrados na interface; não há repetição automática. O link do commit aparece após sucesso. Aguarde o fluxo de Pages/hospedagem para a atualização pública.

O token só fica no campo e na memória da aba durante o uso; é limpo após cada tentativa, nunca vai para localStorage, exportação, URLs ou arquivos publicados. Não envie tokens pelo chat nem os escreva no código. Por ser uma aplicação no navegador, use em dispositivo confiável e sirva por HTTPS. O editor é público como qualquer arquivo estático; sua capacidade de gravar depende do token. Não há autenticação de painel sem backend.

## Arquivos e mudanças

- `editor.html`: painel de coleção, edição multilíngue, prévia e publicação.
- `editor.css`: visual alinhado ao portfólio; três colunas no desktop, duas no tablet e uma no celular; controles de toque e foco visível.
- `editor.js`: CRUD de vídeos, ordenação por arraste/setas, histórico, persistência local, exportação, validação de links, títulos e integração com a GitHub Contents API. Preserva metadados e créditos dos vídeos existentes.
- `projects.js`: camada de dados publicada pelo editor. Inicialmente mantém os dados originais de `data.js`; ao publicar, substitui a lista em memória sem alterar softwares, traduções gerais ou créditos globais.
- `index.html`, `hemobras.html`, `ufpe.html`: carregam `projects.js` antes de `common.js` e oferecem link ao editor no rodapé.
- `common.js`: escapa títulos, descrições e nomes dos créditos; restringe URLs de iframe aos provedores permitidos; exibe descrições por vídeo; calcula contagens a partir dos dados; sincroniza o vídeo em destaque com o primeiro vídeo da coleção Hemobrás; valida o idioma recuperado.
- `styles.css`: correção de declaração CSS inválida, melhorias de quebra de texto, cards verticais, créditos, navegação móvel abaixo da barra, contatos e controles de reprodução; respeita `[hidden]`.

`data.js` e `curriculo.pdf` permanecem intactos. Destino desta versão: repositório `dvidsales/portfolio`, branch `main`, arquivos na raiz. A hospedagem principal permanece no GitHub Pages. O editor já preenche esse destino; o token restrito deve ser informado apenas no momento de publicar.
