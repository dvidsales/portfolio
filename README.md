# Portfólio de David Sales

Portfólio e editor visual em **HTML, CSS e JavaScript**, sem backend e sem build. A hospedagem principal é o **GitHub Pages**, no repositório [`dvidsales/portfolio`](https://github.com/dvidsales/portfolio), branch `main`, arquivos na raiz.

- Portfólio: https://dvidsales.github.io/portfolio/
- Editor: https://dvidsales.github.io/portfolio/editor.html
- Histórico de publicações: https://github.com/dvidsales/portfolio/actions

## Usar o editor

1. Selecione a coleção e o vídeo, ou clique em **Adicionar vídeo**.
2. Insira um link HTTPS de arquivo do Google Drive, YouTube (inclusive Shorts e transmissões) ou Vimeo. A prévia e o portfólio usam a mesma normalização. Links protegidos por `resourcekey` do Drive ou hash de vídeo não listado do Vimeo mantêm esses parâmetros.
3. Escolha **Formato** e **Categoria**. Categorias diferentes criam abas dentro da coleção; use a mesma categoria para manter os vídeos juntos. Vídeos novos herdam a categoria quando há uma única categoria na coleção. A escolha explícita de **Geral** é preservada.
4. Preencha o título e, se quiser, a descrição em **Português, English e Español**. As traduções são manuais. Os títulos nos três idiomas são obrigatórios para publicar; descrições são opcionais. Limites: 300 caracteres para títulos, 5.000 para descrições.
5. Use **Salvar vídeo** para validar o item. A prévia de texto acompanha a digitação. Arraste os vídeos ou use as setas para mudar a ordem. **Remover** pede confirmação. **Desfazer** recupera alterações, inclusive da coleção selecionada anteriormente, em até 30 estados.
6. Revise o destino, informe o token restrito e publique. A mensagem **Commit criado** confirma o envio ao repositório. A implantação do Pages é uma etapa posterior; acompanhe o link para Actions antes de conferir o site.

O rascunho é salvo automaticamente no navegador, inclusive ao mudar de vídeo, idioma ou coleção. Alterar um rascunho não modifica o site público. O editor administra vídeos das coleções existentes; não cria projetos nem envia arquivos de vídeo aos provedores.

### Rascunho, backup e conflitos

**Exportar dados** baixa `projects.js`, sem credenciais. A exportação também funciona com um rascunho incompleto, para não perder trabalho; a publicação pelo editor exige conteúdo válido. Para publicar manualmente, substitua `projects.js` na raiz do repositório e faça um commit.

**Descartar rascunho local** restaura a publicação conhecida pela página atual, inclusive a última publicação feita nessa aba. Para obter alterações de outra pessoa/aba, recarregue o editor. Se houver trabalho local, exporte um backup antes de descartar. Não há importador automático de backups.

O rascunho registra os dados que serviram de base para a edição. Antes de gravar, o editor lê o arquivo no GitHub e compara com essa base. Se houve uma publicação intermediária, bloqueia a gravação e avisa, em vez de sobrescrever conteúdo mais recente. O SHA também acompanha a atualização, protegendo contra alterações concorrentes entre leitura e escrita. Rascunhos anteriores a essa revisão são recuperados com aviso para revisão manual.

Se o armazenamento local falhar, a edição continua em memória, com aviso para exportar antes de sair. Alterações do rascunho em outra aba também são sinalizadas. Se os dados publicados não carregarem corretamente, edição e publicação ficam bloqueadas até recarregar.

## Criar o token restrito

No GitHub, abra **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**:

- Escolha validade curta.
- Selecione **Only select repositories → portfolio**.
- Defina **Repository permissions → Contents: Read and write**. A leitura de Metadata é automática.

Cole o token somente no campo de senha do editor. O token não é salvo em localStorage, URLs, exportações ou arquivos do repositório; o campo é limpo após cada tentativa de publicação. Não envie tokens pelo chat nem os escreva no código. Políticas de organização podem exigir aprovação; branches protegidas podem impedir commits diretos.

O editor é uma página estática pública. Visitantes podem editar rascunhos em seus próprios navegadores; para gravar no repositório é necessário fornecer um token autorizado. Use o editor por HTTPS em dispositivo confiável.

## GitHub Pages

O editor já sugere proprietário `dvidsales`, repositório `portfolio`, branch `main` e pasta vazia (raiz). Em **Settings → Pages**, mantenha a publicação a partir dessa branch e pasta, ou o fluxo equivalente já configurado. As alterações do editor afetam `projects.js`; o site e o editor precisam estar instalados por inteiro no repositório uma primeira vez.

`bootstrap.js` carrega os dados publicados com um endereço novo por navegação, reduzindo o uso de uma cópia antiga no navegador. O cache da infraestrutura do Pages ainda pode levar algum tempo para refletir um deploy. Confira o resultado do workflow em Actions; se necessário, recarregue com Ctrl + Shift + R. Não é necessário ampliar o token para permissões de Actions apenas para publicar os vídeos.

## Testar localmente

Na pasta do site:

```sh
python -m http.server 8000
```

Abra http://localhost:8000/. O Python serve apenas os arquivos para desenvolvimento; em produção não é necessário servidor de aplicação.

Os testes automatizados ficam em `tests/`. Eles verificam navegação, traduções, responsividade, acessibilidade, editor e integração simulada com a API. Consulte `tests/README.md` e o relatório [VALIDACAO.md](VALIDACAO.md).

## Organização dos arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html`, `hemobras.html`, `ufpe.html` | Páginas públicas, metadados, links e estrutura semântica. |
| `styles.css` | Identidade visual, layout responsivo, contraste e foco visível. |
| `data.js` | Dados originais de projetos, softwares, créditos e traduções gerais. |
| `projects.js` | Conteúdo publicado pelo editor; substitui a lista de projetos em memória. |
| `video-utils.js` | Validação e normalização compartilhadas de vídeos e estrutura de dados. |
| `bootstrap.js` | Carregamento dos dados, tratamento de falhas e inicialização da página. |
| `common.js` | Idiomas, projetos, categorias, créditos, contagens, destaque e navegação. |
| `editor.html`, `editor.css`, `editor.js` | Editor visual, rascunhos, histórico, backup e publicação no GitHub. |
| `favicon.svg` | Ícone do site, servido localmente. |
| `curriculo.pdf` | Currículo original, preservado. |

Os créditos e os conteúdos autorais foram preservados. O primeiro vídeo da coleção **Hemobrás — YouTube** é usado como destaque na página inicial. Se a coleção estiver vazia, o destaque fica oculto. Os links **Abrir vídeo no provedor** permitem acessar o vídeo fora do player incorporado.

## Limites da verificação

Os testes simulam respostas dos players e da API do GitHub; não criam commits de teste com o token do visitante. As permissões de compartilhamento, a reprodução, legendas e a disponibilidade de cada vídeo são controladas pelo provedor. O relatório distingue esses limites dos fluxos verificados no site. Detalhes das correções estão em [CHANGELOG.md](CHANGELOG.md).
