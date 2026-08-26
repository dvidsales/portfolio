const STORAGE_KEY = 'davidsales_portfolio_state_v3';
function loadState(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); if(raw) return JSON.parse(raw); }
  catch(e){ /* ignora silenciosamente */ }
  return { lang:'pt', softLevels:{}, reviewed:{} };
}
function saveState(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){ /* ignora silenciosamente */ } }
let state = loadState();
if(!state.softLevels) state.softLevels = {};
if(!state.reviewed) state.reviewed = {};
if(!state.lang) state.lang = 'pt';

function renderSidebarTree(){
  const ul = document.getElementById('sidebarProjectTree');
  if(!ul) return;
  const items = window.PROJECTS_FILTER_IDS
    ? PROJECTS.filter(p => window.PROJECTS_FILTER_IDS.includes(p.id))
    : PROJECTS;
  ul.innerHTML = items.map(p => `<li><a href="#proj-${p.id}"><span class="file">◆</span><span>${p.title.pt}</span></a></li>`).join('');
}
renderSidebarTree();

function applyLang(lang){
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

  renderSoftwares(lang);
  renderProjects(lang);
  saveState();
}

function renderSoftwares(lang){
  const wrap = document.getElementById('softGrid');
  if(!wrap) return;
  wrap.innerHTML = '';
  SOFTWARES.forEach(s=>{
    const level = state.softLevels[s.id] ?? s.level;
    const row = document.createElement('div');
    row.className = 'fader-row';
    row.innerHTML = `
      <span class="fader-label"><span class="fader-icon" style="background:${s.color}">${s.abbr}</span>${s.name}</span>
      <div class="fader-track">
        <div class="fader-meter"></div>
        <div class="fader-fill" style="width:${level}%"></div>
        <div class="fader-fill-static" style="width:${level}%"></div>
      </div>
      <span class="fader-val">${level}%</span>
    `;
    wrap.appendChild(row);
  });
}

