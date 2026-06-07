/* ============================================================
   TINNIE HOUSE RECORDS — sections: Wall, Artists, About, Demos, Footer, Player
   ============================================================ */
(function(){
  const {useState,useEffect,useRef}=React;
  const h=React.createElement;
  const I=window.THIcon;
  const PLAYLIST=[THR.spotlight,...THR.releases];

  /* ---------------------------------------------------- RELEASE CARD */
  function Card({r,audio,dense}){
    const playing=audio.isPlaying(r);
    return h('div',{className:'rel'+(playing?' playing':''),onClick:()=>audio.toggle(r)},
      h('div',{className:'rel__art'},
        h(window.ReleaseArt,{seed:r.seed,style:r.style}),
        h('span',{className:'rel__cat'},r.cat),
        h('span',{className:'rel__genre'},h('span',{className:'tag',style:{color:'var(--ac-ink)'}},r.genre)),
        h('button',{className:'rel__play',title:'Play',onClick:e=>{e.stopPropagation();audio.toggle(r);}}, (playing?I.pause:I.play)({}))
      ),
      h('div',{className:'rel__foot'},
        h('div',{className:'rel__title'},r.title),
        h('div',{className:'rel__by'},'by ',h('b',null,r.artist)),
        !dense&&h('div',{className:'rel__row'},
          h('span',{className:'tag'},r.tracks+(r.tracks>1?' TRKS':' TRK')),
          h('span',{className:'tag'},r.bpm?r.bpm+' BPM':'AMBIENT'))
      )
    );
  }

  /* ---------------------------------------------------- WALL */
  window.Wall=function Wall({audio,dense}){
    const [filter,setFilter]=useState('ALL');
    const filters=['ALL',...THR.GENRES.map(g=>g.toUpperCase())];
    /* show only the latest 8 releases (dev: pull latest 8 from DB) */
    const LATEST=8;
    const list=THR.releases
      .filter(r=>filter==='ALL'||r.genre.toUpperCase()===filter)
      .slice(0,LATEST);
    return h('section',{className:'wall sec-pad',id:'releases'},
      h('div',{className:'wrap'},
        h('div',{className:'wall__head rv'},
          h('div',null,
            h('div',{className:'eyebrow',style:{marginBottom:'16px'}},'THE CATALOG'),
            h('h2',{className:'h-sec'},'WALL OF RELEASES')
          ),
          h('div',{className:'wall__filters'},
            filters.map(f=>h('button',{key:f,className:'filt'+(filter===f?' on':''),onClick:()=>setFilter(f)},f))
          )
        ),
        h('div',{className:'grid'+(dense?' dense':'')+' rv'},
          list.map(r=>h(Card,{key:r.cat,r,audio,dense}))
        ),
        h('div',{className:'wall__more'},
          h(window.Hud,{variant:'ghost',icon:I.arrow({}),
            onClick:()=>window.open('https://www.beatport.com/label/tinnie-house-records/','_blank','noopener')},
            'VIEW COMPLETE DISCOGRAPHY')
        )
      )
    );
  };

  /* ---------------------------------------------------- ARTISTS */
  window.Artists=function Artists(){
    return h('section',{className:'artists sec-pad',id:'artists'},
      h('div',{className:'wrap'},
        h('div',{className:'wall__head rv'},
          h('div',null,
            h('div',{className:'eyebrow',style:{marginBottom:'16px'}},'THE ROSTER'),
            h('h2',{className:'h-sec'},'ARTISTS')
          ),
          h('span',{className:'tag'},'08 PRODUCERS · GOLD COAST → WORLDWIDE')
        ),
        h('div',{className:'art-grid'},
          THR.artists.map((a,i)=>h('a',{key:a.n,href:'#',onClick:e=>e.preventDefault(),className:'artist rv'+(i%4?(' d'+(i%4)):'')},
            h('span',{className:'artist__n'},a.n),
            h('div',{className:'artist__art'}, h(window.ReleaseArt,{seed:a.seed,style:['warp','ink','rings','particles'][i%4]})),
            h('div',{className:'artist__body'},
              h('div',{className:'artist__name'},a.name),
              h('div',{className:'artist__role'},a.role),
              h('div',{className:'tag',style:{marginTop:'8px',color:'var(--ink-3)'}},a.releases+' RELEASE'+(a.releases>1?'S':''))
            )
          ))
        )
      )
    );
  };

  /* ---------------------------------------------------- ABOUT */
  window.About=function About(){
    return h('section',{className:'about sec-pad',id:'about'},
      h('img',{src:'assets/logo.png',alt:'',style:{position:'absolute',right:'-60px',top:'50%',transform:'translateY(-50%)',width:'420px',opacity:0.05,filter:'saturate(0) brightness(1.5)',pointerEvents:'none'}}),
      h('div',{className:'wrap'},
        h('div',{className:'about__grid'},
          h('div',{className:'rv'},
            h('div',{className:'eyebrow',style:{marginBottom:'22px'}},'ABOUT THE LABEL'),
            h('p',{className:'about__big'},'A cutting-edge electronic label rooted in Australia\u2019s ',h('em',null,'Gold Coast'),' underground — championing the sounds that define tomorrow\u2019s dancefloors.'),
            h('p',null,'We celebrate Australia\u2019s rich electronic heritage while signing artists from every corner of the globe. Our catalogue spans techno, melodic techno and dark progressive house, always chasing groundbreaking sound that transcends borders and moves both body and soul.'),
            h('div',{style:{marginTop:'30px'}},
              h(window.Hud,{variant:'ghost',icon:I.arrow({})},'OUR STORY'))
          ),
          h('div',{className:'about__stats rv d1'},
            [['019',null,'Releases shipped'],['08',null,'Resident artists'],['40','+','Countries reached'],['2020',null,'Founded · QLD']]
            .map(([n,suf,l],i)=>h('div',{key:i,className:'about__stat'},
              h('b',null, n, suf?h('span',{className:'u'},suf):null),
              h('span',null,l)))
          )
        )
      )
    );
  };

  /* ---------------------------------------------------- DEMOS / COMMUNITY */
  window.Demos=function Demos(){
    const [email,setEmail]=useState(''); const [done,setDone]=useState(false);
    const chans=[['BANDCAMP','Full catalogue / buy'],['SOUNDCLOUD','Previews & sets'],['SPOTIFY','Label playlist'],['INSTAGRAM','@tinniehouse'],['YOUTUBE','Visuals & mixes']];
    return h('section',{className:'demo sec-pad',id:'demos'},
      h('div',{className:'wrap'},
        h('div',{className:'eyebrow rv',style:{marginBottom:'16px'}},'A&R / COMMUNITY'),
        h('h2',{className:'h-sec rv'},'SEND US YOUR SOUND'),
        h('div',{className:'demo__grid'},
          h('div',{className:'panel rv'},
            h('h4',null,'DEMO SUBMISSIONS'),
            h('p',{style:{color:'var(--ink-2)',marginTop:'14px',fontSize:'14.5px'}},'We\u2019re always hunting the next breakthrough. No funnels, no gatekeeping — just send the music.'),
            h('ul',{className:'demo__list'},
              ['Send 2\u20133 of your strongest unreleased tracks','Private SoundCloud or WAV / streaming links only','Brief artist bio + social links','If it moves us, we reach out for the full files']
              .map((t,i)=>h('li',{key:i},h('span',{className:'n'},'0'+(i+1)),h('span',null,t)))
            ),
            h('div',{style:{marginTop:'26px'}},
              h(window.Hud,{variant:'solid',icon:I.arrow({})},'demos@tinniehouse.au'))
          ),
          h('div',{className:'panel rv d1'},
            h('h4',null,'JOIN THE FREQUENCY'),
            h('p',{style:{color:'var(--ink-2)',marginTop:'14px',fontSize:'14.5px'}},'New releases, label nights and back-catalogue drops — straight to your inbox. No spam, ever.'),
            h('div',{className:'demo__sub'},
              h('input',{className:'inp',placeholder:'your@email.com',value:email,onChange:e=>setEmail(e.target.value)}),
              h(window.Hud,{variant:'solid',onClick:()=>{if(email)setDone(true);}}, done?'SUBSCRIBED ✓':'SUBSCRIBE')
            ),
            h('div',{className:'demo__chans'},
              chans.map(([n,d])=>h('a',{key:n,href:'#',onClick:e=>e.preventDefault(),className:'chan'},
                h('span',null,n),h('b',null,d+'  ↗')))
            )
          )
        )
      )
    );
  };

  /* ---------------------------------------------------- FOOTER */
  window.Footer=function Footer(){
    return h('footer',{className:'foot'},
      h('div',{className:'wrap'},
        h('div',{className:'foot__top'},
          h('div',{className:'foot__brand'},
            h('div',{className:'nav__brand'},
              h('img',{src:'assets/logo.png',alt:'',style:{width:'34px',height:'34px',objectFit:'contain'}}),
              h('span',{className:'nav__name'},'TINNIE ',h('b',null,'HOUSE'),h('span',{className:'nav__name-rec'},' RECORDS'))),
            h('p',null,'Independent electronic music label. Techno, melodic techno & dark progressive house since 2020. Gold Coast, Australia.')),
          [['LABEL',['About','Artists','Releases','Demo Policy']],
           ['LISTEN',['Bandcamp','SoundCloud','Spotify','YouTube']],
           ['CONNECT',['Instagram','Contact','Press Kit','Newsletter']]]
          .map(([t,links])=>h('div',{key:t,className:'foot__col'},
            h('h5',null,t),
            links.map(l=>h('a',{key:l,href:'#',onClick:e=>e.preventDefault()},l))))
        ),
        h('div',{className:'foot__bot'},
          h('span',null,'© 2026 TINNIE HOUSE RECORDS — ALL RIGHTS RESERVED'),
          h('div',{className:'links'},
            h('a',{href:'#',onClick:e=>e.preventDefault()},'PRIVACY'),
            h('a',{href:'#',onClick:e=>e.preventDefault()},'TERMS'),
            h('a',{href:'#',onClick:e=>e.preventDefault()},'COOKIES'))
        )
      )
    );
  };

  /* ---------------------------------------------------- PLAYER BAR */
  window.Player=function Player({audio}){
    const st=audio.state;
    const [t,setT]=useState(0);
    useEffect(()=>{ if(!st.running){return;} const iv=setInterval(()=>setT(x=>x+1),1000); return ()=>clearInterval(iv); },[st.running,st.track&&st.track.cat]);
    useEffect(()=>{ setT(0); },[st.track&&st.track.cat]);
    if(!st.track) return null;
    const idx=PLAYLIST.findIndex(p=>p.cat===st.track.cat);
    const go=d=>{ const n=PLAYLIST[(idx+d+PLAYLIST.length)%PLAYLIST.length]; audio.play(n); };
    const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
    const tot=4*60+ (st.track.seed%50);
    return h('div',{className:'player'+(st.running?' on':'')},
      h('div',{className:'player__in'},
        h('div',{className:'player__art'}, h(window.ReleaseArt,{seed:st.track.seed,style:st.track.style})),
        h('div',{className:'player__meta'},
          h('b',null,st.track.title),
          h('span',null,st.track.artist)),
        h('div',{className:'player__ctrls'},
          h('button',{className:'player__btn',onClick:()=>go(-1),title:'Previous'},I.prev({})),
          h('button',{className:'player__btn player__play',onClick:()=>audio.toggle(st.track),title:'Play/Pause'}, (st.running?I.pause:I.play)({})),
          h('button',{className:'player__btn',onClick:()=>go(1),title:'Next'},I.skip({}))),
        h('span',{className:'player__time'},fmt(t%tot)),
        h('div',{className:'player__wave'}, h(window.Waveform,null)),
        h('span',{className:'player__time'},fmt(tot)),
        h('button',{className:'player__btn',title:st.soundOn?'Mute':'Unmute',onClick:()=>audio.setSound(!st.soundOn)}, (st.soundOn?I.sound:I.mute)({})),
        h('button',{className:'player__btn player__close',title:'Close',onClick:()=>audio.stop()},I.close({}))
      )
    );
  };
})();
