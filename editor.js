'use strict';
const $ = id => document.getElementById(id);
const DRAFT_KEY = 'davidsales_editor_v1';
const clone = value => JSON.parse(JSON.stringify(value));
const languages = {pt:'Português', en:'English', es:'Español'};
let projects = clone(PROJECTS), selectedProject = 0, selectedVideo = 0, lang = 'pt', history = [], dragged = null;
function status(message){ $('status').textContent = message; }
try { const draft = JSON.parse(localStorage.getItem(DRAFT_KEY)); if(Array.isArray(draft) && draft.length && draft.every(p => p.id && Array.isArray(p.videos))) { projects = draft; status('Rascunho local recuperado.'); } } catch { status('Não foi possível recuperar o rascunho. Os dados publicados foram mantidos.'); }
function collectionCategory(p){
 const categories = [...new Set(p.videos.map(v=>v.category).filter(Boolean))];
 return categories.length===1 ? categories[0] : null;
}
function normalizeCategories(){
 for(const p of projects){const category=collectionCategory(p);if(category)for(const v of p.videos)if(!v.category)v.category=category;}
}
normalizeCategories();
const project = () => projects[selectedProject];
const video = () => project().videos[selectedVideo];
function persist(){ try { localStorage.setItem(DRAFT_KEY, JSON.stringify(projects)); status('Rascunho salvo neste navegador.'); } catch { status('Armazenamento indisponível. Exporte os dados antes de fechar.'); } }
function checkpoint(){ history.push(clone(projects)); if(history.length>30) history.shift(); $('undo').disabled=false; }
function embedURL(value){
 const u = new URL(value); if(u.protocol!=='https:') throw Error('Use um link HTTPS.');
 if(u.hostname==='drive.google.com'){ const match=u.pathname.match(/^\/file\/d\/([\w-]+)/); if(!match) throw Error('Use um link de arquivo do Google Drive.'); return `https://drive.google.com/file/d/${match[1]}/preview`; }
 if(['youtube.com','www.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(u.hostname)){const id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop(); if(!/^[\w-]{11}$/.test(id||'')) throw Error('ID do YouTube inválido.'); return `https://www.youtube-nocookie.com/embed/${id}`;}
 if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(u.hostname)){const id=u.pathname.split('/').filter(Boolean).pop(); if(!/^\d+$/.test(id||''))throw Error('ID do Vimeo inválido.');return `https://player.vimeo.com/video/${id}`;}
 throw Error('Use Google Drive, YouTube ou Vimeo.');
}
function renderList(){
 $('videoList').replaceChildren();
 project().videos.forEach((v,i)=>{
  const li=document.createElement('li');li.draggable=true;li.classList.toggle('selected',i===selectedVideo);
  const select=document.createElement('button');select.className='select-video';select.textContent=`${String(i+1).padStart(2,'0')} / ${v.caption?.[lang] || 'Novo vídeo'}`;select.onclick=()=>{selectedVideo=i;render();};li.append(select);
  const controls=document.createElement('div');controls.className='order-controls';
  for(const [label,delta] of [['↑',-1],['↓',1]]){const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-label',delta<0?'Mover para cima':'Mover para baixo');b.disabled=i+delta<0||i+delta>=project().videos.length;b.onclick=()=>move(i,i+delta);controls.append(b);}li.append(controls);
  li.ondragstart=()=>{dragged=i;};li.ondragover=e=>e.preventDefault();li.ondrop=e=>{e.preventDefault();if(dragged!==null)move(dragged,i);dragged=null;};li.ondragend=()=>{dragged=null;};$('videoList').append(li);
 });
}
function move(from,to){checkpoint();const [v]=project().videos.splice(from,1);project().videos.splice(to,0,v);selectedVideo=to;persist();render();}
function preview(){
 const v=video();$('preview').replaceChildren();if(!v){$('preview').textContent='Adicione um vídeo a este projeto.';return;}
 try {const frame=document.createElement('iframe');frame.src=embedURL(v.embed);frame.title=v.caption?.[lang]||'Prévia do vídeo';frame.allowFullscreen=true;frame.classList.toggle('vertical',v.orientation==='vertical');$('preview').append(frame);} catch {const note=document.createElement('p');note.textContent='Insira um link válido e salve para visualizar.';$('preview').append(note);}
 const tag=document.createElement('p');tag.className='eyebrow';tag.textContent=I18N[lang]['cat_'+(v.category||'geral')]||v.category||'Geral';$('preview').append(tag);
 const title=document.createElement('h3');title.textContent=v.caption?.[lang]||'Sem título';const desc=document.createElement('p');desc.textContent=v.desc?.[lang]||'';$('preview').append(title,desc);
}
function render(){
 renderList();const v=video();$('fields').disabled=!v;
 const category=v?.category||'geral';
 if(![...$('category').options].some(o=>o.value===category)){const option=document.createElement('option');option.value=category;option.textContent=category;$('category').append(option);}
 $('category').value=category;
 $('url').value=v?.embed||'';$('orientation').value=v?.orientation||'horizontal';$('title').value=v?.caption?.[lang]||'';$('description').value=v?.desc?.[lang]||'';
 $('titleLabel').firstChild.textContent=`Título · ${languages[lang]}`;$('descLabel').firstChild.textContent=`Descrição · ${languages[lang]}`;
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===lang));preview();
}
function capture(){const v=video();if(!v)return;v.caption ||= {};v.desc ||= {};v.caption[lang]=$('title').value;v.desc[lang]=$('description').value;v.embed=$('url').value.trim();v.orientation=$('orientation').value;v.category=$('category').value;}
// Cada alteração permanece no rascunho, inclusive ao mudar de idioma ou seleção.
$('videoForm').addEventListener('input',()=>{checkpoint();capture();persist();renderList();});
$('category').addEventListener('change',()=>{checkpoint();capture();persist();preview();});
$('orientation').addEventListener('change',()=>{checkpoint();capture();persist();preview();});
$('videoForm').onsubmit=e=>{e.preventDefault();try{const normalized=embedURL($('url').value.trim());checkpoint();capture();video().embed=normalized;persist();render();}catch(error){status(error.message);}};
for(const [i,p] of projects.entries()){const option=document.createElement('option');option.value=i;option.textContent=p.title.pt;$('project').append(option);}
$('project').onchange=()=>{selectedProject=Number($('project').value);selectedVideo=0;render();};
for(const b of document.querySelectorAll('[data-lang]'))b.onclick=()=>{lang=b.dataset.lang;render();};
$('add').onclick=()=>{checkpoint();project().videos.push({... (collectionCategory(project()) ? {category:collectionCategory(project())} : {}),caption:{pt:'',en:'',es:''},desc:{pt:'',en:'',es:''},embed:'',orientation:'horizontal'});selectedVideo=project().videos.length-1;persist();render();$('url').focus();};
$('remove').onclick=()=>{if(!video()||!confirm('Remover este vídeo do rascunho? Você pode desfazer.'))return;checkpoint();project().videos.splice(selectedVideo,1);selectedVideo=Math.max(0,selectedVideo-1);persist();render();};
$('undo').onclick=()=>{if(!history.length)return;projects=history.pop();selectedVideo=Math.min(selectedVideo,Math.max(0,project().videos.length-1));$('undo').disabled=!history.length;persist();render();};
$('reset').onclick=()=>{if(!confirm('Descartar o rascunho e voltar aos dados publicados?'))return;checkpoint();projects=clone(PROJECTS);selectedVideo=0;persist();render();};
function publishedSource(){normalizeCategories();return '// Gerado pelo editor visual. Não contém credenciais.\nPROJECTS.splice(0, PROJECTS.length, ...'+JSON.stringify(projects,null,2).replace(/</g,'\\u003c')+');\n';}
$('export').onclick=()=>{const blob=new Blob([publishedSource()],{type:'text/javascript;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='projects.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
function validate(){for(const p of projects)for(const [i,v] of p.videos.entries()){embedURL(v.embed);for(const l of Object.keys(languages))if(!v.caption?.[l]?.trim())throw Error(`${p.title.pt}, vídeo ${i+1}: preencha o título em ${languages[l]}.`);}}
function base64(text){const bytes=new TextEncoder().encode(text);let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary);}
$('publishForm').onsubmit=async e=>{
 e.preventDefault();const button=$('publishButton');button.disabled=true;$('publishResult').textContent='Publicando…';
 const token=$('token').value.trim();
 try{
  validate();const owner=$('owner').value.trim(),repo=$('repo').value.trim(),branch=$('branch').value.trim();
  if(!/^[\w.-]+$/.test(owner)||!/^[\w.-]+$/.test(repo))throw Error('Proprietário ou repositório inválido.');
  const folder=$('folder').value.trim().replace(/^\/+|\/+$/g,'');if(folder.split('/').some(s=>s==='..'||s==='.')||folder.includes('\\'))throw Error('Pasta inválida.');
  const path=(folder?folder+'/':'')+'projects.js';const endpoint=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
  const get=await fetch(endpoint+'?ref='+encodeURIComponent(branch),{headers,cache:'no-store',redirect:'error'});let sha;
  if(get.ok)sha=(await get.json()).sha;else if(get.status!==404)throw Error(`Leitura recusada (${get.status}). Confira token, repositório e branch.`);
  const response=await fetch(endpoint,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},redirect:'error',body:JSON.stringify({message:'Atualiza vídeos pelo editor visual',branch,content:base64(publishedSource()),...(sha?{sha}:{})})});
  if(!response.ok)throw Error(response.status===409||response.status===422?'Conflito ou branch inválida/protegida. Revise o destino e tente novamente.':`Publicação recusada (${response.status}). Confira Contents: read and write e acesso ao repositório.`);
  const result=await response.json();$('publishResult').textContent='Publicado. Commit: ';const a=document.createElement('a');a.href=`https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commit/${encodeURIComponent(result.commit.sha)}`;a.textContent=result.commit.sha.slice(0,7);a.target='_blank';a.rel='noopener';$('publishResult').append(a);$('reviewed').checked=false;
 }catch(error){$('publishResult').textContent=error instanceof TypeError?'Não foi possível conectar ao GitHub. Confira a conexão e tente novamente.':error.message;}
 finally{$('token').value='';button.disabled=false;}
};
render();
