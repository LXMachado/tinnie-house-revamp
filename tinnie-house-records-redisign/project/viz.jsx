/* ============================================================
   TINNIE HOUSE RECORDS — audio engine + reactive visualizer
   - window.THR.audio : real WebAudio techno loop (muted by default)
     feeding an analyser; synth-spectrum fallback when idle.
   - <Visualizer/> and <Waveform/> React canvases read the spectrum.
   ============================================================ */
window.THR = window.THR || {};

/* ---------------------------------------------------------- AUDIO ENGINE */
window.THR.audio = (function(){
  let ctx=null, master=null, bus=null, analyser=null, freq=null, noiseBuf=null;
  let running=false, soundOn=false, bpm=124, step=0, nextT=0, timer=null;
  let track=null;
  const subs=new Set();
  const emit=()=>subs.forEach(f=>{try{f();}catch(e){}});

  function ensure(){
    if(ctx) return true;
    try{
      const AC=window.AudioContext||window.webkitAudioContext; ctx=new AC();
      master=ctx.createGain(); master.gain.value=0; master.connect(ctx.destination);
      bus=ctx.createGain(); bus.gain.value=0.85;
      analyser=ctx.createAnalyser(); analyser.fftSize=512; analyser.smoothingTimeConstant=0.78;
      freq=new Uint8Array(analyser.frequencyBinCount);
      bus.connect(analyser); analyser.connect(master);
      const len=Math.floor(ctx.sampleRate*0.4); noiseBuf=ctx.createBuffer(1,len,ctx.sampleRate);
      const d=noiseBuf.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
      return true;
    }catch(e){ return false; }
  }
  function env(g,t,a,d,peak){ g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+d); }

  function kick(t){
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.frequency.setValueAtTime(155,t); o.frequency.exponentialRampToValueAtTime(46,t+0.11);
    g.gain.setValueAtTime(1,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.34);
    o.connect(g).connect(bus); o.start(t); o.stop(t+0.36);
  }
  function hat(t,open){
    const s=ctx.createBufferSource(); s.buffer=noiseBuf;
    const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=7200;
    const g=ctx.createGain(); env(g,t,0.002,open?0.16:0.045,0.32);
    s.connect(hp).connect(g).connect(bus); s.start(t); s.stop(t+0.2);
  }
  function bass(t,f,dur){
    const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.value=f;
    const lp=ctx.createBiquadFilter(); lp.type='lowpass';
    lp.frequency.setValueAtTime(220,t); lp.frequency.exponentialRampToValueAtTime(900,t+0.04); lp.frequency.exponentialRampToValueAtTime(180,t+dur);
    lp.Q.value=8;
    const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.5,t+0.01); g.gain.setValueAtTime(0.5,t+dur*0.7); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.connect(lp).connect(g).connect(bus); o.start(t); o.stop(t+dur+0.02);
  }
  function stab(t){
    const freqs=[220,277,330]; const g=ctx.createGain(); env(g,t,0.01,0.5,0.16);
    const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=900; bp.Q.value=2; bp.connect(g).connect(bus);
    freqs.forEach((f,i)=>{ const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.value=f; o.detune.value=(i-1)*8; o.connect(bp); o.start(t); o.stop(t+0.55); });
  }
  function schedule(){
    if(!running) return;
    const ahead=ctx.currentTime+0.12;
    while(nextT<ahead){
      const s16=step%16, beat=Math.floor(s16/4);
      if(s16%4===0) kick(nextT);
      if(s16%2===0) hat(nextT, s16%8===4);
      const notes=[41.2,41.2,55,49,41.2,61.7,55,49]; // moody minor bass
      if(s16%2===0) bass(nextT, notes[(step>>1)%8], 60/bpm/2*0.9);
      if(s16===0 && (step/16|0)%2===1) stab(nextT);
      nextT+=60/bpm/4; step++;
    }
  }
  function startSchedulerLoop(){ if(timer) return; timer=setInterval(schedule,25); }

  return {
    subscribe(f){ subs.add(f); return ()=>subs.delete(f); },
    get state(){ return {running, soundOn, track}; },
    play(t){
      if(ensure()){ if(ctx.state==='suspended') ctx.resume(); nextT=ctx.currentTime+0.06; step=0; }
      track=t||track; running=true; startSchedulerLoop(); emit();
    },
    toggle(t){
      if(track && track.cat===(t&&t.cat) && running){ this.stop(); }
      else { this.play(t); }
    },
    stop(){ running=false; track=track; if(master&&ctx) master.gain.linearRampToValueAtTime(0,ctx.currentTime+0.05); emit(); },
    setSound(on){ soundOn=on; if(ensure()){ master.gain.linearRampToValueAtTime(on?0.5:0,ctx.currentTime+0.08);} emit(); },
    isPlaying(t){ return running && track && t && track.cat===t.cat; },
    /* normalized spectrum 0..1 into out[] */
    bins(out){
      const n=out.length;
      if(running && analyser){
        analyser.getByteFrequencyData(freq);
        const usable=Math.floor(freq.length*0.72);
        for(let i=0;i<n;i++){
          const idx=Math.floor(Math.pow(i/n,1.35)*usable);
          out[i]=Math.min(1,(freq[idx]/255)*1.15);
        }
        return out;
      }
      // synth fallback — believable idle techno spectrum
      const t=performance.now()/1000, beat=(t*(bpm/60))%1;
      const kickEnv=Math.pow(1-beat,2.4);
      for(let i=0;i<n;i++){
        const f=i/n;
        let v=Math.exp(-f*2.3)*(0.45+0.55*kickEnv);          // bass-heavy + kick
        v+=0.18*Math.exp(-Math.pow((f-0.32)/0.12,2))*(0.5+0.5*Math.sin(t*3+f*20)); // mid resonance
        v+=0.14*f*(0.4+0.6*Math.abs(Math.sin(t*7+i)));        // shimmering highs
        v*=0.6+0.4*Math.sin(t*0.6+f*4);
        out[i]=Math.max(0,Math.min(1,v*(0.7+0.3*Math.random())));
      }
      return out;
    },
    level(){ const a=new Float32Array(24); this.bins(a); let s=0; for(let i=0;i<a.length;i++) s+=a[i]; return s/a.length; }
  };
})();

