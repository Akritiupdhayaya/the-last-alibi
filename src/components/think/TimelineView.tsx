import React, { useState } from 'react';
import { TimelineEvent, Suspect } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { Clock, AlertTriangle, Pin, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  suspects: Suspect[];
  onAddToBoard: (item: { id: string; title: string; subtitle: string; type: 'EVENT' }) => void;
  onAddNote: (content: string, title: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  suspects,
  onAddToBoard,
  onAddNote,
}) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [filterConflictsOnly, setFilterConflictsOnly] = useState<boolean>(false);

  const toggleExpand = (id: string) => {
    soundFx.playPaper();
    setExpandedEventId((prev) => (prev === id ? null : id));
  };

  const displayedEvents = filterConflictsOnly
    ? timeline.filter((e) => e.hasConflict)
    : timeline;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
            <span>CHRONOLOGICAL RECONSTRUCTION</span>
            <span>·</span>
            <span>FATAL EVENING (9:00 PM – 11:00 PM)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-1">
            INCIDENT TIMELINE
          </h2>
          <p className="text-xs md:text-sm font-sans text-[#8e897e] mt-1">
            Analyze movements, power fluctuations, and chronological contradictions.
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => {
            soundFx.playPaper();
            setFilterConflictsOnly(!filterConflictsOnly);
          }}
          className={`px-3.5 py-1.5 text-xs font-mono-data tracking-wider uppercase border transition-colors flex items-center gap-2 ${
            filterConflictsOnly
              ? 'bg-amber-950/80 border-amber-600 text-amber-200'
              : 'bg-[#12141a] border-white/10 text-[#8c887d] hover:text-[#e8e3d8]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{filterConflictsOnly ? 'SHOWING CONFLICTS ONLY' : 'FILTER CONFLICTS'}</span>
        </button>
      </div>

      {/* Chronological Vertical Track */}
      <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-px before:bg-white/10">
        {displayedEvents.map((event) => {
          const isExpanded = expandedEventId === event.id;
          const involved = suspects.filter((s) => event.involvedSuspectIds.includes(s.id));

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-6 md:-left-10 top-4 w-3 md:w-4 h-3 md:h-4 rounded-full border-2 transform -translate-x-1/2 flex items-center justify-center transition-all ${
                  event.hasConflict
                    ? 'bg-amber-500 border-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-[#1a1d24] border-[#c5a880]'
                }`}
              />

              {/* Event Card */}
              <div
                className={`border transition-all ${
                  event.hasConflict
                    ? 'bg-[#14151b] border-amber-900/50 hover:border-amber-700/60'
                    : 'bg-[#111317] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div
                  onClick={() => toggleExpand(event.id)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <span className="font-mono-data text-base md:text-lg font-bold text-[#c5a880] shrink-0">
                      {event.time}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base md:text-lg font-display font-bold text-[#f5f1e8]">
                          {event.title}
                        </h3>
                        {event.hasConflict && (
                          <span className="flex items-center gap-1 text-[10px] font-mono-data text-amber-300 bg-amber-950/80 px-2 py-0.5 border border-amber-800/60">
                            <AlertTriangle className="w-3 h-3" />
                            CRITICAL CONFLICT
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono-data text-[#807b71] mt-0.5">
                        <span>{event.location}</span>
                        {involved.length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{involved.map((s) => s.name).join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playPin();
                        onAddToBoard({
                          id: `time-${event.id}`,
                          title: `${event.time}: ${event.title}`,
                          subtitle: event.location,
                          type: 'EVENT',
                        });
                      }}
                      className="p-1.5 text-[#888377] hover:text-[#f4efe5] transition-colors"
                      title="Pin event to board"
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#888377]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#888377]" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-white/[0.04] space-y-4 text-xs md:text-sm">
                    <p className="text-[#ded9ce] font-sans leading-relaxed">
                      {event.description}
                    </p>

                    {event.hasConflict && event.conflictDescription && (
                      <div className="p-3 bg-amber-950/30 border-l-2 border-amber-500 text-amber-200 text-xs font-mono-data">
                        <span className="font-bold block mb-0.5 uppercase tracking-wider">
                          DEDUCTIVE ANOMALY:
                        </span>
                        {event.conflictDescription}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                      <span className="text-[11px] font-mono-data text-[#706c64]">
                        LOCATION: {event.location.toUpperCase()}
                      </span>

                      <button
                        onClick={() => {
                          soundFx.playPaper();
                          onAddNote(
                            `[${event.time}] ${event.title} at ${event.location}: ${event.description}`,
                            `Timeline: ${event.time}`
                          );
                        }}
                        className="text-xs font-mono-data text-[#c5a880] hover:underline"
                      >
                        LOG IN NOTEBOOK →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
