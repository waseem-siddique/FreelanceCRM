import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Users, FolderOpen, Activity, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBar from '../components/TopBar';
import BorderGlow from '../components/BorderGlow';
import GlassIcons from '../components/GlassIcons';
import Beams from '../components/Beams';
import { useTheme } from '../contexts/ThemeContext';
import DotGrid from '../components/DotGrid';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    projectsByStatus: [],
    totalBudget: 0,
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [clientsRes, projectsRes] = await Promise.all([
        API.get('/clients'),
        API.get('/projects'),
      ]);

      const clients = clientsRes.data;
      const projects = projectsRes.data;

      const totalClients = clients.length;
      const totalProjects = projects.length;

      // Count projects by status
      const statusCounts = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});

      const projectsByStatus = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }));

      const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

      const recentProjects = projects
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalClients,
        totalProjects,
        projectsByStatus,
        totalBudget,
        recentProjects,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const glassItems = [
    { icon: <span className="font-bold">{stats.totalClients}</span>, color: 'blue', label: 'Clients', link: '/clients' },
    { icon: <span className="font-bold">{stats.totalProjects}</span>, color: 'purple', label: 'Projects', link: '/projects' },
    { icon: <span className="font-bold">₹{stats.totalBudget > 999 ? (stats.totalBudget / 1000).toFixed(1) + 'k' : stats.totalBudget}</span>, color: 'green', label: 'Revenue', link: '/revenue' },
    { icon: <span className="font-bold">{stats.projectsByStatus.find(s => s.name === 'In Progress')?.value || 0}</span>, color: 'indigo', label: 'Active', link: '/projects?status=In%20Progress' },
    { icon: <span className="font-bold">{stats.projectsByStatus.find(s => s.name === 'Completed')?.value || 0}</span>, color: 'orange', label: 'Done', link: '/projects?status=Completed' },
    { icon: <span className="font-bold">{stats.projectsByStatus.find(s => s.name === 'Not Started')?.value || 0}</span>, color: 'red', label: 'Pending', link: '/projects?status=Not%20Started' },
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-8">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030008] transition-colors duration-300 relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        {theme === 'dark' ? (
          <Beams
            beamWidth={3}
            beamHeight={30}
            beamNumber={20}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        ) : (
          <DotGrid 
            baseColor="#cbd5e1" 
            activeColor="#94a3b8" 
            dotSize={4}
            gap={24}
          />
        )}
      </div>

      <div className="relative z-10">
        <TopBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-slate-900 dark:text-white"
          >
            Welcome to FreelanceCRM Dashboard
          </motion.h1>

          {/* Stats Glass Icons */}
          <div className="relative mb-16 flex justify-center text-xl md:text-2xl">
            <GlassIcons items={glassItems} />
          </div>

          {/* Recent Projects */}
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recentProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="h-full relative"
              >
                <Link
                  to={`/project/${project._id}`}
                  className="block h-full hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] rounded-[28px] transition-all duration-300"
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
                    <div style={{ padding: '2em' }}>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{project.title}</h3>
                      <p className="text-slate-600 dark:text-gray-300 text-sm mb-4">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                          project.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                            'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                          }`}>
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;