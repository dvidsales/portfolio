const STORAGE_KEY = 'davidsales_portfolio_state_v3';
function loadState(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); if(raw){const parsed=JSON.parse(raw);if(parsed && typeof parsed==='object' && !Array.isArray(parsed))return parsed;} }
  catch(e){ /* ignora silenciosamente */ }
  return { lang:'pt' };
}
function saveState(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){ /* ignora silenciosamente */ } }
let state = loadState();
if(!['pt','en','es'].includes(state.lang)) state.lang = 'pt';
function esc(value){ return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function safeEmbed(value){ return PortfolioVideo.safe(value); }
function localized(value, lang){ return value?.[lang] || value?.pt || ''; }
function externalLink(value){ try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?esc(url.href):'';}catch{return '';}}
const categorySelections = new Map();


function renderSidebarTree(lang = state.lang){
  const ul = document.getElementById('sidebarProjectTree');
  if(!ul) return;
  const items = window.PROJECTS_FILTER_IDS
    ? PROJECTS.filter(p => window.PROJECTS_FILTER_IDS.includes(p.id))
    : PROJECTS;
  ul.innerHTML = items.map(p => `<li><a href="#proj-${p.id}"><span class="file">◆</span><span>${esc(localized(p.title, lang))}</span></a></li>`).join('');
}
renderSidebarTree();

function applyLang(lang){
  if(!I18N[lang])lang='pt';
  state.lang = lang;
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  const ccCurrent = document.getElementById('ccCurrent');
  if(ccCurrent) ccCurrent.textContent = lang.toUpperCase();
  document.querySelectorAll('.cc-option').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(I18N[lang][key] !== undefined) el.textContent = I18N[lang][key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const key = el.getAttribute('data-i18n-html');
    if(I18N[lang][key] !== undefined) el.innerHTML = I18N[lang][key];
  });

  renderSidebarTree(lang);
  document.querySelector('.skip-link')?.setAttribute('aria-label', I18N[lang].skip_link);
  document.getElementById('primaryNav')?.setAttribute('aria-label', I18N[lang].nav_label);
  document.getElementById('ccBtn')?.setAttribute('aria-label', I18N[lang].language_label);
  document.getElementById('burgerBtn')?.setAttribute('aria-label', I18N[lang].menu_label);
  const page = location.pathname.endsWith('hemobras.html') ? 'hemobras' : location.pathname.endsWith('ufpe.html') ? 'ufpe' : 'home';
  document.title = I18N[lang]['title_'+page];
  document.querySelector('meta[name="description"]')?.setAttribute('content', I18N[lang]['description_'+page]);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content',I18N[lang]['description_'+page]);
  for(const [key,ids] of Object.entries({bin_hemobras_count:['hemobras','hemobras-tv','hemobras-instagram'],bin_ufpe_count:['noticias-campus','documenta-ufpe']})){
    const total = PROJECTS.filter(p=>ids.includes(p.id)).reduce((sum,p)=>sum+p.videos.length,0);
    document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el=>el.textContent=total+' '+I18N[lang][total===1?'video_singular':'video_plural']);
  }
  const featured = document.querySelector('.featured-work');
  if(featured){
    const first = PROJECTS.find(p=>p.id==='hemobras')?.videos[0];
    featured.hidden = !first;
    if(first){
      const box = featured.querySelector('.video-box');
      box.classList.toggle('vertical',first.orientation==='vertical');
      featured.querySelector('.featured-player').classList.toggle('vertical',first.orientation==='vertical');
      box.innerHTML = embedHTML(first, lang);
      featured.querySelector('h3').textContent = localized(first.caption,lang);
      featured.querySelector('.featured-info p').textContent = first.desc?.[lang] || I18N[lang].featured_desc;
      let external = featured.querySelector('.video-external');
      if(!external){external=document.createElement('a');external.className='video-external';external.target='_blank';external.rel='noopener noreferrer';featured.querySelector('.featured-info').append(external);}
      external.href=PortfolioVideo.external(first.embed);
      external.textContent=I18N[lang].open_video;
      external.hidden=!external.getAttribute('href');
    }
  }
  renderSoftwares(lang);
  renderProjects(lang);
  saveState();
}

