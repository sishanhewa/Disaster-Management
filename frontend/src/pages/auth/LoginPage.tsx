import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Waves, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Activity } from 'lucide-react';
import { authApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      setAuth(response.user, response.accessToken);
      toast.success('Welcome back to SIDMS!');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      {/* Branding */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-5">
          <Waves className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight mb-1">
          SIDMS
        </h1>
        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Sri Lanka's Next-Gen Weather Intelligence
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Sign In</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 text-sm">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                {...register('email')}
                type="email"
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-slate-600'} bg-slate-700 text-slate-100 placeholder-slate-400 py-2 pl-9 pr-4 rounded focus:ring-2 focus:ring-blue-500 outline-none transition`}
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-bold text-slate-300 text-sm">Password</label>
              <span className="text-xs text-slate-500 cursor-help" title="Contact admin to reset">Forgot?</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`w-full border ${errors.password ? 'border-red-500' : 'border-slate-600'} bg-slate-700 text-slate-100 placeholder-slate-400 py-2 pl-9 pr-10 rounded focus:ring-2 focus:ring-blue-500 outline-none transition`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                LOG IN
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500 text-sm">
          New to the platform?{' '}
          <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition">
            Create an account
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        <span className="flex items-center gap-1"><Activity size={10} /> Live System</span>
        <span>•</span>
        <span>Secure Login</span>
        <span>•</span>
        <span>v1.0.4-SL</span>
      </div>
    </div>
  );
}