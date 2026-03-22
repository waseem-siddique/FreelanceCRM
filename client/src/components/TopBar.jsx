import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, UserCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../assets/logo.png';

const TopBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#060010] border-b border-slate-200 dark:border-gray-900 shadow-sm dark:shadow-md sticky top-0 z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src={logo} alt="FreelanceCRM" className="h-8 w-auto" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              FreelanceCRM
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/clients" className="text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Clients
            </Link>
            <Link to="/projects" className="text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Projects
            </Link>
            <Link to="/projects" className="text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Invoice
            </Link>
            {user && (
              <div className="flex items-center ml-4 pl-4 border-l border-slate-200 dark:border-gray-800 space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white bg-slate-100 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-gray-700/50 rounded-full transition-colors"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <Link to="/profile" className="flex items-center space-x-2 group cursor-pointer">
                  <div className="p-1 bg-slate-100 dark:bg-gray-800/50 rounded-full group-hover:bg-primary-500/10 dark:group-hover:bg-primary-500/20 transition-colors">
                    <UserCircle className="w-6 h-6 text-slate-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    Hi, {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default TopBar;