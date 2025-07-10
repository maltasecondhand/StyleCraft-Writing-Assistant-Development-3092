import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTemplates } from '../../context/TemplateContext';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiFolder, FiTrash2, FiEdit, FiCheck, FiClock } = FiIcons;

function TemplateModal() {
  const { state, toggleTemplateModal, selectTemplate, deleteTemplate } = useTemplates();
  const { dispatch: stepsDispatch } = useSteps();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    // 検索フィルタリング
    const filtered = state.templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.keywords?.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTemplates(filtered);
  }, [searchTerm, state.templates]);

  const handleSelectTemplate = (template) => {
    selectTemplate(template);
    stepsDispatch({ type: 'LOAD_TEMPLATE', payload: template.data });
    toggleTemplateModal();
  };

  const handleDeleteClick = (e, templateId) => {
    e.stopPropagation();
    setConfirmDelete(templateId);
  };

  const handleConfirmDelete = (e, templateId) => {
    e.stopPropagation();
    deleteTemplate(templateId);
    setConfirmDelete(null);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(null);
  };

  // 日付フォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiFolder} className="text-primary-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">テンプレートを選択</h2>
          </div>
          <button
            onClick={toggleTemplateModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="テンプレートを検索..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[50vh]">
            {filteredTemplates.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectTemplate(template)}
                    className="cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{template.name}</h3>
                      <div className="flex space-x-1">
                        {confirmDelete === template.id ? (
                          <>
                            <button
                              onClick={(e) => handleConfirmDelete(e, template.id)}
                              className="p-1 rounded-full hover:bg-red-100 text-red-500"
                            >
                              <SafeIcon icon={FiCheck} className="text-sm" />
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <SafeIcon icon={FiX} className="text-sm" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => handleDeleteClick(e, template.id)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <SafeIcon icon={FiTrash2} className="text-gray-500 text-sm" />
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-100">
                              <SafeIcon icon={FiEdit} className="text-gray-500 text-sm" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {template.description || '説明なし'}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.data.keywords?.slice(0, 3).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                      {template.data.keywords?.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                          +{template.data.keywords.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <SafeIcon icon={FiClock} className="mr-1" />
                      <span>{formatDate(template.updatedAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                  <SafeIcon icon={FiFolder} className="text-gray-500 text-3xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">テンプレートがありません</h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? '検索条件に一致するテンプレートがありません。'
                    : 'テンプレートを作成してここに保存しましょう。'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={toggleTemplateModal}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TemplateModal;