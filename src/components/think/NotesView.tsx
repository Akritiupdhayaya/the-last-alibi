import React, { useState } from 'react';
import { DetectiveNote, CaseDefinition } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { Plus, Trash2, Edit3, BookOpen } from 'lucide-react';

interface NotesViewProps {
  caseDef: CaseDefinition;
  notes: DetectiveNote[];
  onUpdateNotes: (notes: DetectiveNote[]) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onUpdateNotes,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<DetectiveNote['category']>('GENERAL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    soundFx.playPaper();
    const newNote: DetectiveNote = {
      id: `note-${Date.now()}`,
      title: title.trim() || 'Untitled Deduction',
      content,
      category,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onUpdateNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string) => {
    soundFx.playPaper();
    onUpdateNotes(notes.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter((n) => {
    if (filterCategory === 'ALL') return true;
    return n.category === filterCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
            <span>CONFIDENTIAL LOG</span>
            <span>·</span>
            <span>DETECTIVE FIELD NOTEBOOK</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-1">
            CASE NOTES
          </h2>
          <p className="text-xs md:text-sm font-sans text-[#8e897e] mt-1">
            Keep private impressions, interview transcripts, and behavioral observations.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playPaper();
            setIsAdding(!isAdding);
          }}
          className="px-4 py-2 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-wider uppercase flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'CANCEL' : 'WRITE NOTE'}</span>
        </button>
      </div>

      {/* Note Creation Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSaveNote}
          className="mb-8 p-6 bg-[#13151b] border border-[#c5a880]/50 space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-display font-bold text-[#f2eee4]">
            NEW DETECTIVE ENTRY
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono-data text-[#888377] uppercase block mb-1">
                ENTRY HEADING
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Discrepancy in kitchen tea timing"
                className="w-full bg-[#0a0b0e] border border-white/10 p-2 text-xs md:text-sm text-[#ede8de] focus:border-[#c5a880] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-data text-[#888377] uppercase block mb-1">
                LOG CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DetectiveNote['category'])}
                className="w-full bg-[#0a0b0e] border border-white/10 p-2 text-xs font-mono-data text-[#e5dfd3]"
              >
                <option value="GENERAL">General Observation</option>
                <option value="SUSPECT">Suspect Behavior</option>
                <option value="EVIDENCE">Evidence Analysis</option>
                <option value="THEORY">Deductive Theory</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono-data text-[#888377] uppercase block mb-1">
              OBSERVATION CONTENT
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record your observations here..."
              className="w-full bg-[#0a0b0e] border border-white/10 p-3 text-xs md:text-sm text-[#ede8de] focus:border-[#c5a880] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-widest uppercase"
          >
            RECORD IN NOTEBOOK
          </button>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 pb-2 border-b border-white/[0.06] overflow-x-auto no-scrollbar">
        {['ALL', 'GENERAL', 'SUSPECT', 'EVIDENCE', 'THEORY'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundFx.playPaper();
              setFilterCategory(cat);
            }}
            className={`px-3 py-1 text-xs font-mono-data tracking-wider uppercase transition-colors whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-[#c5a880] text-[#0a0c0f] font-semibold'
                : 'text-[#858076] hover:text-[#ded9cd]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-2 p-12 text-center border border-white/[0.04] bg-[#111317]">
            <BookOpen className="w-8 h-8 text-[#545967] mx-auto mb-3" />
            <h4 className="text-base font-display font-bold text-[#ede8de]">
              NOTEBOOK IS CURRENTLY EMPTY
            </h4>
            <p className="text-xs font-mono-data text-[#7c786e] mt-1">
              Use 'WRITE NOTE' or copy statements from Interviews and Evidence cards.
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 bg-[#111317] border border-white/[0.06] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono-data text-[#888377] pb-2 border-b border-white/[0.04]">
                  <span className="text-[#c5a880] uppercase tracking-wider">
                    {note.category}
                  </span>
                  <span>{note.updatedAt}</span>
                </div>

                <h4 className="text-base font-display font-bold text-[#ede8de] mt-2">
                  {note.title}
                </h4>

                <p className="text-xs md:text-sm font-sans text-[#cfc9bc] mt-2 leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-end">
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-[#6d6a62] hover:text-red-400 transition-colors p-1"
                  title="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
