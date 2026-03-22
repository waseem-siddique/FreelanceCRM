import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Mail, Phone, Building2, Search, MapPin, Building, Calendar, ArrowLeft } from 'lucide-react';
import API from '../services/api';
import ClientForm from '../components/ClientForm';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBar from '../components/TopBar';
import BorderGlow from '../components/BorderGlow';
import ThemeBackground from '../components/ThemeBackground';
import { useTheme } from '../contexts/ThemeContext';

const ClientList = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/clients');
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await API.delete(`/clients/${id}`);
        setClients(clients.filter(c => c._id !== id));
      } catch (error) { }
    }
  };

  const handleEdit = (client, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingClient(client);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleFormSuccess = () => {
    fetchClients();
    handleFormClose();
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              Clients
            </motion.h1>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search clients..."
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
                Add Client
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showForm && (
              <ClientForm
                client={editingClient}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
              />
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="h-full hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] rounded-[28px] transition-all duration-300 relative group"
              >
                <Link to={`/client/${client._id}`} className="block h-full">
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
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{client.name}</h3>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleEdit(client, e)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleDelete(client._id, e)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-gray-300">
                        {client.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-slate-400 dark:text-gray-400" />
                            <a href={`mailto:${client.email}`} className="hover:text-primary-400">
                              {client.email}
                            </a>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-slate-400 dark:text-gray-400" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.company && (
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-slate-400 dark:text-gray-400" />
                            <span>{client.company}</span>
                          </div>
                        )}
                      </div>

                      {client.notes && (
                        <p className="mt-4 text-sm text-slate-500 dark:text-gray-400 border-t border-slate-200 dark:border-gray-700 pt-2">{client.notes}</p>
                      )}
                    </div>
                  </BorderGlow>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredClients.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? 'No clients match your search.' : 'No clients yet. Click "Add Client" to create one.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientList;