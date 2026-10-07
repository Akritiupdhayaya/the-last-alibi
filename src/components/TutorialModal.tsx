import React, { useState } from 'react';
import { soundFx } from '../services/soundFx';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteTutorial?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onCompleteTutorial,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: '01',
      title: 'STEP 1 — INVESTIGATE',
      lead: 'Examine the physical record.',
      content: [
        'You will receive crime scene evidence, interviews, archival documents, and photographs.',
        'Examine everything carefully. Zoom in on items, note the timestamps, and pay attention to subtle physical details.',
      ],
      buttonText: 'NEXT',
    },
    {
      stepNumber: '02',
      title: 'STEP 2 — QUESTION',
      lead: 'Interrogate every person of interest.',
      content: [
        'Interview suspects with targeted lines of questioning.',
        'Watch closely for contradictions against what physical evidence reveals.',
        'Remember: lying does not automatically mean someone is the killer. Innocent people hide embarrassing secrets, financial fraud, and personal shame.',
      ],
      buttonText: 'NEXT',
    },
    {
      stepNumber: '03',
      title: 'STEP 3 — CONNECT',
      lead: 'Map the unseen connections.',
      content: [
        'Use the Investigation Board to connect people, evidence, places, and events.',
        'Pin critical clues, link alibis to contradictions, and trace the threads of suspicion.',
        'Build your own visual deduction architecture.',
      ],
      buttonText: 'NEXT',
    },
    {
      stepNumber: '04',
      title: 'STEP 4 — RECONSTRUCT',
      lead: 'Rebuild the chronology second by second.',
      content: [
        'Build the timeline of the fatal evening.',
        'Compare what people claim they were doing with what clocks, phone logs, and acoustic records prove.',
        'Identify precisely where an alibi conflicts with reality.',
      ],
      buttonText: 'NEXT',
    },
    {
      stepNumber: '05',
      title: 'STEP 5 — THINK',
      lead: 'Separate the signal from the noise.',
      content: [
        'Not every clue is important.',
        'Not every secret is related to the murder.',
        'Red herrings are intentional. A good detective rejects plausible distractions and follows only ironclad proof.',
      ],
      buttonText: 'NEXT',
    },
    {
      stepNumber: '06',
      title: 'STEP 6 — ACCUSE',
      lead: 'Submit your formal deductive case.',
      content: [
        'When you believe you know what transpired, enter the Final Accusation dossier.',
        'You must identify: the killer, the motive, the murder weapon, the approximate time, the supporting evidence, and how the killer’s alibi failed.',
      ],
      buttonText: 'REVIEW RULES',
    },
    {
      stepNumber: '07',
      title: 'DETECTIVE RULES',
      lead: 'Ten iron laws of investigation.',
      isRules: true,
      rules: [
        'There may be multiple suspicious people.',
        'Not every lie is evidence of murder.',
        'Evidence must support your conclusions.',
        'You may change your theory at any time.',
        'You can revisit old evidence.',
        'You can accuse the wrong person.',
        'A correct accusation with weak reasoning will not receive a perfect score.',
        'Pay attention to contradictions.',
        'The game will not tell you which clues matter.',
        'Think like a detective.',
      ],
      buttonText: 'BEGIN INVESTIGATION',
    },
  ];

  const handleNext = () => {
    soundFx.playPaper();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (onCompleteTutorial) onCompleteTutorial();
      onClose();
    }
  };

  const handleBack = () => {
    soundFx.playPaper();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const current = steps[currentStep];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div className="relative w-full max-w-2xl bg-[#121418] border border-[#2a2d35] rounded-none p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Top subtle decorative rule */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c5a880]/60 to-transparent" />

        {/* Header bar */}
        <div className="flex items-center justify-between pb-6 border-b border-[#22252c]">
          <div>
            <span className="text-[11px] font-mono-data tracking-widest text-[#c5a880] uppercase">
              Field Manual · Protocol {current.stepNumber} of 07
            </span>
            <h2 id="tutorial-title" className="text-xl md:text-2xl font-display font-bold tracking-wide text-[#f4efe6] mt-1">
              HOW TO PLAY
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playPaper();
              onClose();
            }}
            className="text-xs font-mono-data text-[#888e9b] hover:text-[#f4efe6] transition-colors px-2 py-1 border border-transparent hover:border-[#333842]"
            aria-label="Close tutorial"
          >
            ESC / CLOSE
          </button>
        </div>

        {/* Step Content */}
        <div className="py-8 min-h-[280px] flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-xs font-mono-data text-[#c5a880]/80 tracking-wider uppercase">
              {current.title}
            </span>
            <p className="text-base md:text-lg font-editorial italic text-[#e6e1d7] mt-1">
              "{current.lead}"
            </p>
          </div>

          {current.isRules ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans text-[#b8b3a8]">
              {current.rules?.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 py-1 border-b border-[#1c1f26]">
                  <span className="font-mono-data text-[#c5a880] text-[11px] shrink-0">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 space-y-3 text-sm md:text-base text-[#bfb9ad] font-sans leading-relaxed">
              {current.content?.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="pt-6 border-t border-[#22252c] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playPaper();
                  setCurrentStep(idx);
                }}
                className={`h-1.5 transition-all ${
                  idx === currentStep ? 'w-6 bg-[#c5a880]' : 'w-2 bg-[#2a2e38] hover:bg-[#434855]'
                }`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-xs font-mono-data tracking-wider uppercase text-[#9e978b] hover:text-[#f4efe6] transition-colors"
              >
                PREVIOUS
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#c5a880] text-[#0d0f12] text-xs font-mono-data font-semibold tracking-widest uppercase hover:bg-[#d8be99] active:scale-[0.98] transition-all"
            >
              {current.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
