import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Waves, Mail, Lock, ArrowRight, Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { verificationApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';

const schema = yup.object({
  otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { user, logout, accessToken, setAuth } = useAuthStore();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Redirect if already verified (true, null, or undefined = no verification needed)
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Only stay on this page if emailVerified is explicitly false
    if (user.emailVerified !== false) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await verificationApi.verifyEmail(data.otp);
      toast.success('Email verified successfully!');
      
      // Update user in store to mark as verified
      if (user && accessToken) {
        setAuth({ ...user, emailVerified: true }, accessToken);
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid or expired OTP';
      toast.error(message, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (cooldown > 0) return;
    
    setIsResending(true);
    try {
      await verificationApi.requestEmailVerification();
      toast.success('New verification code sent to your email!', {
        icon: '📧',
        duration: 5000,
      });
      setCooldown(60); // 60 second cooldown
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send code. Please try again.';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      {/* Branding */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-5">
          <Waves className="text-white w-9 h-9" />
        </div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight mb-2">
          Verify Your Email
        </h1>
        <p className="text-slate-400 text-sm text-center max-w-md">
          Please verify your email address to continue using SIDMS
        </p>
      </div>

      {/* Verification Card */}
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        {/* Email Info */}
        <div className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Mail className="text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Verification code sent to</p>
            <p className="font-medium text-white">{user.email}</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-500/90">
            Check your inbox and spam folder. The code expires in 10 minutes.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Enter 6-Digit Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                {...register('otp')}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="w-full border border-slate-600 bg-slate-700 text-white text-center text-2xl tracking-[0.5em] placeholder-slate-500 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setValue('otp', value);
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                VERIFY EMAIL
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Didn't receive the code?
            </p>
            <button
              onClick={resendCode}
              disabled={isResending || cooldown > 0}
              className="flex items-center gap-2 text-sm font-medium text-emerald-500 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isResending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
            </button>
          </div>
        </div>

        {/* Logout Option */}
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-400 transition"
          >
            Use a different account
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-600">
          Secure verification powered by SIDMS
        </p>
      </div>
    </div>
  );
}
