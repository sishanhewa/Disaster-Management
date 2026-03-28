import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Share2, Clock, Calendar, List } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { guidesApi as contentApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import { format } from 'date-fns';

export default function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: guide, isLoading } = useQuery({
    queryKey: ['guide', slug],
    queryFn: () => contentApi.getGuideBySlug(slug!),
    enabled: !!slug
  });

  const extractHeadings = (markdown: string) => {
    const headingRegex = /^## (.*$)/gm;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
      headings.push(match[1].trim());
    }
    return headings;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide?.title,
        text: guide?.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded mb-8" />
        <div className="aspect-video w-full bg-slate-800 rounded-2xl mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-6">
            <div className="h-10 w-3/4 bg-slate-800 rounded" />
            <div className="h-6 w-full bg-slate-800 rounded" />
            <div className="h-6 w-full bg-slate-800 rounded" />
            <div className="h-6 w-2/3 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!guide) return null;

  const headings = extractHeadings(guide.content);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Navigation */}
      <Link
        to="/guides"
        className="inline-flex items-center gap-2 text-slate-400 hover:hover:text-sky-400 transition-colors font-bold mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Guides
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Badge color="sky" className="px-3 py-1">{guide.category}</Badge>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Clock size={14} />
                {guide.readTimeMin} min read
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-8">
              {guide.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-700/50 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
                  CS
                </div>
                <div>
                  <p className="text-xs font-black text-white">SIDMS Team</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Verified Content</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <Calendar size={16} />
                <span className="text-xs font-bold">Updated {format(new Date(guide.updatedAt), 'MMM dd, yyyy')}</span>
              </div>

              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-sky-500/10 text-slate-300 hover:text-sky-400 rounded-xl transition-all border border-slate-700/50 hover:border-sky-500/30 text-xs font-bold"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            {guide.coverImageUrl && (
              <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/5 border border-slate-700">
                <img
                  src={guide.coverImageUrl}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <article className="prose prose-invert prose-sky max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ ...props }) => {
                  const id = props.children?.toString().toLowerCase().replace(/\s+/g, '-');
                  return <h2 id={id} className="text-2xl font-black text-white mt-12 mb-6 scroll-mt-24" {...props} />;
                },
                p: ({ ...props }) => <p className="text-slate-300 leading-relaxed text-lg mb-6" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc list-inside space-y-3 text-slate-300 mb-8" {...props} />,
                li: ({ ...props }) => <li className="marker:text-sky-500" {...props} />,
                strong: ({ ...props }) => <strong className="font-bold text-white" {...props} />,
              }}
            >
              {guide.content}
            </ReactMarkdown>
          </article>
        </div>

        {/* Sidebar / TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
              <h4 className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider mb-6 pb-4 border-b border-slate-700">
                <List size={18} className="text-sky-400" />
                Table of Contents
              </h4>
              <nav className="space-y-4">
                {headings.map((heading) => (
                  <a
                    key={heading}
                    href={`#${heading.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-sm text-slate-400 hover:hover:text-sky-400 transition-colors font-bold leading-tight"
                  >
                    {heading}
                  </a>
                ))}
              </nav>
            </div>

            <div className="bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-2xl p-6">
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-2">Need direct help?</h4>
              <p className="text-slate-400 text-xs font-medium mb-4">Our emergency response team is available 24/7 during disasters.</p>
              <Link
                to="/emergency"
                className="inline-flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-widest hover:gap-3 transition-all"
              >
                Go to Emergency Center
                <ChevronLeft size={14} className="rotate-180" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
