/* Public marketing only. No form fields or customer data are passed to vendors. */
(function () {
  if (window.yaptMarketingConsent) return;
  var pixelId = '26923785453912756';
  var key = 'yapt_marketing_consent_v1';
  var lifetime = 180 * 24 * 60 * 60 * 1000;
  var choice = null;
  var initialized = false;
  var observingContacts = false;
  var listeners = [];
  var banner, dialog, trigger, previousFocus;
  function decoded(value) {
    for (var i = 0; i < 2; i++) {
      try { var next = decodeURIComponent(value); if (next === value) break; value = next; }
      catch (_) { break; }
    }
    return value;
  }
  function personalOrSecret(value) {
    value = decoded(value);
    return /[^\s/?#&=]+@[^\s/?#&=]+\.[a-z]{2,}/i.test(value)
      || /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(value);
  }
  function sensitiveKey(value) {
    var name = decoded(value).toLowerCase().replace(/[^a-z0-9]/g, '');
    return /email|phone|telefone|celular|password|passwd|senha|token|secret|apikey|authorization|authcode|oauthcode|cpf|cnpj/.test(name)
      || /^(?:code|name|fullname|firstname|lastname|username|nome|nomecompleto|sobrenome|mobile|whatsapp|taxid|documento)$/.test(name);
  }
  function safeAddress(value) {
    if (!value) return true;
    try {
      var url = new URL(value, location.origin);
      if (url.username || url.password || personalOrSecret(value)) return false;
      var fields = Array.from(url.searchParams.entries()).concat(Array.from(new URLSearchParams(url.hash.slice(1)).entries()));
      return !fields.some(function (entry) { return sensitiveKey(entry[0]) || personalOrSecret(entry[1]); });
    } catch (_) { return false; }
  }
  function safePage() { return safeAddress(location.href) && safeAddress(document.referrer); }
  function googleConsent(allowed) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    var state = allowed ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: state, ad_user_data: state, ad_personalization: state, analytics_storage: state });
  }
  try {
    localStorage.setItem(key + '_probe', '1');
    localStorage.removeItem(key + '_probe');
    var saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && saved.version === 1 && typeof saved.advertising === 'boolean'
      && Number.isFinite(saved.updatedAt) && saved.updatedAt <= Date.now()
      && Date.now() - saved.updatedAt < lifetime) choice = saved.advertising;
  } catch (_) { /* No storage means a new choice is required. */ }

  function loadScript(src) {
    if (Array.from(document.scripts).some(function (script) { return script.src === src; })) return;
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }

  function observeConfirmedContacts() {
    // The campaign adapter already confirms its own response. Other pages keep
    // the original widget and its form UX; only a copy of a successful reply is read.
    if (observingContacts || document.querySelector('[data-yapt-confirmed-capture]') || typeof window.fetch !== 'function') return;
    observingContacts = true;
    var originalFetch = window.fetch;
    window.fetch = function (input, options) {
      var observe = false;
      try {
        var url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, location.href);
        if (choice === true && safePage() && url.origin === 'https://vkrwduoawdhsbkoufurl.supabase.co'
          && url.pathname === '/functions/v1/webhook-widget' && options && options.method?.toUpperCase() === 'POST' && typeof options.body === 'string') {
          var body = JSON.parse(options.body);
          observe = body.action === 'wa_button_submit' && body.instanceId === 'a28b6328-6021-4b00-8d2b-af875173ec4b';
        }
      } catch (_) { /* Observation never changes the business request. */ }
      var result = originalFetch.apply(this, arguments);
      if (observe) {
        void result.then(function (response) {
          if (!response.ok || choice !== true || !safePage()) return;
          return response.clone().json().then(function (payload) {
            if (payload && payload.success === true) window.yaptMetaPixel.trackLead();
          });
        }).catch(function () { /* The widget keeps ownership of errors. */ });
      }
      return result;
    };
  }

  function startMarketing() {
    if (!safePage()) return;
    var w = window;
    w.dataLayer = w.dataLayer || [];
    googleConsent(true);
    if (!document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
      w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      loadScript('https://www.googletagmanager.com/gtm.js?id=GTM-WPH76KZH');
    }
    if (document.querySelector('[data-yapt-linkedin]')) {
      w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || [];
      if (!w._linkedin_data_partner_ids.includes('10064090')) w._linkedin_data_partner_ids.push('10064090');
      if (!w.lintrk) {
        w.lintrk = function (a, b) { w.lintrk.q.push([a, b]); };
        w.lintrk.q = [];
      }
      loadScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
    }
    if (initialized) { w.fbq('consent', 'grant'); return; }
    if (!w.fbq) {
      var fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      fbq.queue = [];
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      w.fbq = fbq;
      if (!w._fbq) w._fbq = fbq;
    }
    w.fbq('set', 'autoConfig', false, pixelId);
    w.fbq('consent', 'grant');
    var state = typeof w.fbq.getState === 'function' ? w.fbq.getState() : null;
    var queued = Array.from(w.fbq.queue || []);
    var existing = state && Array.isArray(state.pixels) && state.pixels.some(function (pixel) { return String(pixel.id) === pixelId; });
    if (!existing && !queued.some(function (args) { return args[0] === 'init' && args[1] === pixelId; })) w.fbq('init', pixelId);
    initialized = true;
    w.fbq('trackSingle', pixelId, 'PageView');
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    observeConfirmedContacts();
  }

  function clearMetaCookies() {
    ['_fbp', '_fbc', 'yapt_gclid', 'yapt_gbraid', 'yapt_wbraid', 'yapt_fbclid'].forEach(function (name) {
      ['', '; Domain=' + location.hostname, '; Domain=.yapt.ai'].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; Path=/' + domain + '; SameSite=Lax';
      });
    });
  }

  function applyChoice(allowed, persist) {
    if (typeof allowed !== 'boolean') return;
    choice = allowed;
    if (persist) {
      try { localStorage.setItem(key, JSON.stringify({ version: 1, advertising: allowed, updatedAt: Date.now() })); } catch (_) { /* This choice lasts for this page only. */ }
    }
    if (allowed) startMarketing();
    else {
      if (initialized && typeof window.fbq === 'function') window.fbq('consent', 'revoke');
      if (window.dataLayer) googleConsent(false);
      clearMetaCookies();
    }
    if (banner) banner.hidden = true;
    if (dialog && dialog.open) dialog.close();
    if (trigger) trigger.hidden = false;
    listeners.forEach(function (listener) { listener(allowed); });
    window.dispatchEvent(new CustomEvent('yapt:marketing-consent', { detail: { advertising: allowed } }));
  }
  function setChoice(allowed) { applyChoice(allowed, true); }

  function manage() {
    if (!dialog) return;
    dialog.querySelector('input').checked = choice === true;
    previousFocus = document.activeElement;
    dialog.showModal();
  }

  window.yaptMarketingConsent = {
    get: function () { return choice; },
    isGranted: function () { return choice === true; },
    set: setChoice,
    manage: manage,
    subscribe: function (listener) { listeners.push(listener); return function () { listeners = listeners.filter(function (item) { return item !== listener; }); }; }
  };
  window.yaptMetaPixel = {
    trackLead: function () {
      if (choice === true && initialized && safePage() && typeof window.fbq === 'function') window.fbq('trackSingle', pixelId, 'Lead');
    }
  };

  function render() {
    if (document.getElementById('yapt-cookie-banner')) return;
    var wrapper = document.createElement('div');
    wrapper.id = 'yapt-cookie-controls';
    wrapper.innerHTML = '<section id="yapt-cookie-banner" aria-label="Cookies e privacidade" hidden><div><strong>Uma experiência melhor, com a sua escolha.</strong><p>Usamos cookies essenciais para o site funcionar. Com sua permissão, cookies de publicidade ajudam a medir campanhas. <a href="/privacy">Saiba mais</a>.</p></div><div class="yapt-cookie-actions"><button type="button" data-cookie-accept>Aceitar cookies</button><button type="button" data-cookie-manage>Gerenciar preferências</button></div></section><button type="button" id="yapt-cookie-trigger" aria-label="Preferências de cookies" hidden>Cookies</button><dialog id="yapt-cookie-dialog" aria-labelledby="yapt-cookie-title"><div class="yapt-cookie-dialog-head"><h2 id="yapt-cookie-title">Preferências de cookies</h2><button type="button" data-cookie-close aria-label="Fechar preferências de cookies">×</button></div><p>Você escolhe se autoriza os cookies de publicidade. Sua decisão pode ser alterada a qualquer momento.</p><div class="yapt-cookie-category"><div><strong>Cookies essenciais</strong><p>Necessários para manter o site e os serviços funcionando.</p></div><span>Sempre ativos</span></div><label class="yapt-cookie-category"><div><strong>Cookies de publicidade</strong><p>Permitem medir visitas e contatos das campanhas, com Meta, Google e LinkedIn quando presentes nesta página.</p></div><input type="checkbox" aria-label="Cookies de publicidade"></label><div class="yapt-cookie-actions"><button type="button" data-cookie-save>Salvar preferências</button><button type="button" data-cookie-accept>Aceitar cookies</button></div></dialog>';
    document.body.appendChild(wrapper);
    banner = document.getElementById('yapt-cookie-banner');
    dialog = document.getElementById('yapt-cookie-dialog');
    trigger = document.getElementById('yapt-cookie-trigger');
    banner.hidden = choice !== null;
    trigger.hidden = choice === null;
    wrapper.querySelectorAll('[data-cookie-accept]').forEach(function (button) { button.addEventListener('click', function () { setChoice(true); }); });
    wrapper.querySelector('[data-cookie-manage]').addEventListener('click', manage);
    trigger.addEventListener('click', manage);
    wrapper.querySelector('[data-cookie-save]').addEventListener('click', function () { setChoice(dialog.querySelector('input').checked); });
    wrapper.querySelector('[data-cookie-close]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('close', function () { if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus(); });
    if (choice === true) startMarketing();
    window.dispatchEvent(new CustomEvent('yapt:marketing-consent', { detail: { advertising: choice === true } }));
  }
  window.addEventListener('storage', function (event) {
    if (event.key !== key) return;
    // A preference change in another tab applies here; invalid/deleted storage revokes.
    var next = null;
    try { next = JSON.parse(event.newValue || 'null'); } catch (_) { /* Revoke below. */ }
    applyChoice(!!(next && next.version === 1 && next.advertising === true && Number.isFinite(next.updatedAt) && next.updatedAt <= Date.now() && Date.now() - next.updatedAt < lifetime), false);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
