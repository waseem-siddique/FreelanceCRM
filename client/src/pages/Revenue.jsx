import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import ThemeBackground from '../components/ThemeBackground';
import { useTheme } from '../contexts/ThemeContext';
import BorderGlow from '../components/BorderGlow';
import { IndianRupee, ArrowLeft, TrendingUp, CheckCircle, Clock, Search, Briefcase } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Revenue = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const paidRevenue = projects.reduce((sum, p) => p.status === 'Completed' ? sum + (p.budget || 0) : sum, 0);
  const pendingRevenue = projects.reduce((sum, p) => p.status !== 'Completed' ? sum + (p.budget || 0) : sum, 0);
  const paidPercentage = totalRevenue > 0 ? Math.round((paidRevenue / totalRevenue) * 100) : 0;

  // Filter and sort transactions (projects with a budget)
  const filteredTransactions = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.client?.name && project.client.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch && (project.budget > 0);
    })
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030008] transition-colors duration-300 relative pb-12">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <ThemeBackground />
      </div>

      <div className="relative z-10">
        <TopBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-slate-900 dark:text-white flex items-center"
            >
              <TrendingUp className="w-8 h-8 mr-3 text-primary-500" />
              Revenue Analytics
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <BorderGlow
                edgeSensitivity={30}
                backgroundColor={theme === 'dark' ? "#060010" : "#ffffff"}
                borderRadius={24}
                glowRadius={30}
                glowIntensity={theme === 'dark' ? 1 : 0.4}
                animated={false}
                colors={['#38bdf8', '#818cf8']}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-600 dark:text-gray-400">Total Revenue</h3>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                    <IndianRupee className="w-6 h-6 mr-1" />
                    {totalRevenue.toLocaleString()}
                  </p>
                </div>
              </BorderGlow>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BorderGlow
                edgeSensitivity={30}
                backgroundColor={theme === 'dark' ? "#060010" : "#ffffff"}
                borderRadius={24}
                glowRadius={30}
                glowIntensity={theme === 'dark' ? 1 : 0.4}
                animated={false}
                colors={['#10b981', '#34d399']}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-600 dark:text-gray-400">Realized (Paid)</h3>
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                    <IndianRupee className="w-6 h-6 mr-1" />
                    {paidRevenue.toLocaleString()}
                  </p>
                </div>
              </BorderGlow>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <BorderGlow
                edgeSensitivity={30}
                backgroundColor={theme === 'dark' ? "#060010" : "#ffffff"}
                borderRadius={24}
                glowRadius={30}
                glowIntensity={theme === 'dark' ? 1 : 0.4}
                animated={false}
                colors={['#f59e0b', '#fbbf24']}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-600 dark:text-gray-400">Pending</h3>
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
                    <IndianRupee className="w-6 h-6 mr-1" />
                    {pendingRevenue.toLocaleString()}
                  </p>
                </div>
              </BorderGlow>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white/50 dark:bg-[#0a0014]/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-gray-400">Revenue Goal Progress (Based on Paid)</span>
                <span className="text-sm font-bold text-primary-500">{paidPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${paidPercentage}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by client or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white dark:bg-[#0a0014]/80 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <BorderGlow
              edgeSensitivity={30}
              backgroundColor={theme === 'dark' ? "#060010" : "#ffffff"}
              borderRadius={24}
              glowRadius={40}
              glowIntensity={theme === 'dark' ? 0.7 : 0.3}
              animated={false}
              colors={theme === 'dark' ? ['#c084fc', '#f472b6'] : ['#e2e8f0', '#cbd5e1']}
            >
              <div className="overflow-x-auto rounded-[24px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#0d001a] border-b border-slate-200 dark:border-gray-800">
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-300">Project / Details</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-300">Client</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-300">Amount</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-300">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-gray-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx, idx) => (
                        <tr 
                          key={tx._id || idx}
                          className="border-b border-slate-100 dark:border-gray-800/50 hover:bg-slate-50 dark:hover:bg-[#0a0014] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <Link to={`/project/${tx._id}`} className="flex items-center hover:text-primary-500 transition-colors">
                              <Briefcase className="w-5 h-5 mr-3 text-slate-400 dark:text-gray-500" />
                              <span className="font-medium text-slate-900 dark:text-gray-100">{tx.title}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
                            {tx.client?.name || 'Unknown Client'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-900 dark:text-white flex items-center">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {tx.budget?.toLocaleString() || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              tx.status === 'Completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : tx.status === 'In Progress' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {tx.status === 'Completed' ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-gray-500">
                            {new Date(tx.updatedAt || tx.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-gray-400">
                          {searchTerm ? 'No transactions found matching your search.' : 'No revenue-generating projects found yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
