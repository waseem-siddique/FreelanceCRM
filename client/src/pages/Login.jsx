import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Key } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';
import Beams from '../components/Beams';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [step, setStep] = useState('login');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedState = localStorage.getItem('login_state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed.step === 'otp') {
        setStep('otp');
        setFormData(parsed.formData);

        if (parsed.lastResend) {
          const elapsed = Math.floor((Date.now() - parsed.lastResend) / 1000);
          if (elapsed < 30) {
            setCountdown(30 - elapsed);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', formData);
      if (data.requiresOtp) {
        toast.success(data.message || 'OTP sent to your email');
        setStep('otp');
        const now = Date.now();
        localStorage.setItem('login_state', JSON.stringify({ step: 'otp', formData, lastResend: now }));
        setCountdown(30);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.requiresOtp) {
        toast.success(error.response.data.message || 'OTP sent to your email');
        setStep('otp');
        const now = Date.now();
        localStorage.setItem('login_state', JSON.stringify({ step: 'otp', formData, lastResend: now }));
        setCountdown(30);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-login', {
        email: formData.email,
        otp
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.removeItem('login_state');
      toast.success('Login verified successfully!');
      navigate('/dashboard');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      if (step === 'reset-password' || step === 'forgot-password') {
        await API.post('/auth/forgot-password', { email: formData.email });
      } else {
        await API.post('/auth/resend-otp', { email: formData.email });
      }
      toast.success('OTP resent successfully');
      // Only set local storage if it's the login OTP
      if (step === 'otp') {
        const now = Date.now();
        localStorage.setItem('login_state', JSON.stringify({ step: 'otp', formData, lastResend: now }));
      }
      setCountdown(30);
    } catch (error) {
      // toast err handled by interceptor
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email: formData.email });
      toast.success(data.message);
      setStep('reset-password');
      setCountdown(30);
    } catch (error) {
      // toast err handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/reset-password', { 
        email: formData.email, 
        otp, 
        newPassword: formData.newPassword 
      });
      toast.success(data.message);
      setStep('login');
      setFormData({ ...formData, password: '', newPassword: '', confirmPassword: '' });
      setOtp('');
    } catch (error) {
      // toast err handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[@$!%*?&]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(formData.newPassword);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 -z-10">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      {/* Form Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white/20 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/30 pointer-events-auto"
        >
          {step === 'otp' ? (
            <div>
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="text-center text-4xl font-extrabold text-white"
              >
                Verification
              </motion.h2>
              <p className="mt-2 text-center text-sm text-gray-200">
                Enter the 6-digit code sent to {formData.email} <br />
                <span className="text-primary-300 font-semibold border border-primary-300/30 bg-primary-900/20 px-2 py-1 rounded inline-block mt-2">Demo OTP: 123456</span>
              </p>
              <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="------"
                    className="w-full px-4 py-3 bg-white/40 border border-white/50 text-center tracking-widest text-3xl rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </motion.button>
              </form>
              <div className="text-center mt-6 flex flex-col space-y-4">
                <button
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  className={`text-sm font-medium ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-white hover:text-gray-200'} transition-colors inline-block`}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend Verification Code'}
                </button>
                <button
                  onClick={() => {
                    setStep('login');
                    localStorage.removeItem('login_state');
                  }}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  &larr; Back to Login
                </button>
              </div>
            </div>
          ) : step === 'forgot-password' ? (
            <div>
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="text-center text-4xl font-extrabold text-white"
              >
                Reset Password
              </motion.h2>
              <p className="mt-2 text-center text-sm text-gray-200">
                Enter your email address to receive a recovery code
              </p>
              <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 bg-white/40 border border-white/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Recovery Code'}
                </motion.button>
              </form>
              <div className="text-center mt-6">
                <button
                  onClick={() => setStep('login')}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  &larr; Back to Login
                </button>
              </div>
            </div>
          ) : step === 'reset-password' ? (
            <div>
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="text-center text-3xl font-extrabold text-white"
              >
                Create New Password
              </motion.h2>
              <p className="mt-2 text-center text-sm text-gray-200">
                Enter the 6-digit code and your new password <br />
                <span className="text-primary-300 font-semibold border border-primary-300/30 bg-primary-900/20 px-2 py-1 rounded inline-block mt-2">Demo OTP: 123456</span>
              </p>
              <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="------"
                      className="w-full px-4 py-3 bg-white/40 border border-white/50 text-center tracking-widest text-3xl rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">New Password</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-300" />
                      </div>
                      <input
                        name="newPassword"
                        type="password"
                        required
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 bg-white/40 border border-white/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                    {/* Password Strength Indicator */}
                    {formData.newPassword && (
                      <div className="mt-3">
                        <div className="flex bg-gray-700/50 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${strength < 3 ? 'bg-red-500' : strength < 5 ? 'bg-yellow-400' : 'bg-green-500'}`}
                            style={{ width: `${(strength / 5) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] sm:text-xs">
                          <span className={formData.newPassword.length >= 8 ? 'text-green-400' : 'text-gray-400'}>8+ chars</span>
                          <span className={/[A-Z]/.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}>ABC</span>
                          <span className={/[a-z]/.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}>abc</span>
                          <span className={/\d/.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}>123</span>
                          <span className={/[@$!%*?&]/.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}>!@#</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">Confirm Password</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-300" />
                      </div>
                      <input
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 bg-white/40 border border-white/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Changing Password...' : 'Reset Password'}
                </motion.button>
              </form>
              <div className="text-center mt-6 flex flex-col space-y-4">
                <button
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  className={`text-sm font-medium ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-300 hover:text-primary-200'} transition-colors inline-block`}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend Verification Code'}
                </button>
                <button
                  onClick={() => setStep('login')}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  &larr; Back to Login
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <motion.h2
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-center text-4xl font-extrabold text-white"
                >
                  Welcome Back
                </motion.h2>
                <p className="mt-2 text-center text-sm text-gray-200">
                  Sign in to your account
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                      Email address
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-300" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 bg-white/40 border border-white/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-300" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pl-10 bg-white/40 border border-white/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setStep('forgot-password')}
                        className="text-xs font-medium text-gray-300 hover:text-white transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign in
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-200">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary-300 hover:text-primary-200">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;