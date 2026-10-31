/* Carrega a edição publicada sem reutilizar uma cópia antiga do navegador. */
'use strict';
(() => {
  const loader = document.currentScript;
  const app = loader.dataset.app;
  if(typeof PROJECTS === 'undefined' || !window.PortfolioVideo || (app!=='editor' && document.getElementById('videoWorkbench') && !window.PortfolioWorkbench)){
    document.documentElement.classList.remove('js');
    const note = document.createElement('p');note.className='load-warning';note.setAttribute('role','alert');
    note.textContent='Não foi possível carregar os arquivos da página. Confira sua conexão e recarregue.';
    document.querySelector('main').prepend(note);return;
  }
  const baseline = JSON.parse(JSON.stringify(PROJECTS));
  window.PORTFOLIO_DEFAULT_PROJECTS = baseline;
  const published = document.createElement('script');
  published.src = `projects.js?updated=${Date.now()}`;
  const onScriptError = event => {if(event.filename?.split('?')[0] === new URL(published.src).href.split('?')[0]) window.PORTFOLIO_DATA_ERROR=true;};
  window.addEventListener('error',onScriptError);
  published.onload = () => {
    window.removeEventListener('error',onScriptError);
    if(window.PORTFOLIO_DATA_ERROR)PROJECTS.splice(0, PROJECTS.length, ...baseline);
    if (!PortfolioVideo.validProjects(PROJECTS)) {
      PROJECTS.splice(0, PROJECTS.length, ...baseline);
      window.PORTFOLIO_DATA_ERROR = true;
    }
    start();
  };
  published.onerror = () => { window.removeEventListener('error',onScriptError);window.PORTFOLIO_DATA_ERROR = true; start(); };
  function start() {
    if (window.PORTFOLIO_DATA_ERROR) {
      const note = document.createElement('p');
      note.className = 'load-warning';
      note.setAttribute('role', 'alert');
      note.textContent = app === 'editor'
        ? 'Não foi possível carregar os dados publicados. Recarregue antes de editar ou publicar.'
        : 'Não foi possível carregar a versão mais recente dos vídeos. Recarregue a página para tentar novamente.';
      document.querySelector('main').prepend(note);
    }
    const script = document.createElement('script');
    script.src = `${app === 'editor' ? 'editor' : 'common'}.js?v=7`;
    script.onerror = () => {
      document.documentElement.classList.remove('js');
      const note = document.createElement('p');
      note.className = 'load-warning';
      note.setAttribute('role', 'alert');
      note.textContent = 'Não foi possível iniciar a página. Confira sua conexão e recarregue.';
      document.querySelector('main').prepend(note);
    };
    document.body.append(script);
  }
  document.body.append(published);
})();
