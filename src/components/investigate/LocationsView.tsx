import React from 'react';
import { EstateLocation, EvidenceItem } from '../../types/case';
import { soundFx } from '../../services/soundFx';
import { MapPin, Pin, Search, ArrowRight } from 'lucide-react';

interface LocationsViewProps {
  locations: EstateLocation[];
  evidenceList: EvidenceItem[];
  onSelectEvidence: (evidence: EvidenceItem) => void;
  onAddToBoard: (item: { id: string; title: string; subtitle: string; type: 'LOCATION' }) => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({
  locations,
  evidenceList,
  onSelectEvidence,
  onAddToBoard,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono-data tracking-[0.25em] uppercase text-[#c5a880]">
          <span>BLACKWOOD ESTATE BLUEPRINT</span>
          <span>·</span>
          <span>5 INVESTIGATED SECTORS</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f5f1e8] mt-1">
          ESTATE LOCATIONS
        </h2>
        <p className="text-xs md:text-sm font-sans text-[#8e897e] mt-1">
          Survey entry points, blackout acoustics, and where critical artifacts were recovered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((loc) => {
          // Find evidence associated with this location
          const relatedEvidence = evidenceList.filter((e) =>
            e.locationFound.toLowerCase().includes(loc.name.toLowerCase().split(' ')[0])
          );

          return (
            <div
              key={loc.id}
              className="border border-white/[0.08] bg-[#111317] hover:border-[#c5a880]/40 transition-all p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono-data text-[#c5a880] uppercase tracking-widest block">
                      {loc.wing}
                    </span>
                    <h3 className="text-xl font-display font-bold text-[#f5f1e8] mt-0.5 group-hover:text-[#c5a880] transition-colors">
                      {loc.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playPin();
                      onAddToBoard({
                        id: `loc-${loc.id}`,
                        title: loc.name,
                        subtitle: loc.wing,
                        type: 'LOCATION',
                      });
                    }}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-[#888377] hover:text-[#ede8de] border border-white/10 transition-colors"
                    title="Pin location to board"
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs md:text-sm font-sans text-[#b8b3a5] mt-3 leading-relaxed">
                  {loc.description}
                </p>

                <div className="mt-4 p-3 bg-black/40 border border-white/[0.04]">
                  <span className="text-[10px] font-mono-data text-[#7c786e] uppercase block mb-0.5">
                    AMBIENT FORENSIC REPORT:
                  </span>
                  <p className="text-xs font-editorial italic text-[#ded9cd]">
                    "{loc.ambientDetails}"
                  </p>
                </div>

                {/* Evidence found here */}
                {relatedEvidence.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.04]">
                    <span className="text-[10px] font-mono-data text-[#888377] uppercase block mb-1.5">
                      ARTIFACTS RECOVERED HERE:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {relatedEvidence.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => {
                            soundFx.playInspect();
                            onSelectEvidence(ev);
                          }}
                          className="px-2.5 py-1 text-xs font-mono-data text-[#c5a880] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-1.5 transition-colors"
                        >
                          <Search className="w-3 h-3" />
                          <span>{ev.title}</span>
                        </button>
                      ))}
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
