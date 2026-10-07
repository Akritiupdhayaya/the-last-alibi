import React from 'react';
import { CaseDefinition } from '../types/case';
import { soundFx } from '../services/soundFx';
import { ChevronRight, ArrowLeft, ShieldAlert, Clock, Users, MapPin } from 'lucide-react';

interface CaseBriefingProps {
  caseDef: CaseDefinition;
  onBeginCase: () => void;
  onOpenTutorial: () => void;
  onBackToArchive: () => void;
}

export const CaseBriefing: React.FC<CaseBriefingProps> = ({
  caseDef,
  onBeginCase,
  onOpenTutorial,
  onBackToArchive,
}) => {
  return (
    <div className="relative min-h-screen bg-[#07080a] text-[#ded9d0] flex flex-col justify-between selection:bg-[#c5a880]/30 selection:text-white overflow-hidden">
      {/* Background Image with Cinematic Scrim */}
      {caseDef.coverImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={caseDef.coverImage}
            alt={caseDef.title}
            className="w-full h-full object-cover object-center opacity-30 filter brightness-50 contrast-125 saturate-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/85 to-[#07080a]/90" />
        </div>
      )}

      {/* Top Header */}
      <header className="relative z-10 px-6 md:px-12 py-6 border-b border-white/[0.06] flex items-center justify-between">
        <button
          onClick={() => {
            soundFx.playPaper();
            onBackToArchive();
          }}
          className="text-xs font-mono-data tracking-widest text-[#8a857b] hover:text-[#f4efe6] transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>CASE ARCHIVE</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundFx.playPaper();
              onOpenTutorial();
            }}
            className="text-xs font-mono-data tracking-wider uppercase text-[#c5a880] hover:text-[#ecd0a9] transition-colors px-3 py-1.5 border border-[#c5a880]/30 hover:border-[#c5a880]"
          >
            HOW TO PLAY
          </button>
        </div>
      </header>

      {/* Main Dossier Content */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-6 py-10 my-auto">
        <div className="border border-[#26282f] bg-[#0d0f13]/90 backdrop-blur-md p-8 md:p-12 shadow-2xl relative">
          {/* Top Stamp */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-mono-data tracking-[0.3em] uppercase text-[#c5a880] block">
                {caseDef.caseNumber} · DOSSIER BRIEFING
              </span>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-[#f5f1e8] tracking-wider mt-1">
                {caseDef.title}
              </h1>
              <div className="text-sm font-mono-data text-[#8b8577] tracking-widest mt-1">
                {caseDef.subtitle} · {caseDef.dateOfIncident}
              </div>
            </div>

            <div className="border border-red-950/80 bg-red-950/20 px-3 py-1.5 text-[11px] font-mono-data tracking-widest text-red-400 uppercase">
              CONFIDENTIAL · INVESTIGATION RESTRICTED
            </div>
          </div>

          {/* Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-white/[0.08]">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#857f72] uppercase block">
                  VICTIM
                </span>
                <p className="text-xl font-display font-semibold text-[#ede8de] mt-0.5">
                  {caseDef.victim.name}
                </p>
                <p className="text-xs font-mono-data text-[#a19a8b]">
                  Age {caseDef.victim.age} · {caseDef.victim.occupation}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#857f72] uppercase block">
                  CAUSE OF DEATH
                </span>
                <p className="text-sm font-serif italic text-[#dfd9cc] mt-0.5 flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  {caseDef.victim.causeOfDeath}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#857f72] uppercase block">
                  ESTIMATED TIME OF DEATH
                </span>
                <p className="text-xs font-mono-data text-[#d5cfc1] mt-0.5 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                  {caseDef.victim.estimatedTimeRange}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#857f72] uppercase block">
                  LOCATION OF INCIDENT
                </span>
                <p className="text-sm font-sans font-medium text-[#ede8de] mt-0.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                  {caseDef.locationName}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#857f72] uppercase block">
                  SUSPECTS UNDER SURVEILLANCE
                </span>
                <p className="text-sm font-sans font-medium text-[#ede8de] mt-0.5 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                  {caseDef.suspects.length} Persons of Interest
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#857f72] uppercase block">
                  ESTIMATED INVESTIGATION DURATION
                </span>
                <p className="text-xs font-mono-data text-[#d5cfc1] mt-0.5">
                  {caseDef.estimatedTime}
                </p>
              </div>
            </div>
          </div>

          {/* Incident Narrative Synopsis */}
          <div className="py-6">
            <span className="text-[11px] font-mono-data tracking-widest text-[#857f72] uppercase block mb-2">
              EXECUTIVE SUMMARY
            </span>
            <p className="text-sm md:text-base font-editorial italic text-[#c8c1b3] leading-relaxed">
              "{caseDef.victim.description}"
            </p>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                soundFx.playPaper();
                onOpenTutorial();
              }}
              className="text-xs font-mono-data tracking-wider uppercase text-[#a69f90] hover:text-[#ded8cb] transition-colors py-2 px-4 border border-white/10 hover:border-white/20"
            >
              CASE RULES & PROTOCOL
            </button>

            <button
              onClick={() => {
                soundFx.playAccuse();
                onBeginCase();
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <span>BEGIN CASE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-6 border-t border-white/[0.06] text-center text-xs font-mono-data text-[#595752]">
        INVESTIGATION AUTHORITY DELEGATED TO SOLO DETECTIVE · ALL TESTIMONIES SUBJECT TO SCRUTINY
      </footer>
    </div>
  );
};
