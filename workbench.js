/* Biblioteca, monitor, propriedades e sequência de navegação. Sem estado de publicação. */
'use strict';
window.PortfolioWorkbench = (() => {
  const text = (value,lang) => value?.[lang] || value?.pt || '';
  const clean = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const ui = {lang:'pt',filter:'all',query:'',view:'grid',selected:null};
  let root, records = [], visible = [], searchTimer, mounted = false, scrollFrame;
  const $ = id => document.getElementById(id);
  const tr = key => I18N[ui.lang][key] || I18N.pt[key] || key;
  const group = id => id.startsWith('hemobras') ? 'hemobras' : ['noticias-campus','documenta-ufpe'].includes(id) ? 'ufpe' : 'personal';
  const scoped = () => Array.isArray(window.PROJECTS_FILTER_IDS);
  function buildRecords(){
    const used = new Set();
    return PROJECTS.filter(p => !scoped() || window.PROJECTS_FILTER_IDS.includes(p.id)).flatMap(p => p.videos.map((v,index) => {
      let key;
      try{const url = new URL(PortfolioVideo.normalize(v.embed));key = p.id + '--' + url.hostname.replace(/\./g,'-') + '-' + (url.hostname==='drive.google.com' ? url.pathname.split('/')[3] : url.pathname.split('/').pop());}
      catch{key = p.id+'--video-'+index;}
      if(used.has(key))key += '-'+index;
      used.add(key);return {key,p,v,index,group:group(p.id)};
    }));
  }
  function mount(){
    root = $('videoWorkbench');if(!root)return false;
    root.className = 'workbench';
    root.innerHTML = `
      <section class="bench-library bench-panel" aria-labelledby="libraryHeading">
        <div class="bench-panel-head"><h3 id="libraryHeading" data-i18n="library_label"></h3><span id="libraryTotal" class="bench-counter"></span></div>
        <div class="library-toolbar">
          <div id="libraryFilters" class="library-filters" role="group"></div>
          <div class="library-search"><label class="sr-only" for="librarySearch" data-i18n="search_label"></label><input id="librarySearch" type="search" autocomplete="off"><button id="clearLibrarySearch" type="button" hidden><span aria-hidden="true">×</span></button></div>
          <div class="library-viewbar"><span id="libraryResultCount" role="status" aria-live="polite" aria-atomic="true"></span><div id="libraryViews" role="group"><button type="button" data-view="grid"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 2h6v6H2zm10 0h6v6h-6zM2 12h6v6H2zm10 0h6v6h-6z"/></svg></button><button type="button" data-view="list"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 3h3v3H2zm5 0h11v3H7zM2 9h3v3H2zm5 0h11v3H7zM2 15h3v3H2zm5 0h11v3H7z"/></svg></button></div></div>
        </div>
        <div id="collectionAnchors" aria-hidden="true"></div>
        <ol id="galleryItems" class="gallery-items"></ol>
      </section>
      <section id="selectedVideoMonitor" class="bench-monitor bench-panel" aria-labelledby="monitorHeading">
        <div class="bench-panel-head"><h3 id="monitorHeading" data-i18n="monitor_heading"></h3><span id="monitorFormat" class="bench-counter"></span></div>
        <div id="monitorScreen" class="monitor-screen"></div>
        <div class="monitor-transport"><button id="previousVideo" type="button"><span aria-hidden="true">←</span></button><span id="monitorPosition" class="bench-counter"></span><button id="nextVideo" type="button"><span aria-hidden="true">→</span></button></div>
        <div class="monitor-copy"><span id="monitorProject" class="eyebrow"></span><h3 id="monitorTitle"></h3><p id="monitorDescription"></p><a id="monitorExternal" class="monitor-external" target="_blank" rel="noopener noreferrer"></a></div>
      </section>
      <details id="workProperties" class="bench-properties bench-panel" open><summary><span data-i18n="properties_heading"></span><span aria-hidden="true">⌄</span></summary><div class="properties-body"><div class="properties-info"><dl id="propertyValues"></dl><div id="propertyProjectLink"></div></div><div id="workCredits"></div></div></details>
      <p id="selectionAnnouncement" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p>`;
    try{const saved = JSON.parse(localStorage.getItem('davidsales_gallery_view'));if(['grid','list'].includes(saved))ui.view = saved;}catch{}
    $('librarySearch').addEventListener('input',e => {
      ui.query = e.target.value;$('clearLibrarySearch').hidden = !ui.query;
      clearTimeout(searchTimer);searchTimer = setTimeout(() => renderLibrary(),160);
    });
    $('clearLibrarySearch').onclick = () => {clearTimeout(searchTimer);ui.query = '';$('librarySearch').value = '';renderLibrary();$('librarySearch').focus();};
    for(const button of $('libraryViews').querySelectorAll('button'))button.onclick = () => {
      ui.view = button.dataset.view;
      try{localStorage.setItem('davidsales_gallery_view',JSON.stringify(ui.view));}catch{}
      renderLibrary();
    };
    $('previousVideo').onclick = () => step(-1);
    $('nextVideo').onclick = () => step(1);
    const requested = new URL(location.href).searchParams.get('video');
    if(requested)ui.selected = requested;
    createTimeline();
    window.addEventListener('hashchange',resolveProjectHash);
    mounted = true;return true;
  }
  function filters(){
    if(scoped())return [{id:'all',label:tr('filter_all')},...PROJECTS.filter(p=>window.PROJECTS_FILTER_IDS.includes(p.id)).map(p=>({id:p.id,label:p.id==='hemobras'?'YouTube':p.id==='hemobras-tv'?tr('cat_tv'):p.id==='hemobras-instagram'?'Instagram':text(p.title,ui.lang)}))];
    return [{id:'all',label:tr('filter_all')},{id:'hemobras',label:'Hemobrás'},{id:'ufpe',label:'UFPE'},{id:'personal',label:tr('filter_personal')}];
  }
  function renderFilters(){
    $('libraryFilters').replaceChildren();
    for(const item of filters()){
      const button = document.createElement('button');button.type = 'button';button.dataset.filter = item.id;
      button.textContent = item.label;button.setAttribute('aria-pressed',item.id===ui.filter);
      button.onclick = () => {ui.filter = item.id;renderFilters();renderLibrary();$('libraryFilters').querySelector(`[data-filter="${item.id}"]`)?.focus();};
      $('libraryFilters').append(button);
    }
    $('libraryFilters').setAttribute('aria-label',tr('filter_label'));
  }
  function render(lang){
    ui.lang = lang;
    if(!mounted && !mount())return;
    records = buildRecords();
    root.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent = tr(el.dataset.i18n);});
    $('libraryTotal').textContent = String(records.length).padStart(2,'0');
    $('librarySearch').placeholder = tr('search_placeholder');$('clearLibrarySearch').setAttribute('aria-label',tr('clear_search'));
    $('libraryViews').setAttribute('aria-label',tr('view_label'));
    $('libraryViews').querySelectorAll('button').forEach(b=>b.setAttribute('aria-label',tr(b.dataset.view==='grid'?'view_grid':'view_list')));
    $('previousVideo').setAttribute('aria-label',tr('previous_video'));$('nextVideo').setAttribute('aria-label',tr('next_video'));
    $('collectionAnchors').replaceChildren();
    for(const p of PROJECTS.filter(p=>!scoped()||window.PROJECTS_FILTER_IDS.includes(p.id))){const anchor=document.createElement('span');anchor.id='proj-'+p.id;anchor.className='collection-anchor';$('collectionAnchors').append(anchor);}
    document.querySelectorAll('[data-collection-count]').forEach(el=>{const count=records.filter(r=>r.group===el.dataset.collectionCount).length;el.textContent=count+' '+tr(count===1?'video_singular':'video_plural');});
    renderFilters();renderLibrary();updateTimelineLabels();resolveProjectHash(false);
  }
  function renderLibrary(){
    clearTimeout(searchTimer);
    const query = clean(ui.query.trim());
    visible = records.filter(r => (ui.filter==='all'||(scoped()?r.p.id===ui.filter:r.group===ui.filter)) && (!query || clean([...Object.values(r.v.caption||{}),...Object.values(r.v.desc||{}),...Object.values(r.p.title),...Object.values(r.p.kind),r.v.category||''].join(' ')).includes(query)));
    if(!visible.some(r=>r.key===ui.selected))ui.selected = visible[0]?.key || null;
    const list = $('galleryItems');const scroll = list.scrollTop;list.replaceChildren();list.dataset.view = ui.view;
    $('clearLibrarySearch').hidden = !ui.query;
    $('libraryResultCount').textContent = visible.length+' '+tr(visible.length===1?'video_singular':'video_plural');
    $('libraryViews').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===ui.view));
    if(!visible.length){const li=document.createElement('li');li.className='gallery-empty';li.textContent=tr('no_results');list.append(li);}
    for(const r of visible){
      const li = document.createElement('li');li.className='gallery-item';
      const button = document.createElement('button');button.type='button';button.className='gallery-select';button.dataset.videoKey=r.key;
      button.setAttribute('aria-pressed',r.key===ui.selected);button.setAttribute('aria-controls','selectedVideoMonitor');
      const thumb = document.createElement('span');thumb.className='gallery-thumbnail';thumb.dataset.group=r.group;
      const fallback = document.createElement('span');fallback.className='thumbnail-fallback';fallback.setAttribute('aria-hidden','true');fallback.innerHTML='<svg viewBox="0 0 40 32"><rect x="1" y="1" width="38" height="30" rx="3"/><path d="m16 10 10 6-10 6Z"/></svg>';
      thumb.append(fallback);
      const src = PortfolioVideo.thumbnail(r.v.embed);
      if(src){const img = document.createElement('img');img.alt='';img.loading='lazy';img.decoding='async';img.src=src;img.referrerPolicy='no-referrer';img.onerror=()=>img.remove();thumb.append(img);}
      const format=document.createElement('span');format.className='thumbnail-format';format.textContent=r.v.orientation==='vertical'?'9:16':'16:9';thumb.append(format);
      const info = document.createElement('span');info.className='gallery-card-info';
      const title = document.createElement('span');title.className='gallery-title';title.textContent=text(r.v.caption,ui.lang);
      const project = document.createElement('span');project.className='gallery-project';project.textContent=text(r.p.title,ui.lang);
      const categoryLabel=r.v.category&&(I18N[ui.lang]['cat_'+r.v.category]||r.v.category);
      if(categoryLabel&&!clean(project.textContent).includes(clean(categoryLabel)))project.textContent+=' · '+categoryLabel;
      info.append(title,project);button.append(thumb,info);
      button.onclick=()=>select(r.key,true);
      li.append(button);list.append(li);
    }
    list.scrollTop=scroll;renderMonitor();ensureCardVisible();
  }
  function select(key,announce=false){
    if(!visible.some(r=>r.key===key))return;
    ui.selected=key;
    $('galleryItems').querySelectorAll('.gallery-select').forEach(b=>b.setAttribute('aria-pressed',b.dataset.videoKey===key));
    renderMonitor();ensureCardVisible();
    if(announce){
      const r=visible.find(r=>r.key===key);$('selectionAnnouncement').textContent=tr('selected_video')+': '+text(r.v.caption,ui.lang);
      const url=new URL(location.href);url.searchParams.set('video',key);url.hash='trabalhos';history.replaceState(null,'',url);
      if(matchMedia('(max-width:760px)').matches)$('selectedVideoMonitor').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
    }
  }
  function ensureCardVisible(){
    const list=$('galleryItems');const card=[...list.querySelectorAll('.gallery-select')].find(b=>b.dataset.videoKey===ui.selected);
    if(!card)return;
    const box=list.getBoundingClientRect(),item=card.getBoundingClientRect();
    if(item.top<box.top)list.scrollTop-=box.top-item.top+8;
    else if(item.bottom>box.bottom)list.scrollTop+=item.bottom-box.bottom+8;
  }
  function step(delta){const index=visible.findIndex(r=>r.key===ui.selected);if(visible[index+delta])select(visible[index+delta].key,true);}
  function renderMonitor(){
    const r=visible.find(r=>r.key===ui.selected);const screen=$('monitorScreen');
    const index=visible.findIndex(r=>r.key===ui.selected);
    $('previousVideo').disabled=index<=0;$('nextVideo').disabled=index<0||index>=visible.length-1;
    $('monitorPosition').textContent=r?`${String(index+1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`:'00 / 00';
    if(!r){
      screen.replaceChildren();const empty=document.createElement('p');empty.textContent=tr('no_selection');screen.append(empty);screen.classList.remove('is-vertical');
      $('monitorTitle').textContent=tr('no_selection');$('monitorDescription').textContent=tr('adjust_filters');$('monitorProject').textContent='';$('monitorFormat').textContent='';$('monitorExternal').hidden=true;
      $('propertyValues').replaceChildren();$('propertyProjectLink').replaceChildren();$('workCredits').replaceChildren();return;
    }
    const src=PortfolioVideo.safe(r.v.embed);let frame=screen.querySelector('iframe');
    if(!src){screen.replaceChildren();const note=document.createElement('p');note.textContent=tr('embed_hint');screen.append(note);}
    else if(!frame||frame.getAttribute('src')!==src){
      screen.replaceChildren();const viewport=document.createElement('div');viewport.className='monitor-viewport';frame=document.createElement('iframe');frame.src=src;frame.allow='fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';viewport.append(frame);screen.append(viewport);
    }
    if(frame)frame.title=text(r.v.caption,ui.lang);
    screen.classList.toggle('is-vertical',r.v.orientation==='vertical');
    $('monitorFormat').textContent=r.v.orientation==='vertical'?'9:16':'16:9';
    $('monitorProject').textContent=text(r.p.kind,ui.lang);$('monitorTitle').textContent=text(r.v.caption,ui.lang);
    $('monitorDescription').textContent=r.v.desc?.[ui.lang]||text(r.p.desc,ui.lang);
    const href=PortfolioVideo.external(r.v.embed);$('monitorExternal').hidden=!href;$('monitorExternal').href=href;
    $('monitorExternal').textContent=tr('open_video');$('monitorExternal').setAttribute('aria-label',tr('open_video')+': '+text(r.v.caption,ui.lang));
    renderProperties(r);
  }
  function renderProperties(r){
    const category=r.v.category||(r.p.id==='hemobras-instagram'?'instagram':r.p.id==='hemobras-tv'?'tv':r.p.id==='hemobras'?'youtube':null);
    const pairs=[...(r.v.credits||[]),...(r.p.credits||[])].filter((pair,i,arr)=>arr.findIndex(x=>x[0]===pair[0]&&x[1]===pair[1])===i);
    const roles=[...new Set(pairs.filter(([,names])=>clean(names).includes('david sales')).map(([role])=>CREDIT_LABELS[ui.lang][role]||role))];
    if(!roles.length && r.group==='hemobras')roles.push(CREDIT_LABELS[ui.lang].edicao);
    const properties=[['property_project',text(r.p.title,ui.lang)],['property_channel',category?(I18N[ui.lang]['cat_'+category]||category):text(r.p.kind,ui.lang)],['property_format',(r.v.orientation==='vertical'?tr('format_vertical')+' · 9:16':tr('format_horizontal')+' · 16:9')]];
    if(roles.length)properties.push(['property_role',roles.join(' · ')]);
    const dl=$('propertyValues');dl.replaceChildren();
    for(const [label,value] of properties){const dt=document.createElement('dt');dt.textContent=tr(label);const dd=document.createElement('dd');dd.textContent=value;dl.append(dt,dd);}
    const projectLink=$('propertyProjectLink');projectLink.replaceChildren();
    if(r.p.link?.href){
      try{const url=new URL(r.p.link.href);if(url.protocol==='https:'&&!url.username&&!url.password){const a=document.createElement('a');a.className='properties-project-link';a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=text(r.p.link.label,ui.lang);projectLink.append(a);}}catch{}
    }
    const credits=$('workCredits');credits.replaceChildren();
    const heading=document.createElement('h4');heading.textContent=tr('credits_label');credits.append(heading);
    if(!pairs.length){const note=document.createElement('p');note.className='properties-note';note.textContent=tr('credits_not_listed');credits.append(note);return;}
    const list=document.createElement('dl');list.className='work-credit-list';
    for(const [role,names] of pairs){const dt=document.createElement('dt');dt.textContent=CREDIT_LABELS[ui.lang][role]||role;const dd=document.createElement('dd');dd.textContent=names;list.append(dt,dd);}credits.append(list);
  }
  function resolveProjectHash(scroll=true){
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
    if(!id.startsWith('proj-'))return;
    const record=records.find(r=>r.p.id===id.slice(5));if(!record)return;
    ui.filter='all';ui.query='';$('librarySearch').value='';ui.selected=record.key;renderFilters();renderLibrary();
    if(scroll)root.scrollIntoView({block:'start',behavior:'instant'});
  }
  const sections=[['about','nav_about'],['formacao','nav_formacao'],['experiencia','nav_experiencia'],['softwares','nav_softwares'],['trabalhos','nav_trabalhos'],['contatos','nav_contatos']];
  function createTimeline(){
    const nav=document.createElement('nav');nav.className='sequence-nav';nav.id='sequenceNav';
    nav.innerHTML='<div class="sequence-title"><span class="sequence-dot" aria-hidden="true"></span><span data-i18n="sequence_heading"></span><span class="sequence-track" aria-hidden="true">NAV</span></div><div class="sequence-rail"><div class="sequence-ruler" aria-hidden="true"></div><div id="sequencePlayhead" class="sequence-playhead" aria-hidden="true"></div><div id="sequenceLinks" class="sequence-links"></div></div><label class="sequence-mobile"><span data-i18n="sequence_mobile"></span><select id="sequenceSelect"></select></label>';
    const home=!!document.getElementById('about');
    for(const [id,key] of sections){
      const a=document.createElement('a');a.href=(home?'':'index.html')+'#'+id;a.dataset.section=id;a.dataset.i18n=key;nav.querySelector('#sequenceLinks').append(a);
      const option=document.createElement('option');option.value=a.getAttribute('href');option.dataset.i18n=key;option.dataset.section=id;nav.querySelector('select').append(option);
    }
    document.body.append(nav);
    $('sequenceSelect').onchange=e=>{location.href=e.target.value;};
    window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=null;updateTimeline();});},{passive:true});
    window.addEventListener('resize',updateTimeline);
  }
  function updateTimelineLabels(){
    $('sequenceNav').setAttribute('aria-label',tr('sequence_label'));
    $('sequenceNav').querySelectorAll('[data-i18n]').forEach(el=>el.textContent=tr(el.dataset.i18n));updateTimeline();
  }
  function updateTimeline(){
    if(!$('sequenceNav'))return;
    const home=!!$('about');let active=home?'about':'trabalhos';
    if(home)for(const [id] of sections){const el=$(id);if(el&&el.getBoundingClientRect().top<innerHeight*.45)active=id;}
    for(const a of $('sequenceLinks').querySelectorAll('a')){if(a.dataset.section===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}
    const selected=$('sequenceSelect').querySelector(`option[data-section="${active}"]`);if(selected)$('sequenceSelect').value=selected.value;
    const range=document.documentElement.scrollHeight-innerHeight;const percent=range>0?Math.min(100,Math.max(0,scrollY/range*100)):0;
    $('sequencePlayhead').style.left=percent+'%';
  }
  return {render,select,resolveProjectHash,get records(){return records;},get visible(){return visible;},get selection(){return ui.selected;}};
})();
