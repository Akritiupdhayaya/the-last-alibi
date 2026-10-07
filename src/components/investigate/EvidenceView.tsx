import React, { useState } from 'react';
import { EvidenceItem } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { ZoomIn, Pin, FileText, CheckCircle2, X, Search, AlertCircle } from 'lucide-react';

interface EvidenceViewProps {
  evidenceList: EvidenceItem[];
  reviewedIds: string[];
  onMarkReviewed: (evidenceId: string) => void;
  onAddToBoard: (evidence: EvidenceItem) => void;
  onAddNote: (evidence: EvidenceItem) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  evidenceList,
  reviewedIds,
  onMarkReviewed,
  onAddToBoard,
  onAddNote,
}) => {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const categories = ['ALL', 'PHYSICAL', 'FORENSIC', 'DOCUMENT', 'DIGITAL'];

  const filteredEvidence = evidenceList.filter((item) => {
    if (categoryFilter === 'ALL') return true;
    return item.category === categoryFilter;
  });

  const openInspector = (item: EvidenceItem) => {
    soundFx.playInspect();
    setSelectedItem(item);
    setIsZoomed(false);
    if (!reviewedIds.includes(item.id)) {
      onMarkReviewed(item.id);
    }
  };

  const closeInspector = () => {
    soundFx.playPaper();
    setSelectedItem(null);
    setIsZoomed(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
            <span>FORENSIC REPOSITORY</span>
            <span>·</span>
            <span>{evidenceList.length} LOGGED ITEMS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-1">
            CRIME SCENE EVIDENCE
          </h2>
          <p className="text-xs md:text-sm font-sans text-[#8e897e] mt-1">
            Examine artifacts, laboratory toxicology, acoustic waveforms, and physical imprints.
          </p>
        </div>

        {/* Filter Controls (Permitted functional segmented buttons) */}
        <div className="flex items-center gap-1 p-1 bg-[#12141a] border border-white/[0.08] overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playPaper();
                setCategoryFilter(cat);
              }}
              className={`px-3 py-1.5 text-xs font-mono-data tracking-wider uppercase transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#c5a880] text-[#0a0c0f] font-semibold'
                  : 'text-[#888479] hover:text-[#ede9e0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvidence.map((item) => {
          const isReviewed = reviewedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`border transition-all flex flex-col justify-between group ${
                isReviewed
                  ? 'bg-[#111317] border-white/[0.08] hover:border-[#c5a880]/50'
                  : 'bg-[#14161d] border-[#c5a880]/40 shadow-[0_0_15px_rgba(197,168,128,0.1)]'
              }`}
            >
              {/* Media Thumbnail or Diagram Box */}
              <div
                onClick={() => openInspector(item)}
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#161820] cursor-pointer"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#161922] to-[#0e1015]">
                    <Search className="w-8 h-8 text-[#515766] group-hover:text-[#c5a880] transition-colors" />
                    <span className="font-mono-data text-[10px] tracking-widest text-[#727988] mt-2 uppercase">
                      FORENSIC ARTIFACT RECORD
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent" />

                {/* Top Tags */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="font-mono-data text-[10px] tracking-widest text-[#c5a880] bg-black/85 px-2 py-0.5">
                    {item.category}
                  </span>

                  {isReviewed ? (
                    <span className="flex items-center gap-1 font-mono-data text-[10px] text-emerald-400 bg-black/80 px-2 py-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      REVIEWED
                    </span>
                  ) : (
                    <span className="font-mono-data text-[10px] tracking-widest text-amber-300 bg-amber-950/80 px-2 py-0.5 border border-amber-700/50">
                      NEW UNREVIEWED
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => openInspector(item)}
                    className="text-lg font-display font-bold text-[#f5f1e8] group-hover:text-[#c5a880] transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono-data text-[#807b71] mt-1">
                    <span>{item.locationFound}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.discoveryTime}</span>
                  </div>

                  <p className="text-xs text-[#a9a396] font-sans mt-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    onClick={() => openInspector(item)}
                    className="flex-1 py-1.5 px-3 bg-white/5 hover:bg-white/10 text-xs font-mono-data tracking-wider uppercase text-[#ded9cd] transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>INSPECT</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playPin();
                      onAddToBoard(item);
                    }}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-[#a39c8e] hover:text-[#f4efe5] border border-white/10 transition-colors"
                    title="Pin to Investigation Board"
                    aria-label={`Pin ${item.title} to board`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playPaper();
                      onAddNote(item);
                    }}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-[#a39c8e] hover:text-[#f4efe5] border border-white/10 transition-colors"
                    title="Add Note"
                    aria-label={`Add note to ${item.title}`}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evidence Detail Modal / Inspector */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#101217] border border-[#2d303b] p-6 md:p-8 shadow-2xl">
            {/* Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
                    EVIDENCE RECORD · {selectedItem.category}
                  </span>
                  <span className="text-white/20">/</span>
                  <span className="text-[11px] font-mono-data text-[#888377]">
                    LOGGED AT {selectedItem.discoveryTime}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-[#f5f1e8] mt-1">
                  {selectedItem.title}
                </h3>
              </div>

              <button
                onClick={closeInspector}
                className="text-xs font-mono-data text-[#888377] hover:text-[#f5f1e8] p-2"
                aria-label="Close inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="py-6 space-y-6">
              {/* Media View with Zoom Toggle */}
              {selectedItem.imageUrl && (
                <div className="relative border border-white/[0.08] bg-black overflow-hidden">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className={`w-full object-contain transition-transform duration-300 ${
                      isZoomed ? 'scale-150 cursor-zoom-out' : 'max-h-72 cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-mono-data text-[#a6a093] px-2 py-1">
                    {isZoomed ? 'CLICK TO RESET' : 'CLICK TO MAGNIFY 150%'}
                  </div>
                </div>
              )}

              {/* Physical Log */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#141720] border border-white/[0.04]">
                <div>
                  <span className="text-[10px] font-mono-data text-[#7c786e] uppercase block">
                    RECOVERY LOCATION
                  </span>
                  <p className="text-xs font-mono-data text-[#ded9cd] mt-0.5">
                    {selectedItem.locationFound}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono-data text-[#7c786e] uppercase block">
                    CHAIN OF CUSTODY
                  </span>
                  <p className="text-xs font-mono-data text-[#ded9cd] mt-0.5">
                    Blackwood Constabulary Forensics
                  </p>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <span className="text-[11px] font-mono-data tracking-widest text-[#7c786e] uppercase block">
                  PHYSICAL DESCRIPTION
                </span>
                <p className="text-sm font-sans text-[#ded9ce] mt-1 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Laboratory Analysis */}
              <div className="p-4 bg-[#181920] border-l-2 border-[#c5a880] space-y-1">
                <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase block">
                  LABORATORY & FORENSIC ANALYSIS
                </span>
                <p className="text-xs md:text-sm font-editorial italic text-[#e4ded3] leading-relaxed">
                  "{selectedItem.forensicAnalysis}"
                </p>
              </div>

              {/* Related tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[11px] font-mono-data text-[#77736a] uppercase">
                  CLASSIFICATION TAGS:
                </span>
                {selectedItem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono-data text-[#b5af9f] bg-white/[0.04] px-2 py-0.5 border border-white/[0.06]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playPin();
                    onAddToBoard(selectedItem);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono-data tracking-wider uppercase text-[#d6d1c4] border border-white/10 flex items-center gap-2"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>PIN TO BOARD</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playPaper();
                    onAddNote(selectedItem);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono-data tracking-wider uppercase text-[#d6d1c4] border border-white/10 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>LOG NOTE</span>
                </button>
              </div>

              <button
                onClick={closeInspector}
                className="px-6 py-2 bg-[#c5a880] hover:bg-[#d8be99] text-[#0a0c0f] font-mono-data text-xs font-semibold tracking-widest uppercase"
              >
                CLOSE INSPECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
