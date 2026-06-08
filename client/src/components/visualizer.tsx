import { useEffect, useRef } from "react";

export function Visualizer({ isActive = false }: { isActive?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let alive = true;
    const dpr = Math.min(1.6, window.devicePixelRatio || 1);
    const binCount = 96;
    const smooth = new Float32Array(binCount);
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
    }));
    let rotation = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = cv.parentElement;
      if (!parent) return;
      const bounds = parent.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      cv.width = width * dpr;
      cv.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (cv.parentElement) observer.observe(cv.parentElement);

    const synth = (bins: Float32Array) => {
      const t = performance.now() / 1000;
      const beat = (t * (124 / 60)) % 1;
      const kickEnvelope = Math.pow(1 - beat, 2.4);
      const activity = isActive ? 1 : 0.18;

      for (let i = 0; i < bins.length; i += 1) {
        const freq = i / bins.length;
        let value = Math.exp(-freq * 2.3) * (0.12 + 0.88 * kickEnvelope * activity);
        value += 0.18 * Math.exp(-Math.pow((freq - 0.32) / 0.12, 2)) * (0.15 + 0.85 * Math.sin(t * 3 + freq * 20) ** 2) * activity;
        value += 0.14 * freq * (0.2 + 0.8 * Math.abs(Math.sin(t * 7 + i))) * activity;
        value *= 0.82 + (0.18 + 0.22 * Math.sin(t * 0.6 + freq * 4)) * activity;
        const idleFloor = 0.018 * Math.exp(-freq * 3.4);
        bins[i] = Math.max(0, Math.min(1, idleFloor + value * (0.82 + 0.18 * Math.random())));
      }
    };

    const bins = new Float32Array(binCount);

    const frame = () => {
      if (!alive) return;

      const hue = 214;
      synth(bins);

      let energy = 0;
      for (let i = 0; i < binCount; i += 1) {
        smooth[i] += (bins[i] - smooth[i]) * (isActive ? 0.28 : 0.08);
        energy += smooth[i];
      }
      energy /= binCount;

      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height * 0.46;
      const baseRadius = Math.min(width, height) * 0.16;
      rotation += 0.0005 + energy * (isActive ? 0.01 : 0.0015);

      ctx.globalCompositeOperation = "lighter";
      for (const particle of particles) {
        particle.y -= (0.00018 + particle.z * 0.0004) * (0.5 + energy * (isActive ? 1.6 : 0.25));
        if (particle.y < 0) {
          particle.y = 1;
          particle.x = Math.random();
        }
        const px = particle.x * width;
        const py = particle.y * height;
        const radius = (0.35 + particle.z * (isActive ? 1.6 : 0.8)) * (0.6 + energy);
        ctx.fillStyle = `hsla(${hue + particle.z * 20} 90% ${54 + particle.z * 14}% / ${isActive ? 0.1 + particle.z * 0.22 : 0.035 + particle.z * 0.08})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const bars = 72;
      for (let i = 0; i < bars; i += 1) {
        const binIndex = Math.floor((i / bars) * binCount * 0.8);
        const value = smooth[binIndex];
        const angle = (i / bars) * Math.PI * 2 + rotation;
        const startRadius = baseRadius;
        const endRadius = baseRadius + value * Math.min(width, height) * (isActive ? 0.26 : 0.09) + 2;
        const x0 = centerX + Math.cos(angle) * startRadius;
        const y0 = centerY + Math.sin(angle) * startRadius;
        const x1 = centerX + Math.cos(angle) * endRadius;
        const y1 = centerY + Math.sin(angle) * endRadius;
        ctx.strokeStyle = `hsla(${hue + value * 40} 95% ${55 + value * 30}% / ${0.5 + value * 0.5})`;
        ctx.lineWidth = isActive ? 2.2 : 1.35;
        if (isActive && value > 0.55) {
          ctx.shadowColor = `hsl(${hue} 100% 65%)`;
          ctx.shadowBlur = 14;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `hsla(${hue} 90% 65% / ${isActive ? 0.25 + energy * 0.5 : 0.12 + energy * 0.16})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius - 6, 0, Math.PI * 2);
      ctx.stroke();

      const cols = Math.floor(width / 9);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < cols; i += 1) {
        const binIndex = Math.floor((i / cols) * binCount);
        const value = smooth[binIndex];
        const barHeight = value * height * (isActive ? 0.34 : 0.12);
        const x = i * 9;
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, `hsla(${hue} 90% 55% / 0.0)`);
        gradient.addColorStop(1, `hsla(${hue + value * 30} 95% ${55 + value * 25}% / ${isActive ? 0.35 + value * 0.5 : 0.08 + value * 0.14})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, 6, barHeight);
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [isActive]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}
