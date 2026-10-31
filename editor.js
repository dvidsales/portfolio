'use strict';
const $ = id => document.getElementById(id);
const DRAFT_KEY = 'davidsales_editor_v1';
const clone = value => JSON.parse(JSON.stringify(value));
const languages = {pt:'Português', en:'English', es:'Español'};
let projects = clone(PROJECTS), baseProjects = clone(PROJECTS);
let selectedProject = 0, selectedVideo = 0, lang = 'pt', history = [], dragged = null;
let lastEditGroup = null, volatileDraft = false, publishing = false;
const project = () => projects[selectedProject];
const video = () => project().videos[selectedVideo];
function status(message){ $('status').textContent = message; }
function collectionCategory(p){
  const categories = [...new Set(p.videos.map(v => v.category).filter(Boolean))];
  return categories.length === 1 ? categories[0] : null;
}
function normalizeCategories(items){
  for(const p of items){
    const category = collectionCategory(p);
    if(category) for(const v of p.videos) if(!v.category) v.category = category;
  }
}
try {
  const stored = JSON.parse(localStorage.getItem(DRAFT_KEY));
  const draft = Array.isArray(stored) ? stored : stored?.projects;
  if(draft){
    if(!PortfolioVideo.validProjects(draft)) throw new Error('invalid draft');
    projects = draft;
    if(stored.version === 2 && PortfolioVideo.validProjects(stored.baseProjects)) {
      baseProjects = stored.baseProjects;
      status(JSON.stringify(baseProjects) === JSON.stringify(PROJECTS)
        ? 'Rascunho local recuperado.'
        : 'Há uma publicação mais recente. Exporte seu rascunho antes de recarregar e revisar as diferenças.');
    } else {
      status('Rascunho antigo recuperado. Revise os vídeos antes de publicar.');
    }
  }
} catch {
  status('O rascunho não pôde ser recuperado. Os dados publicados foram carregados.');
}
normalizeCategories(projects);
if($('status').textContent === 'Carregando dados publicados…')status('Pronto para editar.');
function persist(message = 'Rascunho salvo neste navegador. Publique para atualizar o site.'){
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({version:2, projects, baseProjects}));
    volatileDraft = false;
    status(message);
  } catch {
    volatileDraft = true;
    status('Não foi possível salvar neste navegador. Exporte os dados antes de fechar a aba.');
  }
}
function checkpoint(group = null){
  if(group && lastEditGroup === group) return;
  const snapshot = {projects:clone(projects), selectedProject, selectedVideo, lang};
  const previous = history[history.length - 1];
  if(!previous || JSON.stringify(previous.projects) !== JSON.stringify(projects)){
    history.push(snapshot);
    if(history.length > 30) history.shift();
  }
  lastEditGroup = group;
  $('undo').disabled = !history.length;
}
function embedURL(value){ return PortfolioVideo.normalize(value); }
function renderList(focusIndex){
  const scroll = $('videoList').scrollTop;
  $('videoList').replaceChildren();
  if(!project().videos.length){
    const empty = document.createElement('li');
    empty.className = 'empty-state';empty.textContent = 'Nenhum vídeo nesta coleção. Adicione o primeiro.';
    $('videoList').append(empty);
  }
  project().videos.forEach((v,i) => {
    const li = document.createElement('li');
    li.draggable = true;li.classList.toggle('selected', i === selectedVideo);
    const select = document.createElement('button');
    select.className = 'select-video';select.dataset.select = i;
    select.setAttribute('aria-pressed', i === selectedVideo);
    const thumb = document.createElement('span');thumb.className='editor-thumbnail';thumb.setAttribute('aria-hidden','true');
    thumb.innerHTML='<svg viewBox="0 0 40 32"><rect x="1" y="1" width="38" height="30" rx="3"/><path d="m16 10 10 6-10 6Z"/></svg>';
    const thumbnail=PortfolioVideo.thumbnail(v.embed);
    if(thumbnail){const image=document.createElement('img');image.alt='';image.loading='lazy';image.src=thumbnail;image.referrerPolicy='no-referrer';image.onerror=()=>image.remove();thumb.append(image);}
    const label = document.createElement('span');label.textContent=`${String(i + 1).padStart(2,'0')} / ${v.caption?.[lang] || 'Novo vídeo — sem título'}`;
    select.append(thumb,label);
    select.onclick = () => { selectedVideo = i;lastEditGroup = null;clearError();render();activateEditorPanel('monitor'); };
    li.append(select);
    const controls = document.createElement('div');controls.className = 'order-controls';
    for(const [label, delta] of [['↑',-1],['↓',1]]){
      const button = document.createElement('button');
      button.textContent = label;
      button.setAttribute('aria-label', `${delta < 0 ? 'Mover para cima' : 'Mover para baixo'}: ${v.caption?.[lang] || 'novo vídeo'}`);
      button.disabled = i + delta < 0 || i + delta >= project().videos.length;
      button.onclick = () => move(i, i + delta);
      controls.append(button);
    }
    li.append(controls);
    li.ondragstart = e => { dragged = i;e.dataTransfer.setData('text/plain', String(i));e.dataTransfer.effectAllowed = 'move'; };
    li.ondragover = e => { e.preventDefault();e.dataTransfer.dropEffect = 'move'; };
    li.ondrop = e => { e.preventDefault();if(dragged !== null) move(dragged,i);dragged = null; };
    li.ondragend = () => { dragged = null; };
    $('videoList').append(li);
  });
  $('videoList').scrollTop = scroll;
  if(focusIndex !== undefined) $('videoList').querySelector(`[data-select="${focusIndex}"]`)?.focus();
}
function move(from,to){
  if(from === to || from < 0 || to < 0 || to >= project().videos.length) return;
  checkpoint();
  const [v] = project().videos.splice(from,1);project().videos.splice(to,0,v);
  selectedVideo = to;$('reviewed').checked = false;persist('Ordem atualizada no rascunho.');render();renderList(to);
}
function preview(){
  const v = video();
  if(!v){ $('preview').replaceChildren();$('preview').textContent = 'Adicione um vídeo a este projeto.';return; }
  const url = PortfolioVideo.safe(v.embed);
  const existing = $('preview').querySelector('iframe');
  let frame;
  if(url){
    frame = existing?.getAttribute('src') === url ? existing : document.createElement('iframe');
    if(frame !== existing) frame.src = url;
    frame.title = v.caption?.[lang] || 'Prévia do vídeo';frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.classList.toggle('vertical', v.orientation === 'vertical');
  }
  // Mantém o player montado ao digitar para não interromper a reprodução.
  for(const child of [...$('preview').childNodes]) if(child !== frame) child.remove();
  if(frame && frame !== existing) $('preview').prepend(frame);
  if(!url){ const note = document.createElement('p');note.textContent = 'Insira um link válido para visualizar o vídeo.';$('preview').append(note); }
  const tag = document.createElement('p');tag.className = 'eyebrow';
  tag.textContent = I18N[lang]['cat_' + (v.category || 'geral')] || v.category || 'Geral';
  const title = document.createElement('h3');title.textContent = v.caption?.[lang] || 'Sem título';
  const desc = document.createElement('p');desc.textContent = v.desc?.[lang] || '';
  $('preview').append(tag,title,desc);
  const href = PortfolioVideo.external(v.embed);
  if(href){const a = document.createElement('a');a.href = href;a.textContent = 'Abrir vídeo no provedor ↗';a.className = 'video-external';a.target = '_blank';a.rel = 'noopener noreferrer';$('preview').append(a);}
}
function render(){
  $('project').value = selectedProject;
  renderList();
  const v = video();$('fields').disabled = !v || !!window.PORTFOLIO_DATA_ERROR;
  const category = v?.category || 'geral';
  if(![...$('category').options].some(o => o.value === category)){
    const option = document.createElement('option');option.value = category;option.textContent = category;$('category').append(option);
  }
  $('category').value = category;
  $('url').value = v?.embed || '';$('orientation').value = v?.orientation || 'horizontal';
  $('title').value = v?.caption?.[lang] || '';$('description').value = v?.desc?.[lang] || '';
  $('titleLabel').firstChild.textContent = `Título · ${languages[lang]}`;
  $('descLabel').firstChild.textContent = `Descrição · ${languages[lang]}`;
  for(const id of ['title','description']) $(id).lang = lang === 'pt' ? 'pt-BR' : lang;
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  preview();
}
function clearError(){
  $('videoError').textContent = '';
  for(const id of ['url','title','description']) $(id).removeAttribute('aria-invalid');
}
function showError(error){
  if(error.projectIndex !== undefined){
    selectedProject = error.projectIndex;selectedVideo = error.videoIndex;lang = error.lang || lang;render();
  }
  $('videoError').textContent = error.message;status(error.message);
  if(error.field){activateEditorPanel('details');$(error.field).setAttribute('aria-invalid','true');$(error.field).focus();}
}
function capture(){
  const v = video();if(!v) return;
  v.caption ||= {};v.desc ||= {};
  v.caption[lang] = $('title').value;v.desc[lang] = $('description').value;
  v.embed = $('url').value.trim();v.orientation = $('orientation').value;v.category = $('category').value;
}
$('videoForm').addEventListener('input', e => {
  checkpoint(`${selectedProject}:${selectedVideo}:${lang}:${e.target.id}`);
  capture();clearError();persist();renderList();preview();$('reviewed').checked = false;
});
$('videoForm').onsubmit = e => {
  e.preventDefault();clearError();
  try {
    const url = embedURL($('url').value);
    if(!$('title').value.trim()) throw Object.assign(new Error('Preencha o título no idioma selecionado.'), {field:'title'});
    checkpoint();capture();video().embed = url;persist('Vídeo salvo no rascunho. Publique para atualizar o site.');render();
  } catch(error){if(!error.field) error.field = 'url';showError(error);}
};
for(const [i,p] of projects.entries()){
  const option = document.createElement('option');option.value = i;option.textContent = p.title.pt;$('project').append(option);
}
$('project').onchange = () => { selectedProject = Number($('project').value);selectedVideo = 0;lastEditGroup = null;clearError();render(); };
for(const button of document.querySelectorAll('[data-lang]')) button.onclick = () => {lang = button.dataset.lang;lastEditGroup = null;clearError();render();};
$('add').onclick = () => {
  checkpoint();const category = collectionCategory(project());
  project().videos.push({caption:{pt:'',en:'',es:''},desc:{pt:'',en:'',es:''},embed:'',orientation:'horizontal',category:category || 'geral'});
  selectedVideo = project().videos.length - 1;persist();clearError();render();activateEditorPanel('details');$('url').focus();$('reviewed').checked = false;
};
$('remove').onclick = () => {
  if(!video() || !confirm('Remover este vídeo do rascunho? Você pode desfazer.')) return;
  checkpoint();project().videos.splice(selectedVideo,1);selectedVideo = Math.max(0,selectedVideo - 1);
  persist('Vídeo removido do rascunho. Você pode desfazer.');clearError();render();$('reviewed').checked = false;
};
$('undo').onclick = () => {
  if(!history.length) return;
  const snapshot = history.pop();projects = snapshot.projects;selectedProject = snapshot.selectedProject;
  selectedVideo = Math.min(snapshot.selectedVideo,Math.max(0,project().videos.length - 1));lang = snapshot.lang;
  lastEditGroup = null;$('undo').disabled = !history.length;persist('Última alteração desfeita.');clearError();render();$('reviewed').checked = false;
};
$('reset').onclick = () => {
  if(!confirm('Descartar o rascunho e voltar aos dados publicados carregados nesta página?')) return;
  checkpoint();projects = clone(PROJECTS);baseProjects = clone(PROJECTS);selectedProject = 0;selectedVideo = 0;
  normalizeCategories(projects);persist('Rascunho restaurado aos dados publicados.');clearError();render();$('reviewed').checked = false;
};
function payloadProjects(requireComplete = true){
  const payload = clone(projects);normalizeCategories(payload);
  for(const [pi,p] of payload.entries()) for(const [vi,v] of p.videos.entries()){
    try{ v.embed = embedURL(v.embed); }
    catch(error){if(requireComplete)throw Object.assign(new Error(`${p.title.pt}, vídeo ${vi+1}: ${error.message}`),{projectIndex:pi,videoIndex:vi,field:'url'});}
    for(const l of Object.keys(languages)){
      if(requireComplete && !v.caption?.[l]?.trim()) throw Object.assign(new Error(`${p.title.pt}, vídeo ${vi+1}: preencha o título em ${languages[l]}.`),{projectIndex:pi,videoIndex:vi,lang:l,field:'title'});
      if(requireComplete && (v.caption[l].length > 300 || (v.desc?.[l]?.length || 0) > 5000)) throw Object.assign(new Error('Use até 300 caracteres no título e 5.000 na descrição.'),{projectIndex:pi,videoIndex:vi,lang:l,field:v.caption[l].length>300?'title':'description'});
      if(v.caption[l])v.caption[l] = v.caption[l].trim();
    }
  }
  return payload;
}
function publishedSource(payload = payloadProjects(false)){
  return '// Gerado pelo editor visual. Não contém credenciais.\nPROJECTS.splice(0, PROJECTS.length, ...' + JSON.stringify(payload,null,2).replace(/</g,'\\u003c') + ');\n';
}
$('export').onclick = () => {
  try{
    const url = URL.createObjectURL(new Blob([publishedSource()],{type:'text/javascript;charset=utf-8'}));
    const a = document.createElement('a');a.href = url;a.download = 'projects.js';a.click();setTimeout(() => URL.revokeObjectURL(url),1000);
    status('Arquivo projects.js exportado. O token não faz parte do arquivo.');
  }catch(error){showError(error);}
};
function base64(text){
  const bytes = new TextEncoder().encode(text);let binary = '';
  for(const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
function remoteProjects(file){
  if(file.encoding !== 'base64' || typeof file.content !== 'string') throw new Error('O GitHub não retornou o conteúdo para revisão. Nada foi alterado.');
  const source = new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(file.content.replace(/\s/g,'')),c => c.charCodeAt(0)));
  const match = source.match(/^\s*\/\/[^\n]*\nPROJECTS\.splice\(0,\s*PROJECTS\.length,\s*\.\.\.([\s\S]*)\);\s*$/);
  if(!match){
    if(source.trim() === '// Conteúdo publicado pelo editor. A ausência de substituição mantém os dados originais.') return clone(window.PORTFOLIO_DEFAULT_PROJECTS);
    throw new Error('O formato de projects.js mudou no GitHub. Exporte seu rascunho e recarregue antes de publicar.');
  }
  const items = JSON.parse(match[1]);
  if(!PortfolioVideo.validProjects(items)) throw new Error('Os dados no GitHub não são compatíveis com este editor. Nada foi alterado.');
  return items;
}
$('publishForm').onsubmit = async e => {
  e.preventDefault();
  if(publishing || window.PORTFOLIO_DATA_ERROR) return;
  publishing = true;const button = $('publishButton');button.disabled = true;$('publishResult').textContent = 'Conferindo dados e destino…';
  const token = $('token').value.trim();
  const controller = new AbortController();const timeout = setTimeout(() => controller.abort(),30000);
  try {
    const payload = payloadProjects();const source = publishedSource(payload);const draftAtStart = JSON.stringify(projects);
    const owner = $('owner').value.trim(), repo = $('repo').value.trim(), branch = $('branch').value.trim();
    if(!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo) || !branch || !token) throw new Error('Preencha proprietário, repositório, branch e token.');
    const folder = $('folder').value.trim().replace(/^\/+|\/+$/g,'');
    if(folder.split('/').some(s => s === '..' || s === '.') || folder.includes('\\')) throw new Error('Pasta inválida. Use o caminho relativo à raiz do repositório.');
    const path = (folder ? folder + '/' : '') + 'projects.js';
    const endpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
    const headers = {Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
    const options = {headers,cache:'no-store',redirect:'error',signal:controller.signal};
    const get = await fetch(endpoint + '?ref=' + encodeURIComponent(branch), options);let sha;
    if(get.ok){
      const file = await get.json();sha = file.sha;
      if(JSON.stringify(remoteProjects(file)) !== JSON.stringify(baseProjects)) throw new Error('Há uma publicação mais recente no GitHub. Nada foi sobrescrito. Exporte seu rascunho, recarregue e revise as diferenças antes de publicar.');
    } else if(get.status !== 404) throw new Error(`Leitura recusada (${get.status}). Confira o acesso ao repositório, o token e a branch.`);
    $('publishResult').textContent = 'Criando commit no GitHub…';
    const response = await fetch(endpoint,{...options,method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({message:'Atualiza vídeos pelo editor visual',branch,content:base64(source),...(sha ? {sha} : {})})});
    if(!response.ok) throw new Error(response.status === 409 || response.status === 422
      ? 'Conflito ou branch inválida/protegida. Nada foi sobrescrito; confira o destino e recarregue os dados.'
      : `Publicação recusada (${response.status}). Confira validade do token e Contents: Read and write.`);
    const result = await response.json();baseProjects = clone(payload);PROJECTS.splice(0,PROJECTS.length,...clone(payload));
    if(JSON.stringify(projects) === draftAtStart){projects = clone(payload);render();}
    persist('Commit criado no GitHub. O Pages ainda precisa concluir a atualização do site.');
    $('publishResult').replaceChildren(document.createTextNode('Commit criado: '));
    const a = document.createElement('a');a.href = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commit/${encodeURIComponent(result.commit.sha)}`;
    a.textContent = result.commit.sha.slice(0,7);a.target = '_blank';a.rel = 'noopener noreferrer';$('publishResult').append(a,document.createTextNode('. '));
    const actions = document.createElement('a');actions.href = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/actions`;actions.textContent = 'Acompanhar publicação no Pages';actions.target = '_blank';actions.rel = 'noopener noreferrer';$('publishResult').append(actions);
    if(JSON.stringify(projects) !== JSON.stringify(payload)) $('publishResult').append(document.createTextNode('. Você fez novas alterações durante o envio; elas continuam no rascunho.'));
    $('reviewed').checked = false;
  } catch(error){
    if(error.projectIndex !== undefined) showError(error);
    $('publishResult').textContent = error.name === 'AbortError'
      ? 'O GitHub demorou a responder. Verifique os commits antes de tentar novamente; o envio pode ter sido recebido.'
      : error instanceof TypeError ? 'Não foi possível conectar ao GitHub. Confira a conexão e os commits antes de tentar novamente.' : error.message;
  } finally {
    clearTimeout(timeout);$('token').value = '';publishing = false;button.disabled = !!window.PORTFOLIO_DATA_ERROR;
  }
};
window.addEventListener('beforeunload', e => {if(volatileDraft){e.preventDefault();e.returnValue = '';}});
window.addEventListener('storage', e => {if(e.key === DRAFT_KEY) status('O rascunho foi alterado em outra aba. Exporte suas mudanças antes de recarregar.');});
if(!window.PORTFOLIO_DATA_ERROR){
  for(const id of ['add','export','publishButton']) $(id).disabled = false;
} else {
  for(const id of ['project','reset','undo']) $(id).disabled = true;
}
render();


