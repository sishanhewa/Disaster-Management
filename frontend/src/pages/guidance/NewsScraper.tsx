import { useEffect, useState } from 'react';
import { ExternalLink, Calendar, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import * as cheerio from 'cheerio';
import { broadcastAlertsApi } from '../../api/endpoints';
import type { BroadcastAlert } from '../../types/relief';

interface NewsItem {
    title: string;
    link: string; // Absolute URL
    rawLink: string; // Relative URL for fetching via proxy
    date: string;
    description?: string;
    fullContent?: string;
}

export default function NewsScraper() {
    const [alerts, setAlerts] = useState<BroadcastAlert[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
    const [articleLoading, setArticleLoading] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch custom alerts from our "backend" first
            try {
                const alertsData = await broadcastAlertsApi.getAll();
                setAlerts(alertsData.filter((a: BroadcastAlert) => a.isActive));
            } catch (alertErr) {
                console.error("Failed to fetch custom alerts", alertErr);
            }

            // Use the Vite proxy during development to bypass CORS
            const url = import.meta.env.DEV
                ? '/api/dmc/index.php?option=com_content&view=category&layout=blog&id=8&Itemid=193&lang=en'
                : 'https://www.dmc.gov.lk/index.php?option=com_content&view=category&layout=blog&id=8&Itemid=193&lang=en';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
            }

            const html = await response.text();

            // Parse HTML with cheerio
            const $ = cheerio.load(html);
            const items: NewsItem[] = [];

            // Extract news items (based on Joomla blog layout common to SL Govt sites)
            $('.item').each((_, element) => {
                const titleEl = $(element).find('.page-header h2 a');
                const title = titleEl.text().trim();
                let rawLink = titleEl.attr('href') || '#';
                let link = rawLink;

                if (link.startsWith('/')) {
                    link = `https://www.dmc.gov.lk${link}`;
                }

                let date = $(element).find('.published time').text().trim() ||
                    $(element).find('.create time').text().trim() ||
                    $(element).find('.muted .icon-calendar').parent().text().trim() ||
                    $(element).find('dd.published').text().replace('Published on', '').trim();

                // Clean up the date string slightly
                date = date.replace(/\\s+/g, ' ');

                const description = $(element).find('p').first().text().trim().substring(0, 150) + '...';

                if (title) {
                    items.push({ title, link, rawLink, date, description });
                }
            });

            // Fallback if the standard Joomla classes aren't present
            if (items.length === 0) {
                // Look for prominent links that might be news
                $('h2 a, h3 a').each((_, element) => {
                    const title = $(element).text().trim();
                    let rawLink = $(element).attr('href') || '#';
                    let link = rawLink;

                    if (link.startsWith('/')) {
                        link = `https://www.dmc.gov.lk${link}`;
                    }
                    // Skip pagination and obvious non-news links
                    if (title && title.length > 10 && !$(element).hasClass('pagenav')) {
                        items.push({ title, link, rawLink, date: 'Recent', description: '' });
                    }
                });
            }

            setNews(items.slice(0, 5)); // Get top 5 recent news

        } catch (err) {
            console.error('Error fetching DMC news:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred while fetching news.');
        } finally {
            setLoading(false);
        }
    };

    const handleReadArticle = async (item: NewsItem) => {
        // If we already fetched the content, just show it
        if (item.fullContent) {
            setSelectedArticle(item);
            return;
        }

        try {
            setArticleLoading(true);
            setSelectedArticle(item); // Show modal immediately with loading state

            // Fetch the article page
            const fetchUrl = import.meta.env.DEV
                ? `/api/dmc${item.rawLink.startsWith('/') ? item.rawLink : '/' + item.rawLink}`
                : item.link; // Production would need a real proxy

            const response = await fetch(fetchUrl);

            if (!response.ok) throw new Error('Failed to fetch article');

            const html = await response.text();
            const $ = cheerio.load(html);

            // Extract article content
            // Assuming Joomla item-page or standard paragraph structure
            let contentText = "";
            const articleBody = $('div[itemprop="articleBody"], .item-page');

            if (articleBody.length > 0) {
                // Extract all paragraphs or list items
                articleBody.find('p, li').each((_, el) => {
                    const text = $(el).text().trim();
                    if (text && !text.includes('Written by') && !text.includes('Hits:')) {
                        contentText += text + "\n\n";
                    }
                });
            } else {
                // Fallback if main container is missing: just grab main paragraphs from body (heuristic)
                $('p').each((_, el) => {
                    const text = $(el).text().trim();
                    // Basic filter to ignore tiny navigation/footer paragraphs
                    if (text.length > 40) {
                        contentText += text + "\n\n";
                    }
                });
            }

            if (!contentText.trim()) {
                contentText = "Content could not be parsed. Please view the original article.";
            }

            // Update item in state
            const updatedItem = { ...item, fullContent: contentText.trim() };

            setNews(prev => prev.map(n => n.link === item.link ? updatedItem : n));
            setSelectedArticle(updatedItem);

        } catch (err) {
            console.error('Error fetching full article:', err);
            // On error, just show the description we already have with a warning
            const updatedItem = { ...item, fullContent: "Error loading the full article content. Please check your connection or read it on the DMC website." };
            setSelectedArticle(updatedItem);
        } finally {
            setArticleLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col h-full">
            <div className="bg-blue-800 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <ShieldAlert size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Live Updates & Alerts</h2>
                        <p className="text-blue-100 text-xs">Official Warnings & DMC News</p>
                    </div>
                </div>
                <button
                    onClick={fetchNews}
                    disabled={loading}
                    className="text-blue-100 hover:text-white transition-colors"
                    title="Refresh News"
                >
                    <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto bg-slate-900/50 flex flex-col">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                        <Loader2 size={32} className="animate-spin mb-3 text-blue-400" />
                        <p className="text-sm font-medium">Fetching official updates...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                        <AlertCircle size={32} className="text-red-400 mb-3" />
                        <p className="text-red-400 font-medium mb-1">Failed to load news</p>
                        <p className="text-xs text-red-500">{error}</p>
                        <button
                            onClick={fetchNews}
                            className="mt-4 px-4 py-2 bg-red-900/30 text-red-400 border border-red-500/40 rounded-lg text-sm font-medium hover:bg-red-900/50 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Custom Alerts Section */}
                        {alerts.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Emergency Guidance Alerts</h3>
                                {alerts.map(alert => (
                                    <div key={alert.id} className={`p-4 rounded-xl shadow-sm border ${alert.severity === 'critical' ? 'bg-red-900/30 border-red-500/40' :
                                        alert.severity === 'warning' ? 'bg-yellow-900/30 border-yellow-500/40' :
                                            'bg-blue-900/30 border-blue-500/40'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${alert.severity === 'critical' ? 'bg-red-600 text-white' :
                                                alert.severity === 'warning' ? 'bg-yellow-500 text-white' :
                                                    'bg-blue-600 text-white'
                                                }`}>
                                                {alert.severity}
                                            </span>
                                            <h4 className={`font-bold text-sm ${alert.severity === 'critical' ? 'text-red-400' :
                                                alert.severity === 'warning' ? 'text-yellow-400' :
                                                    'text-blue-400'
                                                }`}>{alert.title}</h4>
                                        </div>
                                        <p className="text-sm text-slate-400">{alert.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* DMC News Section */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">DMC Latest News</h3>
                            {news.length === 0 ? (
                                <p className="text-sm text-slate-500 py-4 text-center">No official news updates found at this time.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {news.map((item, index) => (
                                        <li key={index} className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 hover:border-blue-500/50 hover:shadow-md transition-all group">
                                            <button onClick={() => handleReadArticle(item)} className="block w-full text-left focus:outline-none">
                                                <h3 className="font-semibold text-slate-200 text-sm mb-1 group-hover:text-blue-400 leading-tight">
                                                    {item.title}
                                                </h3>
                                                {item.date && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                        <Calendar size={12} />
                                                        {item.date}
                                                    </div>
                                                )}
                                                {item.description && (
                                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-[5px] group-hover:translate-y-0 text-xs font-medium">
                                                    <span className="text-blue-400">Read Full Article</span>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Article Modal Overlay */}
            {selectedArticle && (
                <div className="absolute inset-0 z-50 bg-slate-800 flex flex-col animate-slide-up overflow-hidden border border-slate-700 rounded-xl shadow-2xl">
                    <div className="bg-blue-800 p-4 text-white flex justify-between items-center sticky top-0 shadow-sm z-10">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <span className="font-semibold truncate text-sm">Official Update</span>
                        </div>
                        <a
                            href={selectedArticle.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 hover:text-blue-200 transition-colors bg-white/10 px-2 py-1 rounded"
                        >
                            DMC Site <ExternalLink size={12} />
                        </a>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 bg-slate-900/50">
                        <h2 className="text-xl font-bold text-slate-100 mb-3 leading-snug">{selectedArticle.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 border-b border-slate-700 pb-4">
                            <Calendar size={14} />
                            {selectedArticle.date}
                        </div>

                        {articleLoading ? (
                            <div className="flex flex-col items-center justify-center p-10 space-y-4">
                                <Loader2 size={32} className="animate-spin text-blue-400" />
                                <span className="text-slate-500 text-sm font-medium">Extracting article content...</span>
                            </div>
                        ) : (
                            <div className="prose prose-sm prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed">
                                {selectedArticle.fullContent?.split('\\n\\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 text-sm text-slate-300">{paragraph}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-slate-700/50 p-2 text-center border-t border-slate-700">
                <a href="https://www.dmc.gov.lk" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-blue-400 flex items-center justify-center gap-1">
                    Visit Disaster Management Centre website for more <ExternalLink size={10} />
                </a>
            </div>
        </div>
    );
}
