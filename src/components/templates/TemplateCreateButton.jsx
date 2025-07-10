import React from 'react';
import { motion } from 'framer-motion';
import { useTemplates } from '../../context/TemplateContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus } = FiIcons;

function TemplateCreateButton() {
  const { toggleTemplateCreatorModal } = useTemplates();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTemplateCreatorModal}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-green-600 bg-green-50 hover:bg-green-100"
    >
      <SafeIcon icon={FiPlus} />
      <span>テンプレート作成</span>
    </motion.button>
  );
}

export default TemplateCreateButton;