/* ---------------------------------------------------------- VISUALIZER (React) */
(function(){
  const {useRef,useEffect}=React;

  function hue(){ const v=getComputedStyle(document.documentElement).getPropertyValue('--viz-hue'); return v?parseFloat(v):214; }

  window.Visualizer=function Visualizer({mode='radial',intensity=1}){
    const ref=useRef(null);
    useEffect(()=>{
      const cv=ref.current, ctx=cv.getContext('2d'); let raf, alive=true;
      const dpr=Math.min(1.6,window.devicePixelRatio||1);
      let W=0,H=0;
      const N=96; const bins=new Float32Array(N); const smooth=new Float32Array(N);
      const parts=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),z:Math.random(),s:Math.random()}));
      function size(){ const r=cv.parentElement.getBoundingClientRect(); W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
      size(); const ro=new ResizeObserver(size); ro.observe(cv.parentElement);
      let rot=0;
      function frame(){
        if(!alive) return;
        const hh=hue();
        THR.audio.bins(bins);
        let energy=0; for(let i=0;i<N;i++){ smooth[i]+=(bins[i]-smooth[i])*0.28; energy+=smooth[i]; } energy/=N;
        ctx.clearRect(0,0,W,H);
        const cx=W/2, cy=H*0.46, baseR=Math.min(W,H)*0.16;
        rot+=0.0018+energy*0.01;

        /* particle field */
        ctx.globalCompositeOperation='lighter';
        for(const p of parts){
          p.y-=(0.0006+p.z*0.0016)*(0.5+energy*1.6); if(p.y<0){p.y=1;p.x=Math.random();}
          const px=p.x*W, py=p.y*H, r=(0.4+p.z*1.6)*(1+energy);
          ctx.fillStyle=`hsla(${hh+p.z*20} 90% ${60+p.z*20}% / ${0.10+p.z*0.22})`;
          ctx.beginPath(); ctx.arc(px,py,r,0,7); ctx.fill();
        }

        if(mode==='radial'||mode==='tunnel'){
          /* radial spectrum bars (mirrored) */
          const bars=72;
          for(let i=0;i<bars;i++){
            const bi=Math.floor(i/bars*N*0.8);
            const v=smooth[bi]*intensity;
            const a=i/bars*Math.PI*2+rot;
            const r0=baseR, r1=baseR+v*Math.min(W,H)*0.26+4;
            const x0=cx+Math.cos(a)*r0, y0=cy+Math.sin(a)*r0;
            const x1=cx+Math.cos(a)*r1, y1=cy+Math.sin(a)*r1;
            ctx.strokeStyle=`hsla(${hh+v*40} 95% ${55+v*30}% / ${0.5+v*0.5})`;
            ctx.lineWidth=2.2;
            if(v>0.55){ctx.shadowColor=`hsl(${hh} 100% 65%)`;ctx.shadowBlur=14;}else ctx.shadowBlur=0;
            ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
          }
          ctx.shadowBlur=0;
          /* inner ring */
          ctx.strokeStyle=`hsla(${hh} 90% 65% / ${0.25+energy*0.5})`; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.arc(cx,cy,baseR-6,0,7); ctx.stroke();
          if(mode==='tunnel'){
            for(let k=1;k<=6;k++){ const rr=baseR+k*Math.min(W,H)*0.07*(1+energy*0.6); ctx.strokeStyle=`hsla(${hh} 80% 60% / ${0.16/k})`; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(cx,cy,rr,0,7); ctx.stroke(); }
          }
        }

        if(mode==='bars'||mode==='radial'){
          /* bottom skyline equalizer */
          const cols=Math.floor(W/9);
          const baseY=H;
          for(let i=0;i<cols;i++){
            const bi=Math.floor(i/cols*N);
            const v=smooth[bi]*intensity;
            const h=v*H*0.34;
            const x=i*9;
            const g=ctx.createLinearGradient(0,baseY,0,baseY-h);
            g.addColorStop(0,`hsla(${hh} 90% 55% / 0.0)`);
            g.addColorStop(1,`hsla(${hh+v*30} 95% ${55+v*25}% / ${0.35+v*0.5})`);
            ctx.fillStyle=g; ctx.fillRect(x,baseY-h,6,h);
          }
        }
        ctx.globalCompositeOperation='source-over';
        raf=requestAnimationFrame(frame);
      }
      frame();
      return ()=>{ alive=false; cancelAnimationFrame(raf); ro.disconnect(); };
    },[mode,intensity]);
    return React.createElement('canvas',{ref, style:{width:'100%',height:'100%',display:'block'}});
  };

  /* mini waveform for the player bar */
  window.Waveform=function Waveform(){
    const ref=useRef(null);
    useEffect(()=>{
      const cv=ref.current, ctx=cv.getContext('2d'); let raf,alive=true;
      const dpr=Math.min(2,window.devicePixelRatio||1);
      const N=64, bins=new Float32Array(N), sm=new Float32Array(N);
      function size(){ const r=cv.getBoundingClientRect(); cv.width=r.width*dpr; cv.height=r.height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); return r; }
      let r=size(); const ro=new ResizeObserver(()=>{r=size();}); ro.observe(cv);
      function frame(){
        if(!alive) return;
        const hh=hue(); THR.audio.bins(bins);
        const W=r.width,H=r.height; ctx.clearRect(0,0,W,H);
        const bw=W/N;
        for(let i=0;i<N;i++){ sm[i]+=(bins[i]-sm[i])*0.3; const v=sm[i]; const h=Math.max(2,v*H*0.92); ctx.fillStyle=`hsla(${hh+v*30} 95% ${55+v*25}% / ${0.4+v*0.5})`; ctx.fillRect(i*bw, (H-h)/2, bw*0.6, h); }
        raf=requestAnimationFrame(frame);
      }
      frame();
      return ()=>{alive=false;cancelAnimationFrame(raf);ro.disconnect();};
    },[]);
    return React.createElement('canvas',{ref,style:{width:'100%',height:'100%',display:'block'}});
  };
})();
