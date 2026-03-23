
import DisasterChatbot from './DisasterChatbot';
import OfflineGuides from './OfflineGuides';
import NewsScraper from './NewsScraper';
import { BookOpen, ShieldAlert } from 'lucide-react';

export default function IntelligentGuidance() {
    return (
        <div className="max-w-7xl mx-auto pb-10 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <BookOpen className="text-blue-600" size={32} />
                    Intelligent Guidance
                </h1>
                <p className="text-gray-600 mt-2 text-lg max-w-3xl">
                    Your centralized hub for disaster preparation, official alerts, and AI-powered survival assistance.
                    Stay informed, stay safe, and be prepared for any emergency in Sri Lanka.
                </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm mb-8 flex items-start gap-3">
                <ShieldAlert className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
                <div>
                    <h3 className="text-amber-800 font-bold text-sm">Emergency Disclaimer</h3>
                    <p className="text-amber-700 text-sm mt-1">
                        If you are in immediate, life-threatening danger, call emergency services (119) or use the SIDMS SOS Beacon immediately. Do not wait for AI guidance.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Chatbot & Guides (Takes up more space) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                            Ask the Expert AI
                        </h2>
                        <DisasterChatbot />
                    </section>

                    <section className="mt-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">2</span>
                            Download Survival Kits
                        </h2>
                        <OfflineGuides />
                    </section>
                </div>

                {/* Right Column: Live News (Sticky sidebar behavior) */}
                <div className="lg:col-span-4 flex flex-col">
                    <div className="sticky top-6 flex flex-col h-[calc(100vh-6rem)]">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">3</span>
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
