import React, { useState, useEffect } from 'react';
import { 
  Shield, Phone, Mail, CheckCircle, AlertCircle, 
  Loader2, UserCheck, UserX, Send, RefreshCw 
} from 'lucide-react';
import { verificationApi } from '../../api/endpoints';
import { extractApiErrorMessage } from '../../api/error';
import { toast } from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

interface VerificationStatus {
  hasEmail: boolean;
  emailVerified: boolean;
  phone: string | null;
  phoneVerified: boolean;
  hasPendingEmailVerification: boolean;
  hasPendingPhoneVerification: boolean;
  isVolunteer: boolean;
}

const VerificationSection: React.FC = () => {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verificationType, setVerificationType] = useState<'email' | 'volunteer' | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await verificationApi.getStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch verification status', error);
    }
  };

  const requestEmailVerification = async () => {
    try {
      setLoading(true);
      await verificationApi.requestEmailVerification();
      toast.success('Verification code sent to your email');
      setVerificationType('email');
      setShowOtpInput(true);
      fetchStatus();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Failed to send verification code'));
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (!otpInput || otpInput.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      await verificationApi.verifyEmail(otpInput);
      toast.success('Email verified successfully!');
      setShowOtpInput(false);
      setOtpInput('');
      setVerificationType(null);
      fetchStatus();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Invalid or expired OTP'));
    } finally {
      setLoading(false);
    }
  };

  const requestVolunteerVerification = async () => {
    if (!phoneInput || !phoneInput.match(/^(0|\+94)?[0-9]{9,10}$/)) {
      toast.error('Please enter a valid Sri Lankan phone number');
      return;
    }
    try {
      setLoading(true);
      await verificationApi.requestVolunteerVerification(phoneInput);
      toast.success('Verification code sent to your phone');
      setVerificationType('volunteer');
      setShowOtpInput(true);
      fetchStatus();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Failed to send verification code'));
    } finally {
      setLoading(false);
    }
  };

  const verifyVolunteer = async () => {
    if (!otpInput || otpInput.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      await verificationApi.verifyVolunteer(otpInput);
      toast.success('Volunteer application approved! You can now accept tasks.');
      setShowOtpInput(false);
      setOtpInput('');
      setPhoneInput('');
      setVerificationType(null);
      fetchStatus();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Invalid or expired OTP'));
    } finally {
      setLoading(false);
    }
  };

  const toggleVolunteer = async () => {
    try {
      setLoading(true);
      const result = await verificationApi.toggleVolunteerStatus();
      toast.success(result.isVolunteer 
        ? 'You are now active as a volunteer' 
        : 'You have opted out of volunteer tasks'
      );
      fetchStatus();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Failed to toggle volunteer status'));
    } finally {
      setLoading(false);
    }
  };

  const cancelVerification = () => {
    setShowOtpInput(false);
    setOtpInput('');
    setVerificationType(null);
  };

  if (!status) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-emerald-500" size={24} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Shield size={18} className="text-emerald-500" />
        Verification & Volunteer Status
      </h3>

      <div className="space-y-6">
        {/* Email Verification */}
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${status.emailVerified ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                {status.emailVerified ? (
                  <CheckCircle size={20} className="text-emerald-500" />
                ) : (
                  <Mail size={20} className="text-amber-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">Email Verification</p>
                <p className="text-xs text-slate-500">
                  {status.emailVerified 
                    ? 'Your email is verified' 
                    : status.hasPendingEmailVerification 
                      ? 'Verification code sent - check your email'
                      : 'Verify your email for security'}
                </p>
              </div>
            </div>
            {!status.emailVerified && !showOtpInput && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={requestEmailVerification}
                loading={loading}
              >
                Verify
              </Button>
            )}
            {status.emailVerified && (
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                <CheckCircle size={12} /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Phone Verification & Volunteer */}
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${status.phoneVerified ? 'bg-emerald-500/20' : 'bg-slate-600/20'}`}>
                {status.phoneVerified ? (
                  <CheckCircle size={20} className="text-emerald-500" />
                ) : (
                  <Phone size={20} className="text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">Phone Verification</p>
                <p className="text-xs text-slate-500">
                  {status.phoneVerified 
                    ? status.phone 
                    : status.hasPendingPhoneVerification 
                      ? 'Verification code sent - check your phone'
                      : 'Required for volunteer status'}
                </p>
              </div>
            </div>
            {!status.phoneVerified && !showOtpInput && (
              <span className="text-xs text-amber-500">Not verified</span>
            )}
            {status.phoneVerified && (
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                <CheckCircle size={12} /> Verified
              </span>
            )}
          </div>

          {/* Volunteer Status */}
          {status.phoneVerified && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${status.isVolunteer ? 'bg-emerald-500/20' : 'bg-slate-600/20'}`}>
                    {status.isVolunteer ? (
                      <UserCheck size={20} className="text-emerald-500" />
                    ) : (
                      <UserX size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">Volunteer Status</p>
                    <p className="text-xs text-slate-500">
                      {status.isVolunteer 
                        ? 'You can accept volunteer tasks'
                        : 'Become a volunteer to help during disasters'}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={status.isVolunteer ? 'outline' : 'primary'}
                  onClick={toggleVolunteer}
                  loading={loading}
                >
                  {status.isVolunteer ? 'Opt Out' : 'Opt In'}
                </Button>
              </div>
            </div>
          )}

          {/* Apply for Volunteer (if phone not verified) */}
          {!status.phoneVerified && status.emailVerified && !showOtpInput && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-sm text-slate-400 mb-3">
                Apply to become a volunteer. You will receive an OTP on your phone.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Phone number (e.g., 0771234567)"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={requestVolunteerVerification}
                  loading={loading}
                  icon={<Send size={16} />}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* OTP Input */}
        {showOtpInput && (
          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-amber-500" />
              <p className="text-sm font-medium text-amber-500">
                Enter the 6-digit code sent to your {verificationType === 'email' ? 'email' : 'phone'}
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="000000"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="flex-1 text-center text-lg tracking-widest"
              />
              <Button 
                onClick={verificationType === 'email' ? verifyEmail : verifyVolunteer}
                loading={loading}
              >
                Verify
              </Button>
              <Button 
                variant="outline"
                onClick={cancelVerification}
                icon={<RefreshCw size={16} />}
              >
                Cancel
              </Button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Didn't receive the code? Check your spam folder.
              </p>
              {verificationType === 'email' && (
                <button
                  onClick={requestEmailVerification}
                  disabled={loading}
                  className="text-xs text-emerald-500 hover:text-emerald-400 font-medium disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
              {verificationType === 'volunteer' && (
                <button
                  onClick={() => {
                    if (phoneInput) {
                      requestVolunteerVerification();
                    }
                  }}
                  disabled={loading || !phoneInput}
                  className="text-xs text-emerald-500 hover:text-emerald-400 font-medium disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        {!status.emailVerified && (
          <p className="text-xs text-slate-500 italic">
            Email verification is required before applying as a volunteer.
          </p>
        )}
      </div>
    </Card>
  );
};

export default VerificationSection;
