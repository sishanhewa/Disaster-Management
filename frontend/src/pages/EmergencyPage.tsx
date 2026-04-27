import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ShieldAlert,
  Info,
  Phone,
  LifeBuoy,
  X,
  Radio
} from 'lucide-react';
import { emergencyApi } from '../api/endpoints';
import { Badge } from '../components/common/Badge';
import { useVictimLocationStream } from '../hooks/useVictimLocationStream';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function EmergencyPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  // Queries - Only fetch user's SOS incidents
  const { data: mySos, isLoading: loadingSos } = useQuery({
    queryKey: ['mySos'],
    queryFn: emergencyApi.getMySosIncidents,
    refetchInterval: 10000, // Poll every 10 seconds for live updates
  });

  // Stream location for the first active incident
  const activeIncident = mySos?.find((i: any) => i.status !== 'RESOLVED');
  const { isStreaming } = useVictimLocationStream(
    activeIncident?.id || null,
    accessToken,
    !!activeIncident && activeIncident.status !== 'RESOLVED'
  );

  const handleCloseSos = async (id: string) => {
    if (!confirm('Are you sure you want to close this SOS incident? Only do this if you are safe or assistance is no longer needed.')) return;
    try {
      await emergencyApi.closeMySos(id);
      toast.success('SOS incident closed. Stay safe!');
      queryClient.invalidateQueries({ queryKey: ['mySos'] });
    } catch {
      toast.error('Failed to close incident. Please try again.');
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-3xl font-sans space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
             <ShieldAlert className="text-rose-500" size={36} />
             EMERGENCY STATUS
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
            </span>
            Live SOS Tracking & Support
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loadingSos ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6 bg-slate-800/20 rounded-3xl border border-slate-800 border-dashed">
            <Loader2 className="w-16 h-16 text-rose-500 animate-spin" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Synchronizing with Command Center...</p>
          </div>
        ) : !mySos || mySos.length === 0 ? (
          <div className="bg-slate-800/30 border-dashed border-2 border-slate-800 rounded-3xl p-20 text-center shadow-inner">
            <div className="bg-emerald-500/10 w-20 h-20 rounded-full border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 text-emerald-500 shadow-xl shadow-emerald-900/10">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">SYSTEM CLEAR</h3>
            <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
              No active SOS incidents detected for your account. You are currently in a <span className="text-emerald-400 font-bold">SECURE</span> state.
            </p>
            <div className="mt-10 p-6 bg-slate-900/50 rounded-2xl border border-slate-800 inline-block text-left max-w-sm">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Info size={14} className="text-sky-500" /> Emergency Protocols
               </p>
               <ul className="space-y-3 text-sm text-slate-400 font-medium">
                 <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Use the floating SOS button to broadcast.
                 </li>
                 <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Call 119 for immediate police assistance.
                 </li>
                 <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Ensure GPS is enabled on your device.
                 </li>
               </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {mySos.map((incident: any) => (
              <div key={incident.id} className="bg-slate-900 border-2 border-rose-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-rose-950/20 animate-in zoom-in-95 duration-500">
                {/* Status Banner */}
                <div className="px-8 py-4 bg-rose-600/10 border-b border-rose-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-rose-600 text-white p-2.5 rounded-xl shadow-lg shadow-rose-900/40 animate-pulse">
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg tracking-tight uppercase">Incident Active</h3>
                      <p className="text-rose-400 text-[10px] font-black tracking-widest uppercase">Status: {incident.status}</p>
                    </div>
                  </div>
                  <Badge variant="critical" className="px-4 py-1.5 font-black text-xs tracking-widest">HELP EN ROUTE</Badge>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Left: Details */}
                  <div className="p-8 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-8">
                     <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Incident Metadata</p>
                       <div className="space-y-4">
                          <div className="flex bg-slate-800/30 p-4 rounded-2xl border border-slate-800/80 items-center gap-4">
                             <Clock className="text-amber-500" size={20} />
                             <div>
                               <p className="text-[10px] text-slate-500 font-black uppercase">Broadcasting Since</p>
                               <p className="text-sm text-white font-bold">{formatDistanceToNow(new Date(incident.createdAt))} ago</p>
                             </div>
                          </div>
                          <div className="flex bg-slate-800/30 p-4 rounded-2xl border border-slate-800/80 items-center gap-4">
                             <MapPin className="text-sky-500" size={20} />
                             <div>
                               <p className="text-[10px] text-slate-500 font-black uppercase flex items-center gap-2">
                                 Live Coordinates
                                 {isStreaming && incident.id === activeIncident?.id && (
                                   <span className="flex items-center gap-1 text-emerald-400">
                                     <Radio size={10} className="animate-pulse" />
                                     Streaming
                                   </span>
                                 )}
                               </p>
                               <p className="text-sm text-white font-bold font-mono">{incident.lat?.toFixed(6)}, {incident.lng?.toFixed(6)}</p>
                             </div>
                          </div>
                          <div className="flex bg-slate-800/30 p-4 rounded-2xl border border-slate-800/80 items-center gap-4">
                             <Phone className="text-rose-500" size={20} />
                             <div>
                               <p className="text-[10px] text-slate-500 font-black uppercase">Verified ID</p>
                               <p className="text-sm text-white font-bold">AID-{incident.id.slice(0, 8).toUpperCase()}</p>
                             </div>
                          </div>
                       </div>
                     </div>

                     <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                           <LifeBuoy className="text-blue-400" size={20} />
                           <h4 className="font-black text-white tracking-widest text-[10px] uppercase">Rescue Protocol</h4>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          Our emergency responders have received your signal and are currently coordinating the nearest tactical unit to your location.
                        </p>
                        <button className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-blue-900/20">
                           Open Crisis Chat
                        </button>
                     </div>
                  </div>

                  {/* Right: Timeline (Spans 2 columns) */}
                  <div className="lg:col-span-2 p-8 bg-slate-900/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Live Action Timeline</p>
                    <div className="space-y-10 relative ml-2">
                      <div className="absolute left-[15px] top-8 bottom-4 w-[2px] bg-slate-800" />
                      
                      {incident.timeline?.length > 0 ? incident.timeline.map((step: any, i: number) => (
                        <div key={i} className="flex gap-6 relative z-10 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                          <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ring-8 ring-slate-900 ${
                            i === 0 ? 'bg-sky-500 shadow-lg shadow-sky-900/40' : 'bg-slate-800'
                          }`}>
                            {i === 0 ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-slate-500" />}
                          </div>
                          <div className="space-y-2">
                            <h5 className={`font-black tracking-tight ${i === 0 ? 'text-white text-lg' : 'text-slate-400 text-sm'}`}>
                               {step.action}
                            </h5>
                            {step.notes && (
                              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800/80 max-w-xl">
                                <p className="text-sm text-slate-300 italic leading-relaxed">"{step.notes}"</p>
                              </div>
                            )}
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest">
                              <span className="text-sky-500">{step.actorName}</span>
                              <span className="text-slate-700">•</span>
                              <span className="text-slate-500 flex items-center gap-1"><Clock size={10} /> {new Date(step.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="flex gap-6 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center ring-8 ring-slate-900">
                             <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-black text-white uppercase tracking-widest text-xs">Signal Initialized</h5>
                            <p className="text-xs text-slate-500 font-medium">Awaiting first responder triage...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="px-8 py-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signal Active — ID: AID-{incident.id.slice(0, 8).toUpperCase()}</span>
                   </div>
                   <button
                     onClick={() => handleCloseSos(incident.id)}
                     className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-2"
                   >
                     <X size={14} /> Close Case
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
