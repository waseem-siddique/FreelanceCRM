import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, IndianRupee, Receipt, Search, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import ProjectForm from '../components/ProjectForm';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBar from '../components/TopBar';
import BorderGlow from '../components/BorderGlow';
import ThemeBackground from '../components/ThemeBackground';
import { useTheme } from '../contexts/ThemeContext';

const ProjectList = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const statusFilter = searchParams.get('status');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await API.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
      } catch (error) { }
    }
  };

  const handleEdit = (project, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    fetchProjects();
    handleFormClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-slate-200 text-slate-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.client?.name && project.client.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter ? project.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030008] transition-colors duration-300 relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <ThemeBackground />
      </div>

      <div className="relative z-10">
        <TopBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-slate-900 dark:text-white"
            >
              Projects
            </motion.h1>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center whitespace-nowrap"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Project
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showForm && (
              <ProjectForm
                project={editingProject}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
              />
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="relative"
              >
                <Link
                  to={`/project/${project._id}`}
                  className="block h-full hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] rounded-[28px] transition-all duration-300"
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
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => handleEdit(project, e)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label="Edit project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(project._id, e)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/invoice/${project._id}`}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            aria-label="View invoice"
                          >
                            <Receipt className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      <p className="mt-2 text-slate-600 dark:text-gray-300">{project.description}</p>

                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
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

                        {project.client && (
                          <div className="text-slate-600 dark:text-gray-400">
                            Client: {project.client.name}
                          </div>
                        )}

                        {project.deadline && (
                          <div className="flex items-center text-slate-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </BorderGlow>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? 'No projects match your search.' : 'No projects yet. Click "Add Project" to create one.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectList;