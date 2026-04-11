import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Shield, ShieldAlert, 
  Trash2, UserX, UserCheck, MoreVertical, 
  Mail, Phone, Calendar, RefreshCw, ChevronLeft, ChevronRight,
  Edit2
} from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ displayName: '', phone: '', isActive: false, roles: [] as string[] });

  // Available roles for the system
  const AVAILABLE_ROLES = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'responder', label: 'First Responder' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'govt_official', label: 'Govt Official' },
    { value: 'agency', label: 'Agency Partner' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers({ page, size: 15, q: searchTerm.trim() || undefined });
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleDeactivate = async (id: string, currentIsActive: boolean) => {
    const action = currentIsActive ? 'deactivate' : 'reactivate';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      setActionLoading(id);
      if (currentIsActive) {
        await adminApi.deactivateUser(id);
      } else {
        await adminApi.reactivateUser(id);
      }
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !currentIsActive } : u));
      toast.success(`User ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      displayName: user.displayName || '',
      phone: user.phone || '',
      isActive: user.isActive,
      roles: user.roles ? [...user.roles] : []
    });
    setIsEditModalOpen(true);
  };

  const handleToggleRole = (roleValue: string) => {
    setEditForm(prev => {
      const currentRoles = prev.roles;
      if (currentRoles.includes(roleValue)) {
        return { ...prev, roles: currentRoles.filter(r => r !== roleValue) };
      }
      return { ...prev, roles: [...currentRoles, roleValue] };
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      setActionLoading(editingUser.id);
      // Update basic details (and active status if endpoint supports it)
      const updatedUser = await adminApi.updateUser(editingUser.id, {
        displayName: editForm.displayName,
        phone: editForm.phone,
        isActive: editForm.isActive
      });

      // Update roles separately since backend expects different endpoint
      if (JSON.stringify(editForm.roles) !== JSON.stringify(editingUser.roles)) {
        const rolesRes = await adminApi.updateUserRoles(editingUser.id, editForm.roles);
        updatedUser.roles = rolesRes.roles;
      }

      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...updatedUser } : u));
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update user completely');
    } finally {
      setActionLoading(null);
    }
  };



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
            User Management
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Manage user accounts, roles, and platform access.</p>
        </div>
      </div>

        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..." 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-sky-500/50 outline-none transition-all placeholder:text-slate-600"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Button type="submit" variant="primary" icon={<Search size={18} />}>Search</Button>
              <Button 
                variant="secondary" 
                onClick={() => { setSearchTerm(''); setPage(0); }} 
                icon={<RefreshCw size={18} />}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 font-bold border-b border-slate-700">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Roles</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <RefreshCw className="animate-spin inline-block mr-2 text-sky-500" />
                      <span className="text-slate-500 font-medium">Loading user database...</span>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-600">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <Users size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-200">{u.displayName}</span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              ID: {u.id.substring(0, 8)}... • Joined {format(new Date(u.createdAt), 'MMM yyyy')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Mail size={12} className="text-slate-600" />
                            {u.email}
                          </div>
                          {u.phone && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                              <Phone size={12} className="text-slate-600" />
                              {u.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles?.map((r: string) => (
                            <Badge 
                              key={r} 
                              variant={r === 'admin' || r === 'ROLE_ADMIN' ? 'critical' : 'neutral'} 
                              size="sm"
                            >
                              {r.replace('ROLE_', '').toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <Badge variant={u.isActive ? 'active' : 'critical'} size="sm">
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => openEditModal(u)}
                            icon={<Edit2 size={14} />}
                            className="text-sky-500"
                          >
                            Manage
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => toggleDeactivate(u.id, u.isActive)}
                            icon={u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                            className={u.isActive ? 'text-rose-500' : 'text-emerald-500'}
                          >
                            {u.isActive ? 'Deactivate' : 'Reactivate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-900/40 border-t border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                disabled={page === 0} 
                onClick={() => setPage(page - 1)}
                icon={<ChevronLeft size={14} />}
              >
                Prev
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(page + 1)}
                icon={<ChevronRight size={14} />}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-md bg-slate-900 border-slate-700 shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Edit User Profile</h3>
              
              <div className="space-y-4">
                <Input 
                  label="Display Name"
                  value={editForm.displayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, displayName: e.target.value })}
                />
                <Input 
                  label="Phone Number"
                  value={editForm.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, phone: e.target.value })}
                />

                <div className="pt-2">
                  <span className="block text-sm font-bold text-slate-300 mb-2">Account Status:</span>
                  <label className="flex items-center gap-2 cursor-pointer pt-1 pb-3">
                    <input 
                      type="checkbox" 
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                    />
                    <span className={editForm.isActive ? 'text-emerald-400 font-bold text-sm' : 'text-rose-400 font-bold text-sm'}>
                      {editForm.isActive ? 'Account Active' : 'Account Deactivated'}
                    </span>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="block text-sm font-bold text-slate-300 mb-3">User Roles:</span>
                  <div className="grid grid-cols-2 gap-3">
                    {AVAILABLE_ROLES.map(role => {
                      const isChecked = editForm.roles.includes(role.value) || editForm.roles.includes('ROLE_' + role.value.toUpperCase());
                      return (
                        <label key={role.value} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-white transition-colors">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => handleToggleRole(role.value)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                          />
                          {role.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1" 
                    variant="secondary" 
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="primary" 
                    onClick={handleUpdateUser}
                    loading={actionLoading === editingUser?.id}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
    </div>
  );
};

export default AdminUsersPage;
