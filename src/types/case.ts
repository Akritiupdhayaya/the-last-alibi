export type Difficulty = '1' | '2' | '3' | '4' | '5';
export type CaseStatus = 'AVAILABLE' | 'LOCKED' | 'SOLVED';

export interface Suspect {
  id: string;
  name: string;
  age: number;
  role: string;
  relation: string;
  avatarUrl: string;
  alibi: string;
  motive: string;
  publicBio: string;
  hiddenSecrets: string[];
  contradictions: string[];
  personality: string;
  locationAtDeath: string;
  isGuilty?: boolean;
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'PHYSICAL' | 'DOCUMENT' | 'FORENSIC' | 'TESTIMONY' | 'DIGITAL';
  locationFound: string;
  discoveryTime: string;
  description: string;
  forensicAnalysis: string;
  imageUrl?: string;
  isRedHerring?: boolean;
  relatedSuspectIds: string[];
  contradictionHint?: string;
  tags: string[];
}

export interface InterviewTopic {
  id: string;
  prompt: string;
  suspectResponse: string;
  revealedClueId?: string;
  demeanor: 'Defensive' | 'Composed' | 'Agitated' | 'Hesitant' | 'Sincere' | 'Guarded';
  unlockedByDefault: boolean;
  requiredEvidenceId?: string;
}

export interface SuspectInterview {
  suspectId: string;
  topics: InterviewTopic[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  timestampMinutes: number; // e.g. 9:00 PM -> 1260
  title: string;
  description: string;
  location: string;
  involvedSuspectIds: string[];
  relatedEvidenceIds: string[];
  isVerified: boolean;
  hasConflict?: boolean;
  conflictDescription?: string;
}

export interface EstateLocation {
  id: string;
  name: string;
  wing: string;
  description: string;
  initialClues: string[];
  ambientDetails: string;
}

export interface AccusationSolution {
  killerId: string;
  killerName: string;
  motive: string;
  motiveId: string;
  weapon: string;
  weaponId: string;
  timeOfDeath: string;
  timeOfDeathId: string;
  requiredEvidenceIds: string[];
  alibiBreakdown: string;
  alibiBreakdownId: string;
  summaryTruth: string;
  redHerringsExplained: string[];
}

export interface CaseDefinition {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  dateOfIncident: string;
  locationName: string;
  coverImage?: string;
  status: CaseStatus;
  victim: {
    name: string;
    age: number;
    occupation: string;
    causeOfDeath: string;
    estimatedTimeRange: string;
    description: string;
  };
  suspects: Suspect[];
  evidence: EvidenceItem[];
  interviews: SuspectInterview[];
  locations: EstateLocation[];
  timeline: TimelineEvent[];
  solution: AccusationSolution;
  unlockCondition?: string;
}

export interface BoardNode {
  id: string;
  type: 'SUSPECT' | 'EVIDENCE' | 'EVENT' | 'LOCATION' | 'THEORY';
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  color?: string;
  referenceId: string;
}

export interface BoardConnection {
  id: string;
  fromId: string;
  toId: string;
  label: 'CONTRADICTION' | 'ALIBI CLAIM' | 'WEAPON LINK' | 'MOTIVE' | 'SUSPECT' | 'SUSPICION';
  color?: string;
}

export interface DetectiveNote {
  id: string;
  title: string;
  content: string;
  category: 'SUSPECT' | 'EVIDENCE' | 'THEORY' | 'GENERAL';
  relatedId?: string;
  updatedAt: string;
}

export interface Theory {
  id: string;
  suspectId: string;
  hypothesis: string;
  motiveHypothesis: string;
  attachedEvidenceIds: string[];
  unresolvedContradictions: string[];
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export interface AccusationSubmission {
  suspectId: string;
  motiveId: string;
  weaponId: string;
  timeId: string;
  selectedEvidenceIds: string[];
  alibiBreakdownId: string;
}

export interface ScoringResult {
  totalScore: number;
  grade: 'MASTER DETECTIVE' | 'EXCEPTIONAL' | 'COMPETENT' | 'UNCERTAIN' | 'CASE UNRESOLVED';
  isCorrectKiller: boolean;
  isCorrectMotive: boolean;
  isCorrectWeapon: boolean;
  isCorrectTime: boolean;
  isCorrectAlibiBreakdown: boolean;
  evidenceScore: number;
  breakdown: {
    killerPoints: number;
    motivePoints: number;
    weaponPoints: number;
    timePoints: number;
    evidencePoints: number;
    alibiPoints: number;
    penaltyPoints: number;
  };
  feedback: string[];
}
