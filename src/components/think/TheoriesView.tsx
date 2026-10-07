import React, { useState } from 'react';
import { Theory, CaseDefinition } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { Plus, Trash2, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface TheoriesViewProps {
  caseDef: CaseDefinition;
  theories: Theory[];
  onUpdateTheories: (theories: Theory[]) => void;
}

export const TheoriesView: React.FC<TheoriesViewProps> = ({
  caseDef,
  theories,
  onUpdateTheories,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [suspectId, setSuspectId] = useState(caseDef.suspects[0]?.id || '');
  const [hypothesis, setHypothesis] = useState('');
  const [motiveHypothesis, setMotiveHypothesis] = useState('');
  const [confidence, setConfidence] = useState<Theory['confidence']>('MEDIUM');
  const [selectedEvIds, setSelectedEvIds] = useState<string[]>([]);

  const handleSaveTheory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypothesis.trim()) return;

    soundFx.playPaper();
    const suspect = caseDef.suspects.find((s) => s.id === suspectId);

    const newTheory: Theory = {
      id: `th-${Date.now()}`,
      suspectId,
      hypothesis,
      motiveHypothesis,
      attachedEvidenceIds: selectedEvIds,
      unresolvedContradictions: suspect ? suspect.contradictions : [],
      confidence,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onUpdateTheories([newTheory, ...theories]);
    setIsCreating(false);
    setHypothesis('');
    setMotiveHypothesis('');
    setSelectedEvIds([]);
  };

  const handleDeleteTheory = (id: string) => {
    soundFx.playPaper();
    onUpdateTheories(theories.filter((t) => t.id !== id));
  };

  const toggleEvidenceSelect = (id: string) => {
    soundFx.playPin();
    setSelectedEvIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
            <span>DEDUCTIVE WORKBENCH</span>
            <span>·</span>
            <span>WORKING HYPOTHESES</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-1">
            CASE THEORIES
          </h2>
          <p className="text-xs md:text-sm font-sans text-[#8e897e] mt-1">
            Construct working narratives. Link evidence and evaluate contradictions without judgment.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playPaper();
            setIsCreating(!isCreating);
          }}
          className="px-4 py-2 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-wider uppercase flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreating ? 'CANCEL' : 'FORMULATE THEORY'}</span>
        </button>
      </div>

      {/* Create Theory Drawer */}
      {isCreating && (
        <form
          onSubmit={handleSaveTheory}
          className="mb-8 p-6 bg-[#13151b] border border-[#c5a880]/50 space-y-5 animate-fade-in"
        >
          <h3 className="text-base font-display font-bold text-[#ede9df]">
            DRAFT NEW WORKING THEORY
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono-data text-[#888377] uppercase block mb-1">
                PRIMARY SUSPECT ACCUSED IN THEORY
              </label>
              <select
                value={suspectId}
                onChange={(e) => setSuspectId(e.target.value)}
                className="w-full bg-[#0a0b0e] border border-white/10 p-2.5 text-xs font-mono-data text-[#e5dfd3]"
              >
                {caseDef.suspects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono-data text-[#888377] uppercase block mb-1">
                CONFIDENCE LEVEL
              </label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as Theory['confidence'])}
                className="w-full bg-[#0a0b0e] border border-white/10 p-2.5 text-xs font-mono-data text-[#e5dfd3]"
              >
                <option value="LOW">Low Confidence (Exploring Lead)</option>
                <option value="MEDIUM">Medium Confidence (Supported by Circumstance)</option>
                <option value="HIGH">High Confidence (Solid Corroboration)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono-data text-[#888377] uppercase block mb-1">
              THEORY HYPOTHESIS & NARRATIVE
            </label>
            <textarea
              rows={3}
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="e.g. Clara staged her tea preparation alibi, bypassed the corridor using the terrace, and struck Elias when confronted..."
              className="w-full bg-[#0a0b0e] border border-white/10 p-3 text-xs md:text-sm text-[#ede8de] focus:border-[#c5a880] outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-mono-data text-[#888377] uppercase block mb-1">
              PROPOSED MOTIVE
            </label>
            <input
              type="text"
              value={motiveHypothesis}
              onChange={(e) => setMotiveHypothesis(e.target.value)}
              placeholder="e.g. Prevent imminent disinheritance and legal exposure for deed falsification"
              className="w-full bg-[#0a0b0e] border border-white/10 p-2.5 text-xs md:text-sm text-[#ede8de] focus:border-[#c5a880] outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono-data text-[#888377] uppercase block mb-2">
              ATTACH EVIDENCE TO THIS THEORY
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {caseDef.evidence.map((ev) => {
                const isSelected = selectedEvIds.includes(ev.id);
                return (
                  <button
                    type="button"
                    key={ev.id}
                    onClick={() => toggleEvidenceSelect(ev.id)}
                    className={`p-2 text-left text-xs border transition-colors truncate ${
                      isSelected
                        ? 'bg-[#c5a880]/20 border-[#c5a880] text-[#f5f1e8]'
                        : 'bg-[#0a0b0e] border-white/5 text-[#888377] hover:text-[#d4cfc2]'
                    }`}
                  >
                    ✓ {ev.title}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-widest uppercase"
          >
            SAVE WORKING THEORY
          </button>
        </form>
      )}

      {/* Theories List */}
      <div className="space-y-4">
        {theories.length === 0 ? (
          <div className="p-12 text-center border border-white/[0.04] bg-[#111317]">
            <Sparkles className="w-8 h-8 text-[#545967] mx-auto mb-3" />
            <h4 className="text-base font-display font-bold text-[#ede8de]">
              NO THEORIES RECORDED YET
            </h4>
            <p className="text-xs font-mono-data text-[#7c786e] mt-1">
              Click 'FORMULATE THEORY' above to test your deductions against the facts.
            </p>
          </div>
        ) : (
          theories.map((theory) => {
            const suspect = caseDef.suspects.find((s) => s.id === theory.suspectId);
            const attached = caseDef.evidence.filter((e) =>
              theory.attachedEvidenceIds.includes(e.id)
            );

            return (
              <div
                key={theory.id}
                className="p-6 bg-[#111317] border border-white/[0.08] space-y-4 relative group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono-data tracking-widest text-[#c5a880] uppercase">
                      THEORY ACCUSING: {suspect?.name || 'UNKNOWN'} · CONFIDENCE: {theory.confidence}
                    </span>
                    <h3 className="text-lg font-display font-bold text-[#f5f1e8] mt-0.5">
                      "{theory.hypothesis}"
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeleteTheory(theory.id)}
                    className="text-[#6d6a62] hover:text-red-400 transition-colors p-1"
                    title="Delete theory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {theory.motiveHypothesis && (
                  <div className="text-xs font-sans text-[#beb8ac]">
                    <span className="font-mono-data text-[#888377] uppercase text-[10px] block">
                      PROPOSED MOTIVE:
                    </span>
                    {theory.motiveHypothesis}
                  </div>
                )}

                {/* Attached Evidence */}
                {attached.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.04]">
                    <span className="font-mono-data text-[#888377] uppercase text-[10px] block mb-1">
                      SUPPORTING EVIDENCE TIED TO THEORY:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {attached.map((ev) => (
                        <span
                          key={ev.id}
                          className="text-xs font-mono-data text-[#c5a880] bg-white/[0.04] px-2 py-0.5 border border-white/[0.06]"
                        >
                          {ev.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contradictions */}
                {theory.unresolvedContradictions && theory.unresolvedContradictions.length > 0 && (
                  <div className="p-3 bg-amber-950/20 border-l-2 border-amber-500 text-xs text-[#e4ded3] space-y-1">
                    <span className="font-mono-data text-amber-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      UNRESOLVED SUSPECT CONTRADICTIONS:
                    </span>
                    {theory.unresolvedContradictions.map((c, idx) => (
                      <p key={idx} className="text-xs font-sans text-[#c4beaf]">
                        · {c}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
