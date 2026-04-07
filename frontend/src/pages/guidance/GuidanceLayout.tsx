import { Link, Outlet, useLocation } from 'react-router-dom';
import { Bot, Newspaper, FileText, ArrowLeft, ShieldAlert } from 'lucide-react';

function GuidanceNavigation() {
    const location = useLocation();
    const currentPath = location.pathname;

    const navigateItems = [
        { path: '/guidance/chat', label: 'AI Survival Guide', icon: <Bot size={18} /> },
        { path: '/guidance/news', label: 'Live DMC Updates', icon: <Newspaper size={18} /> },
        { path: '/guidance/guides', label: 'Offline Kits', icon: <FileText size={18} /> },
    ];

    return (
        <div className="bg-emerald-700 text-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-600">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full hidden sm:block">
                        <ShieldAlert size={20} className="text-emerald-100" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg sm:text-xl">Intelligent Guidance Center</h1>
                        <p className="text-emerald-200 text-xs hidden sm:block">Verified Disaster Management Information</p>
                    </div>
                </div>

                <Link to="/" className="text-sm font-medium text-emerald-100 hover:text-white flex items-center gap-1 transition-colors bg-emerald-800/50 hover:bg-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-600">
                    <ArrowLeft size={16} />
                    Back to Relief App
                </Link>
            </div>

            <div className="flex overflow-x-auto hide-scrollbar">
                {navigateItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 p-3 text-sm font-semibold transition-colors border-b-2 ${currentPath === item.path || (currentPath === '/guidance' && item.path === '/guidance/chat')
                            ? 'bg-emerald-800 text-white border-white'
                            : 'text-emerald-100 hover:bg-emerald-600 hover:text-white border-transparent'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function GuidanceLayout() {
    return (
        <div className="max-w-6xl mx-auto pb-10 animate-fade-in">
            <GuidanceNavigation />

            {/* Disclaimer Banner */}
            <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm mb-6 flex items-start gap-3">
                <ShieldAlert className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
                <div>
                    <h3 className="text-amber-400 font-bold text-sm">Emergency Disclaimer</h3>
                    <p className="text-amber-300/80 text-sm mt-1">
                        If you are in immediate, life-threatening danger, call emergency services (119) or use the SIDMS SOS Beacon immediately. Do not wait for AI guidance.
                    </p>
                </div>
            </div>

            <div className="bg-transparent h-full">
                {/* The child routes will render here */}
                <Outlet />
            </div>
        </div>
    );
}
