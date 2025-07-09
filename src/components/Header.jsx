import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiHome, FiFileText } = FiIcons;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiEdit3} className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                moanote AI
              </h1>
              <p className="text-sm text-gray-600">自分らしい文体でnoteを書こう</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            {location.pathname !== '/' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/steps')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiEdit3} className="text-lg" />
                  <span>新規作成</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/draft')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiFileText} className="text-lg" />
                  <span>下書きから作成</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiHome} className="text-lg" />
                  <span>ホーム</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;