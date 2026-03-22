import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, IndianRupee, Edit, Trash2, Receipt, Mail, Phone, Building2, Plus, X, CheckCircle, Circle } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectForm from '../components/ProjectForm';
import TopBar from '../components/TopBar';
import BorderGlow from '../components/BorderGlow';
import ThemeBackground from '../components/ThemeBackground';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const getStatusFromProgress = (progress) => {
  if (progress === 0) return 'Not Started';
  if (progress === 100) return 'Completed';
  return 'In Progress';
};

const ProjectDetails = () => {
  const { theme } = useTheme();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingTasks, setSavingTasks] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/projects/${projectId}`);
      // Ensure status matches progress
      const computedStatus = getStatusFromProgress(data.progress || 0);
      if (data.status !== computedStatus) {
        // Correct status locally
        setProject({ ...data, status: computedStatus });
        // Optionally sync to backend (we'll do it silently)
        await API.put(`/projects/${projectId}`, { status: computedStatus }).catch(() => { });
      } else {
        setProject(data);
      }
      setTasks(data.tasks || []);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await API.delete(`/projects/${projectId}`);
        toast.success('Project deleted');
        navigate('/projects');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleEdit = () => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    fetchProject(); // refresh data
    handleFormClose();
  };

  const handleProgressChange = async (newProgress) => {
    const updatedProgress = Math.max(0, Math.min(100, newProgress));
    const newStatus = getStatusFromProgress(updatedProgress);

    // Update local state immediately
    setProject({ ...project, progress: updatedProgress, status: newStatus });

    try {
      await API.put(`/projects/${projectId}`, {
        progress: updatedProgress,
        status: newStatus
      });
      toast.success('Progress updated');
    } catch (error) {
      toast.error('Failed to update progress');
      // Revert local state? Not necessary but could be done
    }
  };

  // Task management
  const addTask = () => {
    setTasks([...tasks, { description: '', completed: false }]);
  };

  const updateTask = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const removeTask = (index) => {
    if (window.confirm('Remove this task?')) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }
  };

  const saveTasks = async () => {
    setSavingTasks(true);
    try {
      await API.put(`/projects/${projectId}`, { tasks });
      toast.success('Tasks saved');

      // Recalculate progress based on completed tasks
      const completedCount = tasks.filter(t => t.completed).length;
      const newProgress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
      const newStatus = getStatusFromProgress(newProgress);

      // Update local state
      setProject({ ...project, progress: newProgress, status: newStatus });

      // Update backend with new progress and status
      await API.put(`/projects/${projectId}`, {
        progress: newProgress,
        status: newStatus
      });
    } catch (error) {
      toast.error('Failed to save tasks');
    } finally {
      setSavingTasks(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-slate-200 text-slate-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

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
            className="flex items-center text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
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
              <div className="rounded-xl overflow-hidden">
                {/* Header with actions */}
                <div className="border-b border-slate-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                    <a
                      href={`/invoice/${project._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900 flex items-center"
                    >
                      <Receipt className="w-4 h-4 mr-1" />
                      Invoice
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-600 dark:text-gray-300 mb-6">{project.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-500">Status</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    {project.budget && (
                      <div>
                        <p className="text-sm text-slate-500 dark:text-gray-500">Budget</p>
                        <p className="flex items-center text-slate-700 dark:text-gray-300">
                          <IndianRupee className="w-4 h-4 mr-1 text-slate-400 dark:text-gray-500" />
                          ₹{project.budget}
                        </p>
                      </div>
                    )}
                    {project.deadline && (
                      <div>
                        <p className="text-sm text-slate-500 dark:text-gray-500">Deadline</p>
                        <p className="flex items-center text-slate-700 dark:text-gray-300">
                          <Calendar className="w-4 h-4 mr-1 text-slate-400 dark:text-gray-500" />
                          {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {project.client && (
                    <div className="border-t border-slate-200 dark:border-gray-800 pt-4">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Client Details</h2>
                      <div className="space-y-2 text-slate-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-500 w-24">Name:</span>
                          <span>{project.client.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-500 mr-2" />
                          <span>{project.client.email}</span>
                        </div>
                        {project.client.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            <span>{project.client.phone}</span>
                          </div>
                        )}
                        {project.client.company && (
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 text-gray-500 mr-2" />
                            <span>{project.client.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6"
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
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Overall Progress: {project.progress || 0}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.progress || 0}
                  onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Tasks / Modules Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#060010"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={['#c084fc', '#f472b6', '#38bdf8']}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Modules / Tasks</h2>
                  <button
                    onClick={addTask}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-white rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900 transition-colors text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <p className="text-slate-500 dark:text-gray-500 text-center py-4">No tasks yet. Click "Add Task" to create one.</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800 rounded-lg">
                        <button
                          onClick={() => updateTask(index, 'completed', !task.completed)}
                          className="mt-1"
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={task.description}
                          onChange={(e) => updateTask(index, 'description', e.target.value)}
                          placeholder="Task description"
                          className="flex-1 bg-transparent text-slate-800 dark:text-gray-200 border-b border-slate-300 dark:border-gray-700 focus:border-primary-500 outline-none px-1 py-0.5 placeholder-slate-400 dark:placeholder-gray-600"
                        />
                        <button
                          onClick={() => removeTask(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {tasks.length > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={saveTasks}
                      disabled={savingTasks}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {savingTasks ? 'Saving...' : 'Save Tasks'}
                    </button>
                  </div>
                )}
              </div>
            </BorderGlow>
          </motion.div>
        </main>

        {/* Edit Modal */}
        {showForm && (
          <ProjectForm
            project={editingProject}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;