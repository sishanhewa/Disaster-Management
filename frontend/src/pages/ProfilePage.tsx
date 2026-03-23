import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, MapPin, Camera, Lock, Save, Loader2, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usersApi, mediaApi } from '../api/endpoints';
import { Badge } from '../components/common/Badge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { SpatialUnitSearch } from '../components/common/SpatialUnitSearch';
import { toast } from 'react-hot-toast';

interface ProfileFormData {
  displayName: string;
  phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore() as any;
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const [fetchingLocations, setFetchingLocations] = useState(false);

  const { register: profileReg, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      phone: user?.phone || '',
    }
  });

  const { register: passReg, handleSubmit: handlePassSubmit, reset: resetPass, watch } = useForm<PasswordFormData>();
  const newPassword = watch('newPassword');

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  const fetchSavedLocations = async () => {
    try {
      setFetchingLocations(true);
      const data = await usersApi.getSavedLocations();
      setSavedLocations(data);
    } catch (error) {
      console.error('Failed to fetch locations', error);
    } finally {
      setFetchingLocations(false);
    }
  };

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      const updatedUser = await usersApi.updateProfile({
        displayName: data.displayName,
        phone: data.phone,
        avatarUrl: user?.avatarUrl,
      });
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await mediaApi.upload(file, 'avatars');
      const updatedUser = await usersApi.updateProfile({
        displayName: user?.displayName || '',
        phone: user?.phone || '',
        avatarUrl: url,
      });
      setUser(updatedUser);
      toast.success('Avatar updated');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      await usersApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      resetPass();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const onAddLocation = async (unit: any) => {
    try {
      await usersApi.addSavedLocation({
        spatialUnitId: unit.id,
        nickname: unit.name,
        sortOrder: savedLocations.length,
      });
      toast.success('Location added');
      fetchSavedLocations();
    } catch (error) {
      toast.error('Failed to add location');
    }
  };

  const onDeleteLocation = async (id: string) => {
    try {
      await usersApi.deleteSavedLocation(id);
      toast.success('Location removed');
      fetchSavedLocations();
    } catch (error) {
      toast.error('Failed to remove location');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Basic Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="flex flex-col items-center p-8 text-center bg-slate-800/50 border-slate-700">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-700 ring-4 ring-slate-800 ring-offset-2 ring-offset-slate-900 border-2 border-emerald-500/30">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User size={64} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg">
                  <Camera size={18} className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={onAvatarUpload} disabled={uploading} />
                </label>
                {uploading && (
                  <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-emerald-500" />
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">{user?.displayName || 'User'}</h2>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {user?.roles?.map((role: string) => (
                  <Badge key={role} color="slate" size="xs">
                    {role.replace('ROLE_', '')}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-emerald-500" />
                Saved Locations
              </h3>
              <div className="space-y-3">
                <SpatialUnitSearch 
                  onSelect={onAddLocation} 
                  placeholder="Add a location..."
                  className="bg-slate-900/50 border-slate-700" 
                />
                
                <div className="mt-4 space-y-2">
                  {fetchingLocations ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="animate-spin text-slate-500" />
                    </div>
                  ) : savedLocations.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-4">No saved locations</p>
                  ) : (
                    savedLocations.map(loc => (
                      <div key={loc.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/50 hover:border-emerald-500/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <MapPin size={14} className="text-slate-500" />
                          <span className="text-white text-sm font-medium">{loc.nickname}</span>
                        </div>
                        <button 
                          onClick={() => onDeleteLocation(loc.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Forms */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <User size={18} className="text-emerald-500" />
                Personal Information
              </h3>
              <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Display Name"
                    {...profileReg('displayName', { required: 'Name is required' })}
                    icon={<User size={16} />}
                  />
                  <Input
                    label="Phone Number"
                    {...profileReg('phone')}
                    placeholder="+94 7X XXX XXXX"
                    icon={<Phone size={16} />}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" loading={loading} icon={<Save size={18} />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Lock size={18} className="text-amber-500" />
                Security
              </h3>
              <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  {...passReg('currentPassword', { required: 'Required' })}
                  icon={<Lock size={16} />}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    {...passReg('newPassword', { 
                      required: 'Required',
                      minLength: { value: 8, message: 'Min 8 characters' }
                    })}
                    icon={<Lock size={16} />}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...passReg('confirmPassword', { 
                      required: 'Required',
                      validate: val => val === newPassword || 'Passwords do not match'
                    })}
                    icon={<Lock size={16} />}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="outline" type="submit" loading={passwordLoading} icon={<Save size={18} />}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default ProfilePage;
