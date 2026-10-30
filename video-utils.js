/* Regras compartilhadas entre a prévia, a exportação e o portfólio. */
'use strict';
window.PortfolioVideo = Object.freeze({
  normalize(value) {
    let url;
    try { url = new URL(String(value).trim()); } catch { throw new Error('Insira um link válido de vídeo.'); }
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Use um link HTTPS sem credenciais.');
    const host = url.hostname.toLowerCase();
    if (host === 'drive.google.com') {
      const id = url.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/)?.[1]
        || (['/open', '/uc'].includes(url.pathname) ? url.searchParams.get('id') : null);
      if (!id || !/^[\w-]+$/.test(id)) throw new Error('Use o link de um arquivo do Google Drive.');
      const result = new URL(`https://drive.google.com/file/d/${id}/preview`);
      const key = url.searchParams.get('resourcekey');
      if (key && /^[\w-]+$/.test(key)) result.searchParams.set('resourcekey', key);
      return result.href;
    }
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'].includes(host)) {
      let id;
      if (host === 'youtu.be') id = url.pathname.match(/^\/([\w-]+)\/?$/)?.[1];
      else if (url.pathname === '/watch') id = url.searchParams.get('v');
      else id = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)\/?$/)?.[1];
      if (!/^[\w-]{11}$/.test(id || '')) throw new Error('Use o link de um vídeo do YouTube, Shorts ou transmissão.');
      return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(host)) {
      const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
      if (!match) throw new Error('Use o link de um vídeo do Vimeo.');
      const result = new URL(`https://player.vimeo.com/video/${match[1]}`);
      const hash = url.searchParams.get('h') || match[2];
      if (hash && /^[a-zA-Z0-9]+$/.test(hash)) result.searchParams.set('h', hash);
      return result.href;
    }
    throw new Error('Use um vídeo do Google Drive, YouTube ou Vimeo.');
  },
  safe(value) { try { return this.normalize(value); } catch { return ''; } },
  external(value) {
    const embed = this.safe(value);
    if (!embed) return '';
    const url = new URL(embed);
    if (url.hostname === 'drive.google.com') return embed.replace('/preview', '/view');
    if (url.hostname === 'www.youtube-nocookie.com') return `https://www.youtube.com/watch?v=${url.pathname.split('/').pop()}`;
    const hash = url.searchParams.get('h');
    return `https://vimeo.com/${url.pathname.split('/').pop()}${hash ? '/' + hash : ''}`;
  },
  validProjects(value) {
    const credits = pairs => Array.isArray(pairs) && pairs.every(pair => Array.isArray(pair) && pair.length === 2 && pair.every(x => typeof x === 'string'));
    const localized = text => text && typeof text === 'object' && !Array.isArray(text)
      && ['pt', 'en', 'es'].every(lang => text[lang] === undefined || typeof text[lang] === 'string');
    return Array.isArray(value) && value.length > 0 && value.length < 100
      && new Set(value.map(p => p?.id)).size === value.length
      && value.every(p => p && typeof p.id === 'string' && /^[\w-]+$/.test(p.id) && localized(p.title) && localized(p.kind)
        && localized(p.desc) && (!p.credits || credits(p.credits))
        && (!p.link || (typeof p.link.href === 'string' && localized(p.link.label)))
        && Array.isArray(p.videos) && p.videos.length < 1000
        && p.videos.every(v => v && localized(v.caption) && (!v.desc || localized(v.desc))
          && typeof v.embed === 'string' && (!v.category || typeof v.category === 'string')
          && (!v.orientation || ['vertical','horizontal'].includes(v.orientation)) && (!v.credits || credits(v.credits))));
  }
});
