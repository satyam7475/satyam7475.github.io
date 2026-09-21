const $=(s)=>document.querySelector(s);
const $$=(s)=>document.querySelectorAll(s);

const progress=$('#progress');
const updateProgress=()=>{const d=document.documentElement; const max=d.scrollHeight-innerHeight; progress.style.width=(max>0?(scrollY/max)*100:0)+'%'};
addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

const cursor=$('#cursorLight');
addEventListener('pointermove',(e)=>{ if(cursor){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';} },{passive:true});

const menu=$('#menu'), nav=$('#siteNav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open));});
$$('.site-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));

const observer=new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -50px'});
$$('.reveal').forEach(el=>observer.observe(el));

// Subtle pointer-driven 3D tilt; disabled for touch devices.
const finePointer=matchMedia('(pointer:fine)').matches;
if(finePointer){
  $$('[data-tilt]').forEach(card=>{
    const max=Number(card.dataset.max||4);
    const onMove=(e)=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*max).toFixed(2)}deg) rotateY(${(x*max).toFixed(2)}deg)`};
    const reset=()=>{card.style.transform=''};
    card.addEventListener('pointermove',onMove);card.addEventListener('pointerleave',reset);
  });

  $$('.magnetic').forEach(btn=>{
    btn.addEventListener('pointermove',(e)=>{const r=btn.getBoundingClientRect();const x=(e.clientX-(r.left+r.width/2))*0.10;const y=(e.clientY-(r.top+r.height/2))*0.10;btn.style.transform=`translate(${x}px,${y}px)`});
    btn.addEventListener('pointerleave',()=>btn.style.transform='');
  });
}

$('#year').textContent=new Date().getFullYear();