function videoBoxHTML(video, lang, extraHtml){
  const inner = video.embed
    ? `<iframe src="${video.embed}" title="${video.caption[lang]}" allowfullscreen loading="lazy"></iframe>`
    : `<div class="video-placeholder"><div class="play">▶</div><span>${I18N[lang].embed_hint}</span></div>`;
  /* video.orientation:'vertical' habilita o layout 9:16 (reels), lado a lado com os 16:9 */
  const vertical = video.orientation === 'vertical';
  const cat = video.category || 'geral';
  const tagHtml = video.category ? `<span class="video-tag">${I18N[lang]['cat_'+cat] || cat}</span>` : '';
  return `<div class="player${vertical ? ' vertical' : ''}" data-cat="${cat}">
      <div class="video-box${vertical ? ' vertical' : ''}">${tagHtml}${inner}</div>
      <div class="pchrome"><span>▶</span><div class="pc-scrub"></div><span>00:00 / --:--</span></div>
      <div class="video-caption">${video.caption[lang]}</div>
      ${extraHtml || ''}
    </div>`;
}
function creditsHTML(pairs, lang){
  if(!pairs || !pairs.length) return '';
  const rows = pairs.map(([role,names])=>`<div class="credit-line"><span class="credit-role">${CREDIT_LABELS[lang][role] || role}</span>${names}</div>`).join('');
  return `<details class="credits"><summary>${I18N[lang].credits_label}</summary><div class="credits-list">${rows}</div></details>`;
}
function renderProjects(lang){
  const list = document.getElementById('projectsList');
  if(!list) return;
  const items = window.PROJECTS_FILTER_IDS
    ? PROJECTS.filter(p => window.PROJECTS_FILTER_IDS.includes(p.id))
    : PROJECTS;
  list.innerHTML = '';
  items.forEach((p,i)=>{
    const isReviewed = !!state.reviewed[p.id];
    const categories = [...new Set(p.videos.map(v => v.category || 'geral'))];
    const hasTabs = categories.length > 1;
    const tabsHtml = hasTabs ? `<div class="video-tabs" role="tablist">${categories.map((c,ci)=>
      `<button class="video-tab${ci===0?' active':''}" data-cat="${c}" role="tab" aria-selected="${ci===0}">${I18N[lang]['cat_'+c] || c}</button>`
    ).join('')}</div>` : '';
    const el = document.createElement('article');
    el.className = 'project reveal in';
    el.id = 'proj-' + p.id;
    el.innerHTML = `
      <div class="clip-head">
        <span class="track-ic">▮▮</span>
        <span class="clip-name">${p.title[lang]}</span>
        <span class="fx-badge">${p.kind[lang]}</span>
      </div>
      <div class="project-body">
        <div class="project-info">
          <p class="project-desc">${p.desc[lang]}</p>
          ${p.link ? `<a class="project-link" href="${p.link.href}" target="_blank" rel="noopener">↗ ${p.link.label[lang]}</a><br>` : ''}
          ${creditsHTML(p.credits, lang)}
          <div style="margin-top:14px;">
            <button class="review-toggle ${isReviewed ? 'done':''}" data-project="${p.id}">
              <span class="dot"></span> ${isReviewed ? I18N[lang].reviewed : I18N[lang].mark_reviewed}
            </button>
          </div>
        </div>
        ${tabsHtml}
        <div class="videos">${p.videos.map(v=>videoBoxHTML(v, lang, creditsHTML(v.credits, lang))).join('')}</div>
      </div>
    `;
    if(hasTabs){
      const firstCat = categories[0];
      el.querySelectorAll('.player').forEach(pl => { if(pl.dataset.cat !== firstCat) pl.style.display = 'none'; });
      el.querySelectorAll('.video-tab').forEach(tab=>{
        tab.addEventListener('click', ()=>{
          const cat = tab.dataset.cat;
          el.querySelectorAll('.video-tab').forEach(t=>{ t.classList.toggle('active', t===tab); t.setAttribute('aria-selected', t===tab); });
          el.querySelectorAll('.player').forEach(pl=>{ pl.style.display = (pl.dataset.cat === cat) ? '' : 'none'; });
        });
      });
    }
    list.appendChild(el);
  });
  list.querySelectorAll('.review-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.project;
      state.reviewed[id] = !state.reviewed[id];
      saveState();
      renderProjects(state.lang);
      updateProgress();
    });
  });
  updateProgress();
}
function updateProgress(){
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  if(!fill || !label) return;

  const items = window.PROJECTS_FILTER_IDS
    ? PROJECTS.filter(p => window.PROJECTS_FILTER_IDS.includes(p.id))
    : PROJECTS;
  const total = items.length;
  const done = items.filter(p=>state.reviewed[p.id]).length;
  fill.style.width = (total ? done/total*100 : 0) + '%';
  label.textContent = `${done}/${total}`;
}

const ccBtn = document.getElementById('ccBtn');
const ccPanel = document.getElementById('ccPanel');
if(ccBtn && ccPanel){
  ccBtn.addEventListener('click', ()=>{
    const open = ccPanel.classList.toggle('open');
    ccBtn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e)=>{
    if(!ccPanel.contains(e.target) && e.target !== ccBtn){ ccPanel.classList.remove('open'); ccBtn.setAttribute('aria-expanded','false'); }
  });
  document.querySelectorAll('.cc-option').forEach(btn=>{
    btn.addEventListener('click', ()=>{ applyLang(btn.dataset.lang); ccPanel.classList.remove('open'); ccBtn.setAttribute('aria-expanded','false'); });
  });
}

const burger = document.getElementById('burgerBtn');
const primaryNav = document.getElementById('primaryNav');
if(burger && primaryNav){
  burger.addEventListener('click', ()=>{
    const open = primaryNav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  primaryNav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{ primaryNav.classList.remove('open'); burger.setAttribute('aria-expanded','false'); });
  });
}

const navLinks = document.querySelectorAll('nav.primary-nav a');
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href')));
const navObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = '#' + entry.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
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
