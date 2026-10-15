import React, { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

export const SupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What makes MBB guesstimate cases unique?',
      a: 'MBB (McKinsey, BCG, Bain) interviewers test structured problem solving, clear MECE segmentation, reasonable real-world benchmark proxies, mental arithmetic precision, and concise executive recommendations.',
    },
    {
      q: 'How does the Gemini AI Evaluator grade my response?',
      a: 'The AI Partner evaluates your written response across 4 core criteria: Structuring (MECE logic), Benchmarks (proxies stated), Math accuracy (arithmetic checks), and Executive Synthesis (the "So What?"). It generates a score from 1-10 with detailed green/red feedback bullet points.',
    },
    {
      q: 'Can I use the Datasheet during live practice?',
      a: 'Yes! The Datasheet contains essential demographic proxies (e.g. US 335M, UK 68M, London 9M, EU 450M, India 1.4B) and commercial benchmarks. Learning these standard numbers will give you speed during live interview rounds.',
    },
    {
      q: 'Should I choose Top-Down or Bottom-Up market sizing?',
      a: 'Top-Down is optimal when dealing with broad B2C consumer products or population-based services. Bottom-Up is ideal for B2B enterprise software, retail store networks, or capacity-constrained physical venues.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold text-slate-800">Support & Guidelines</h2>
        <p className="text-xs text-slate-500 mt-1">
          Mastering consulting interview methodologies and platform features.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
