import React from 'react';
import { motion } from 'framer-motion';
import { usePrompts } from '../../context/PromptsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCode } = FiIcons;

function PromptButton() {
  const { togglePromptModal } = usePrompts();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={togglePromptModal}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-purple-600 bg-purple-50 hover:bg-purple-100"
    >
      <SafeIcon icon={FiCode} />
      <span>カスタムプロンプト</span>
    </motion.button>
  );
}

export default PromptButton;