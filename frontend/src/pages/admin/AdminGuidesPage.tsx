import React, { useEffect, useState } from 'react';
import { guidesApi, faqApi } from '../../api/endpoints';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

type TabKey = 'articles' | 'faq';

export default function AdminGuidesPage() {
  const [tab, setTab] = useState<TabKey>('articles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [articles, setArticles] = useState<any[]>([]);
  const [faq, setFaq] = useState<any[]>([]);

  const [articleForm, setArticleForm] = useState({ title: '', summary: '', content: '', category: 'general', language: 'en', readTimeMin: '3', isPublished: true, coverImageUrl: '' });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'general', language: 'en', sortOrder: '0', isPublished: true });

  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const inputClass = "block w-full rounded-lg px-3 py-2 text-sm border bg-slate-900 border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors text-white";

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [articlesRes, faqRes] = await Promise.all([
        guidesApi.getGuides(),
        faqApi.getFaqs()
      ]);

      setArticles(articlesRes || []);
      setFaq(faqRes || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load guide admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetArticleForm = () => {
    setArticleForm({ title: '', summary: '', content: '', category: 'general', language: 'en', readTimeMin: '3', isPublished: true, coverImageUrl: '' });
    setEditingArticleId(null);
  };

  const resetFaqForm = () => {
    setFaqForm({ question: '', answer: '', category: 'general', language: 'en', sortOrder: '0', isPublished: true });
    setEditingFaqId(null);
  };

  const submitArticle = async () => {
    if (!articleForm.title.trim() || !articleForm.summary.trim() || !articleForm.content.trim()) {
      setError('Article title, summary and content are required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...articleForm,
        readTimeMin: Number(articleForm.readTimeMin) || 3
      };

      if (editingArticleId) {
        await guidesApi.updateGuide(editingArticleId, payload);
      } else {
        await guidesApi.createGuide(payload);
      }

      resetArticleForm();
      await loadAll();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  const editArticle = (article: any) => {
    setEditingArticleId(article.id);
    setArticleForm({
      title: article.title || '',
      summary: article.summary || '',
      content: article.content || '',
      category: article.category || 'general',
      language: article.language || 'en',
      readTimeMin: String(article.readTimeMin || 3),
      isPublished: article.isPublished !== false,
      coverImageUrl: article.coverImageUrl || ''
    });
    setTab('articles');
  };

  const submitFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      setError('FAQ question and answer are required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...faqForm,
        sortOrder: Number(faqForm.sortOrder) || 0
      };

      if (editingFaqId) {
        await faqApi.updateFaq(editingFaqId, payload);
      } else {
        await faqApi.createFaq(payload);
      }

      resetFaqForm();
      await loadAll();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save FAQ.');
    } finally {
      setSaving(false);
    }
  };

  const editFaq = (item: any) => {
    setEditingFaqId(item.id);
    setFaqForm({
      question: item.question || '',
      answer: item.answer || '',
      category: item.category || 'general',
      language: item.language || 'en',
      sortOrder: String(item.sortOrder || 0),
      isPublished: item.isPublished !== false
    });
    setTab('faq');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        <span className="ml-3 text-slate-400">Loading guide admin...</span>
      </div>
    );
  }

  // Theme utility classes matching our global theme structure
  const thBg = "bg-slate-900/50";
  const thText = "text-slate-400";
  const rowHover = "hover:bg-slate-800/50 transition-colors";
  const divider = "divide-slate-800";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold text-white">Guides Management</h1>
        <p className="text-sm mt-1 text-slate-400">
          Manage preparedness articles and FAQ content. (Note: Delete functionality is not supported by the current backend API).
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-slate-700">
        <button
          onClick={() => setTab('articles')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${tab === 'articles' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Articles
        </button>
        <button
          onClick={() => setTab('faq')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${tab === 'faq' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          FAQ
        </button>
      </div>

      {tab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                {editingArticleId ? 'Edit Article' : 'New Article'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Title</label>
                  <input className={inputClass} value={articleForm.title} onChange={e => setArticleForm({ ...articleForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Language</label>
                  <select className={inputClass} value={articleForm.language} onChange={e => setArticleForm({ ...articleForm, language: e.target.value })}>
                    <option value="en">English (en)</option>
                    <option value="si">Sinhala (si)</option>
                    <option value="ta">Tamil (ta)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Category</label>
                  <input className={inputClass} value={articleForm.category} onChange={e => setArticleForm({ ...articleForm, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Cover Image URL</label>
                  <input className={inputClass} value={articleForm.coverImageUrl} onChange={e => setArticleForm({ ...articleForm, coverImageUrl: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Summary</label>
                  <textarea rows={2} className={inputClass} value={articleForm.summary} onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Content (Markdown)</label>
                  <textarea rows={8} className={inputClass} value={articleForm.content} onChange={e => setArticleForm({ ...articleForm, content: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Read Time (Min)</label>
                  <input type="number" className={inputClass} value={articleForm.readTimeMin} onChange={e => setArticleForm({ ...articleForm, readTimeMin: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="pubA" checked={articleForm.isPublished} onChange={e => setArticleForm({ ...articleForm, isPublished: e.target.checked })} />
                  <label htmlFor="pubA" className="text-sm font-medium text-slate-300">Published</label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <Button variant="secondary" className="flex-1" onClick={resetArticleForm} disabled={saving}>Clear</Button>
                  <Button variant="primary" className="flex-1" onClick={submitArticle} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className={`min-w-full divide-y ${divider}`}>
                  <thead className={thBg}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${thText}`}>Title</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${thText}`}>Category</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${thText}`}>Status</th>
                      <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${thText}`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${divider}`}>
                    {articles.map((item: any) => (
                      <tr key={item.id} className={rowHover}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{item.title}</div>
                          <div className="text-xs text-slate-400">{item.language} | {item.readTimeMin}m</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge color={item.isPublished ? 'emerald' : 'slate'}>
                            {item.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="secondary" size="sm" onClick={() => editArticle(item)}>Edit</Button>
                        </td>
                      </tr>
                    ))}
                    {articles.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                          No articles found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'faq' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                {editingFaqId ? 'Edit FAQ' : 'New FAQ'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Question</label>
                  <input className={inputClass} value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Language</label>
                  <select className={inputClass} value={faqForm.language} onChange={e => setFaqForm({ ...faqForm, language: e.target.value })}>
                    <option value="en">English (en)</option>
                    <option value="si">Sinhala (si)</option>
                    <option value="ta">Tamil (ta)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Category</label>
                  <input className={inputClass} value={faqForm.category} onChange={e => setFaqForm({ ...faqForm, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Answer</label>
                  <textarea rows={4} className={inputClass} value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-300">Sort Order</label>
                  <input type="number" className={inputClass} value={faqForm.sortOrder} onChange={e => setFaqForm({ ...faqForm, sortOrder: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="pubF" checked={faqForm.isPublished} onChange={e => setFaqForm({ ...faqForm, isPublished: e.target.checked })} />
                  <label htmlFor="pubF" className="text-sm font-medium text-slate-300">Published</label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <Button variant="secondary" className="flex-1" onClick={resetFaqForm} disabled={saving}>Clear</Button>
                  <Button variant="primary" className="flex-1" onClick={submitFaq} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className={`min-w-full divide-y ${divider}`}>
                  <thead className={thBg}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${thText}`}>Question</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${thText}`}>Category</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${thText}`}>Order</th>
                      <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${thText}`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${divider}`}>
                    {faq.map((item: any) => (
                      <tr key={item.id} className={rowHover}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{item.question}</div>
                          <div className="text-xs text-slate-400 mt-1 line-clamp-1">{item.answer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {item.sortOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="secondary" size="sm" onClick={() => editFaq(item)}>Edit</Button>
                        </td>
                      </tr>
                    ))}
                    {faq.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                          No FAQs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
