import { AccusationSubmission, CaseDefinition, ScoringResult } from '../types/case';

export function calculateDetectiveScore(
  submission: AccusationSubmission,
  caseDef: CaseDefinition
): ScoringResult {
  const { solution } = caseDef;

  let killerPoints = 0;
  let motivePoints = 0;
  let weaponPoints = 0;
  let timePoints = 0;
  let evidencePoints = 0;
  let alibiPoints = 0;
  let penaltyPoints = 0;

  const feedback: string[] = [];

  // 1. Killer (40 points)
  const isCorrectKiller = submission.suspectId === solution.killerId;
  if (isCorrectKiller) {
    killerPoints = 40;
    feedback.push(`Identified the true perpetrator: ${solution.killerName}.`);
  } else {
    feedback.push('Wrong suspect identified. The actual killer escaped justice.');
    penaltyPoints += 15;
  }

  // 2. Motive (15 points)
  const isCorrectMotive = submission.motiveId === solution.motiveId;
  if (isCorrectMotive) {
    motivePoints = 15;
    feedback.push('Precisely deduced the financial & legal motive.');
  } else {
    feedback.push('Incorrect primary motive attributed.');
  }

  // 3. Murder Weapon (15 points)
  const isCorrectWeapon = submission.weaponId === solution.weaponId;
  if (isCorrectWeapon) {
    weaponPoints = 15;
    feedback.push('Correctly identified the blunt-force murder weapon.');
  } else {
    feedback.push('Incorrect weapon chosen; forensic physical mismatch.');
  }

  // 4. Time of Murder (10 points)
  const isCorrectTime = submission.timeId === solution.timeOfDeathId;
  if (isCorrectTime) {
    timePoints = 10;
    feedback.push('Exact fatal struggle window isolated (10:22 PM).');
  } else {
    feedback.push('Estimated time of death is inconsistent with chronometer evidence.');
  }

  // 5. Alibi Breakdown Reason (10 points)
  const isCorrectAlibiBreakdown = submission.alibiBreakdownId === solution.alibiBreakdownId;
  if (isCorrectAlibiBreakdown) {
    alibiPoints = 10;
    feedback.push('Unmasked how the fabricated alibi directly contradicted physical evidence.');
  } else {
    feedback.push('Alibi flaw reasoning did not refute the suspect’s claims.');
  }

  // 6. Supporting Evidence Selection (10 points max)
  // Each required evidence selected adds points; selecting red herrings subtracts points
  const requiredCount = solution.requiredEvidenceIds.length;
  let matchingEvidenceCount = 0;
  let redHerringSelectedCount = 0;

  submission.selectedEvidenceIds.forEach((evId) => {
    if (solution.requiredEvidenceIds.includes(evId)) {
      matchingEvidenceCount++;
    }
    const item = caseDef.evidence.find((e) => e.id === evId);
    if (item && item.isRedHerring) {
      redHerringSelectedCount++;
    }
  });

  if (requiredCount > 0) {
    evidencePoints = Math.round((matchingEvidenceCount / requiredCount) * 10);
  }

  if (redHerringSelectedCount > 0) {
    const penalty = redHerringSelectedCount * 3;
    penaltyPoints += penalty;
    feedback.push(`Misled by ${redHerringSelectedCount} intentional red herring(s).`);
  }

  if (matchingEvidenceCount === requiredCount && isCorrectKiller) {
    feedback.push('Flawless chain of evidentiary proof established.');
  }

  const rawScore = killerPoints + motivePoints + weaponPoints + timePoints + evidencePoints + alibiPoints - penaltyPoints;
  const totalScore = Math.max(10, Math.min(100, rawScore));

  let grade: ScoringResult['grade'] = 'CASE UNRESOLVED';
  if (totalScore === 100) {
    grade = 'MASTER DETECTIVE';
  } else if (totalScore >= 85) {
    grade = 'EXCEPTIONAL';
  } else if (totalScore >= 70) {
    grade = 'COMPETENT';
  } else if (totalScore >= 50) {
    grade = 'UNCERTAIN';
  } else {
    grade = 'CASE UNRESOLVED';
  }

  return {
    totalScore,
    grade,
    isCorrectKiller,
    isCorrectMotive,
    isCorrectWeapon,
    isCorrectTime,
    isCorrectAlibiBreakdown,
    evidenceScore: evidencePoints,
    breakdown: {
      killerPoints,
      motivePoints,
      weaponPoints,
      timePoints,
      evidencePoints,
      alibiPoints,
      penaltyPoints,
    },
    feedback,
  };
}
