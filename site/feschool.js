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

/* INP (2026-11-11, website c50kTr0f): a tap only marks the card (aria-current + tick)
   in the click task, so that frame paints at once. Showing the new panel and the
   scroll to it (style + layout of the panel, forced by scrollIntoView, and the big
   repaint below it) run in a new task after that paint. End state is the same. */
var job=0;
function afterPaint(fn){
  var done=false;
  function run(){ if(!done){ done=true; fn(); } }
  if(window.requestAnimationFrame) requestAnimationFrame(function(){ setTimeout(run,0); });
  setTimeout(run,250); /* safety net if no frame comes (hidden tab) */
}
function mark(g){
  goals.forEach(function(b){
    if(b.getAttribute('data-goal')===g) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current');
  });
}
function show(g){
  Object.keys(panels).forEach(function(k){panels[k].classList.toggle('on',k===g);});
}
function pick(g,scroll){
  if(!panels[g]) return;
  mark(g);
  if(!scroll){ show(g); return; }
  var id=++job;
  afterPaint(function(){
    if(id!==job) return; /* a newer tap won */
    show(g);
    var r=document.getElementById('dersler')||panels[g];
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    r.scrollIntoView({block:'start',behavior:reduce?'auto':'smooth'});
    try{localStorage.setItem(KEY,g);}catch(err){}
  });
}

if(goals.length){
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="#kurs-"]');
    if(!a) return;
    var href=a.getAttribute('href'), at=href.indexOf('#kurs-');
    /* '/#kurs-sirket' (footer) on this same page: switch in place too; other pages navigate */
    if(at>0&&(a.host!==location.host||a.pathname!==location.pathname||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)) return;
    var g=href.slice(at+6);
    if(!panels[g]) return;
    e.preventDefault();
    pick(g,true);
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
