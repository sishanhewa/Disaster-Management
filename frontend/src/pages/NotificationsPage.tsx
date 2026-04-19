import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle, Info, AlertTriangle, AlertCircle, 
  Trash2, BellOff, ArrowRight, Loader2, Calendar
} from 'lucide-react';
import { notificationsApi } from '../api/endpoints';
import { Badge } from '../components/common/Badge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async (p = 0, append = false) => {
    try {
      if (append) setFetchingMore(true);
      else setLoading(true);
      
      const data = await notificationsApi.getNotifications({ page: p, size: 20 });
      setNotifications(prev => append ? [...prev, ...data.content] : data.content);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { unreadCount } = await notificationsApi.getUnreadCount();
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count');
    }
  };

  const markAsRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (notif?.isRead) return;

    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'WARNING': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'SUCCESS': return <CheckCircle size={20} className="text-emerald-500" />;
      case 'ERROR': return <AlertCircle size={20} className="text-rose-500" />;
      case 'INFO':
      default: return <Info size={20} className="text-sky-500" />;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] p-6 rounded-xl border border-slate-700 font-sans space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Notifications
          </h1>
          <p className="text-slate-400 flex items-center gap-2 mt-1">
            <Bell size={14} />
            Your alerts, warnings and system updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="critical" className="px-2">
              {unreadCount} New
            </Badge>
          )}
          <Button
            variant="secondary"
            size="sm"
            disabled={unreadCount === 0}
            onClick={markAllRead}
            icon={<CheckCircle size={15} />}
          >
            Mark all read
          </Button>
        </div>
      </div>

        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="animate-spin mb-4" />
              <p>Loading your notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-4">
              <BellOff size={48} className="text-slate-700" />
              <div className="text-center">
                <p className="text-lg font-medium text-slate-400">All caught up!</p>
                <p className="text-sm">You have no notifications at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-5 flex gap-4 transition-colors cursor-pointer group relative ${
                    !notif.isRead ? 'bg-emerald-500/[0.03] hover:bg-emerald-500/[0.05]' : 'hover:bg-slate-700/30'
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className={`mt-1 p-2.5 rounded-xl bg-slate-900/50 border border-slate-700 flex-shrink-0 group-hover:border-slate-500 transition-colors`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm font-bold transition-colors ${!notif.isRead ? 'text-white' : 'text-slate-400'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${!notif.isRead ? 'text-slate-300' : 'text-slate-500'}`}>
                      {notif.body}
                    </p>
                    
                    {!notif.isRead && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    )}
                  </div>

                  <button className="p-2 text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all self-center">
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {page < totalPages - 1 && (
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/20">
              <Button 
                variant="ghost" 
                className="w-full text-slate-400 hover:text-white"
                onClick={() => fetchNotifications(page + 1, true)}
                loading={fetchingMore}
              >
                Load More Notifications
              </Button>
            </div>
          )}
        </Card>
    </div>
  );
};

export default NotificationsPage;
