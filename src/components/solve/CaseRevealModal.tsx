import React, { useState } from 'react';
import { CaseDefinition, ScoringResult } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { Award, CheckCircle2, ChevronRight, Lock, Unlock, ArrowRight } from 'lucide-react';
import emptyRoomImg from '../../assets/images/empty_room_case2_1791389839753.jpg';

interface CaseRevealModalProps {
  caseDef: CaseDefinition;
  scoringResult: ScoringResult;
  onOpenNextCase: () => void;
  onReturnToArchive: () => void;
}

export const CaseRevealModal: React.FC<CaseRevealModalProps> = ({
  caseDef,
  scoringResult,
  onOpenNextCase,
  onReturnToArchive,
}) => {
  const [activeTab, setActiveTab] = useState<'SCORE' | 'TRUTH' | 'UNLOCK'>('SCORE');
  const { solution } = caseDef;

  const handleNextTab = () => {
    soundFx.playPaper();
    if (activeTab === 'SCORE') setActiveTab('TRUTH');
    else if (activeTab === 'TRUTH') setActiveTab('UNLOCK');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#0f1116] border border-[#2e323e] my-8 p-6 md:p-10 shadow-2xl">
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c5a880] to-transparent" />

        {/* Tab Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
              CASE ANALYSIS COMPLETE · {caseDef.caseNumber}
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-0.5">
              {activeTab === 'SCORE' && 'YOUR DETECTIVE EVALUATION'}
              {activeTab === 'TRUTH' && 'THE TRUTH BEHIND THE CRIME'}
              {activeTab === 'UNLOCK' && 'NEW INVESTIGATION UNLOCKED'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {(['SCORE', 'TRUTH', 'UNLOCK'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundFx.playPaper();
                  setActiveTab(tab);
                }}
                className={`px-3 py-1 text-xs font-mono-data tracking-wider uppercase transition-colors ${
                  activeTab === tab
                    ? 'bg-[#c5a880] text-[#0a0c0f] font-bold'
                    : 'bg-white/5 text-[#888377] hover:text-[#ded9cd]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: DETECTIVE SCORE */}
        {activeTab === 'SCORE' && (
          <div className="py-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-[#14161f] border border-white/[0.06] gap-6">
              <div className="text-center md:text-left">
                <span className="text-xs font-mono-data text-[#888377] tracking-widest uppercase block">
                  DETECTIVE RANK CONFERRED
                </span>
                <div className="text-2xl md:text-3xl font-display font-black text-[#c5a880] mt-1">
                  {scoringResult.grade}
                </div>
                <p className="text-xs text-[#a9a396] mt-1">
                  Based on forensic alignment, timeline precision, and alibi deconstruction.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-5xl md:text-6xl font-mono-data font-bold text-[#f5f1e8]">
                  {scoringResult.totalScore}%
                </div>
              </div>
            </div>

            {/* Score Breakdown List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-data">
              <div className="p-4 bg-black/40 border border-white/[0.04] flex items-center justify-between">
                <span>PERPETRATOR (40 PTS)</span>
                <span className={scoringResult.isCorrectKiller ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {scoringResult.breakdown.killerPoints} / 40
                </span>
              </div>

              <div className="p-4 bg-black/40 border border-white/[0.04] flex items-center justify-between">
                <span>PRIMARY MOTIVE (15 PTS)</span>
                <span className={scoringResult.isCorrectMotive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {scoringResult.breakdown.motivePoints} / 15
                </span>
              </div>

              <div className="p-4 bg-black/40 border border-white/[0.04] flex items-center justify-between">
                <span>MURDER WEAPON (15 PTS)</span>
                <span className={scoringResult.isCorrectWeapon ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {scoringResult.breakdown.weaponPoints} / 15
                </span>
              </div>

              <div className="p-4 bg-black/40 border border-white/[0.04] flex items-center justify-between">
                <span>TIME OF MURDER (10 PTS)</span>
                <span className={scoringResult.isCorrectTime ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {scoringResult.breakdown.timePoints} / 10
                </span>
              </div>

              <div className="p-4 bg-black/40 border border-white/[0.04] flex items-center justify-between">
                <span>ALIBI DECONSTRUCTION (10 PTS)</span>
                <span className={scoringResult.isCorrectAlibiBreakdown ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {scoringResult.breakdown.alibiPoints} / 10
                </span>
              </div>

              <div className="p-4 bg-black/40 border border-white/[0.04] flex items-center justify-between">
                <span>SUPPORTING EVIDENCE (10 PTS)</span>
                <span className="text-[#c5a880] font-bold">
                  {scoringResult.breakdown.evidencePoints} / 10
                </span>
              </div>
            </div>

            {/* Evaluator Feedback */}
            <div className="p-4 bg-[#14161f] border border-white/[0.06] space-y-1.5">
              <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
                INSPECTOR GENERAL ASSESSMENT
              </span>
              {scoringResult.feedback.map((msg, idx) => (
                <div key={idx} className="text-xs text-[#cfc9be] flex items-center gap-2">
                  <span className="text-[#c5a880]">·</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextTab}
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
              >
                <span>REVEAL THE TRUTH</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: THE TRUTH */}
        {activeTab === 'TRUTH' && (
          <div className="py-8 space-y-6 max-h-[60vh] overflow-y-auto pr-2 animate-fade-in">
            <div className="p-4 bg-red-950/20 border-l-2 border-red-500">
              <span className="text-[11px] font-mono-data text-red-400 uppercase tracking-widest block">
                THE KILLER
              </span>
              <h3 className="text-2xl font-display font-bold text-[#f5f1e8] mt-0.5">
                {solution.killerName}
              </h3>
            </div>

            <div>
              <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
                THE MOTIVE
              </span>
              <p className="text-sm font-sans text-[#ded9cd] mt-1 leading-relaxed">
                {solution.motive}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
                THE METHOD & WEAPON
              </span>
              <p className="text-sm font-sans text-[#ded9cd] mt-1 leading-relaxed">
                {solution.weapon}. Clara struck Elias from behind while he was seated at his study desk.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
                THE TIMELINE RECONSTRUCTION
              </span>
              <p className="text-sm font-sans text-[#ded9cd] mt-1 leading-relaxed">
                The fatal strike occurred at exactly 10:22 PM during the 26-minute blackout, arresting the pendulum mantle clock.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
                THE FALSE ALIBI COLLAPSE
              </span>
              <p className="text-sm font-sans text-[#ded9cd] mt-1 leading-relaxed">
                {solution.alibiBreakdown}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
                THE RESOLUTION OF RED HERRINGS
              </span>
              <div className="mt-2 space-y-2">
                {solution.redHerringsExplained.map((rh, idx) => (
                  <div key={idx} className="p-2.5 bg-black/40 border border-white/[0.04] text-xs text-[#b8b3a7]">
                    · {rh}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNextTab}
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
              >
                <span>PROCEED TO NEXT CASE</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: UNLOCK NEXT CASE */}
        {activeTab === 'UNLOCK' && (
          <div className="py-8 space-y-8 animate-fade-in">
            <div className="p-6 bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-mono-data text-emerald-400 tracking-widest uppercase block">
                    CASE 001 · THE LAST ALIBI
                  </span>
                  <div className="text-lg font-display font-bold text-emerald-200">
                    CASE SOLVED · ACCUSATION RECORDED
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono-data text-[#888377] block">FINAL SCORE</span>
                <span className="text-xl font-mono-data font-bold text-emerald-300">
                  {scoringResult.totalScore}%
                </span>
              </div>
            </div>

            {/* Unlocked Case Preview Card */}
            <div className="border border-white/10 bg-[#12141c] p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-56 aspect-[16/10] bg-black overflow-hidden shrink-0 border border-white/10">
                <img
                  src={emptyRoomImg}
                  alt="Case 002 Preview"
                  className="w-full h-full object-cover filter brightness-80"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-data text-[#c5a880]">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>NEW CASE UNLOCKED</span>
                </div>

                <h3 className="text-2xl font-display font-bold text-[#f5f1e8]">
                  CASE 002 — THE EMPTY ROOM
                </h3>

                <p className="text-xs font-editorial italic text-[#bdb6a8]">
                  "Some rooms are empty for a reason."
                </p>

                <p className="text-xs font-sans text-[#8f8a7e] leading-relaxed">
                  Julian Carlisle, precious gem merchant, found dead in a sealed subterranean bank viewing vault with eighty million in diamonds untouched.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  soundFx.playPaper();
                  onReturnToArchive();
                }}
                className="w-full sm:w-auto px-6 py-3 border border-white/10 hover:border-white/20 text-xs font-mono-data tracking-wider uppercase text-[#a9a396] hover:text-[#ede9df]"
              >
                RETURN TO CASE ARCHIVE
              </button>

              <button
                onClick={() => {
                  soundFx.playAccuse();
                  onOpenNextCase();
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2"
              >
                <span>OPEN CASE 002</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
