/* ============================================================
   TINNIE HOUSE RECORDS — app shell + theme tweaks
   ============================================================ */
(function(){
  const {useEffect}=React;
  const h=React.createElement;

  /* accent presets — all cold / electric family */
  const ACCENTS={
    '#2f6bff':{ac2:'#38d6ff',hue:214,name:'Electric Blue'},
    '#16d6ff':{ac2:'#7af0ff',hue:190,name:'Cyan'},
    '#6f8cff':{ac2:'#acc4ff',hue:224,name:'Ice'},
    '#7a6bff':{ac2:'#b3a6ff',hue:250,name:'UV Violet'},
    '#2fe0b8':{ac2:'#88f4dd',hue:166,name:'Teal'},
  };
  function hexRgb(x){ const n=parseInt(x.slice(1),16); return [n>>16&255,n>>8&255,n&255]; }
  function applyTheme(tw){
    const r=document.documentElement.style;
    const a=tw.accent, cfg=ACCENTS[a]||ACCENTS['#2f6bff'];
    const [R,G,B]=hexRgb(cfg.ac2);
    r.setProperty('--ac',a);
    r.setProperty('--ac-2',cfg.ac2);
    r.setProperty('--ac-glow',`rgba(${R},${G},${B},0.55)`);
    r.setProperty('--ac-dim',`rgba(${R},${G},${B},0.16)`);
    r.setProperty('--ac-ink',`rgb(${Math.min(255,R+60)},${Math.min(255,G+50)},${Math.min(255,B+40)})`);
    r.setProperty('--viz-hue',cfg.hue);
    r.setProperty('--grain', tw.grain?0.05:0);
    r.setProperty('--scan', tw.grain?0.05:0);
    document.body.style.fontFamily = tw.bodyFont==='mono' ? 'var(--f-mono)' : 'var(--f-body)';
  }

  const TWEAK_DEFAULTS=/*EDITMODE-BEGIN*/{
    "accent":"#2f6bff",
    "vizMode":"radial",
    "intensity":1,
    "dense":false,
    "grain":true,
    "bodyFont":"sans"
  }/*EDITMODE-END*/;

  function App(){
    const [tw,setTweak]=window.useTweaks(TWEAK_DEFAULTS);
    const audio=window.useAudio();
    window.useReveal();
    useEffect(()=>{ applyTheme(tw); },[tw.accent,tw.grain,tw.bodyFont]);

    return h(React.Fragment,null,
      h(window.Nav,{audio}),
      h(window.Hero,{audio,vizMode:tw.vizMode,intensity:tw.intensity}),
      h(window.Marquee,null),
      h(window.Spotlight,{audio}),
      h(window.Wall,{audio,dense:tw.dense}),
      h(window.Artists,null),
      h(window.About,null),
      h(window.Demos,null),
      h(window.Footer,null),
      h(window.Player,{audio}),

      h(window.TweaksPanel,null,
        h(window.TweakSection,{label:'Identity'}),
        h(window.TweakColor,{label:'Accent',value:tw.accent,options:Object.keys(ACCENTS),onChange:v=>setTweak('accent',v)}),
        h(window.TweakRadio,{label:'Body type',value:tw.bodyFont,options:['sans','mono'],onChange:v=>setTweak('bodyFont',v)}),

        h(window.TweakSection,{label:'Hero visualizer'}),
        h(window.TweakSelect,{label:'Style',value:tw.vizMode,options:['radial','tunnel','bars','field'],onChange:v=>setTweak('vizMode',v)}),
        h(window.TweakSlider,{label:'Intensity',value:tw.intensity,min:0.4,max:1.8,step:0.1,onChange:v=>setTweak('intensity',v)}),

        h(window.TweakSection,{label:'Catalog wall'}),
        h(window.TweakRadio,{label:'Density',value:tw.dense?'dense':'comfy',options:['comfy','dense'],onChange:v=>setTweak('dense',v==='dense')}),

        h(window.TweakSection,{label:'Atmosphere'}),
        h(window.TweakToggle,{label:'Film grain + scanlines',value:tw.grain,onChange:v=>setTweak('grain',v)})
      )
    );
  }

  applyTheme(TWEAK_DEFAULTS);
  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
