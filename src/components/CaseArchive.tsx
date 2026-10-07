import React from 'react';
import { CaseDefinition, ScoringResult } from '../types/case';
import { soundFx } from '../services/soundFx';
import { Lock, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface CaseArchiveProps {
  cases: CaseDefinition[];
  solvedCaseIds: string[];
  caseScores: Record<string, ScoringResult>;
  onSelectCase: (caseItem: CaseDefinition) => void;
  onOpenTutorial: () => void;
  onBackToTitle: () => void;
}

export const CaseArchive: React.FC<CaseArchiveProps> = ({
  cases,
  solvedCaseIds,
  caseScores,
  onSelectCase,
  onOpenTutorial,
  onBackToTitle,
}) => {
  const renderStars = (diff: string) => {
    const count = parseInt(diff, 10) || 1;
    return (
      <span className="text-[#c5a880] tracking-widest text-xs">
        {'★'.repeat(count)}
        {'☆'.repeat(5 - count)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-[#e2ded6] flex flex-col justify-between selection:bg-[#c5a880]/30 selection:text-white">
      {/* Top Header */}
      <header className="px-6 md:px-12 py-6 border-b border-white/[0.06] flex items-center justify-between">
        <button
          onClick={() => {
            soundFx.playPaper();
            onBackToTitle();
          }}
          className="text-xs font-mono-data tracking-widest text-[#8a857b] hover:text-[#f2eee6] transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>MAIN ENTRANCE</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundFx.playPaper();
              onOpenTutorial();
            }}
            className="text-xs font-mono-data tracking-wider uppercase text-[#c5a880] hover:text-[#e4c8a2] transition-colors px-3 py-1.5 border border-[#c5a880]/30 hover:border-[#c5a880]"
          >
            HOW TO PLAY
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-6xl mx-auto w-full px-6 md:px-12 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono-data tracking-[0.3em] uppercase text-[#c5a880]">
              CLASSIFIED REGISTRY
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[11px] font-mono-data tracking-widest text-[#858076]">
              SOLO DETECTIVE RECORDS
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-[#f4efe6] mt-2">
            CASE ARCHIVE
          </h1>

          <p className="text-base md:text-lg font-editorial italic text-[#aba495] mt-2">
            "Select an investigation."
          </p>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => {
            const isSolved = solvedCaseIds.includes(caseItem.id);
            const scoreObj = caseScores[caseItem.id];
            const isLocked = caseItem.status === 'LOCKED' && !isSolved;

            return (
              <div
                key={caseItem.id}
                className={`group relative flex flex-col justify-between border transition-all duration-300 ${
                  isSolved
                    ? 'bg-[#111317] border-[#364230]'
                    : isLocked
                    ? 'bg-[#0e0f13]/60 border-white/[0.04] opacity-75'
                    : 'bg-[#111318] border-white/10 hover:border-[#c5a880]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Top Media Cover or Locked Preview */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#16181f]">
                  {caseItem.coverImage ? (
                    <img
                      src={caseItem.coverImage}
                      alt={caseItem.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isLocked
                          ? 'filter blur-sm brightness-40 scale-105'
                          : 'group-hover:scale-105 filter brightness-85'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#12141a] to-[#0a0b0e]">
                      <span className="font-mono-data text-xs tracking-widest text-[#444a57]">
                        [SEALED MEDIA]
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono-data text-[11px] tracking-widest text-white/90 bg-black/70 px-2 py-0.5">
                      {caseItem.caseNumber}
                    </span>

                    {isSolved ? (
                      <span className="flex items-center gap-1.5 font-mono-data text-[11px] tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        CASE SOLVED
                      </span>
                    ) : isLocked ? (
                      <span className="flex items-center gap-1.5 font-mono-data text-[11px] tracking-wider text-[#7e828d] bg-black/80 px-2 py-0.5">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    ) : (
                      <span className="font-mono-data text-[11px] tracking-wider text-[#c5a880] bg-black/80 px-2 py-0.5 border border-[#c5a880]/40">
                        AVAILABLE
                      </span>
                    )}
                  </div>
                </div>

                {/* Case Info Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono-data tracking-widest text-[#a39c8e] uppercase">
                      {caseItem.subtitle}
                    </div>

                    <h2 className="text-xl md:text-2xl font-display font-bold text-[#f5f1e8] mt-1 group-hover:text-[#c5a880] transition-colors">
                      {caseItem.title}
                    </h2>

                    <p className="text-xs md:text-sm font-editorial italic text-[#c2bcad] mt-2 line-clamp-2">
                      "{caseItem.tagline}"
                    </p>

                    <p className="text-xs text-[#78756d] font-sans mt-3 line-clamp-3 leading-relaxed">
                      {caseItem.description}
                    </p>
                  </div>

                  {/* Metadata & Status */}
                  <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono-data text-[#8a8579]">
                      <span>DIFFICULTY</span>
                      <span>{renderStars(caseItem.difficulty)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono-data text-[#8a8579]">
                      <span>ESTIMATED TIME</span>
                      <span className="text-[#d8d3c7]">{caseItem.estimatedTime}</span>
                    </div>

                    {isSolved && scoreObj && (
                      <div className="flex items-center justify-between text-xs font-mono-data bg-emerald-950/30 border border-emerald-900/40 p-2">
                        <span className="flex items-center gap-1.5 text-emerald-300">
                          <Award className="w-3.5 h-3.5" />
                          DETECTIVE SCORE
                        </span>
                        <span className="text-emerald-300 font-bold">
                          {scoreObj.totalScore}% · {scoreObj.grade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-6 pt-0">
                  {isLocked ? (
                    <button
                      disabled
                      className="w-full py-3 bg-[#16181f] text-[#555a66] font-mono-data text-xs tracking-widest uppercase flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      LOCKED
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playPaper();
                        onSelectCase(caseItem);
                      }}
                      className={`w-full py-3 font-mono-data text-xs tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 transition-all ${
                        isSolved
                          ? 'bg-[#1e241c] hover:bg-[#273224] text-emerald-200 border border-emerald-700/50'
                          : 'bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f]'
                      }`}
                    >
                      <span>{isSolved ? 'REOPEN CASE' : 'OPEN CASE'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-data text-[#62605b]">
        <span>THE LAST ALIBI ENGINE · V1.0</span>
        <span>CASES ARE INDEPENDENT INVESTIGATIONS</span>
      </footer>
    </div>
  );
};
