import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Waves, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { authApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';

const schema = yup.object({
  displayName: yup.string().min(2, 'Name must be at least 2 characters').required('Display name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phone: yup.string().required('Phone number is required'),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms').required(),
}).required();

type FormData = yup.InferType<typeof schema>;

const strengthColor = ['bg-slate-700', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
const strengthLabel = ['—', 'Weak', 'Fair', 'Good', 'Strong'];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const password = watch('password', '');

  useEffect(() => {
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 8 && /[0-9]/.test(password)) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setPasswordStrength(s);
  }, [password]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { acceptTerms: _, confirmPassword: __, ...registerData } = data;
      const response = await authApi.register(registerData as any);
      setAuth(response.user, response.accessToken);
      
      // Show verification message if email was sent
      if (response.emailVerificationSent) {
        toast.success(response.message || 'Registration successful! Please check your email to verify your account.', {
          duration: 6000,
          icon: '📧',
        });
      } else {
        toast.success('Welcome to SIDMS! Please verify your email in settings.');
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = (err?: any) =>
    `w-full border ${err ? 'border-red-500' : 'border-slate-600'} bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition`;

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
        <p className="text-slate-400 text-sm">Create your account</p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-xl bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Row: Name + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={15} /></div>
                <input {...register('displayName')} className={`${inputCls(errors.displayName)} pl-9`} placeholder="Arjun Perera" />
              </div>
              {errors.displayName && <p className="text-[10px] text-red-400 mt-1">{errors.displayName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Phone size={15} /></div>
                <input {...register('phone')} className={`${inputCls(errors.phone)} pl-9`} placeholder="+94 7X XXX XXXX" />
              </div>
              {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={15} /></div>
              <input {...register('email')} type="email" className={`${inputCls(errors.email)} pl-9`} placeholder="name@example.com" />
            </div>
            {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          {/* Row: Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={15} /></div>
                <input {...register('password')} type={showPassword ? 'text' : 'password'} className={`${inputCls(errors.password)} pl-9 pr-10`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength bar */}
              <div className="flex gap-1 mt-1.5">
                {[1,2,3,4].map(bar => (
                  <div key={bar} className={`h-1 flex-1 rounded-full transition-all duration-500 ${bar <= passwordStrength ? strengthColor[passwordStrength] : 'bg-slate-700'}`} />
                ))}
              </div>
              <p className="text-[9px] text-slate-500 mt-0.5">{strengthLabel[passwordStrength]}</p>
              {errors.password && <p className="text-[10px] text-red-400 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={15} /></div>
                <input {...register('confirmPassword')} type={showPassword ? 'text' : 'password'} className={`${inputCls(errors.confirmPassword)} pl-9`} placeholder="••••••••" />
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-red-400 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group mt-2">
            <input {...register('acceptTerms')} type="checkbox" className="mt-1 accent-blue-500 w-4 h-4" />
            <span className="text-sm text-slate-400 group-hover:text-slate-300 transition select-none">
              I accept the{' '}
              <Link to="/terms" className="text-blue-400 underline underline-offset-2">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-400 underline underline-offset-2">Privacy Policy</Link>.
            </span>
          </label>
          {errors.acceptTerms && <p className="text-[10px] text-red-400">{errors.acceptTerms.message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                CREATE ACCOUNT
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}