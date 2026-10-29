/* FE School site (2026-10-29 redesign) — small progressive enhancement.
   All content is static HTML (built by site-src/build-pages.mjs); without JS the
   goal picker still works through #kurs-* anchors + CSS :target.
   - Goal picker: one result panel visible, choice remembered (fe-goal).
   - Contact page: copy the WhatsApp number.
   Click tracking / UTM tagging live in site.js (loaded on every page). */
(function(){
"use strict";
var KEY='fe-goal';
var goals=[].slice.call(document.querySelectorAll('.goal[data-goal]'));
var panels={};
[].slice.call(document.querySelectorAll('.gres[data-goal]')).forEach(function(p){panels[p.getAttribute('data-goal')]=p;});

function pick(g,scroll){
  if(!panels[g]) return;
  Object.keys(panels).forEach(function(k){panels[k].classList.toggle('on',k===g);});
  goals.forEach(function(b){
    if(b.getAttribute('data-goal')===g) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current');
  });
  if(scroll){
    var r=document.getElementById('dersler')||panels[g];
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    r.scrollIntoView({block:'start',behavior:reduce?'auto':'smooth'});
  }
}

if(goals.length){
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#kurs-"]');
    if(!a) return;
    var g=a.getAttribute('href').slice(6);
    if(!panels[g]) return;
    e.preventDefault();
    pick(g,true);
    try{localStorage.setItem(KEY,g);}catch(err){}
    try{history.replaceState(null,'','#kurs-'+g);}catch(err){}
  });
  var start='is', h=location.hash.replace('#kurs-','');
  if(location.hash.indexOf('#kurs-')===0&&panels[h]) start=h;
  else { try{var s=localStorage.getItem(KEY); if(s&&panels[s]) start=s;}catch(err){} }
  pick(start,false);
}

var copy=document.getElementById('copyWa');
if(copy){
  copy.addEventListener('click',function(){
    var ok=document.getElementById('copyOk'),num=document.getElementById('waNum');
    function sel(){var r=document.createRange();r.selectNodeContents(num);var s=getSelection();s.removeAllRanges();s.addRange(r);}
    if(navigator.clipboard){navigator.clipboard.writeText('+905467615951').then(function(){ok.hidden=false;setTimeout(function(){ok.hidden=true;},2000);},sel);}
    else sel();
  });
}
})();
