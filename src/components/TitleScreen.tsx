import React, { useEffect, useRef } from 'react';
import { soundFx } from '../services/soundFx';
import mansionImg from '../assets/images/mansion_silhouette_1791389801256.jpg';

interface TitleScreenProps {
  onEnterArchive: () => void;
  onOpenTutorial: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onEnterArchive,
  onOpenTutorial,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rain particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const dropsCount = 120;
    const drops = Array.from({ length: dropsCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 4 + Math.random() * 7,
      length: 12 + Math.random() * 22,
      opacity: 0.15 + Math.random() * 0.25,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(210, 220, 235, 0.4)';
      ctx.lineWidth = 1;

      for (const drop of drops) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(200, 215, 230, ${drop.opacity})`;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= 0.6; // slight wind slant
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * (width + 100);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleEnter = () => {
    soundFx.playAccuse();
    onEnterArchive();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07080a] flex flex-col justify-between overflow-hidden select-none">
      {/* Background Mansion Image with Dark Noir Grading */}
      <div className="absolute inset-0 z-0">
        <img
          src={mansionImg}
          alt="Blackwood Estate Silhouette in Rain"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-[10000ms] ease-out motion-safe:scale-100 filter brightness-60 contrast-125 saturate-50"
          referrerPolicy="no-referrer"
        />
        {/* Layered cinematic vignette and darkness */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/70 to-[#07080a]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#07080a_85%)]" />
      </div>

      {/* Atmospheric Canvas Rain */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Top Classified Header */}
      <header className="relative z-20 px-8 py-8 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse" />
          <span className="text-[11px] font-mono-data tracking-[0.3em] uppercase text-[#a39e93]">
            ARCHIVAL CRIMINAL DOSSIER · SECURE REPOSITORY
          </span>
        </div>

        <button
          onClick={() => {
            soundFx.playPaper();
            onOpenTutorial();
          }}
          className="text-xs font-mono-data tracking-widest text-[#a8a192] hover:text-[#e8e2d5] transition-colors py-1 px-3 border border-white/10 hover:border-[#c5a880]/50"
        >
          HOW TO PLAY
        </button>
      </header>

      {/* Main Title Center Block */}
      <main className="relative z-20 max-w-4xl mx-auto px-6 text-center my-auto py-12 flex flex-col items-center">
        <div className="mb-4">
          <span className="inline-block text-xs md:text-sm font-mono-data tracking-[0.4em] uppercase text-[#c5a880] pb-2">
            CASE ARCHIVE
          </span>
          <div className="w-12 h-px bg-[#c5a880]/50 mx-auto" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-wider text-[#f5f1e8] uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
          THE LAST ALIBI
        </h1>

        <p className="mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl font-editorial italic text-[#beb7a9] tracking-wide max-w-xl mx-auto">
          "An interactive murder mystery."
        </p>

        <p className="mt-4 text-xs md:text-sm font-sans text-[#7a7770] max-w-md mx-auto leading-relaxed">
          Examine physical forensic evidence. Interrogate suspects. Uncover contradictions. Reconstruct the fatal timeline before submitting your formal accusation.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleEnter}
            className="group relative px-8 py-4 bg-[#c5a880] text-[#090b0e] font-mono-data font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#d8be99] hover:shadow-[0_0_30px_rgba(197,168,128,0.3)] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-3">
              ENTER CASE ARCHIVE
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </button>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-20 px-8 py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-data text-[#5c5b57]">
        <div className="flex items-center gap-4">
          <span>DEPT. OF FORENSIC RECONSTRUCTION</span>
          <span aria-hidden="true">·</span>
          <span>SOLO INVESTIGATION</span>
        </div>
        <div className="text-[11px] tracking-widest text-[#78746c]">
          NO COMPASSION · NO REDEMPTION · ONLY EVIDENCE
        </div>
      </footer>
    </div>
  );
};
