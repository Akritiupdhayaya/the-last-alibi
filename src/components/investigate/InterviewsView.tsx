import React, { useState } from 'react';
import { Suspect, SuspectInterview, EvidenceItem } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { MessageSquare, Lock, Pin, User, ChevronRight } from 'lucide-react';

interface InterviewsViewProps {
  suspects: Suspect[];
  interviews: SuspectInterview[];
  evidenceList: EvidenceItem[];
  reviewedEvidenceIds: string[];
  initialSuspectId?: string;
  onAddToBoard: (item: { id: string; title: string; subtitle: string; type: 'THEORY' | 'EVENT' | 'SUSPECT' | 'EVIDENCE' }) => void;
  onAddNote: (content: string, title: string) => void;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  suspects,
  interviews,
  evidenceList,
  reviewedEvidenceIds,
  initialSuspectId,
  onAddToBoard,
  onAddNote,
}) => {
  const [activeSuspectId, setActiveSuspectId] = useState<string>(
    initialSuspectId || suspects[0]?.id || ''
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const activeSuspect = suspects.find((s) => s.id === activeSuspectId) || suspects[0];
  const activeInterview = interviews.find((i) => i.suspectId === activeSuspect?.id);

  const handleSelectSuspect = (id: string) => {
    soundFx.playPaper();
    setActiveSuspectId(id);
    setSelectedTopicId(null);
  };

  const handleAskQuestion = (topicId: string) => {
    soundFx.playInspect();
    setSelectedTopicId(topicId);
  };

  const activeTopic = activeInterview?.topics.find((t) => t.id === selectedTopicId);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
          <span>INTERROGATION CHAMBER</span>
          <span>·</span>
          <span>RECORDED TRANSCRIPTS</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-1">
          SUSPECT INTERVIEWS
        </h2>
        <p className="text-xs md:text-sm font-sans text-[#8e897e] mt-1">
          Pose targeted questions. Confront suspects with discovered evidence to break false alibis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Suspect Selector */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[11px] font-mono-data tracking-widest text-[#7a766c] uppercase block mb-1">
            SELECT PERSON OF INTEREST
          </span>

          {suspects.map((suspect) => {
            const isSelected = suspect.id === activeSuspect?.id;

            return (
              <button
                key={suspect.id}
                onClick={() => handleSelectSuspect(suspect.id)}
                className={`w-full p-3.5 border transition-all text-left flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#181b22] border-[#c5a880] shadow-[0_0_15px_rgba(197,168,128,0.1)]'
                    : 'bg-[#111317] border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1e2129] border border-white/10 overflow-hidden shrink-0">
                    <img
                      src={suspect.avatarUrl}
                      alt={suspect.name}
                      className="w-full h-full object-cover filter grayscale"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-[#ede9df] group-hover:text-[#c5a880] transition-colors">
                      {suspect.name}
                    </h4>
                    <p className="text-[11px] font-mono-data text-[#8a8578]">
                      {suspect.role}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-[#c5a880] translate-x-1' : 'text-[#504d46]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Column: Interrogation Area */}
        <div className="lg:col-span-8 border border-white/[0.08] bg-[#111317] p-6 flex flex-col justify-between">
          {activeSuspect && activeInterview ? (
            <div className="space-y-6">
              {/* Header of Active Suspect */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1b1e25] border border-white/10 overflow-hidden">
                    <img
                      src={activeSuspect.avatarUrl}
                      alt={activeSuspect.name}
                      className="w-full h-full object-cover filter grayscale contrast-125"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#f5f1e8]">
                      {activeSuspect.name}
                    </h3>
                    <p className="text-xs font-mono-data text-[#c5a880]">
                      {activeSuspect.role} · Alibi Claim: {activeSuspect.locationAtDeath}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono-data text-[#79756c] uppercase block">
                    OBSERVED PERSONALITY
                  </span>
                  <span className="text-xs font-mono-data text-[#dad5c7]">
                    {activeSuspect.personality}
                  </span>
                </div>
              </div>

              {/* Question Selection Prompts */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono-data tracking-widest text-[#79756c] uppercase block">
                  AVAILABLE LINES OF QUESTIONING
                </span>

                <div className="space-y-2">
                  {activeInterview.topics.map((topic) => {
                    const isUnlocked =
                      topic.unlockedByDefault ||
                      (topic.requiredEvidenceId &&
                        reviewedEvidenceIds.includes(topic.requiredEvidenceId));

                    const isCurrent = topic.id === selectedTopicId;

                    if (!isUnlocked) {
                      const reqEvidence = evidenceList.find(
                        (e) => e.id === topic.requiredEvidenceId
                      );

                      return (
                        <div
                          key={topic.id}
                          className="p-3 bg-[#0d0f13] border border-white/[0.04] flex items-center justify-between opacity-60 text-xs font-mono-data text-[#636058]"
                        >
                          <div className="flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-[#55524b]" />
                            <span>[LOCKED INQUIRY LINE]</span>
                          </div>
                          <span className="text-[10px] tracking-wider text-[#7e7a70]">
                            Requires forensic discovery: {reqEvidence?.title || 'Unknown Clue'}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleAskQuestion(topic.id)}
                        className={`w-full p-3 text-left border transition-all flex items-center justify-between text-xs md:text-sm ${
                          isCurrent
                            ? 'bg-[#1c202a] border-[#c5a880] text-[#f5f1e8]'
                            : 'bg-[#13151b] border-white/[0.06] text-[#c9c4b7] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                          <span className="font-sans">"{topic.prompt}"</span>
                        </div>
                        <span className="text-[10px] font-mono-data text-[#888377] shrink-0 ml-2">
                          {isCurrent ? 'ACTIVE' : 'ASK'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interrogation Readout / Transcript */}
              {activeTopic ? (
                <div className="p-5 bg-[#0e1015] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
                      OFFICIAL TRANSCRIPT · STATEMENT RECORD
                    </span>
                    <span className="text-xs font-mono-data text-[#8a8579] bg-white/5 px-2 py-0.5">
                      Demeanor: {activeTopic.demeanor}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-mono-data text-[#7c786e] mb-1">
                      INVESTIGATOR INQUIRY:
                    </div>
                    <p className="text-xs md:text-sm font-sans text-[#ded9cd]">
                      "{activeTopic.prompt}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.04]">
                    <div className="text-xs font-mono-data text-[#c5a880] mb-1">
                      {activeSuspect.name.toUpperCase()} RESPONDS:
                    </div>
                    <p className="text-sm md:text-base font-editorial italic text-[#ede8de] leading-relaxed p-3 bg-black/40 border-l-2 border-[#c5a880]">
                      "{activeTopic.suspectResponse}"
                    </p>
                  </div>

                  {/* Actions on this statement */}
                  <div className="pt-3 flex items-center justify-end gap-3 text-xs font-mono-data">
                    <button
                      onClick={() => {
                        soundFx.playPin();
                        onAddToBoard({
                          id: `stmt-${activeTopic.id}`,
                          title: `${activeSuspect.name}: Statement`,
                          subtitle: activeTopic.prompt,
                          type: 'SUSPECT',
                        });
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#d4cfc3] border border-white/10 flex items-center gap-1.5"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>PIN STATEMENT TO BOARD</span>
                    </button>

                    <button
                      onClick={() => {
                        soundFx.playPaper();
                        onAddNote(
                          `"${activeTopic.suspectResponse}" (Demeanor: ${activeTopic.demeanor})`,
                          `Interview: ${activeSuspect.name}`
                        );
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#d4cfc3] border border-white/10 flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>COPY TO NOTEBOOK</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#0d0f13] border border-white/[0.04] text-xs font-mono-data text-[#6a665e]">
                  SELECT A QUESTION ABOVE TO INTERROGATE {activeSuspect.name.toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono-data text-[#726e65]">
              NO SUSPECT SELECTED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
