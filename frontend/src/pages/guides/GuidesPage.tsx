import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { guidesApi as contentApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';

const categories = ['All', 'Safety', 'Preparation', 'Recovery', 'Technical'];

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: guides, isLoading } = useQuery({
    queryKey: ['guides'],
    queryFn: () => contentApi.getGuides()
  });

  const filteredGuides = guides?.filter((guide: any) => {
    const matchesCategory = activeCategory === 'All' || guide.category === activeCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
           <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
               <BookOpen size={24} />
            </div>
             Safety & Preparation Guides
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl font-medium">
             Expert resources and actionable guides to help you stay safe and prepared during climate events in Sri Lanka.
          </p>
        </div>

        <div className="relative group max-w-md w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

       {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeCategory === category
                 ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

       {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-slate-800 border border-slate-700 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredGuides && filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide: any) => (
            <Link
              key={guide.id}
              to={`/guides/${guide.slug}`}
               className="group bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-500 transition-all shadow-lg flex flex-col"
            >
              <div className="aspect-video overflow-hidden relative border-b border-slate-700">
                {guide.coverImageUrl ? (
                  <img
                    src={guide.coverImageUrl}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-500">
                    <BookOpen size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant="info" className="bg-slate-900 border-slate-700">{guide.category}</Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                 <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock size={14} />
                    {guide.readTimeMin} min read
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                  {guide.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">
                  {guide.summary}
                </p>
                <div className="mt-auto flex items-center text-blue-400 text-sm font-bold gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  Read Full Guide
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/50 border border-dashed border-slate-700 rounded-3xl">
           <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4 border border-slate-700">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-100">No guides found</h3>
          <p className="text-slate-400 mt-2">Try adjusting your category or search query</p>
        </div>
      )}
    </div>
  );
}
