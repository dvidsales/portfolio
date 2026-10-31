from playwright.sync_api import sync_playwright
from pathlib import Path
from urllib.parse import urlparse,unquote
import subprocess,time,json,base64,os,shutil,argparse,tempfile
parser=argparse.ArgumentParser(description='Validação end to end do portfólio; não faz publicações reais.')
parser.add_argument('--output',type=Path,default=None,help='Pasta para resultados JSON e capturas de tela')
parser.add_argument('--port',type=int,default=8771)
args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[1]
OUT=args.output or Path(tempfile.mkdtemp(prefix='portfolio-audit-'))
OUT.mkdir(parents=True,exist_ok=True)
ORIGIN=f'http://localhost:{args.port}/'
AXE=Path(os.environ.get('PORTFOLIO_AXE_PATH',str(Path(__file__).parent/'node_modules/axe-core/axe.min.js')))
if not AXE.is_file():raise SystemExit('axe-core não encontrado. Execute npm install --prefix tests.')
CHROMIUM=os.environ.get('PORTFOLIO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
server=subprocess.Popen([os.sys.executable,'-m','http.server',str(args.port),'--bind','127.0.0.1','--directory',str(ROOT)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(.5)
checks=[];axe_results=[];errors=[]
def check(name,condition=True):
 assert condition,name
 checks.append(name)
def ready(page,path):
 page.goto(ORIGIN+path,wait_until='domcontentloaded')
 page.wait_for_function("typeof render==='function'" if path.split('#')[0]=='editor.html' else "typeof applyLang==='function'")
def wire(page):
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('https://drive.google.com/**',lambda r:r.fulfill(status=200,content_type='text/html',body='<html lang="pt"><head><title>Vídeo externo simulado</title></head><body><main>Provedor externo</main></body></html>'))
 page.route('https://www.youtube-nocookie.com/**',lambda r:r.fulfill(status=200,content_type='text/html',body='<title>YouTube simulado</title>'))
 page.route('https://player.vimeo.com/**',lambda r:r.fulfill(status=200,content_type='text/html',body='<title>Vimeo simulado</title>'))
 page.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(status=200,content_type='text/css',body=''))
def fill_publish(page):
 page.fill('#token','token-simulado-nao-real');page.check('#reviewed')
def api_content(source):
 return {'sha':'sha-base','encoding':'base64','content':base64.b64encode(source.encode()).decode()}
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=CHROMIUM,args=['--no-sandbox'])
  context=browser.new_context(reduced_motion='reduce');page=context.new_page();wire(page)
  published=(ROOT/'projects.js').read_text()
  for path in ['index.html','hemobras.html','ufpe.html','editor.html']:
   ready(page,path)
   for lang in ['pt','en','es'] if path!='editor.html' else ['pt']:
    if path!='editor.html':page.evaluate('(l)=>applyLang(l)',lang)
    for width in [320,375,768,900,1024,1280,1920]:
     page.set_viewport_size({'width':width,'height':900})
     check(f'layout:{path}:{lang}:{width}',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
    page.set_viewport_size({'width':1280,'height':900})
    page.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelectorAll('details').forEach(e=>e.open=true)")
    page.add_script_tag(path=str(AXE))
    result=page.evaluate('axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}})')
    axe_results.append({'page':path,'lang':lang,'violations':result['violations']})
    check(f'accessibility:{path}:{lang}',not result['violations'])
    if path!='editor.html':
     missing=page.evaluate("[...document.querySelectorAll('[data-i18n],[data-i18n-html]')].filter(e=>I18N[state.lang][e.dataset.i18n||e.dataset.i18nHtml]===undefined).map(e=>e.outerHTML)")
     check('traduções:'+path+':'+lang,not missing)
     check('idioma HTML:'+path+':'+lang,page.locator('html').get_attribute('lang')==('pt-BR' if lang=='pt' else lang))
    # Testa os destinos de todos os links locais, incluindo IDs gerados.
    for href in set(page.locator('a[href]').evaluate_all('(els)=>els.map(e=>e.href)')):
     parsed=urlparse(href)
     if parsed.netloc!=f'localhost:{args.port}':continue
     file=unquote(parsed.path.lstrip('/')) or 'index.html'
     check('link:'+path+':'+file+'#'+parsed.fragment,(ROOT/file).is_file())
     if parsed.fragment:
      if file==path:check('âncora:'+parsed.fragment,page.locator('[id="'+parsed.fragment+'"]').count()==1)
      elif file.endswith('.html'):check('âncora externa:'+file+'#'+parsed.fragment,('id="'+parsed.fragment+'"') in (ROOT/file).read_text())
   page.screenshot(path=str(OUT/('final-'+path+'.png')),full_page=True)
  ready(page,'index.html');page.evaluate("applyLang('pt')")
  check('biblioteca reúne todos os vídeos',page.locator('#galleryItems .gallery-select').count()==21)
  check('contagem Hemobrás',page.locator('[data-collection-count=hemobras]').inner_text()=='13 vídeos')
  check('contagem UFPE',page.locator('[data-collection-count=ufpe]').inner_text()=='6 vídeos')
  check('apenas um player',page.locator('iframe').count()==1)
  check('primeiro vídeo no monitor','ministério da saúde' in page.locator('#monitorTitle').inner_text())
  page.click('[data-filter=ufpe]');check('filtro UFPE',page.locator('#galleryItems .gallery-select').count()==6)
  page.locator('.gallery-select').nth(1).click();check('seleção troca monitor','fisioterapia' in page.locator('#monitorTitle').inner_text())
  check('créditos preservados','david sales' in page.locator('#workCredits').inner_text().lower())
  check('participação a partir dos créditos','edição' in page.locator('#propertyValues').inner_text())
  selected=page.locator('#monitorScreen iframe').get_attribute('src')
  page.evaluate("applyLang('en')");check('idioma mantém o vídeo',page.locator('#monitorScreen iframe').get_attribute('src')==selected)
  check('descrição traduzida','news reports' in page.locator('#monitorDescription').inner_text())
  page.click('[data-view=list]');check('visualização em lista',page.locator('#galleryItems').get_attribute('data-view')=='list')
  page.fill('#librarySearch','arquitetura');page.wait_for_timeout(220);check('busca sem acentos e entre idiomas',page.locator('.gallery-select').count()==1)
  page.fill('#librarySearch','nao-existe-video-xyz');page.wait_for_timeout(220);check('busca vazia',page.locator('.gallery-select').count()==0 and page.locator('#nextVideo').is_disabled())
  page.click('#clearLibrarySearch');check('limpar busca',page.locator('.gallery-select').count()==6)
  page.click('[data-filter=all]');page.click('[data-view=grid]');page.evaluate("applyLang('pt')")
  page.click('[data-filter=personal]');check('filtro autorais',page.locator('.gallery-select').count()==2)
  check('ficha técnica autoral','direção' in page.locator('#workCredits').inner_text().lower())
  page.click('#nextVideo');check('próximo vídeo','bajado' in page.locator('#monitorTitle').inner_text())
  page.click('#previousVideo');check('vídeo anterior','stalker' in page.locator('#monitorTitle').inner_text())
  page.click('[data-filter=hemobras]');page.locator('.gallery-select').nth(7).click();check('vídeo vertical no monitor',page.locator('#monitorScreen').evaluate('(e)=>e.classList.contains("is-vertical")'))
  rect=page.locator('#monitorScreen iframe').bounding_box();box=page.locator('#monitorScreen').bounding_box()
  check('player vertical mede 9:16',abs(rect['width']/rect['height']-9/16)<.005)
  check('player vertical centralizado',abs(rect['x']+rect['width']/2-box['x']-box['width']/2)<1)
  check('link compartilhável','video=' in page.url)
  check('link do Instagram omitido nos verticais',page.locator('#propertyProjectLink a').count()==0)
  shared=page.url;title=page.locator('#monitorTitle').inner_text();page.goto(shared,wait_until='domcontentloaded');page.wait_for_function('typeof applyLang==="function"');check('link mantém seleção',page.locator('#monitorTitle').inner_text()==title)
  page.locator('#workProperties summary').click();check('propriedades recolhíveis',not page.locator('#propertyValues').is_visible());page.locator('#workProperties summary').click()
  page.set_viewport_size({'width':375,'height':812})
  check('menu fechado inerte',page.locator('#primaryNav').evaluate('(e)=>e.inert'))
  page.click('#burgerBtn');check('menu aberto',page.locator('#burgerBtn').get_attribute('aria-expanded')=='true')
  check('foco no menu',page.locator('#primaryNav a').first.evaluate('(e)=>e===document.activeElement'))
  page.keyboard.press('Escape');check('Escape fecha menu',page.locator('#primaryNav').evaluate('(e)=>e.inert'))
  page.click('#ccBtn');page.keyboard.press('End');page.keyboard.press('Enter');check('idiomas por teclado',page.locator('html').get_attribute('lang')=='es')
  page.select_option('#sequenceSelect','#contatos');check('timeline compacta navega',page.url.endswith('#contatos'))
  page.set_viewport_size({'width':1280,'height':900});check('menu desktop ativo',not page.locator('#primaryNav').evaluate('(e)=>e.inert'))
  with page.expect_download() as download:page.locator('a[download]').click()
  check('currículo PDF',Path(download.value.path()).read_bytes().startswith(b'%PDF-'))
  ready(page,'hemobras.html');check('coleção institucional limitada',page.locator('.gallery-select').count()==13)
  page.click('[data-filter=hemobras-instagram]');check('filtro de canal na coleção',page.locator('.gallery-select').count()==6)
  ready(page,'ufpe.html');check('coleção UFPE limitada',page.locator('.gallery-select').count()==6)
  check('sem iframe vazio',page.locator('iframe[src=""]').count()==0)
  for raw in ['null','42','[]','{"lang":"xx"}','{invalid']:
   page.evaluate('(raw)=>localStorage.setItem(STORAGE_KEY,raw)',raw);page.reload(wait_until='domcontentloaded');page.wait_for_function('typeof applyLang==="function"');check('preferências corrompidas:'+raw,page.locator('html').get_attribute('lang')=='pt-BR')
  ready(page,'index.html#proj-a-stalker');page.wait_for_timeout(100)
  check('link direto para coleção',page.locator('#videoWorkbench').bounding_box()['y']<300 and 'stalker' in page.locator('#monitorTitle').inner_text())
  # As três abas móveis compartilham o mesmo rascunho do editor.
  ready(page,'editor.html');page.set_viewport_size({'width':375,'height':812})
  check('aba móvel biblioteca',page.locator('#editorLibrary').is_visible() and page.locator('#editorDetails').is_hidden())
  page.click('#editorTab-monitor');check('aba móvel monitor',page.locator('#editorMonitor').is_visible())
  page.click('#editSelectedVideo');check('atalho para detalhes',page.locator('#editorDetails').is_visible())
  page.locator('#editorTab-details').focus();page.keyboard.press('Home');check('abas móveis por teclado',page.locator('#editorLibrary').is_visible())
  page.set_viewport_size({'width':1280,'height':900});page.wait_for_function('["editorLibrary","editorMonitor","editorDetails"].every(id=>!document.getElementById(id).hidden)');check('três painéis no desktop',all(page.locator('#'+id).is_visible() for id in ['editorLibrary','editorMonitor','editorDetails']))
  ready(page,'editor.html');n=page.locator('#videoList .select-video').count();page.click('#add')
  check('adicionar',page.locator('#videoList .select-video').count()==n+1)
  check('categoria herdada',page.input_value('#category')=='youtube')
  page.fill('#url','https://youtu.be/abcdefghijk')
  for lang,title in [('pt','Título seguro <img src=x onerror=alert(1)>'),('en','English title'),('es','Título español')]:
   page.click('[data-lang='+lang+']');page.fill('#title',title);page.fill('#description','Descrição '+lang)
   check('prévia de texto em tempo real:'+lang,page.locator('#preview h3').inner_text()==title)
  page.click('button[type=submit]');check('URL normalizada',page.input_value('#url')=='https://www.youtube-nocookie.com/embed/abcdefghijk')
  check('texto HTML inofensivo',page.locator('#preview img').count()==0)
  check('nenhum token salvo','token-simulado' not in page.evaluate('JSON.stringify(localStorage)'))
  page.select_option('#category','geral');page.select_option('#orientation','vertical');page.reload(wait_until='domcontentloaded');page.wait_for_function('typeof render==="function"')
  page.locator('#videoList .select-video').last.click();check('rascunho persistido',page.input_value('#category')=='geral' and page.input_value('#orientation')=='vertical')
  before=page.evaluate('JSON.stringify(project().videos.map(v=>v.caption.pt))')
  page.locator('#videoList li').last.locator('.order-controls button').first.click();check('reordenar',page.evaluate('selectedVideo')==n-1)
  page.select_option('#project','1');page.click('#undo');check('desfazer restaura coleção',page.input_value('#project')=='0')
  check('desfazer restaura ordem',page.evaluate('JSON.stringify(project().videos.map(v=>v.caption.pt))')==before)
  page.on('dialog',lambda d:d.accept());page.click('#remove');check('remover',page.locator('#videoList .select-video').count()==n);page.click('#undo');check('desfazer remoção',page.locator('#videoList .select-video').count()==n+1)
  # Arraste de verdade, além dos controles por teclado.
  items=page.locator('#videoList li');first_title=items.first.locator('.select-video').inner_text().split(' / ',1)[1]
  items.first.drag_to(items.nth(1));check('arrastar',page.locator('#videoList li').nth(1).inner_text().find(first_title)>=0)
  with page.expect_download() as download:page.click('#export')
  source=Path(download.value.path()).read_text();check('exportação sem token','token-simulado' not in source and 'PROJECTS.splice' in source)
  calls=[];remote={'source':published,'status':200}
  def api(route):
   request=route.request;calls.append({'method':request.method,'body':request.post_data})
   if request.method=='GET':route.fulfill(status=200,json=api_content(remote['source']))
   elif remote['status']!=200:route.fulfill(status=remote['status'],json={'message':'simulated'})
   else:
    body=json.loads(request.post_data);remote['source']=base64.b64decode(body['content']).decode();route.fulfill(status=200,json={'commit':{'sha':'abc123456789'}})
  page.route('https://api.github.com/**',api)
  fill_publish(page);page.click('#publishButton');page.wait_for_function('!publishing')
  check('publicar commit','Commit criado:' in page.locator('#publishResult').inner_text())
  body=json.loads([c for c in calls if c['method']=='PUT'][-1]['body']);check('publicação inclui SHA e branch',body['sha']=='sha-base' and body['branch']=='main')
  check('token limpo',page.input_value('#token')=='')
  check('token não exportado','token-simulado' not in remote['source'])
  check('base local atualizada após publicar',page.evaluate('JSON.stringify(PROJECTS)===JSON.stringify(baseProjects)'))
  # Uma segunda publicação na mesma sessão deve funcionar.
  page.fill('#title','Segunda edição');fill_publish(page);page.click('#publishButton');page.wait_for_function('!publishing');check('publicar novamente','Commit criado:' in page.locator('#publishResult').inner_text())
  # Atualização alheia: não pode gravar mesmo conhecendo o novo SHA.
  remote['source']=published;before_put=sum(c['method']=='PUT' for c in calls)
  fill_publish(page);page.click('#publishButton');page.wait_for_function('!publishing');check('conflito não sobrescreve',sum(c['method']=='PUT' for c in calls)==before_put and 'publicação mais recente' in page.locator('#publishResult').inner_text())
  check('token limpo no conflito',page.input_value('#token')=='')
  # Erro da API após leitura válida.
  remote['source']=page.evaluate('publishedSource(baseProjects)');remote['status']=403
  fill_publish(page);page.click('#publishButton');page.wait_for_function('!publishing');check('permissão negada exibida','403' in page.locator('#publishResult').inner_text());check('token limpo no erro',page.input_value('#token')=='')
  remote['status']=409;fill_publish(page);page.click('#publishButton');page.wait_for_function('!publishing');check('corrida de atualização tratada','Conflito' in page.locator('#publishResult').inner_text())
  # Falha de conexão deve restaurar o botão e limpar token.
  page.unroute('https://api.github.com/**');page.route('https://api.github.com/**',lambda r:r.abort())
  fill_publish(page);page.click('#publishButton');page.wait_for_function('!publishing');check('falha de conexão','Não foi possível conectar' in page.locator('#publishResult').inner_text());check('botão reabilitado',page.locator('#publishButton').is_enabled())
  # Validação de tradução leva ao vídeo e idioma que faltam.
  page.click('#add');page.fill('#url','https://youtu.be/abcdefghijk');page.fill('#title','Somente português')
  fill_publish(page);page.click('#publishButton');page.wait_for_function('!publishing');check('tradução ausente indicada',page.locator('[data-lang=en]').get_attribute('aria-pressed')=='true' and page.locator('#title').get_attribute('aria-invalid')=='true')
  check('token limpo na validação',page.input_value('#token')=='')
  page.fill('#url','https://evil.example/video');page.click('button[type=submit]');check('provedor inválido rejeitado',page.locator('#url').get_attribute('aria-invalid')=='true')
  # Backup de rascunho incompleto continua disponível.
  with page.expect_download() as download:page.click('#export')
  check('backup incompleto',Path(download.value.path()).stat().st_size>0)
  # Resiliência a rascunho com estrutura inválida.
  for draft in ['null','[]','[{"id":"bad","videos":[null]}]']:
   page.evaluate('(d)=>localStorage.setItem(DRAFT_KEY,d)',draft);page.reload(wait_until='domcontentloaded');page.wait_for_function('typeof render==="function"');check('rascunho inválido:'+draft,page.locator('#videoList .select-video').count()==3)
  # Bloqueio quando os dados publicados não carregam.
  page.route('**/projects.js?*',lambda r:r.abort());page.reload(wait_until='domcontentloaded');page.wait_for_function('typeof render==="function"');check('falha de carga bloqueia gravação',page.locator('#publishButton').is_disabled() and page.locator('#add').is_disabled())
  page.unroute('**/projects.js?*')
  page.route('**/projects.js?*',lambda r:r.fulfill(status=200,content_type='text/javascript',body="PROJECTS.splice(0,PROJECTS.length,...[{id:'bad'}]);"))
  page.reload(wait_until='domcontentloaded');page.wait_for_function('typeof render==="function"')
  check('estrutura publicada inválida bloqueada',page.locator('#publishButton').is_disabled() and page.locator('.load-warning').count()>0)
  page.unroute('**/projects.js?*')
  ready(page,'editor.html');data_url=page.locator('script[src*="projects.js?updated="]').get_attribute('src')
  page.reload(wait_until='domcontentloaded');page.wait_for_function('typeof render==="function"')
  check('carga de dados renova URL',data_url!=page.locator('script[src*="projects.js?updated="]').get_attribute('src'))
  # URLs suportadas e suas variantes.
  ready(page,'editor.html')
  urls=[('https://www.youtube.com/watch?v=abcdefghijk','https://www.youtube-nocookie.com/embed/abcdefghijk'),('https://youtube.com/shorts/abcdefghijk','https://www.youtube-nocookie.com/embed/abcdefghijk'),('https://drive.google.com/open?id=abcDEF_123&resourcekey=key-123','https://drive.google.com/file/d/abcDEF_123/preview?resourcekey=key-123'),('https://vimeo.com/123456789/abc123','https://player.vimeo.com/video/123456789?h=abc123')]
  for raw,expected in urls:check('normalizar:'+raw,page.evaluate('(u)=>PortfolioVideo.normalize(u)',raw)==expected)
  for raw in ['javascript:alert(1)','http://youtu.be/abcdefghijk','https://youtu.be.evil.com/abcdefghijk','https://www.youtube.com/playlist?list=abcdefghijk','https://user:pass@vimeo.com/123']:
   check('bloquear:'+raw,page.evaluate('(u)=>PortfolioVideo.safe(u)',raw)=='')
  # Link direto para projeto gerado dinamicamente.
  ready(page,'index.html#proj-a-stalker');page.wait_for_timeout(100)
  check('link direto dinâmico',page.locator('#videoWorkbench').bounding_box()['y'] < 300)
  ready(page,'editor.html')
  # Sem armazenamento: edição funciona e há aviso claro.
  page.evaluate("() => {Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError')}}");page.fill('#title','Sem armazenamento');check('armazenamento indisponível avisado','Não foi possível salvar' in page.locator('#status').inner_text())
  # Sem JS: conteúdo estático continua legível e links de navegação presentes.
  nojs=browser.new_context(java_script_enabled=False,viewport={'width':375,'height':812});nj=nojs.new_page();nj.goto(ORIGIN,wait_until='domcontentloaded');check('conteúdo sem JavaScript',nj.locator('#about .section-title').is_visible() and nj.locator('#primaryNav').is_visible());nojs.close()
  check('nenhum erro JavaScript',not errors)
  browser.close()
 print('Relatório:',OUT)
 print('PASS',len(checks),'verificações; acessibilidade:',len(axe_results),'cenários sem violações. APIs e players externos simulados.')
 OUT.joinpath('results.json').write_text(json.dumps({'checks':checks,'axe':axe_results,'errors':errors},ensure_ascii=False,indent=2))
finally:server.terminate()