function renderSoftwares(lang){
  const wrap = document.getElementById('softGrid');
  if(!wrap) return;
  wrap.innerHTML = '';
  SOFTWARES.forEach(s=>{
    const level = s.level;
    const row = document.createElement('div');
    row.className = 'fader-row';
    row.innerHTML = `
      <span class="fader-label"><span class="fader-icon" style="background:${s.color}">${s.abbr}</span>${s.name}</span>
      <div class="fader-track" aria-hidden="true">
        <div class="fader-meter"></div>
        <div class="fader-fill" style="width:${level}%"></div>
      </div>
      <span class="fader-val">${s.label[lang]}</span>
    `;
    wrap.appendChild(row);
  });
}

function embedHTML(video,lang){
  const url = safeEmbed(video.embed);
  return url ? `<iframe src="${esc(url)}" title="${esc(localized(video.caption,lang))}" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
    : `<div class="video-placeholder"><span>${esc(I18N[lang].embed_hint)}</span></div>`;
}
function videoBoxHTML(video, lang, extraHtml){
  const vertical = video.orientation === 'vertical';
  const cat = video.category || 'geral';
  const tagHtml = video.category ? `<span class="video-tag">${esc(I18N[lang]['cat_'+cat] || cat)}</span>` : '';
  const external = PortfolioVideo.external(video.embed);
  return `<div class="player${vertical ? ' vertical' : ''}" data-cat="${esc(cat)}">
      <div class="video-box${vertical ? ' vertical' : ''}">${tagHtml}${embedHTML(video,lang)}</div>
      <div class="video-caption">${esc(localized(video.caption,lang))}</div>
      ${video.desc?.[lang] ? `<p class="video-description">${esc(video.desc[lang])}</p>` : ''}
      ${external ? `<a class="video-external" href="${esc(external)}" target="_blank" rel="noopener noreferrer">${esc(I18N[lang].open_video)}</a>` : ''}
      ${extraHtml || ''}
    </div>`;
}
function creditsHTML(pairs, lang){
  if(!pairs?.length) return '';
  const rows = pairs.map(([role,names])=>`<div class="credit-line"><span class="credit-role">${esc(CREDIT_LABELS[lang][role] || role)}</span>${esc(names)}</div>`).join('');
  return `<details class="credits"><summary>${esc(I18N[lang].credits_label)}</summary><div class="credits-list">${rows}</div></details>`;
}
function renderProjects(lang){
  const list = document.getElementById('projectsList');
  if(!list) return;
  const items = window.PROJECTS_FILTER_IDS ? PROJECTS.filter(p => window.PROJECTS_FILTER_IDS.includes(p.id)) : PROJECTS;
  list.replaceChildren();
  items.forEach(p=>{
    const categories = [...new Set(p.videos.map(v => v.category || 'geral'))];
    const hasTabs = categories.length > 1;
    const selected = categories.includes(categorySelections.get(p.id)) ? categorySelections.get(p.id) : categories[0];
    const tabsHtml = hasTabs ? `<div class="video-tabs" role="tablist" aria-label="${esc(localized(p.title,lang))}">${categories.map((c,i)=>
      `<button id="tab-${p.id}-${i}" class="video-tab${c===selected?' active':''}" data-cat="${esc(c)}" role="tab" aria-controls="panel-${p.id}-${i}" tabindex="${c===selected?'0':'-1'}" aria-selected="${c===selected}">${esc(I18N[lang]['cat_'+c] || c)}</button>`
    ).join('')}</div>` : '';
    const videosHTML = hasTabs ? categories.map((c,i)=>`<div class="videos" id="panel-${p.id}-${i}" role="tabpanel" aria-labelledby="tab-${p.id}-${i}" tabindex="0" ${c!==selected?'hidden':''}>${p.videos.filter(v=>(v.category||'geral')===c).map(v=>videoBoxHTML(v,lang,creditsHTML(v.credits,lang))).join('')}</div>`).join('')
      : `<div class="videos">${p.videos.length ? p.videos.map(v=>videoBoxHTML(v,lang,creditsHTML(v.credits,lang))).join('') : `<p class="empty-state">${esc(I18N[lang].empty_project)}</p>`}</div>`;
    const el = document.createElement('article');
    el.className = 'project reveal in';el.id = 'proj-' + p.id;el.setAttribute('aria-labelledby','title-'+p.id);
    const link = p.link && externalLink(p.link.href);
    const heading = document.querySelector('.company-hero') ? 'h2' : 'h3';
    el.innerHTML = `
      <div class="clip-head">
        <span class="track-ic" aria-hidden="true">▮▮</span>
        <${heading} class="clip-name" id="title-${p.id}">${esc(localized(p.title,lang))}</${heading}>
        <span class="fx-badge">${esc(localized(p.kind,lang))}</span>
      </div>
      <div class="project-body">
        <div class="project-info">
          <p class="project-desc">${esc(localized(p.desc,lang))}</p>
          ${link ? `<a class="project-link" href="${link}" target="_blank" rel="noopener noreferrer">↗ ${esc(localized(p.link.label,lang))}</a><br>` : ''}
          ${creditsHTML(p.credits, lang)}
        </div>
        ${tabsHtml}${videosHTML}
      </div>`;
    if(hasTabs){
      const tabs = [...el.querySelectorAll('.video-tab')];
      function select(tab,focus=false){
        categorySelections.set(p.id,tab.dataset.cat);
        tabs.forEach(t=>{const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',active);t.tabIndex=active?0:-1;el.querySelector('#'+t.getAttribute('aria-controls')).hidden=!active;});
        if(focus)tab.focus();
      }
      tabs.forEach((tab,i)=>{
        tab.addEventListener('click',()=>select(tab));
        tab.addEventListener('keydown',e=>{
          let next;
          if(e.key==='ArrowRight')next=(i+1)%tabs.length;
          if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
          if(e.key==='Home')next=0;
          if(e.key==='End')next=tabs.length-1;
          if(next!==undefined){e.preventDefault();select(tabs[next],true);}
        });
      });
    }
    list.appendChild(el);
  });
}



const ccBtn = document.getElementById('ccBtn');
const ccPanel = document.getElementById('ccPanel');
const burger = document.getElementById('burgerBtn');
const primaryNav = document.getElementById('primaryNav');
const mobileNav = window.matchMedia('(max-width:900px)');
function closeLanguages(focus=false){if(!ccPanel)return;ccPanel.classList.remove('open');ccPanel.inert=true;ccBtn.setAttribute('aria-expanded','false');if(focus)ccBtn.focus();}
function closeNavigation(focus=false){if(!primaryNav)return;primaryNav.classList.remove('open');primaryNav.inert=mobileNav.matches;burger.setAttribute('aria-expanded','false');if(focus)burger.focus();}
if(ccBtn && ccPanel){
  ccBtn.addEventListener('click',()=>{
    const open = ccBtn.getAttribute('aria-expanded')!=='true';closeNavigation();
    ccPanel.classList.toggle('open',open);ccPanel.inert=!open;ccBtn.setAttribute('aria-expanded',open);
    if(open)ccPanel.querySelector(`[data-lang="${state.lang}"]`).focus();
  });
  ccPanel.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{applyLang(btn.dataset.lang);closeLanguages(true);}));
  ccPanel.addEventListener('keydown',e=>{
    if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
      const options=[...ccPanel.querySelectorAll('button')];let i=options.indexOf(document.activeElement);
      i=e.key==='Home'?0:e.key==='End'?options.length-1:(i+(e.key==='ArrowDown'?1:options.length-1))%options.length;
      e.preventDefault();options[i].focus();
    }
  });
}
if(burger && primaryNav){
  closeNavigation();
  burger.addEventListener('click',()=>{
    const open=burger.getAttribute('aria-expanded')!=='true';closeLanguages();primaryNav.classList.toggle('open',open);primaryNav.inert=!open;burger.setAttribute('aria-expanded',open);
    if(open)primaryNav.querySelector('a').focus();
  });
  primaryNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeNavigation()));
  mobileNav.addEventListener('change',()=>closeNavigation());
}
document.addEventListener('click',e=>{
  if(ccPanel&&!ccPanel.contains(e.target)&&!ccBtn.contains(e.target))closeLanguages();
  if(primaryNav&&!primaryNav.contains(e.target)&&!burger.contains(e.target))closeNavigation();
});
document.addEventListener('focusin',e=>{
  if(ccPanel&&!ccPanel.contains(e.target)&&!ccBtn.contains(e.target))closeLanguages();
  if(primaryNav&&!primaryNav.contains(e.target)&&!burger.contains(e.target))closeNavigation();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(ccBtn?.getAttribute('aria-expanded')==='true')closeLanguages(true);
    if(burger?.getAttribute('aria-expanded')==='true')closeNavigation(true);
  }
});

const navLinks = document.querySelectorAll('nav.primary-nav a');
const samePageNavLinks = [...navLinks].filter(a => a.getAttribute('href')?.startsWith('#'));
const sections = samePageNavLinks.map(a => document.querySelector(a.getAttribute('href')));
const navObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = '#' + entry.target.id;
      samePageNavLinks.forEach(a => {const active=a.getAttribute('href')===id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && navObserver.observe(s));

const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('in'); revealObserver.unobserve(entry.target); } });
}, { threshold:.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const scrubProgress = document.getElementById('scrubProgress');
const heroScrubFill = document.getElementById('heroScrubFill');
const heroScrubHead = document.getElementById('heroScrubHead');
const heroTimecode = document.getElementById('heroTimecode');
const heroTimecode2 = document.getElementById('heroTimecode2');
function fmtTimecode(ms){
  const totalSec = ms/1000;
  const h = String(Math.floor(totalSec/3600)).padStart(2,'0');
  const m = String(Math.floor((totalSec%3600)/60)).padStart(2,'0');
  const s = String(Math.floor(totalSec%60)).padStart(2,'0');
  const f = String(Math.floor((ms%1000)/1000*30)).padStart(2,'0');
  return `${h}:${m}:${s}:${f}`;
}
const startTime = Date.now();
function onScroll(){
  const doc = document.documentElement;
  const pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1) * 100;
  if(scrubProgress) scrubProgress.style.width = pct + '%';
  if(heroScrubFill) heroScrubFill.style.width = Math.min(pct*3,100) + '%';
  if(heroScrubHead) heroScrubHead.style.left = Math.min(pct*3,100) + '%';
}
document.addEventListener('scroll', onScroll, { passive:true });
onScroll();
function tick(){
  const tc = fmtTimecode(Date.now()-startTime);
  if(heroTimecode) heroTimecode.textContent = tc;
  if(heroTimecode2) heroTimecode2.textContent = tc;
  requestAnimationFrame(tick);
}
if(heroTimecode || heroTimecode2){
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){ requestAnimationFrame(tick); }
  else { if(heroTimecode) heroTimecode.textContent = '00:00:00:00'; if(heroTimecode2) heroTimecode2.textContent = '00:00:00:00'; }
}

applyLang(state.lang);

// Os projetos são criados após o carregamento dos dados; resolve também links diretos.
if(location.hash){
  try{
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if(target) requestAnimationFrame(() => target.scrollIntoView({behavior:'instant',block:'start'}));
  }catch{ /* Fragmentos inválidos não impedem a navegação. */ }
}
