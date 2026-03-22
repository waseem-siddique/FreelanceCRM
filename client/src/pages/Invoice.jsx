import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBar from '../components/TopBar';
import BorderGlow from '../components/BorderGlow';
import ThemeBackground from '../components/ThemeBackground';
import { useTheme } from '../contexts/ThemeContext';

const Invoice = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [invoiceHTML, setInvoiceHTML] = useState('');

  useEffect(() => {
    fetchInvoice();
  }, [projectId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/invoice/project/${projectId}?t=${Date.now()}`, {
        responseType: 'text',
      });
      setInvoiceHTML(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownload = () => {
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${projectId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030008] transition-colors duration-300 relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <ThemeBackground />
      </div>

      <div className="relative z-10">
        <TopBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </motion.button>
            <div className="flex space-x-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg text-slate-700 dark:text-gray-200 font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download HTML
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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
              <div className="p-4 rounded-xl overflow-hidden">
                <iframe
                  srcDoc={invoiceHTML}
                  title="Invoice"
                  className="w-full h-[800px] border-0 rounded-xl bg-white"
                />
              </div>
            </BorderGlow>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Invoice;