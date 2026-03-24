
import DisasterChatbot from './DisasterChatbot';
import OfflineGuides from './OfflineGuides';
import NewsScraper from './NewsScraper';
import { BookOpen, ShieldAlert } from 'lucide-react';

export default function IntelligentGuidance() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
            {/* Header */}
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 shadow-lg backdrop-blur-sm">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-3">
                    <BookOpen className="text-blue-400" size={32} />
                    Intelligence Guidance Center
                </h1>
                <p className="text-slate-400 mt-2 text-lg max-w-3xl font-medium">
                    Your centralized hub for disaster preparation, official alerts, and AI-powered survival assistance.
                    Stay informed, stay safe, and be prepared for any emergency in Sri Lanka.
                </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-900/30 border border-amber-500/40 p-5 rounded-2xl shadow-lg flex items-start gap-4 hover:shadow-amber-900/20 transition-all">
                <ShieldAlert className="text-amber-400 mt-0.5 flex-shrink-0" size={24} />
                <div>
                    <h3 className="text-amber-400 font-bold text-lg mb-1">Emergency Disclaimer</h3>
                    <p className="text-amber-200/80 text-sm">
                        If you are in immediate, life-threatening danger, call emergency services (119) or use the SIDMS SOS Beacon immediately. Do not wait for AI guidance.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Chatbot & Guides */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <section className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700 shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-blue-900/50 text-blue-400 flex items-center justify-center text-lg font-extrabold border border-blue-500/30 shadow-inner">1</span>
                            Ask the Expert AI
                        </h2>
                        <DisasterChatbot />
                    </section>

                    <section className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700 shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center text-lg font-extrabold border border-emerald-500/30 shadow-inner">2</span>
                            Download Survival Kits
                        </h2>
                        <OfflineGuides />
                    </section>
                </div>

                {/* Right Column: Live News (Sticky) */}
                <div className="lg:col-span-4 flex flex-col">
                    <div className="sticky top-8 flex flex-col h-[calc(100vh-6rem)] bg-slate-800/40 rounded-2xl p-6 border border-slate-700 shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-red-900/50 text-red-400 flex items-center justify-center text-lg font-extrabold border border-red-500/30 shadow-inner">3</span>
                            Live Updates
                        </h2>
                        <div className="flex-1 min-h-[500px]">
                            <NewsScraper />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
