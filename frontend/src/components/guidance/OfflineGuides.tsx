import { Book, Download, FileText, Umbrella, AlertTriangle, MountainSnow } from 'lucide-react';

const GUIDES = [
    {
        id: 'flood-prep',
        title: 'Flood Preparation & Evacuation',
        description: 'Essential steps to secure your home, pack an emergency kit, and evacuate safely during heavy rains and rising water levels.',
        icon: <Umbrella size={24} className="text-blue-400" />,
        color: 'bg-blue-900/30 border-blue-500/40'
    },
    {
        id: 'landslide-safety',
        title: 'Landslide Warning Signs',
        description: 'Learn to identify the early warning signs of a landslide, especially in hilly areas of Sri Lanka, and know when to evacuate immediately.',
        icon: <MountainSnow size={24} className="text-amber-400" />,
        color: 'bg-amber-900/30 border-amber-500/40'
    },
    {
        id: 'emergency-kit',
        title: '72-Hour Emergency Kit Checklist',
        description: 'A comprehensive checklist of what you need to survive for 72 hours without power, clean water, or rescue services.',
        icon: <Book size={24} className="text-emerald-400" />,
        color: 'bg-emerald-900/30 border-emerald-500/40'
    },
    {
        id: 'first-aid',
        title: 'Basic Disaster First Aid',
        description: 'Quick reference guide for treating minor injuries, preventing infections in floodwater, and managing shock until help arrives.',
        icon: <AlertTriangle size={24} className="text-red-400" />,
        color: 'bg-red-900/30 border-red-500/40'
    }
];

export default function OfflineGuides() {
    const handleDownload = (guideId: string, title: string) => {
        // In a real application, this would trigger a download of a PDF or save to IndexedDB/ServiceWorker cache
        // For this prototype, we simulate a download action
        alert(`Downloading offline guide: ${title}... \nThis document will be available even without an internet connection.`);
    };

    return (
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <FileText size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Offline Survival Guides</h2>
                        <p className="text-emerald-100 text-xs">Download to access without internet</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <p className="text-sm text-slate-400 mb-2">
                    During a severe disaster, cell towers may go down. Download these verified safety guides from the Disaster Management Centre to your phone now.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GUIDES.map((guide) => (
                        <div
                            key={guide.id}
                            className={`p-4 rounded-xl border ${guide.color} flex flex-col justify-between transition-transform hover:-translate-y-1`}
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-slate-700 rounded-lg shadow-sm border border-slate-600">
                                        {guide.icon}
                                    </div>
                                    <h3 className="font-bold text-slate-200">{guide.title}</h3>
                                </div>
                                <p className="text-sm text-slate-400 mb-4">{guide.description}</p>
                            </div>

                            <button
                                onClick={() => handleDownload(guide.id, guide.title)}
                                className="flex items-center justify-center gap-2 w-full py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-600 hover:text-emerald-400 transition-colors shadow-sm"
                            >
                                <Download size={16} />
                                Save Offline
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
