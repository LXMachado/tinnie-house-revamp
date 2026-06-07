/* ============================================================
   TINNIE HOUSE RECORDS — shared UI primitives
   ============================================================ */
(function(){
  const {useRef,useEffect,useState}=React;
  const h=React.createElement;

  /* ---- icons ---- */
  const I={
    play:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'currentColor',...p},h('path',{d:'M7 5v14l12-7z'})),
    pause:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'currentColor',...p},h('rect',{x:6,y:5,width:4,height:14}),h('rect',{x:14,y:5,width:4,height:14})),
    share:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',...p},h('circle',{cx:18,cy:5,r:3}),h('circle',{cx:6,cy:12,r:3}),h('circle',{cx:18,cy:19,r:3}),h('path',{d:'M8.6 13.5l6.8 4M15.4 6.5l-6.8 4'})),
    arrow:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',...p},h('path',{d:'M5 12h14M13 6l6 6-6 6'})),
    sound:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',...p},h('path',{d:'M4 9v6h4l5 4V5L8 9H4z'}),h('path',{d:'M17 8a5 5 0 010 8M19.5 5.5a9 9 0 010 13'})),
    mute:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',...p},h('path',{d:'M4 9v6h4l5 4V5L8 9H4z'}),h('path',{d:'M22 9l-6 6M16 9l6 6'})),
    skip:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'currentColor',...p},h('path',{d:'M6 5v14l9-7zM16 5h2v14h-2z'})),
    prev:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'currentColor',...p},h('path',{d:'M18 5v14l-9-7zM6 5h2v14H6z'})),
    close:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',...p},h('path',{d:'M6 6l12 12M18 6L6 18'})),
    x:(p)=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round',...p},h('path',{d:'M6 6l12 12M18 6L6 18'})),
  };
  window.THIcon=I;

  /* ---- HUD button (signature chamfer) ---- */
  window.Hud=function Hud({variant='solid',size,icon,children,className='',...rest}){
    const cls=`hud hud--${variant} ${size==='sm'?'hud--sm':''} ${className}`.trim();
    if(variant==='ghost'){
      return h('button',{className:cls,...rest}, h('span',{className:'hud__in'}, icon||null, children));
    }
    return h('button',{className:cls,...rest}, icon||null, children);
  };

  /* ---- generative album art canvas ---- */
  window.ReleaseArt=function ReleaseArt({seed,style,className='',rounded}){
    const ref=useRef(null);
    useEffect(()=>{
      const cv=ref.current; if(!cv) return;
      const draw=()=>{ try{ THR.drawArt(cv,seed,style); }catch(e){} };
      draw();
      let to; const ro=new ResizeObserver(()=>{ clearTimeout(to); to=setTimeout(draw,160); });
      ro.observe(cv);
      return ()=>{ ro.disconnect(); clearTimeout(to); };
    },[seed,style]);
    return h('canvas',{ref,className,style:{width:'100%',height:'100%'}});
  };

  /* ---- scroll reveal hook (IntersectionObserver, one-shot) ----
     Content is visible by default (see .rv in CSS). This only ADDS the
     `.in` class once to trigger the entrance animation when an element
     scrolls into view. We never remove it and never observe/mutate class
     attributes app-wide, so there is no React/DOM feedback loop. If a
     later re-render strips `.in`, the element simply stays visible. */
  window.useReveal=function useReveal(){
    useEffect(()=>{
      const io=new IntersectionObserver((es)=>{
        es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
      },{threshold:0, rootMargin:'0px 0px -10% 0px'});
      document.querySelectorAll('.rv').forEach(el=>{
        const r=el.getBoundingClientRect();
        if(r.top < window.innerHeight*0.94) el.classList.add('in'); // already in view
        else io.observe(el);
      });
      return ()=>io.disconnect();
    },[]);
  };

  /* ---- subscribe to audio engine state ---- */
  window.useAudio=function useAudio(){
    const [,force]=useState(0);
    useEffect(()=>THR.audio.subscribe(()=>force(x=>x+1)),[]);
    return THR.audio;
  };
})();