// No celular, os mesmos painéis viram abas; o estado de edição é compartilhado.
const editorMobile = matchMedia('(max-width:650px)');
const editorPanels = {library:'editorLibrary',monitor:'editorMonitor',details:'editorDetails'};
let activeEditorPanel = 'library';
function activateEditorPanel(key,focus=false){
  if(!editorPanels[key])return;
  activeEditorPanel=key;
  for(const [name,id] of Object.entries(editorPanels)){
    const panel=$(id);panel.hidden=editorMobile.matches && name!==key;
    if(editorMobile.matches){panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','editorTab-'+name);}
    else{panel.removeAttribute('role');panel.setAttribute('aria-labelledby','editorHeading-'+name);}
    const tab=$('editorTab-'+name);tab.setAttribute('aria-selected',name===key);tab.tabIndex=name===key?0:-1;
  }
  if(focus)$('editorTab-'+key).focus();
}
for(const [i,tab] of [...document.querySelectorAll('[data-editor-panel]')].entries()){
  tab.onclick=()=>activateEditorPanel(tab.dataset.editorPanel);
  tab.onkeydown=e=>{
    const keys=Object.keys(editorPanels);let next;
    if(e.key==='ArrowRight')next=(i+1)%keys.length;
    if(e.key==='ArrowLeft')next=(i+keys.length-1)%keys.length;
    if(e.key==='Home')next=0;if(e.key==='End')next=keys.length-1;
    if(next!==undefined){e.preventDefault();activateEditorPanel(keys[next],true);}
  };
}
$('editSelectedVideo').onclick=()=>{activateEditorPanel('details');$('title').focus();};
editorMobile.addEventListener('change',()=>activateEditorPanel(activeEditorPanel));
activateEditorPanel(activeEditorPanel);
