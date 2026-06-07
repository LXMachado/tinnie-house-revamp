/* ============================================================
   TINNIE HOUSE RECORDS — sections: Nav, Hero, Marquee, Spotlight
   ============================================================ */
(function(){
  const {useState,useEffect}=React;
  const h=React.createElement;
  const I=window.THIcon;

  function scrollTo(id){ const el=document.getElementById(id); if(el) window.scrollTo({top:el.offsetTop-50,behavior:'smooth'}); }

  /* ---------------------------------------------------- NAV */
  window.Nav=function Nav({audio}){
    const [scr,setScr]=useState(false);
    useEffect(()=>{ const f=()=>setScr(window.scrollY>40); f(); window.addEventListener('scroll',f); return ()=>window.removeEventListener('scroll',f); },[]);
    const st=audio.state;
    return h('nav',{className:'nav'+(scr?' scrolled':'')},
      h('a',{className:'nav__brand',href:'#',onClick:e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}},
        h('img',{src:'assets/logo.png',className:'nav__logo',alt:'Tinnie House Records',style:{width:'32px',height:'32px',objectFit:'contain'}}),
        h('span',{className:'nav__name'},'TINNIE ',h('b',null,'HOUSE'),h('span',{className:'nav__name-rec'},' RECORDS'))
      ),
      h('div',{className:'nav__links'},
        [['Releases','releases'],['Artists','artists'],['About','about'],['Demos','demos']]
      .map(([t,id])=>h('a',{key:id,href:'#'+id,onClick:e=>{e.preventDefault();scrollTo(id);}},t))),
      h('div',{className:'nav__right'},
        h('div',{className:'np'+(st.running?' on':'')},
          h('div',{className:'np__eq'},h('i'),h('i'),h('i'),h('i')),
          h('span',null,'NOW PLAYING ',h('b',null, st.track?st.track.title:'—'))
        ),
        h('button',{className:'hud hud--ghost hud--sm',title:st.soundOn?'Mute':'Enable sound',onClick:()=>audio.setSound(!st.soundOn)},
          h('span',{className:'hud__in'}, (st.soundOn?I.sound:I.mute)({}), st.soundOn?'SOUND':'MUTED'))
      )
    );
  };

  /* ---------------------------------------------------- HERO */
  window.Hero=function Hero({audio,vizMode,intensity}){
    const sp=THR.spotlight;
    return h('section',{className:'hero',id:'top'},
      h('div',{className:'hero__viz'}, h(window.Visualizer,{mode:vizMode,intensity})),
      h('img',{src:'assets/logo.png',alt:'',className:'hero__mark',style:{
        position:'absolute',zIndex:1,top:'50%',left:'50%',transform:'translate(-50%,-54%)',
        width:'min(60vw,720px)',opacity:0.06,filter:'saturate(0) brightness(1.4)',pointerEvents:'none'
      }}),
      h('div',{className:'hero__grid'}),
      h('div',{className:'hero__fade'}),
      h('div',{className:'wrap hero__in'},
        h('div',{className:'hero__cat'},
          h('span',{className:'chip chip--ac'},h('span',{className:'chip-dot'}),'EST. 2020 · GOLD COAST AU'),
          h('span',{className:'tag'},'INDEPENDENT ELECTRONIC LABEL')
        ),
        h('h1',null,
          h('span',{className:'ln'},'PUSHING THE'),
          h('span',{className:'ln'},'BOUNDARIES OF'),
          h('span',{className:'ln ac'},'UNDERGROUND'),
          h('span',{className:'ln'},'ELECTRONIC MUSIC')
        ),
        h('p',{className:'hero__sub'},'Techno, melodic techno and dark progressive house engineered for the floor and the deep listen. A wall of releases from the Gold Coast and beyond — built to move both body and circuitry.'),
        h('div',{className:'hero__cta'},
          h(window.Hud,{variant:'solid',icon:audio.isPlaying(sp)?I.pause({}):I.play({}),onClick:()=>audio.toggle(sp)}, audio.isPlaying(sp)?'PAUSE':'LISTEN'),
          h(window.Hud,{variant:'ghost',icon:I.arrow({}),onClick:()=>scrollTo('releases')},'EXPLORE RELEASES')
        )
      ),
      h('div',{className:'hero__meta wrap',style:{maxWidth:'none',left:0,right:0}},
        h('div',{style:{display:'flex',gap:'46px'}},
          h('div',{className:'hero__stat'},h('b',null,'019'),h('span',null,'Catalog Releases')),
          h('div',{className:'hero__stat'},h('b',null,'08'),h('span',null,'Resident Artists')),
          h('div',{className:'hero__stat'},h('b',null,'∞'),h('span',null,'BPM / Energy'))
        ),
        h('div',{className:'hero__scroll'},'SCROLL')
      )
    );
  };

  /* ---------------------------------------------------- MARQUEE (release ticker) */
  window.Marquee=function Marquee(){
    /* --- date-aware campaign logic for the upcoming release --- */
    const promo={ artist:'RAFA KAO & GABRIEL SAMY', title:'CABARITA', cat:'TH021',
                  start:new Date(2026,6,1), end:new Date(2026,6,14,23,59,59) };
    const now=new Date();
    let phase, tag, avail, live;
    if(now<promo.start){ phase='pre';  tag='UPCOMING';  avail='BEATPORT EXCLUSIVE · JUL 01–14'; live=false; }
    else if(now<=promo.end){ phase='live'; tag='OUT NOW'; avail='BEATPORT EXCLUSIVE · UNTIL JUL 14'; live=true; }
    else { phase='wide'; tag='OUT NOW'; avail='NOW ON ALL PLATFORMS'; live=true; }

    const seg=(key,tagText,fill,main,meta,pulse)=>h('span',{className:'tick',key},
      h('b',{className:'tick__tag'+(fill?' fill':'')}, pulse&&h('i',{className:'tick__live'}), tagText),
      h('span',{className:'tick__main'}, main),
      meta&&h('span',{className:'tick__meta'}, meta),
      h('span',{className:'dot'},'\u25C6')
    );
    const run=[
      seg('a', tag, true, '\u201C'+promo.title+'\u201D \u2014 '+promo.artist, avail, live),
      seg('b', 'CAT \u00b7 '+promo.cat, false, phase==='pre'?'ON BEATPORT \u00b7 01 JUL':'OUT ON BEATPORT', '\u2197', false),
    ];
    const track=[...run, ...run.map(r=>React.cloneElement(r,{key:r.key+'2'}))];
    const goReleases=()=>{ const el=document.getElementById('releases'); if(el) window.scrollTo({top:el.offsetTop-50,behavior:'smooth'}); };
    return h('div',{className:'marq',onClick:goReleases,title:'View releases',role:'button'},
      h('div',{className:'marq__track'}, track));
  };

  /* ---------------------------------------------------- SPOTLIGHT */
  window.Spotlight=function Spotlight({audio}){
    const sp=THR.spotlight; const playing=audio.isPlaying(sp);
    return h('section',{className:'spot sec-pad',id:'spotlight'},
      h('div',{className:'wrap'},
        h('div',{className:'rv'},
          h('div',{className:'eyebrow'},'SPOTLIGHT / NEW RELEASE')
        ),
        h('div',{className:'spot__grid'},
          h('div',{className:'spot__art rv'},
            h(window.ReleaseArt,{seed:sp.seed,style:sp.style}),
            h('span',{className:'corner tl'}),h('span',{className:'corner br'}),
            h('div',{className:'play'},
              h('button',{onClick:()=>audio.toggle(sp),title:'Play'}, (playing?I.pause:I.play)({}))
            ),
            h('div',{className:'ovl'},
              h('span',{className:'spot__cat-tag'},sp.cat),
              h('span',{className:'tag'},sp.tracks+' TRACKS · '+(sp.bpm)+' BPM')
            )
          ),
          h('div',{className:'spot__info rv d1'},
            h('div',{className:'spot__artist'},'BY '+sp.artist.toUpperCase()),
            h('h3',null,sp.title),
            h('div',{className:'spot__tags'}, sp.genres.map(g=>h('span',{key:g,className:'chip'},g)),
              h('span',{className:'chip chip--ac'},'KEY · '+sp.key)),
            h('p',{className:'spot__desc'},sp.desc),
            h('div',{className:'spot__cta'},
              h(window.Hud,{variant:'solid',icon:(playing?I.pause:I.play)({}),onClick:()=>audio.toggle(sp)}, playing?'PAUSE':'PLAY RELEASE'),
              h(window.Hud,{variant:'ghost',icon:I.share({})},'SHARE')
            ),
            h('div',{className:'spot__meta'},
              h('div',null,h('span',null,'Released'),h('b',null,sp.released)),
              h('div',null,h('span',null,'Catalog'),h('b',null,sp.cat)),
              h('div',null,h('span',null,'Format'),h('b',null,'WAV · 24bit'))
            )
          )
        )
      )
    );
  };
})();
