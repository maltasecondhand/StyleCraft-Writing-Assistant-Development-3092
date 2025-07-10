import React from 'react';
import { motion } from 'framer-motion';
import { useTemplates } from '../../context/TemplateContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings } = FiIcons;

function TemplateCombinationButton() {
  const { toggleTemplateSelectorModal } = useTemplates();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTemplateSelectorModal}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-purple-600 bg-purple-50 hover:bg-purple-100"
    >
      <SafeIcon icon={FiSettings} />
      <span>テンプレート組合せ</span>
    </motion.button>
  );
}

export default TemplateCombinationButton;