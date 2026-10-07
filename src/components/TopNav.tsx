import React from 'react';
import { soundFx } from '../services/soundFx';

export type WorkspaceSection =
  | 'overview'
  | 'suspects'
  | 'evidence'
  | 'interviews'
  | 'timeline'
  | 'board'
  | 'theories'
  | 'notes'
  | 'solve';

interface TopNavProps {
  caseNumber: string;
  caseTitle: string;
  activeSection: WorkspaceSection;
  onSelectSection: (section: WorkspaceSection) => void;
  onOpenTutorial: () => void;
  onExitToArchive: () => void;
  isCaseSolved?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  caseNumber,
  caseTitle,
  activeSection,
  onSelectSection,
  onOpenTutorial,
  onExitToArchive,
  isCaseSolved,
}) => {
  const navItems: { id: WorkspaceSection; label: string; group?: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'suspects', label: 'Suspects' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'board', label: 'Board' },
    { id: 'theories', label: 'Theories' },
    { id: 'notes', label: 'Notes' },
    { id: 'solve', label: 'Accuse' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d11]/95 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Zone 1: Wordmark & Case Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            soundFx.playPaper();
            onExitToArchive();
          }}
          className="text-xs font-mono-data tracking-widest text-[#827d73] hover:text-[#e4ded3] transition-colors pr-2 border-r border-white/10 hidden sm:inline-block"
          title="Return to Case Archive"
        >
          ← ARCHIVE
        </button>

        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm md:text-base tracking-wider text-[#ede8de] whitespace-nowrap">
            {caseNumber} · {caseTitle}
          </span>
          <span
            className={`text-[10px] font-mono-data tracking-widest px-1.5 py-0.5 whitespace-nowrap hidden md:inline-block ${
              isCaseSolved
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                : 'bg-[#1b1e25] text-[#c5a880] border border-[#c5a880]/30'
            }`}
          >
            {isCaseSolved ? 'SOLVED' : 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar py-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const isSolve = item.id === 'solve';

          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playPaper();
                onSelectSection(item.id);
              }}
              className={`px-2.5 py-1 text-xs font-mono-data tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 ${
                isSolve
                  ? isActive
                    ? 'bg-red-950 text-red-200 border border-red-700 font-bold'
                    : 'text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-800'
                  : isActive
                  ? 'bg-white/10 text-[#f5f1e8] font-medium border-b-2 border-[#c5a880]'
                  : 'text-[#8c887f] hover:text-[#ddd7cc]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundFx.playPaper();
            onOpenTutorial();
          }}
          className="text-xs font-mono-data tracking-wider uppercase text-[#c5a880] hover:text-[#e4cb9f] transition-colors px-2.5 py-1 border border-[#c5a880]/30 hover:border-[#c5a880] whitespace-nowrap hidden sm:inline-block"
        >
          HOW TO PLAY
        </button>
      </div>
    </header>
  );
};
