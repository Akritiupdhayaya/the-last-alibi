/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CaseDefinition,
  ScoringResult,
  AccusationSubmission,
  BoardNode,
  BoardConnection,
  DetectiveNote,
  Theory,
  Suspect,
  EvidenceItem,
} from './types/case';
import { INITIAL_ALL_CASES, CASE_001, CASE_002_PREVIEW } from './data/cases';
import { calculateDetectiveScore } from './services/scoringEngine';
import { soundFx } from './services/soundFx';

// Components
import { TitleScreen } from './components/TitleScreen';
import { CaseArchive } from './components/CaseArchive';
import { CaseBriefing } from './components/CaseBriefing';
import { TutorialModal } from './components/TutorialModal';
import { TopNav, WorkspaceSection } from './components/TopNav';
import { CaseOverview } from './components/CaseOverview';
import { SuspectsView } from './components/investigate/SuspectsView';
import { EvidenceView } from './components/investigate/EvidenceView';
import { LocationsView } from './components/investigate/LocationsView';
import { InterviewsView } from './components/investigate/InterviewsView';
import { TimelineView } from './components/think/TimelineView';
import { InvestigationBoard } from './components/think/InvestigationBoard';
import { TheoriesView } from './components/think/TheoriesView';
import { NotesView } from './components/think/NotesView';
import { FinalAccusationView } from './components/solve/FinalAccusationView';
import { CaseRevealModal } from './components/solve/CaseRevealModal';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'TITLE' | 'ARCHIVE' | 'BRIEFING' | 'INVESTIGATION'>('TITLE');
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('overview');

  // Case Catalog & Progression State
  const [allCases, setAllCases] = useState<CaseDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('last_alibi_cases');
      return saved ? JSON.parse(saved) : INITIAL_ALL_CASES;
    } catch {
      return INITIAL_ALL_CASES;
    }
  });

  const [activeCase, setActiveCase] = useState<CaseDefinition>(CASE_001);

  const [solvedCaseIds, setSolvedCaseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('last_alibi_solved_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [caseScores, setCaseScores] = useState<Record<string, ScoringResult>>(() => {
    try {
      const saved = localStorage.getItem('last_alibi_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active Case Working Memory
  const [reviewedEvidenceIds, setReviewedEvidenceIds] = useState<string[]>(['evidence-crime-scene']);
  const [activeInterviewSuspectId, setActiveInterviewSuspectId] = useState<string>('suspect-clara');
  const [boardNodes, setBoardNodes] = useState<BoardNode[]>([]);
  const [boardConnections, setBoardConnections] = useState<BoardConnection[]>([]);
  const [notes, setNotes] = useState<DetectiveNote[]>([
    {
      id: 'init-note-1',
      title: 'Initial Crime Scene Dispatch',
      content: 'Elias Blackwood found in his study. The estate was in total darkness from 10:17 to 10:43 PM. The killer had a 26-minute window.',
      category: 'GENERAL',
      updatedAt: '10:55 PM',
    },
  ]);
  const [theories, setTheories] = useState<Theory[]>([]);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [isRevealOpen, setIsRevealOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Synchronize progression to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('last_alibi_cases', JSON.stringify(allCases));
      localStorage.setItem('last_alibi_solved_ids', JSON.stringify(solvedCaseIds));
      localStorage.setItem('last_alibi_scores', JSON.stringify(caseScores));
    } catch {
      // storage unavailable
    }
  }, [allCases, solvedCaseIds, caseScores]);

  // Handlers
  const handleSelectCaseFromArchive = (caseItem: CaseDefinition) => {
    setActiveCase(caseItem);
    setCurrentView('BRIEFING');
  };

  const handleBeginInvestigation = () => {
    setCurrentView('INVESTIGATION');
    setActiveSection('overview');
  };

  const handleMarkEvidenceReviewed = (evId: string) => {
    setReviewedEvidenceIds((prev) => (prev.includes(evId) ? prev : [...prev, evId]));
  };

  const handleStartInterviewWithSuspect = (suspectId: string) => {
    setActiveInterviewSuspectId(suspectId);
    setActiveSection('interviews');
  };

  const handleAddSuspectToBoard = (suspect: Suspect) => {
    const existing = boardNodes.find((n) => n.referenceId === suspect.id);
    if (!existing) {
      const newNode: BoardNode = {
        id: `node-${Date.now()}`,
        type: 'SUSPECT',
        title: suspect.name,
        subtitle: suspect.role,
        x: 250 + Math.random() * 100,
        y: 180 + Math.random() * 100,
        color: '#c5a880',
        referenceId: suspect.id,
      };
      setBoardNodes((prev) => [...prev, newNode]);
    }
    setActiveSection('board');
  };

  const handleAddEvidenceToBoard = (evidence: EvidenceItem) => {
    const existing = boardNodes.find((n) => n.referenceId === evidence.id);
    if (!existing) {
      const newNode: BoardNode = {
        id: `node-${Date.now()}`,
        type: 'EVIDENCE',
        title: evidence.title,
        subtitle: evidence.category,
        x: 300 + Math.random() * 100,
        y: 280 + Math.random() * 100,
        color: '#d97706',
        referenceId: evidence.id,
      };
      setBoardNodes((prev) => [...prev, newNode]);
    }
    setActiveSection('board');
  };

  const handleAddGenericToBoard = (item: {
    id: string;
    title: string;
    subtitle: string;
    type: BoardNode['type'];
  }) => {
    const newNode: BoardNode = {
      id: `node-${Date.now()}`,
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      x: 320 + Math.random() * 80,
      y: 220 + Math.random() * 80,
      color: item.type === 'SUSPECT' ? '#c5a880' : item.type === 'EVENT' ? '#10b981' : '#3b82f6',
      referenceId: item.id,
    };
    setBoardNodes((prev) => [...prev, newNode]);
    setActiveSection('board');
  };

  const handleAddNoteFromArtifact = (title: string, category: DetectiveNote['category']) => {
    const newNote: DetectiveNote = {
      id: `note-${Date.now()}`,
      title: `Observation: ${title}`,
      content: `Preliminary investigative impression logged regarding ${title}.`,
      category,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveSection('notes');
  };

  const handleAddNoteFromText = (content: string, title: string) => {
    const newNote: DetectiveNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      category: 'GENERAL',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveSection('notes');
  };

  const handleSubmitAccusation = (submission: AccusationSubmission) => {
    const result = calculateDetectiveScore(submission, activeCase);
    setScoringResult(result);
    setIsRevealOpen(true);

    // If score is calculated, mark case solved and unlock Case 002!
    if (!solvedCaseIds.includes(activeCase.id)) {
      setSolvedCaseIds((prev) => [...prev, activeCase.id]);
    }

    setCaseScores((prev) => ({
      ...prev,
      [activeCase.id]: result,
    }));

    // Unlock CASE 002
    setAllCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id === 'case-001') {
          return { ...c, status: 'SOLVED' };
        }
        if (c.id === 'case-002') {
          return { ...c, status: 'AVAILABLE' };
        }
        return c;
      })
    );
  };

  const handleOpenNextCase = () => {
    setIsRevealOpen(false);
    // Find Case 002
    const case2 = allCases.find((c) => c.id === 'case-002') || CASE_002_PREVIEW;
    setActiveCase({
      ...case2,
      status: 'AVAILABLE',
    });
    setCurrentView('BRIEFING');
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-[#e0dbd2] selection:bg-[#c5a880]/30 selection:text-white">
      {/* View 1: Cinematic Title Screen */}
      {currentView === 'TITLE' && (
        <TitleScreen
          onEnterArchive={() => setCurrentView('ARCHIVE')}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />
      )}

      {/* View 2: Case Archive Menu */}
      {currentView === 'ARCHIVE' && (
        <CaseArchive
          cases={allCases}
          solvedCaseIds={solvedCaseIds}
          caseScores={caseScores}
          onSelectCase={handleSelectCaseFromArchive}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onBackToTitle={() => setCurrentView('TITLE')}
        />
      )}

      {/* View 3: Case Briefing Dossier */}
      {currentView === 'BRIEFING' && (
        <CaseBriefing
          caseDef={activeCase}
          onBeginCase={handleBeginInvestigation}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onBackToArchive={() => setCurrentView('ARCHIVE')}
        />
      )}

      {/* View 4: Main Investigation Workspace */}
      {currentView === 'INVESTIGATION' && (
        <div className="min-h-screen flex flex-col justify-between">
          <TopNav
            caseNumber={activeCase.caseNumber}
            caseTitle={activeCase.title}
            activeSection={activeSection}
            onSelectSection={(sec) => setActiveSection(sec)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onExitToArchive={() => setCurrentView('ARCHIVE')}
            isCaseSolved={solvedCaseIds.includes(activeCase.id)}
          />

          <main className="flex-1 pb-16">
            {activeSection === 'overview' && (
              <CaseOverview
                caseDef={activeCase}
                onNavigate={(sec) => setActiveSection(sec)}
                reviewedEvidenceIds={reviewedEvidenceIds}
                solvedResult={caseScores[activeCase.id]}
              />
            )}

            {activeSection === 'suspects' && (
              <SuspectsView
                suspects={activeCase.suspects}
                onStartInterview={handleStartInterviewWithSuspect}
                onAddToBoard={handleAddSuspectToBoard}
                onAddNote={(s) => handleAddNoteFromArtifact(s.name, 'SUSPECT')}
              />
            )}

            {activeSection === 'evidence' && (
              <EvidenceView
                evidenceList={activeCase.evidence}
                reviewedIds={reviewedEvidenceIds}
                onMarkReviewed={handleMarkEvidenceReviewed}
                onAddToBoard={handleAddEvidenceToBoard}
                onAddNote={(ev) => handleAddNoteFromArtifact(ev.title, 'EVIDENCE')}
              />
            )}

            {activeSection === 'interviews' && (
              <InterviewsView
                suspects={activeCase.suspects}
                interviews={activeCase.interviews}
                evidenceList={activeCase.evidence}
                reviewedEvidenceIds={reviewedEvidenceIds}
                initialSuspectId={activeInterviewSuspectId}
                onAddToBoard={handleAddGenericToBoard}
                onAddNote={handleAddNoteFromText}
              />
            )}

            {activeSection === 'timeline' && (
              <TimelineView
                timeline={activeCase.timeline}
                suspects={activeCase.suspects}
                onAddToBoard={handleAddGenericToBoard}
                onAddNote={handleAddNoteFromText}
              />
            )}

            {activeSection === 'board' && (
              <InvestigationBoard
                caseDef={activeCase}
                nodes={boardNodes}
                connections={boardConnections}
                onUpdateNodes={setBoardNodes}
                onUpdateConnections={setBoardConnections}
              />
            )}

            {activeSection === 'theories' && (
              <TheoriesView
                caseDef={activeCase}
                theories={theories}
                onUpdateTheories={setTheories}
              />
            )}

            {activeSection === 'notes' && (
              <NotesView
                caseDef={activeCase}
                notes={notes}
                onUpdateNotes={setNotes}
              />
            )}

            {activeSection === 'solve' && (
              <FinalAccusationView
                caseDef={activeCase}
                onSubmitAccusation={handleSubmitAccusation}
              />
            )}
          </main>

          <footer className="border-t border-white/[0.06] px-6 py-4 flex items-center justify-between text-xs font-mono-data text-[#64615a] bg-[#0c0d11]">
            <div className="flex items-center gap-3">
              <span>{activeCase.caseNumber} · {activeCase.locationName}</span>
              <span aria-hidden="true">·</span>
              <span>FORENSIC DOSSIER ACTIVE</span>
            </div>
            <button
              onClick={() => {
                soundFx.playPaper();
                setIsTutorialOpen(true);
              }}
              className="text-[#c5a880] hover:underline"
            >
              DETECTIVE PROTOCOLS
            </button>
          </footer>
        </div>
      )}

      {/* Global Interactive Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* Cinematic Case Resolution & Next Case Unlocking Modal */}
      {isRevealOpen && scoringResult && (
        <CaseRevealModal
          caseDef={activeCase}
          scoringResult={scoringResult}
          onOpenNextCase={handleOpenNextCase}
          onReturnToArchive={() => {
            setIsRevealOpen(false);
            setCurrentView('ARCHIVE');
          }}
        />
      )}
    </div>
  );
}
