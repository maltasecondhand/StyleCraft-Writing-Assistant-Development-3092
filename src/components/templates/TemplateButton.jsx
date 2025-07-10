import React from 'react';
import { motion } from 'framer-motion';
import { usePersonas } from '../../context/PersonaContext';
import { useTemplates } from '../../context/TemplateContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFolder, FiSave } = FiIcons;

function TemplateButton({ type = 'load' }) {
  const { togglePersonaModal } = usePersonas();
  const { toggleTemplateModal, toggleSaveModal } = useTemplates();

  const handleClick = () => {
    if (type === 'load') {
      // ペルソナモーダルを開く（読者ペルソナ管理と同じ内容）
      togglePersonaModal('reader');
    } else {
      // 保存モーダルを開く
      toggleSaveModal();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        type === 'load'
          ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
          : 'text-secondary-600 bg-secondary-50 hover:bg-secondary-100'
      }`}
    >
      <SafeIcon icon={type === 'load' ? FiFolder : FiSave} />
      <span>{type === 'load' ? 'ペルソナ読込' : 'ペルソナ保存'}</span>
    </motion.button>
  );
}

export default TemplateButton;