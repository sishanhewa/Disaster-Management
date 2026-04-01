import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HelpCircle, Search, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { faqApi } from '../api/endpoints';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => faqApi.getFaqs()
  });

  const filteredFaqs = faqs?.filter((faq: any) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFaqs = filteredFaqs?.reduce((acc: any, faq: any) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Frequently Asked Questions</h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium">
          Find quick answers to common questions about disaster alerts, weather tracking, and community reporting on SIDMS.
        </p>

        <div className="max-w-xl mx-auto pt-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-lg"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-4">
               <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 w-full bg-slate-800 border border-slate-700 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : groupedFaqs && Object.keys(groupedFaqs).length > 0 ? (
        <div className="space-y-12">
          {Object.entries(groupedFaqs).map(([category, items]: [string, any]) => (
            <section key={category} className="space-y-4">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] pl-1">
                {category}
              </h2>
              <div className="space-y-3">
                {items.map((faq: any) => (
                  <div
                    key={faq.id}
                    className={`group bg-slate-800 border transition-all duration-300 rounded-2xl overflow-hidden ${
                      expandedId === faq.id 
                        ? 'border-blue-500/50 shadow-lg shadow-blue-500/5' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                       <span className={`font-bold transition-colors ${expandedId === faq.id ? 'text-blue-400' : 'text-slate-100'}`}>
                        {faq.question}
                      </span>
                      <div className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        expandedId === faq.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                      }`}>
                        {expandedId === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        expandedId === faq.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-5 pt-0 text-slate-400 font-medium leading-relaxed border-t border-slate-700 mt-2">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/50 border border-dashed border-slate-700 rounded-3xl">
          <MessageSquare className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-100">No questions found</h3>
          <p className="text-slate-400 mt-2">Try a different search term</p>
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center space-y-4 mt-20">
        <h3 className="text-xl font-bold text-slate-100">Still have questions?</h3>
        <p className="text-slate-400 font-medium">
          Can't find the answer you're looking for? Please contact our support team.
        </p>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg">
          Contact Support
        </button>
      </div>
    </div>
  );
}
