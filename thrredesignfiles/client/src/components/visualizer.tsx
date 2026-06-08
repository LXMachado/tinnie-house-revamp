import { useRef, useEffect } from "react";

export function Visualizer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    let raf: number;
    let alive = true;
    const dpr = Math.min(1.6, window.devicePixelRatio || 1);
    const N = 96;
    const smooth = new Float32Array(N);
    const parts = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(), s: Math.random()
    }));
    let rot = 0;

    let W = 0, H = 0;
    function size() {
      const parent = cv!.parentElement!;
      const r = parent.getBoundingClientRect();
      W = r.width; H = r.height;
      cv!.width = W * dpr; cv!.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv.parentElement!);

    function synth(bins: Float32Array) {
      const t = performance.now() / 1000;
      const bpm = 124;
      const beat = (t * (bpm / 60)) % 1;
      const kickEnv = Math.pow(1 - beat, 2.4);
      for (let i = 0; i < bins.length; i++) {
        const f = i / bins.length;
        let v = Math.exp(-f * 2.3) * (0.45 + 0.55 * kickEnv);
        v += 0.18 * Math.exp(-Math.pow((f - 0.32) / 0.12, 2)) * (0.5 + 0.5 * Math.sin(t * 3 + f * 20));
        v += 0.14 * f * (0.4 + 0.6 * Math.abs(Math.sin(t * 7 + i)));
        v *= 0.6 + 0.4 * Math.sin(t * 0.6 + f * 4);
        bins[i] = Math.max(0, Math.min(1, v * (0.7 + 0.3 * Math.random())));
      }
    }

    const bins = new Float32Array(N);

    function frame() {
      if (!alive) return;
      const hh = 214; // electric blue hue
      synth(bins);
      let energy = 0;
      for (let i = 0; i < N; i++) { smooth[i] += (bins[i] - smooth[i]) * 0.28; energy += smooth[i]; }
      energy /= N;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.46;
      const baseR = Math.min(W, H) * 0.16;
      rot += 0.0018 + energy * 0.01;

      // particle field
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.y -= (0.0006 + p.z * 0.0016) * (0.5 + energy * 1.6);
        if (p.y < 0) { p.y = 1; p.x = Math.random(); }
        const px = p.x * W, py = p.y * H;
        const r = (0.4 + p.z * 1.6) * (1 + energy);
        ctx.fillStyle = `hsla(${hh + p.z * 20} 90% ${60 + p.z * 20}% / ${0.10 + p.z * 0.22})`;
        ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
      }

      // radial spectrum
      const bars = 72;
      for (let i = 0; i < bars; i++) {
        const bi = Math.floor(i / bars * N * 0.8);
        const v = smooth[bi];
        const a = i / bars * Math.PI * 2 + rot;
        const r0 = baseR, r1 = baseR + v * Math.min(W, H) * 0.26 + 4;
        const x0 = cx + Math.cos(a) * r0, y0 = cy + Math.sin(a) * r0;
        const x1 = cx + Math.cos(a) * r1, y1 = cy + Math.sin(a) * r1;
        ctx.strokeStyle = `hsla(${hh + v * 40} 95% ${55 + v * 30}% / ${0.5 + v * 0.5})`;
        ctx.lineWidth = 2.2;
        if (v > 0.55) { ctx.shadowColor = `hsl(${hh} 100% 65%)`; ctx.shadowBlur = 14; } else ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // inner ring
      ctx.strokeStyle = `hsla(${hh} 90% 65% / ${0.25 + energy * 0.5})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, baseR - 6, 0, 7); ctx.stroke();

      // bottom bars
      const cols = Math.floor(W / 9);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < cols; i++) {
        const bi = Math.floor(i / cols * N);
        const v = smooth[bi];
        const h = v * H * 0.34;
        const x = i * 9;
        const g = ctx.createLinearGradient(0, H, 0, H - h);
        g.addColorStop(0, `hsla(${hh} 90% 55% / 0.0)`);
        g.addColorStop(1, `hsla(${hh + v * 30} 95% ${55 + v * 25}% / ${0.35 + v * 0.5})`);
        ctx.fillStyle = g; ctx.fillRect(x, H - h, 6, h);
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    }
    frame();
    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}
