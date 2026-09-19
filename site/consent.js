/* FE School — analytics consent + Google Analytics 4 loader.
   Google Analytics is NOT loaded, and no analytics cookies are set, until the
   visitor clicks "Kabul et". The choice is remembered in localStorage on this
   origin only (thefeschool.com). "Reddet" (or a later withdrawal) removes the
   GA cookies and keeps the tag from loading. window.gtag only exists after
   consent, so site.js click tracking is automatically a no-op without it.
   Exposes window.feCookieSettings() to re-open the banner. */
(function(){
"use strict";

var GA_ID = 'G-T2E9FFH861';
var KEY = 'fe_analytics_consent';           // 'granted' | 'denied'
var POLICY_URL = '/gizlilik-politikasi.html';

function read(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
function write(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

function loadGA(){
  if (window.__feGA) return;
  window.__feGA = true;
  window['ga-disable-' + GA_ID] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

function clearGACookies(){
  window['ga-disable-' + GA_ID] = true;
  var host = location.hostname.split('.');
  var domains = [location.hostname];
  if (host.length > 2) domains.push(host.slice(-2).join('.'));
  domains.push('.' + host.slice(-2).join('.'));
  document.cookie.split(';').forEach(function(c){
    var name = c.split('=')[0].trim();
    if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name.indexOf('_gat') === 0) {
      domains.forEach(function(d){
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
      });
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
  });
}

function injectStyles(){
  if (document.getElementById('feConsentStyles')) return;
  var st = document.createElement('style');
  st.id = 'feConsentStyles';
  st.textContent =
    '.fe-consent{position:fixed;left:16px;bottom:16px;right:16px;max-width:560px;z-index:2147483000;' +
      'background:var(--surface-solid,#fff);color:var(--ink,#14332e);border:1px solid var(--surface-border,#eeebe3);' +
      'border-radius:var(--radius-sm,18px);box-shadow:var(--shadow-lg,0 10px 40px rgba(20,51,46,.25));padding:18px 20px;' +
      'font-family:"Plus Jakarta Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-size:.92rem;line-height:1.5}' +
    '.fe-consent p{margin:0 0 12px;color:var(--ink-soft,#4d6b66)}' +
    '.fe-consent strong{color:var(--ink,#14332e)}' +
    '.fe-consent a{color:var(--primary-deep,#e85c3b);text-decoration:underline}' +
    '.fe-consent-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
    '.fe-consent button{font:inherit;font-weight:700;cursor:pointer;border-radius:999px;padding:9px 20px;border:1.5px solid var(--primary,#ff7a59)}' +
    '.fe-consent .fe-accept{background:var(--primary,#ff7a59);color:#fff}' +
    '.fe-consent .fe-reject{background:transparent;color:var(--ink,#14332e);border-color:var(--surface-border,#d9d5ca)}' +
    '.fe-consent button:focus-visible{outline:3px solid var(--primary-glow,rgba(255,122,89,.5));outline-offset:2px}' +
    '.fe-cookie-link{background:none;border:0;padding:0;margin-left:14px;font:inherit;color:inherit;text-decoration:underline;cursor:pointer;opacity:.85}' +
    '@media (prefers-reduced-motion:no-preference){.fe-consent{animation:feConsentIn .35s ease-out}}' +
    '@keyframes feConsentIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}';
  document.head.appendChild(st);
}

function closeBanner(){
  var el = document.getElementById('feConsent');
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

function showBanner(){
  injectStyles();
  closeBanner();
  var el = document.createElement('div');
  el.id = 'feConsent';
  el.className = 'fe-consent';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Çerez tercihleri');
  el.innerHTML =
    '<p><strong>Çerezler ve gizlilik.</strong> Bu site, ziyaretçi istatistiklerini anlamak için Google Analytics çerezleri kullanır. ' +
    'Kabul etmezsen hiçbir analitik çerez kullanılmaz ve site aynı şekilde çalışır. ' +
    '<a href="' + POLICY_URL + '">Gizlilik politikası</a></p>' +
    '<div class="fe-consent-row">' +
      '<button type="button" class="fe-accept">Kabul et</button>' +
      '<button type="button" class="fe-reject">Reddet</button>' +
    '</div>';
  el.querySelector('.fe-accept').addEventListener('click', function(){ write('granted'); closeBanner(); loadGA(); });
  el.querySelector('.fe-reject').addEventListener('click', function(){ write('denied'); closeBanner(); clearGACookies(); });
  document.body.appendChild(el);
}

function addFooterLink(){
  var bottom = document.querySelector('.footer-bottom');
  if (!bottom || bottom.querySelector('.fe-cookie-link')) return;
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'fe-cookie-link';
  b.textContent = 'Çerez tercihleri';
  b.addEventListener('click', showBanner);
  bottom.appendChild(b);
}

window.feCookieSettings = showBanner;

function init(){
  injectStyles();
  addFooterLink();
  var v = read();
  if (v === 'granted') loadGA();
  else if (v === 'denied') { clearGACookies(); }
  else showBanner();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();
