import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiGrid } = FiIcons;

function CombinationButton({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-purple-600 bg-purple-50 hover:bg-purple-100"
    >
      <SafeIcon icon={FiGrid} />
      <span>組み合わせ</span>
    </motion.button>
  );
}

export default CombinationButton;