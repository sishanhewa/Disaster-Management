import { useState, type ReactNode } from 'react';
import { Book, Download, FileText, Umbrella, AlertTriangle, MountainSnow, Loader2, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface GuideToken {
    id: string;
    title: string;
    description: string;
    icon: ReactNode;
    color: string;
    content: string;
}

const GUIDES: GuideToken[] = [
    {
        id: 'flood-prep',
        title: 'Flood Evacuation & Protocol',
        description: 'Crucial checklists to secure your perimeter and navigate life-threatening rising waters.',
        icon: <Umbrella size={24} className="text-blue-400" />,
        color: 'bg-blue-900/30 border-blue-500/40',
        content: `SIDMS OFFLINE INTELLIGENCE REPORT
Subject: Flood Evacuation & Preparation Protocol

1. PRIOR TO FLOODING EVENTS
- Secure a waterproof Emergency Supply Kit (water, 72h rations, radio, batteries).
- Transfer vital documentation (ID, property deeds) directly into watertight sealed envelopes.
- Safely elevate critical appliances above baseline floor height to prevent immediate water damage.
- Disable primary electrical breaker systems if ground waters begin intruding into your home perimeter.

2. NAVIGATING ACTIVE FLOODS
- AVOID WALKING THROUGH MOVING WATER: Merely 6 inches of fast-moving flood torrent can physically sweep you off your feet.
- AVOID DRIVING: Never drive into flooded intersections. Cars can easily stall and be swept away by rapid currents.
- EVACUATE ONLY TO HIGHEST ELEVATION: If water rises rapidly within your house, climb to a roof safely. DO NOT physically trap yourself within a closed attic.

3. POST-DISASTER PROTOCOL
- AVOID FLOOD WATERS: Standing water is critically dangerous due to live downstream electrical discharges or sewage biohazards.
- DRINK ONLY verified bottled water until authorities confirm the local mainline water is chemically safe for biological consumption.
`
    },
    {
        id: 'landslide-safety',
        title: 'Landslide Early Warnings',
        description: 'Identify geological fragmentation signs in high-risk zones across Sri Lanka.',
        icon: <MountainSnow size={24} className="text-amber-400" />,
        color: 'bg-amber-900/30 border-amber-500/40',
        content: `SIDMS OFFLINE INTELLIGENCE REPORT
Subject: Landslide Early Warnings & Safety Protocols

1. CRITICAL VISUAL WARNING SIGNS
- Landscape fragmentation: Visually monitor the formation of deep active cracks forming across external terrain, paved roads, or internal house foundations.
- Geological movement: Fences, retaining walls, utility poles, or trees actively tilting out of standard vertical alignment.
- Hydrological anomalies: Normal springs/seepage areas suddenly disappearing entirely, or previously clear streams rapidly turning dark and muddy indicating severe upstream sediment shifts.
- Structural stress: Doors or external windows physically jamming tight for the first time due to foundation torsion.

2. DURING A SUSPECTED LANDSLIDE
- IF INDOORS: Curl firmly into a tight ball providing maximal protection to your skull/head area. Attempt to find immediate cover directly under heavy structural furniture if physical evacuation is completely impossible.
- IF OUTDOORS: Run directly away from the immediate downward path of the incoming slide at a highly aggressive 90-degree lateral angle.
- Listen for sudden extreme increases in external volume—approaching landslides often generate distinct roaring acoustics resembling multiple accelerating freight trains.

3. RECOVERY PROTOCOL
- REMAIN DISTANT: The immediate landslide impact perimeter remains extremely volatile. Secondary cascade slides often follow precisely matching the primary fracture path.
- Monitor active local Sri Lankan emergency radio broadcasts.
`
    },
    {
        id: 'emergency-kit',
        title: '72-Hour Rapid Kit Checklist',
        description: 'Complete inventory list engineered to maintain bio-survival independently of network utilities.',
        icon: <Book size={24} className="text-emerald-400" />,
        color: 'bg-emerald-900/30 border-emerald-500/40',
        content: `SIDMS OFFLINE INTELLIGENCE REPORT
Subject: 72-Hour Survival Inventory Checklist

PURPOSE: Maintaining biological self-sufficiency for roughly 72 hours until federal Disaster Management elements can intercept your target zone.

[ ] HYDRATION UNIT: Minimum 1 Gallon (4 Liters) of clean sealed drinking water per human/animal per day.
[ ] CALORIC SUPPLY: 3 full days of heavy non-perishable caloric items (canned proteins, complex carbohydrates, dry compressed rations).
[ ] MEDICAL INVENTORY: Fully equipped physical first-aid supply payload.
[ ] COMMS HARDWARE: Local battery-powered (or hand-crank compatible) AM/FM wideband emergency radio.
[ ] ILLUMINATION: Intense physical flashlight payload with separately stored supplementary batteries.
[ ] SANITARY PAYLOAD: Standard wet wipes, garbage containment bags, and sealed plastic locking ties.
[ ] ENVIRONMENTAL SHIELDING: Advanced waterproof protective clothing systems, sturdy physical boots, and external thermal Mylar blankets.
[ ] NAVIGATIONAL TOOLS: Printed, physical map diagrams of all immediate local regional topography and primary exit avenues.
`
    },
    {
        id: 'first-aid',
        title: 'Disaster Triage First Aid',
        description: 'High-yield trauma stabilization instructions pending professional paramedic arrival.',
        icon: <AlertTriangle size={24} className="text-red-400" />,
        color: 'bg-red-900/30 border-red-500/40',
        content: `SIDMS OFFLINE INTELLIGENCE REPORT
Subject: Emergency Triage & Basic Trauma First Aid

WARNING: This guide does not replace professional Paramedical intervention. Utilize these techniques to stabilize incoming physical trauma strictly while awaiting specialized emergency extraction.

1. SEVERE BLEEDING PROTOCOL
- Immediate Action: Apply direct, overwhelming physical pressure rapidly against the identified source using cleanly available fabrics or your bare hands.
- Maintain persistent absolute force until bleeding significantly halts. DO NOT remove underlying saturated bandages; apply secondary layers progressively over them.

2. SHOCK MANAGEMENT
- Verify the subject is continuously breathing normally.
- If no evident spinal trauma is perceived, lay the subject horizontally with maximum physical comfort.
- Elevate their feet vertically roughly 12 inches upwards to maintain blood pressure within the core.
- Apply external physical thermal shielding to aggressively prevent freezing.

3. BURN STABILIZATION
- Immediately deploy sustained cool (NOT freezing nor icy) clean water dynamically across the impacted burn zone.
- Shield the compromised burn zone by gracefully wrapping a clean, completely dry sterile cloth across it to isolate against biological contamination.
- NEVER actively pop newly generated physical burn blisters.

4. FRACTURE IMMOBILIZATION
- Enforce strict total immobility across the broken limb. 
- DO NOT attempt aggressive manipulation. If physical splinting is absolutely necessary for rapid evacuation, strap a secondary rigged supportive brace strictly above and cleanly below the specific fracture point.
`
    }
];

export default function OfflineGuides() {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [downloadedId, setDownloadedId] = useState<string | null>(null);

    const generateAndDownloadPDF = async (guide: GuideToken) => {
        setDownloadingId(guide.id);
        setDownloadedId(null);
        
        try {
            // Simulated generation buffer to show UI feedback
            await new Promise((resolve) => setTimeout(resolve, 800));

            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Set up Document
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(20, 40, 70);
            
            // Header
            doc.text('SIDMS INTELLIGENCE', 15, 20);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('Sri Lanka Integrated Disaster Management System', 15, 26);
            
            // Line
            doc.setDrawColor(200, 200, 200);
            doc.line(15, 30, 195, 30);

            // Title
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(guide.title.toUpperCase(), 15, 42);

            // Body
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            
            // Split text to fit A4 width
            const lines = doc.splitTextToSize(guide.content.split('SIDMS OFFLINE INTELLIGENCE REPORT')[1].trim(), 175);
            doc.text(lines, 15, 55);

            // Footer
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`Generated securely by SIDMS Framework: ${new Date().toLocaleDateString()}`, 15, 280);

            // Trigger Save
            doc.save(`SIDMS_Guide_${guide.id}.pdf`);
            
            setDownloadedId(guide.id);
            setTimeout(() => setDownloadedId(null), 3000); // clear success state
        } catch (err) {
            console.error(err);
            alert("Failed to render PDF payload.");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <FileText size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-extrabold text-lg tracking-wide">Offline Survival Kits</h2>
                        <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider mt-0.5">Download real PDF vectors</p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <p className="text-sm text-slate-400 mb-2 font-medium">
                    During severe multi-factor disasters, physical cell-tower communication matrices commonly fail globally. 
                    Actively download these verified PDF safety instructions directly onto your local device storage <span className="text-white font-bold">now</span>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GUIDES.map((guide) => (
                        <div
                            key={guide.id}
                            className={`p-5 rounded-2xl border ${guide.color} flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg bg-slate-800/80`}
                        >
                            <div className="mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-slate-900 rounded-xl shadow-inner border border-slate-700">
                                        {guide.icon}
                                    </div>
                                    <h3 className="font-bold text-slate-100 leading-tight">{guide.title}</h3>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">{guide.description}</p>
                            </div>

                            <button
                                onClick={() => generateAndDownloadPDF(guide)}
                                disabled={downloadingId === guide.id}
                                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                                    downloadedId === guide.id
                                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50'
                                        : downloadingId === guide.id
                                        ? 'bg-slate-700 text-slate-400 border border-slate-600 cursor-wait'
                                        : 'bg-slate-700 hover:bg-emerald-600/80 hover:border-emerald-500 border border-slate-600 text-slate-200'
                                }`}
                            >
                                {downloadedId === guide.id ? (
                                    <><CheckCircle2 size={18} /> Kit Downloaded</>
                                ) : downloadingId === guide.id ? (
                                    <><Loader2 size={18} className="animate-spin" /> Rendering PDF...</>
                                ) : (
                                    <><Download size={18} /> Download Kit</>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
