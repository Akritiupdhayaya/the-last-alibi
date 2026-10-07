import React from 'react';
import { CaseDefinition, ScoringResult } from '../types/case';
import { WorkspaceSection } from './TopNav';
import { soundFx } from '../services/soundFx';
import { Users, FileSearch, Clock, ShieldAlert, GitBranch, ArrowRight, Award } from 'lucide-react';

interface CaseOverviewProps {
  caseDef: CaseDefinition;
  onNavigate: (section: WorkspaceSection) => void;
  reviewedEvidenceIds: string[];
  solvedResult?: ScoringResult | null;
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({
  caseDef,
  onNavigate,
  reviewedEvidenceIds,
  solvedResult,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner / Case Title */}
      <div className="border border-white/[0.08] bg-[#101217] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
              ACTIVE INVESTIGATION DOSSIER
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[11px] font-mono-data text-[#8b877f]">
              {caseDef.locationName}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-display font-bold text-[#f4f0e6] mt-2">
            {caseDef.title}
          </h1>

          <p className="text-sm font-editorial italic text-[#b8b2a5] mt-1 max-w-2xl">
            "{caseDef.tagline}"
          </p>
        </div>

        {/* Status Callout */}
        <div className="flex flex-col sm:flex-row items-start md:items-end gap-3">
          {solvedResult ? (
            <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 text-right">
              <div className="flex items-center justify-end gap-2 text-xs font-mono-data text-emerald-400">
                <Award className="w-4 h-4" />
                <span>CASE SOLVED · {solvedResult.grade}</span>
              </div>
              <div className="text-2xl font-mono-data font-bold text-emerald-300 mt-1">
                Score: {solvedResult.totalScore}%
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                soundFx.playAccuse();
                onNavigate('solve');
              }}
              className="px-6 py-3 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/60 font-mono-data text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>SUBMIT ACCUSATION</span>
            </button>
          )}
        </div>
      </div>

      {/* Investigation Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => {
            soundFx.playPaper();
            onNavigate('suspects');
          }}
          className="p-5 bg-[#12141a] border border-white/[0.06] hover:border-[#c5a880]/40 transition-all text-left group"
        >
          <div className="flex items-center justify-between text-[#807b71] group-hover:text-[#c5a880]">
            <Users className="w-4 h-4" />
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-mono-data font-bold text-[#ede9df] mt-3">
            {caseDef.suspects.length}
          </div>
          <div className="text-[11px] font-mono-data text-[#8a8579] tracking-wider uppercase mt-0.5">
            Suspects Under Scrutiny
          </div>
        </button>

        <button
          onClick={() => {
            soundFx.playPaper();
            onNavigate('evidence');
          }}
          className="p-5 bg-[#12141a] border border-white/[0.06] hover:border-[#c5a880]/40 transition-all text-left group"
        >
          <div className="flex items-center justify-between text-[#807b71] group-hover:text-[#c5a880]">
            <FileSearch className="w-4 h-4" />
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-mono-data font-bold text-[#ede9df] mt-3">
            {reviewedEvidenceIds.length} / {caseDef.evidence.length}
          </div>
          <div className="text-[11px] font-mono-data text-[#8a8579] tracking-wider uppercase mt-0.5">
            Evidence Reviewed
          </div>
        </button>

        <button
          onClick={() => {
            soundFx.playPaper();
            onNavigate('timeline');
          }}
          className="p-5 bg-[#12141a] border border-white/[0.06] hover:border-[#c5a880]/40 transition-all text-left group"
        >
          <div className="flex items-center justify-between text-[#807b71] group-hover:text-[#c5a880]">
            <Clock className="w-4 h-4" />
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-mono-data font-bold text-[#ede9df] mt-3">
            {caseDef.timeline.length}
          </div>
          <div className="text-[11px] font-mono-data text-[#8a8579] tracking-wider uppercase mt-0.5">
            Reconstructed Events
          </div>
        </button>

        <button
          onClick={() => {
            soundFx.playPaper();
            onNavigate('board');
          }}
          className="p-5 bg-[#12141a] border border-white/[0.06] hover:border-[#c5a880]/40 transition-all text-left group"
        >
          <div className="flex items-center justify-between text-[#807b71] group-hover:text-[#c5a880]">
            <GitBranch className="w-4 h-4" />
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-mono-data font-bold text-[#ede9df] mt-3">
            INVESTIGATION
          </div>
          <div className="text-[11px] font-mono-data text-[#8a8579] tracking-wider uppercase mt-0.5">
            Evidence Board
          </div>
        </button>
      </div>

      {/* Victim & Incident Detail Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Victim Card */}
        <div className="md:col-span-1 border border-white/[0.06] bg-[#111318] p-6 space-y-4">
          <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
            THE VICTIM
          </span>

          <div>
            <h3 className="text-xl font-display font-bold text-[#f2eee4]">
              {caseDef.victim.name}
            </h3>
            <p className="text-xs font-mono-data text-[#9a9485] mt-0.5">
              Age {caseDef.victim.age} · {caseDef.victim.occupation}
            </p>
          </div>

          <div className="text-xs space-y-2 pt-2 border-t border-white/[0.06] font-sans">
            <div>
              <span className="text-[#757168] block font-mono-data text-[10px] uppercase">
                Cause of Death
              </span>
              <span className="text-[#ded9cd] font-medium">{caseDef.victim.causeOfDeath}</span>
            </div>
            <div>
              <span className="text-[#757168] block font-mono-data text-[10px] uppercase">
                Estimated Time
              </span>
              <span className="text-[#ded9cd] font-mono-data">{caseDef.victim.estimatedTimeRange}</span>
            </div>
            <div>
              <span className="text-[#757168] block font-mono-data text-[10px] uppercase">
                Location Found
              </span>
              <span className="text-[#ded9cd]">Private Study, West Wing</span>
            </div>
          </div>
        </div>

        {/* Core Investigative Task */}
        <div className="md:col-span-2 border border-white/[0.06] bg-[#111318] p-6 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
              PRIMARY DETECTIVE BRIEF
            </span>
            <h3 className="text-lg md:text-xl font-display text-[#ede8de] mt-1">
              "The 26-Minute Blackout at Blackwood Estate"
            </h3>
            <p className="text-xs md:text-sm font-sans text-[#a7a294] mt-2 leading-relaxed">
              Between 10:17 PM and 10:43 PM, the power to Blackwood Estate was abruptly cut. During this dark window, Elias Blackwood was bludgeoned to death in his study. The heavy oak door was locked with an interior latch, but the French terrace balcony door was left ajar in the rain.
            </p>
            <p className="text-xs md:text-sm font-sans text-[#a7a294] mt-2 leading-relaxed">
              Five individuals were inside the manor. Every person offered an airtight story. Your assignment is to cross-examine their claims, uncover physical contradictions, reconstruct the timeline, and determine whose alibi was impossible.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundFx.playPaper();
                onNavigate('suspects');
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono-data tracking-wider uppercase text-[#ded9cf] border border-white/10"
            >
              Examine Suspects →
            </button>
            <button
              onClick={() => {
                soundFx.playPaper();
                onNavigate('interviews');
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono-data tracking-wider uppercase text-[#ded9cf] border border-white/10"
            >
              Conduct Interviews →
            </button>
            <button
              onClick={() => {
                soundFx.playPaper();
                onNavigate('board');
              }}
              className="px-4 py-2 bg-[#c5a880]/15 hover:bg-[#c5a880]/25 text-xs font-mono-data tracking-wider uppercase text-[#c5a880] border border-[#c5a880]/40"
            >
              Open Investigation Board →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
