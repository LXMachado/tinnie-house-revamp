/* ============================================================
   TINNIE HOUSE RECORDS — procedural album art
   Deterministic dark abstract artwork seeded per release.
   window.THR.drawArt(canvas, seed, style)
   ============================================================ */
window.THR = window.THR || {};
(function(){
  function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

  // cohesive electric-blue family; hue drifts blue→cyan→violet only
  function pal(rng){
    const base = 218 + Math.floor(rng()*64);      // 218..282
    const accent = base + (rng()<.5? -18 : 26);
    return {
      bg0:`hsl(${base-4} 38% 5%)`,
      bg1:`hsl(${base} 30% 9%)`,
      mid:`hsl(${base} 55% 22%)`,
      ac:`hsl(${accent} 92% 62%)`,
      ac2:`hsl(${accent+14} 96% 70%)`,
      hot:`hsl(${accent} 100% 80%)`,
      base, accent
    };
  }

  function bg(ctx,w,h,p,rng){
    const g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,p.bg1); g.addColorStop(1,p.bg0);
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    // soft off-center radial bloom
    const cx=w*(.3+rng()*.4), cy=h*(.25+rng()*.4), r=Math.max(w,h)*(.5+rng()*.4);
    const rg=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    rg.addColorStop(0,`hsla(${p.accent} 90% 55% / ${.18+rng()*.18})`);
    rg.addColorStop(1,'transparent');
    ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
  }

  function grain(ctx,w,h,amt){
    const n=Math.floor(w*h*0.04);
    ctx.globalAlpha=amt;
    for(let i=0;i<n;i++){
      const x=Math.random()*w, y=Math.random()*h, s=Math.random()*1.2;
      ctx.fillStyle=Math.random()<.5?'#fff':'#000';
      ctx.fillRect(x,y,s,s);
    }
    ctx.globalAlpha=1;
  }
  function vignette(ctx,w,h){
    const g=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.2,w/2,h/2,Math.max(w,h)*.72);
    g.addColorStop(0,'transparent'); g.addColorStop(1,'rgba(2,4,8,.78)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  }

  const styles={
    /* concentric warped rings */
    rings(ctx,w,h,p,rng){
      const cx=w*(.4+rng()*.2), cy=h*(.4+rng()*.2);
      const n=10+Math.floor(rng()*8);
      ctx.lineWidth=Math.max(1,w/260);
      for(let i=0;i<n;i++){
        const r=(i+1)/n*Math.max(w,h)*.62*(1+rng()*.05);
        ctx.beginPath();
        const segs=80;
        for(let s=0;s<=segs;s++){
          const a=s/segs*Math.PI*2;
          const warp=Math.sin(a*3+i*.6)*r*.06*(rng()*.5+.7);
          const rr=r+warp;
          const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr*.92;
          s===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        const t=i/n;
        ctx.strokeStyle=`hsla(${p.accent} ${60+t*40}% ${40+t*38}% / ${.12+t*.6})`;
        if(i>n-3){ ctx.shadowColor=p.ac; ctx.shadowBlur=w/22; } else ctx.shadowBlur=0;
        ctx.stroke();
      }
      ctx.shadowBlur=0;
    },
    /* swirling warp — stormdrifter feel */
    warp(ctx,w,h,p,rng){
      const cx=w*.5, cy=h*.5, arms=3+Math.floor(rng()*3);
      ctx.globalCompositeOperation='lighter';
      for(let a=0;a<arms;a++){
        const baseAng=rng()*Math.PI*2;
        const pts=160;
        ctx.beginPath();
        for(let i=0;i<pts;i++){
          const t=i/pts;
          const ang=baseAng+t*Math.PI*(4+rng()*2);
          const rad=t*Math.max(w,h)*.55;
          const x=cx+Math.cos(ang)*rad, y=cy+Math.sin(ang)*rad*.9;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.lineWidth=w/90*(1+rng());
        ctx.strokeStyle=`hsla(${p.accent+a*8} 90% ${55+rng()*20}% / .5)`;
        ctx.shadowColor=p.ac2; ctx.shadowBlur=w/16;
        ctx.stroke();
      }
      // core
      const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,w*.28);
      cg.addColorStop(0,p.hot); cg.addColorStop(.4,p.ac); cg.addColorStop(1,'transparent');
      ctx.fillStyle=cg; ctx.globalAlpha=.55; ctx.beginPath(); ctx.arc(cx,cy,w*.28,0,7); ctx.fill();
      ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over'; ctx.shadowBlur=0;
    },
    /* perspective wire grid / terrain */
    grid(ctx,w,h,p,rng){
      const rows=14, hor=h*(.42+rng()*.12);
      ctx.strokeStyle=`hsla(${p.accent} 80% 60% / .5)`;
      ctx.lineWidth=Math.max(1,w/420);
      ctx.shadowColor=p.ac; ctx.shadowBlur=w/40;
      // horizon glow
      const hg=ctx.createLinearGradient(0,hor-h*.1,0,hor+h*.1);
      hg.addColorStop(0,'transparent'); hg.addColorStop(.5,`hsla(${p.accent} 90% 60% / .35)`); hg.addColorStop(1,'transparent');
      ctx.fillStyle=hg; ctx.fillRect(0,hor-h*.1,w,h*.2);
      const amp=[]; for(let c=0;c<=24;c++) amp[c]=(rng()-.5);
      // vertical lines converge
      for(let c=-12;c<=12;c++){
        const x0=w/2+c*(w/8);
        ctx.beginPath(); ctx.moveTo(w/2+c*4,hor); ctx.lineTo(x0,h); ctx.stroke();
      }
      // horizontal rows below horizon
      for(let r=0;r<rows;r++){
        const t=r/rows; const y=hor+t*t*(h-hor);
        ctx.beginPath();
        for(let x=0;x<=w;x+=w/24){
          const c=Math.floor(x/(w/24));
          const yy=y - amp[c]*(t*40)*(w/300);
          x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);
        }
        ctx.globalAlpha=.2+t*.6; ctx.stroke(); ctx.globalAlpha=1;
      }
      ctx.shadowBlur=0;
    },
    /* fluid ink */
    ink(ctx,w,h,p,rng){
      const blobs=5+Math.floor(rng()*4);
      ctx.globalCompositeOperation='lighter';
      for(let b=0;b<blobs;b++){
        const cx=rng()*w, cy=rng()*h, r=w*(.18+rng()*.3);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
        const l=40+rng()*30;
        g.addColorStop(0,`hsla(${p.accent+ (rng()*30-15)} 85% ${l}% / .5)`);
        g.addColorStop(.6,`hsla(${p.base} 70% 30% / .25)`);
        g.addColorStop(1,'transparent');
        ctx.fillStyle=g;
        ctx.beginPath();
        const lobes=6+Math.floor(rng()*5);
        for(let i=0;i<=lobes;i++){
          const a=i/lobes*Math.PI*2; const rr=r*(.6+rng()*.6);
          const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr;
          i===0?ctx.moveTo(x,y):ctx.quadraticCurveTo(cx,cy,x,y);
        }
        ctx.fill();
      }
      ctx.globalCompositeOperation='source-over';
    },
    /* particle starburst */
    particles(ctx,w,h,p,rng){
      const cx=w*(.35+rng()*.3), cy=h*(.35+rng()*.3);
      const n=320;
      ctx.globalCompositeOperation='lighter';
      for(let i=0;i<n;i++){
        const a=rng()*Math.PI*2; const d=Math.pow(rng(),.6)*Math.max(w,h)*.6;
        const x=cx+Math.cos(a)*d, y=cy+Math.sin(a)*d*.95;
        const s=rng()*rng()*(w/120);
        const l=50+rng()*40;
        ctx.fillStyle=`hsla(${p.accent} 95% ${l}% / ${.3+rng()*.6})`;
        if(rng()<.08){ ctx.shadowColor=p.ac2; ctx.shadowBlur=w/30; } else ctx.shadowBlur=0;
        ctx.beginPath(); ctx.arc(x,y,Math.max(.4,s),0,7); ctx.fill();
      }
      // a couple streaks
      for(let i=0;i<6;i++){
        const a=rng()*Math.PI*2, d=Math.max(w,h)*.5;
        ctx.strokeStyle=`hsla(${p.accent} 90% 70% / .25)`; ctx.lineWidth=w/300;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*d,cy+Math.sin(a)*d); ctx.stroke();
      }
      ctx.shadowBlur=0; ctx.globalCompositeOperation='source-over';
    },
    /* scanline / spectrum bands */
    scan(ctx,w,h,p,rng){
      const bands=46;
      for(let i=0;i<bands;i++){
        const y=i/bands*h; const bh=h/bands;
        const v=Math.abs(Math.sin(i*.5+rng()*6))*Math.pow(rng(),2);
        ctx.fillStyle=`hsla(${p.accent} ${50+v*45}% ${12+v*55}% / ${.25+v*.6})`;
        const bw=w*(.2+v*.8);
        ctx.fillRect(0,y,bw,bh*.7);
      }
      // bright meter line
      ctx.strokeStyle=p.ac2; ctx.shadowColor=p.ac; ctx.shadowBlur=w/30; ctx.lineWidth=w/200;
      ctx.beginPath();
      for(let x=0;x<=w;x+=w/40){ const yy=h*.5+Math.sin(x*.04+rng()*4)*h*.28*rng(); x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy); }
      ctx.stroke(); ctx.shadowBlur=0;
    }
  };

  window.THR.drawArt=function(canvas,seed,style){
    const dpr=Math.min(2,window.devicePixelRatio||1);
    const rect=canvas.getBoundingClientRect();
    const w=Math.max(2,Math.round((rect.width||canvas.width||300)));
    const h=Math.max(2,Math.round((rect.height||canvas.height||300)));
    canvas.width=w*dpr; canvas.height=h*dpr;
    const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);
    const rng=mulberry32((seed||1)*2654435761>>>0);
    const p=pal(rng);
    bg(ctx,w,h,p,rng);
    (styles[style]||styles.warp)(ctx,w,h,p,rng);
    grain(ctx,w,h,0.04);
    vignette(ctx,w,h);
    // subtle outer frame
    ctx.strokeStyle='rgba(150,190,255,.08)'; ctx.lineWidth=1; ctx.strokeRect(.5,.5,w-1,h-1);
  };
})();
