import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Briefcase, FileText, Clock, Mail, Twitter, Github, Linkedin } from 'lucide-react';
import ThemeBackground from '../components/ThemeBackground';
import LandingNavbar from '../components/LandingNavbar';
import logo from '../assets/logo.png';

const Landing = () => {
  const featuresRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Client Management',
      description: 'Keep all your client details in one place – contact info, notes, and history.',
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Project Tracking',
      description: 'Monitor project status, deadlines, budgets, and milestones effortlessly.',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Invoice Generation',
      description: 'Create professional invoices instantly and download or print them.',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Time Tracking',
      description: 'Log hours worked on projects and stay on top of your productivity.',
    },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Fixed Background - covers entire viewport */}
      <div className="fixed inset-0 z-0 bg-slate-50 dark:bg-[#030008] transition-colors duration-300">
        <ThemeBackground />
      </div>

      {/* Navbar */}
      <LandingNavbar scrollToFeatures={scrollToFeatures} scrollToContact={scrollToContact} />

      {/* Scrollable Content */}
      <div className="relative z-10 text-slate-900 dark:text-white pt-16">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
          <img src={logo} alt="FreelanceCRM Logo" className="w-32 h-32 mb-6" />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-center mb-6"
          >
            FreelanceCRM
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-center mb-10 max-w-2xl text-slate-600 dark:text-gray-200"
          >
            Manage your clients, projects, and invoices with ease.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-lg rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transform transition-all duration-300 hover:scale-105 focus:outline-none"
            >
              Get Started
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16"
            >
              Powerful Features
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 z-10 relative"
                >
                  <div className="text-primary-600 dark:text-primary-300 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Get in Touch Section */}
        <section ref={contactRef} className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Get in Touch
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-gray-200 mb-12"
            >
              Have questions or want to collaborate? Reach out to us!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/20 max-w-md mx-auto transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Mail className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                <span className="text-lg">contact@freelancecrm.com</span>
              </div>

              <div className="flex justify-center space-x-6 mt-6">
                <a
                  href="#"
                  className="text-slate-700 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-slate-700 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-slate-700 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center text-slate-800 dark:text-white border-t border-slate-200 dark:border-white/10">
          <p>&copy; {new Date().getFullYear()} FreelanceCRM. All rights reserved.</p>
          <p className="mt-2">
            Designed by <span className="font-semibold">MOHAMMED WASEEM SIDDIQUE</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;