import React from 'react';
import { motion } from 'framer-motion';
import { usePersonas } from '../../context/PersonaContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiUsers } = FiIcons;

function PersonaButton({ type = 'reader' }) {
  const { togglePersonaModal } = usePersonas();

  const handleClick = () => {
    togglePersonaModal(type);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        type === 'reader'
          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          : 'text-green-600 bg-green-50 hover:bg-green-100'
      }`}
    >
      <SafeIcon icon={type === 'reader' ? FiUsers : FiUser} />
      <span>{type === 'reader' ? '読者ペルソナ' : '書き手ペルソナ'}</span>
    </motion.button>
  );
}

export default PersonaButton;