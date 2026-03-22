import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Save, User, Building2, Phone, Mail, ArrowLeft } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBar from '../components/TopBar';
import BorderGlow from '../components/BorderGlow';
import ThemeBackground from '../components/ThemeBackground';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/auth/profile');
      setProfile(data);
    } catch (error) {
      // If endpoint doesn't exist, use data from localStorage as fallback
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setProfile({
          name: user.name || '',
          email: user.email || '',
          companyName: '',
          phone: '',
        });
        toast.error('Profile endpoint not ready – using local data');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', profile);
      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      // If backend endpoint doesn't exist, show a message
      toast.error('Backend profile update not implemented yet');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030008] transition-colors duration-300 relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <ThemeBackground />
      </div>

      <div className="relative z-10">
        <TopBar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-slate-900 dark:text-white mb-8"
        >
          Profile Settings
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor={theme === 'dark' ? "#060010" : "#ffffff"}
            borderRadius={28}
            glowRadius={40}
            glowIntensity={theme === 'dark' ? 1 : 0.5}
            coneSpread={25}
            animated={false}
            colors={theme === 'dark' ? ['#c084fc', '#f472b6', '#38bdf8'] : ['#f8fafc', '#f1f5f9', '#e2e8f0']}
          >
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0a0515] border border-slate-300 dark:border-gray-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0a0515] border border-slate-300 dark:border-gray-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={profile.companyName || ''}
                    onChange={handleChange}
                    placeholder="Your company name (optional)"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0a0515] border border-slate-300 dark:border-gray-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900 (optional)"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0a0515] border border-slate-300 dark:border-gray-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </BorderGlow>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;