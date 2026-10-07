import React, { useState } from 'react';
import { Suspect } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { MessageSquare, Pin, AlertCircle, FileText, X } from 'lucide-react';

interface SuspectsViewProps {
  suspects: Suspect[];
  onStartInterview: (suspectId: string) => void;
  onAddToBoard: (suspect: Suspect) => void;
  onAddNote: (suspect: Suspect) => void;
}

export const SuspectsView: React.FC<SuspectsViewProps> = ({
  suspects,
  onStartInterview,
  onAddToBoard,
  onAddNote,
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);

  const openDossier = (s: Suspect) => {
    soundFx.playPaper();
    setSelectedSuspect(s);
  };

  const closeDossier = () => {
    soundFx.playPaper();
    setSelectedSuspect(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
          <span>PERSONS OF INTEREST</span>
          <span>·</span>
          <span>{suspects.length} INDIVIDUALS IN RESIDENCE</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-1">
          SUSPECT DOSSIERS
        </h2>
        <p className="text-xs md:text-sm font-sans text-[#8e897e] mt-1">
          Review biographies, reported alibis, and detected inconsistencies. Every guest had access to the manor grounds.
        </p>
      </div>

      {/* Suspects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suspects.map((suspect) => (
          <div
            key={suspect.id}
            className="border border-white/[0.08] bg-[#111317] hover:border-[#c5a880]/40 transition-all flex flex-col justify-between group"
          >
            {/* Portrait Header */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181a20]">
              <img
                src={suspect.avatarUrl}
                alt={suspect.name}
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 text-[10px] font-mono-data text-[#c5a880] tracking-widest uppercase">
                PERSON OF INTEREST
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-display font-bold text-[#f5f2e9] group-hover:text-[#c5a880] transition-colors">
                    {suspect.name}
                  </h3>
                  <span className="text-xs font-mono-data text-[#8a8578]">
                    Age {suspect.age}
                  </span>
                </div>

                <div className="text-xs font-mono-data text-[#c5a880]/90 tracking-wide mt-1">
                  {suspect.role}
                </div>

                <div className="text-xs text-[#a09a8d] mt-1 italic font-serif">
                  {suspect.relation}
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                  <div>
                    <span className="text-[10px] font-mono-data text-[#706c64] uppercase block">
                      Reported Alibi (10:15–10:43 PM)
                    </span>
                    <p className="text-xs text-[#d3cebe] line-clamp-2 mt-0.5">
                      "{suspect.alibi}"
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono-data text-[#706c64] uppercase block">
                      Suspected Motive
                    </span>
                    <p className="text-xs text-[#b8b3a5] line-clamp-2 mt-0.5">
                      {suspect.motive}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => openDossier(suspect)}
                  className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-xs font-mono-data tracking-wider uppercase text-[#e2ded5] transition-colors border border-white/10 text-center"
                >
                  FULL DOSSIER
                </button>

                <button
                  onClick={() => {
                    soundFx.playPaper();
                    onStartInterview(suspect.id);
                  }}
                  className="p-2 bg-[#c5a880]/15 hover:bg-[#c5a880]/25 text-[#c5a880] border border-[#c5a880]/30 transition-colors"
                  title="Interrogate Suspect"
                  aria-label={`Interrogate ${suspect.name}`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    soundFx.playPin();
                    onAddToBoard(suspect);
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 text-[#a39c8e] hover:text-[#f2ede4] border border-white/10 transition-colors"
                  title="Pin to Investigation Board"
                  aria-label={`Pin ${suspect.name} to board`}
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suspect Detail Dossier Modal */}
      {selectedSuspect && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#101217] border border-[#2d303b] p-6 md:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1a1c24] border border-white/10 overflow-hidden shrink-0">
                  <img
                    src={selectedSuspect.avatarUrl}
                    alt={selectedSuspect.name}
                    className="w-full h-full object-cover filter grayscale contrast-125"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
                    CONFIDENTIAL INTERROGATION RECORD
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#f5f1e8] mt-0.5">
                    {selectedSuspect.name}
                  </h3>
                  <div className="text-xs font-mono-data text-[#8f8a7e]">
                    Age {selectedSuspect.age} · {selectedSuspect.role} · {selectedSuspect.relation}
                  </div>
                </div>
              </div>

              <button
                onClick={closeDossier}
                className="text-xs font-mono-data text-[#888377] hover:text-[#f5f1e8] p-2"
                aria-label="Close dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="py-6 space-y-6">
              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#7c786e] uppercase block">
                  PUBLIC BIOGRAPHY
                </span>
                <p className="text-sm font-sans text-[#d4cfc1] mt-1 leading-relaxed">
                  {selectedSuspect.publicBio}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#141720] border border-white/[0.04]">
                <div>
                  <span className="text-[11px] font-mono-data text-[#c5a880] uppercase block">
                    CLAIMED LOCATION AT DEATH
                  </span>
                  <p className="text-xs text-[#ede8de] mt-1 font-medium">
                    {selectedSuspect.locationAtDeath}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-mono-data text-[#c5a880] uppercase block">
                    PSYCHOLOGICAL DEMEANOR
                  </span>
                  <p className="text-xs text-[#ede8de] mt-1">
                    {selectedSuspect.personality}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#7c786e] uppercase block">
                  UNCHECKED STATEMENTS & ALIBI
                </span>
                <p className="text-sm font-serif italic text-[#ded9cd] mt-1 p-3 bg-black/40 border-l-2 border-[#c5a880]">
                  "{selectedSuspect.alibi}"
                </p>
              </div>

              {/* Contradictions & Hidden Secrets */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-data tracking-widest text-[#c5a880] uppercase mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>EMERGENT CONTRADICTIONS & DISCOVERIES</span>
                </div>
                <div className="space-y-2">
                  {selectedSuspect.contradictions.map((c, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-[#e0dad0] p-3 bg-amber-950/20 border border-amber-900/40 flex items-start gap-2"
                    >
                      <span className="font-mono-data text-[#c5a880] shrink-0">!</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSuspect.hiddenSecrets && selectedSuspect.hiddenSecrets.length > 0 && (
                <div>
                  <span className="text-[11px] font-mono-data tracking-widest text-[#7c786e] uppercase block mb-2">
                    CONFIDENTIAL SURVEILLANCE FINDINGS
                  </span>
                  <div className="space-y-2">
                    {selectedSuspect.hiddenSecrets.map((sec, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-[#beb8ac] p-3 bg-black/30 border border-white/[0.04]"
                      >
                        · {sec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playPin();
                    onAddToBoard(selectedSuspect);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono-data tracking-wider uppercase text-[#d6d1c4] border border-white/10 flex items-center gap-2"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>PIN TO BOARD</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playPaper();
                    onAddNote(selectedSuspect);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono-data tracking-wider uppercase text-[#d6d1c4] border border-white/10 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>LOG NOTE</span>
                </button>
              </div>

              <button
                onClick={() => {
                  soundFx.playPaper();
                  closeDossier();
                  onStartInterview(selectedSuspect.id);
                }}
                className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-widest uppercase flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>INTERROGATE SUSPECT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
