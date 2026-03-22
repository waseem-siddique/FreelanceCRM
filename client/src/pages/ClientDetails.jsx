import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Building2, Calendar, IndianRupee, Activity, CheckCircle, Clock } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBar from '../components/TopBar';
import BorderGlow from '../components/BorderGlow';
import ThemeBackground from '../components/ThemeBackground';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const getStatusColor = (status) => {
  switch (status) {
    case 'Not Started': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    default: return 'bg-slate-200 text-slate-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientAndProjects();
  }, [clientId]);

  const fetchClientAndProjects = async () => {
    try {
      setLoading(true);
      const [clientRes, projectsRes] = await Promise.all([
        API.get(`/clients/${clientId}`),
        API.get('/projects')
      ]);
      setClient(clientRes.data);
      
      // Filter projects that belong to this client
      const clientProjects = projectsRes.data.filter(p => p.client?._id === clientId || p.client === clientId);
      setProjects(clientProjects);
      
    } catch (error) {
      toast.error('Failed to load client details');
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!client) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030008] transition-colors duration-300 relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <ThemeBackground />
      </div>

      <div className="relative z-10">
        <TopBar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
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
              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{client.name}</h1>
                    {client.company && (
                      <div className="flex items-center text-lg text-primary-600 dark:text-primary-300">
                        <Building2 className="w-5 h-5 mr-2" />
                        {client.company}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 dark:text-gray-300">
                  <div className="space-y-4">
                    {client.email && (
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 mr-3 text-slate-400 dark:text-gray-400" />
                        <a href={`mailto:${client.email}`} className="hover:text-primary-400 transition-colors">
                          {client.email}
                        </a>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-3 text-slate-400 dark:text-gray-400" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {client.address && (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 mr-3 text-slate-400 dark:text-gray-400 shrink-0 mt-1" />
                        <span className="whitespace-pre-wrap">{client.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {client.notes && (
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">Notes</h3>
                    <p className="text-slate-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {client.notes}
                    </p>
                  </div>
                )}
              </div>
            </BorderGlow>
          </motion.div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Associated Projects</h2>
            
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-[28px] border border-slate-200 dark:border-white/10">
                <p className="text-slate-500 dark:text-gray-400">No projects found for this client.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative focus-within:ring-2 focus-within:ring-primary-500 rounded-[28px]"
                  >
                    <Link to={`/project/${project._id}`} className="block h-full cursor-pointer hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] rounded-[28px] transition-all duration-300 group">
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
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            {project.budget && (
                              <span className="flex items-center text-slate-500 dark:text-gray-400">
                                <IndianRupee className="w-4 h-4 mr-1" />
                                {project.budget}
                              </span>
                            )}
                          </div>
                        </div>
                      </BorderGlow>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ClientDetails;
