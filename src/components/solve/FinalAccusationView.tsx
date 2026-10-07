import React, { useState } from 'react';
import { CaseDefinition, AccusationSubmission } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { ShieldAlert, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

interface FinalAccusationViewProps {
  caseDef: CaseDefinition;
  onSubmitAccusation: (submission: AccusationSubmission) => void;
}

export const FinalAccusationView: React.FC<FinalAccusationViewProps> = ({
  caseDef,
  onSubmitAccusation,
}) => {
  const [suspectId, setSuspectId] = useState<string>('');
  const [motiveId, setMotiveId] = useState<string>('');
  const [weaponId, setWeaponId] = useState<string>('');
  const [timeId, setTimeId] = useState<string>('');
  const [alibiBreakdownId, setAlibiBreakdownId] = useState<string>('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available Deduction Choices for Case 001
  const motiveOptions = [
    {
      id: 'motive-debts-disinheritance',
      label: 'Prevent Total Disinheritance & Cover Falsified Estate Deed',
      description: 'The killer owed catastrophic debts (£420,000) and was caught attempting to illegally transfer the estate deed.',
    },
    {
      id: 'motive-antique-fraud',
      label: 'Conceal International Antique Forgery Scheme',
      description: 'The victim discovered forged Tang dynasty bronzes and threatened criminal prosecution.',
    },
    {
      id: 'motive-pension-eviction',
      label: 'Retaliation Over Imminent Eviction & Stolen Timber',
      description: 'The victim had drafted an eviction and pension cancellation letter for selling estate assets.',
    },
    {
      id: 'motive-passion-will',
      label: 'Jealousy & Bitterness Over Missing Conservatorship Bequest',
      description: 'Resentment that the victim was redrafting his testament without promised art funds.',
    },
    {
      id: 'motive-journalistic-silence',
      label: 'Eliminate Wiretapping Evidence & Protect Undercover Story',
      description: 'The victim had uncovered an undercover journalist wiretapping private estate sales.',
    },
  ];

  const weaponOptions = [
    {
      id: 'evidence-bronze-horse',
      label: 'Cast Bronze Horse Statuette (7.2 lb)',
      description: 'Solid heavy statuette found wiped partially clean on study bookshelf with blood traces in crevices.',
    },
    {
      id: 'weapon-brass-poker',
      label: 'Heavy Brass Fireplace Poker',
      description: 'Cast iron and brass hearth poker resting near the study fireplace grate.',
    },
    {
      id: 'weapon-whiskey-poison',
      label: 'Lethal Chemical Poison in Whiskey Glass',
      description: 'Chloral hydrate sedative poured into Elias’s evening scotch tumbler.',
    },
    {
      id: 'weapon-marble-bookend',
      label: 'Carved Carrara Marble Bookend',
      description: 'Architectural bookend from the central study desk.',
    },
  ];

  const timeOptions = [
    {
      id: 'time-1002',
      label: '10:00 PM – 10:10 PM',
      description: 'Immediately upon Elias entering the study before the blackout began.',
    },
    {
      id: 'time-1022',
      label: '10:20 PM – 10:25 PM (10:22 PM)',
      description: 'During the depths of the 26-minute blackout when the mantle pendulum clock stopped.',
    },
    {
      id: 'time-1045',
      label: '10:43 PM – 10:50 PM',
      description: 'Right after the auxiliary generator kicked on, before the body was discovered.',
    },
  ];

  const alibiFlawOptions = [
    {
      id: 'alibi-cold-kettle-boots',
      label: 'Unboiled Cold Kettle + Muddy Terrace Bootprints + Cashmere Fibers',
      description: 'The kitchen kettle was 17.8°C with unheated water, muddy size 6 equestrian bootprints matched the terrace, and microfibers clung to the murder weapon.',
    },
    {
      id: 'alibi-phone-cell-log',
      label: 'Overseas Phone Call Record Showed Continuous Silence',
      description: 'The call to Zurich ended 20 minutes before claimed.',
    },
    {
      id: 'alibi-scratched-hands',
      label: 'Hand Lacerations Were Combat Wounds Not Garden Briars',
      description: 'Knuckle injuries proved physical hand-to-hand struggle in the dark.',
    },
    {
      id: 'alibi-piano-interruption',
      label: 'Piano Music Was Never Heard Beyond the Vestibule',
      description: 'No one in the house could corroborate the melody.',
    },
  ];

  const toggleEvidence = (evId: string) => {
    soundFx.playPin();
    setErrorMsg(null);
    setSelectedEvidenceIds((prev) =>
      prev.includes(evId) ? prev.filter((id) => id !== evId) : [...prev, evId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!suspectId) {
      setErrorMsg('You must identify the accused killer.');
      return;
    }
    if (!motiveId) {
      setErrorMsg('You must select the primary motive.');
      return;
    }
    if (!weaponId) {
      setErrorMsg('You must specify the murder weapon.');
      return;
    }
    if (!timeId) {
      setErrorMsg('You must pinpoint the fatal window.');
      return;
    }
    if (!alibiBreakdownId) {
      setErrorMsg('You must declare how the killer’s alibi failed.');
      return;
    }
    if (selectedEvidenceIds.length < 2) {
      setErrorMsg('Select at least 2 pieces of supporting evidence to corroborate your case.');
      return;
    }

    soundFx.playAccuse();
    onSubmitAccusation({
      suspectId,
      motiveId,
      weaponId,
      timeId,
      alibiBreakdownId,
      selectedEvidenceIds,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="border border-red-950/80 bg-[#120f12] p-6 md:p-8 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-red-400">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>FORMAL INDICTMENT · FINAL ACCUSATION</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-1">
          SUBMIT CASE SOLUTION
        </h2>
        <p className="text-xs md:text-sm font-sans text-[#b8b0a5] mt-1 leading-relaxed">
          You are about to submit your definitive findings for {caseDef.title}. A complete accusation requires identifying the perpetrator, motive, weapon, fatal window, evidentiary proof, and the fatal flaw in the killer's alibi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Who Killed Elias */}
        <div className="p-6 bg-[#111317] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
              01 · PERPETRATOR IDENTIFICATION
            </span>
            <span className="text-xs font-mono-data text-[#8a8579]">WHO KILLED ELIAS?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {caseDef.suspects.map((suspect) => {
              const isSelected = suspectId === suspect.id;

              return (
                <button
                  type="button"
                  key={suspect.id}
                  onClick={() => {
                    soundFx.playPin();
                    setSuspectId(suspect.id);
                  }}
                  className={`p-3 border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-600 ring-1 ring-red-500/50'
                      : 'bg-[#15171f] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 bg-black overflow-hidden shrink-0">
                    <img
                      src={suspect.avatarUrl}
                      alt={suspect.name}
                      className="w-full h-full object-cover filter grayscale"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-[#ede9df]">
                      {suspect.name}
                    </h4>
                    <p className="text-[11px] font-mono-data text-[#888377] truncate">
                      {suspect.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Primary Motive */}
        <div className="p-6 bg-[#111317] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
              02 · MOTIVE OF THE KILLER
            </span>
            <span className="text-xs font-mono-data text-[#8a8579]">WHY DID THEY KILL?</span>
          </div>

          <div className="space-y-2">
            {motiveOptions.map((opt) => {
              const isSelected = motiveId === opt.id;

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    soundFx.playPin();
                    setMotiveId(opt.id);
                  }}
                  className={`w-full p-3.5 border text-left transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-600'
                      : 'bg-[#15171f] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-display font-semibold text-sm text-[#ede8de]">
                    {opt.label}
                  </div>
                  <div className="text-xs font-sans text-[#8e897e] mt-0.5">
                    {opt.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Murder Weapon */}
        <div className="p-6 bg-[#111317] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
              03 · MURDER WEAPON
            </span>
            <span className="text-xs font-mono-data text-[#8a8579]">WHAT DELIVERED THE FATAL BLOW?</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weaponOptions.map((opt) => {
              const isSelected = weaponId === opt.id;

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    soundFx.playPin();
                    setWeaponId(opt.id);
                  }}
                  className={`p-3.5 border text-left transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-600'
                      : 'bg-[#15171f] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-display font-semibold text-sm text-[#ede8de]">
                    {opt.label}
                  </div>
                  <div className="text-xs font-sans text-[#8e897e] mt-1">
                    {opt.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Time of Murder */}
        <div className="p-6 bg-[#111317] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
              04 · FATAL TIMELINE WINDOW
            </span>
            <span className="text-xs font-mono-data text-[#8a8579]">WHEN DID THE STRIKE OCCUR?</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {timeOptions.map((opt) => {
              const isSelected = timeId === opt.id;

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    soundFx.playPin();
                    setTimeId(opt.id);
                  }}
                  className={`p-3.5 border text-left transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-600'
                      : 'bg-[#15171f] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-mono-data font-bold text-sm text-[#ede8de]">
                    {opt.label}
                  </div>
                  <div className="text-xs font-sans text-[#8e897e] mt-1">
                    {opt.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: How Killer's Alibi Failed */}
        <div className="p-6 bg-[#111317] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
              05 · ALIBI DEMOLITION
            </span>
            <span className="text-xs font-mono-data text-[#8a8579]">HOW DID THE KILLER'S ALIBI FAIL?</span>
          </div>

          <div className="space-y-2">
            {alibiFlawOptions.map((opt) => {
              const isSelected = alibiBreakdownId === opt.id;

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    soundFx.playPin();
                    setAlibiBreakdownId(opt.id);
                  }}
                  className={`w-full p-3.5 border text-left transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-600'
                      : 'bg-[#15171f] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-display font-semibold text-sm text-[#ede8de]">
                    {opt.label}
                  </div>
                  <div className="text-xs font-sans text-[#8e897e] mt-0.5">
                    {opt.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 6: Key Corroborating Evidence */}
        <div className="p-6 bg-[#111317] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
              06 · CORROBORATING EVIDENCE (SELECT 2 OR MORE)
            </span>
            <span className="text-xs font-mono-data text-[#8a8579]">
              {selectedEvidenceIds.length} SELECTED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {caseDef.evidence.map((ev) => {
              const isSelected = selectedEvidenceIds.includes(ev.id);

              return (
                <button
                  type="button"
                  key={ev.id}
                  onClick={() => toggleEvidence(ev.id)}
                  className={`p-3 text-left border transition-all text-xs flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#c5a880]/20 border-[#c5a880] text-[#f5f1e8]'
                      : 'bg-[#14161f] border-white/5 text-[#8f8a7e] hover:border-white/20'
                  }`}
                >
                  <div className="truncate">
                    <span className="block font-medium truncate">{ev.title}</span>
                    <span className="text-[10px] font-mono-data text-[#6e6a61]">
                      {ev.category}
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 bg-red-950/80 border border-red-700 text-red-200 text-xs font-mono-data flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Final Submission CTA */}
        <div className="pt-4 flex items-center justify-between">
          <p className="text-xs font-mono-data text-[#7e7a71]">
            YOUR DEDUCTIVE REASONING WILL BE SCORED IMMEDIATELY UPON SUBMISSION.
          </p>

          <button
            type="submit"
            className="px-8 py-4 bg-red-800 hover:bg-red-700 text-white font-mono-data text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-3 transition-all active:scale-[0.98] shadow-[0_0_25px_rgba(220,38,38,0.3)]"
          >
            <span>SUBMIT ACCUSATION</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
