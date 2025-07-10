import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePersonas } from '../../context/PersonaContext';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiUser, FiUsers, FiSave, FiClock, FiCheck } = FiIcons;

function CombinationModal({ isOpen, onClose }) {
  const { state, saveCombination, applyCombination } = usePersonas();
  const { dispatch: stepsDispatch } = useSteps();
  const [selectedReaderPersona, setSelectedReaderPersona] = useState('');
  const [selectedWriterPersona, setSelectedWriterPersona] = useState('');
  const [combinationName, setCombinationName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const combinations = state.preferences.combinations || [];
  
  const filteredCombinations = searchTerm
    ? combinations.filter(combo => 
        combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.readerPersonas.find(p => p.id === combo.readerPersonaId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.writerPersonas.find(p => p.id === combo.writerPersonaId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : combinations;

  const handleSaveCombination = () => {
    if (!combinationName.trim() || !selectedReaderPersona || !selectedWriterPersona) {
      return;
    }
    
    saveCombination(
      combinationName.trim(),
      selectedReaderPersona,
      selectedWriterPersona
    );
    
    setCombinationName('');
    setSelectedReaderPersona('');
    setSelectedWriterPersona('');
    setShowForm(false);
  };

  const handleApplyCombination = (combinationId) => {
    const result = applyCombination(combinationId);
    if (result) {
      const { readerPersona, writerPersona } = result;
      
      // ステップコンテキストを更新
      stepsDispatch({
        type: 'UPDATE_DATA',
        payload: {
          readerPersona: readerPersona.data,
          writerCharacter: writerPersona.data
        }
      });
      
      onClose();
    }
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
  
  if (!isOpen) return null;

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
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiSave} className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              ペルソナ組み合わせ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 mr-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="組み合わせを検索..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiSave} />
              <span>新規作成</span>
            </motion.button>
          </div>

          {showForm ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                新しい組み合わせを作成
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    組み合わせ名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={combinationName}
                    onChange={(e) => setCombinationName(e.target.value)}
                    placeholder="例: ビジネス記事用セット"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    読者ペルソナ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedReaderPersona}
                    onChange={(e) => setSelectedReaderPersona(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">選択してください</option>
                    {state.readerPersonas.map(persona => (
                      <option key={persona.id} value={persona.id}>
                        {persona.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    書き手ペルソナ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedWriterPersona}
                    onChange={(e) => setSelectedWriterPersona(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">選択してください</option>
                    {state.writerPersonas.map(persona => (
                      <option key={persona.id} value={persona.id}>
                        {persona.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveCombination}
                    disabled={!combinationName.trim() || !selectedReaderPersona || !selectedWriterPersona}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    保存
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[50vh]">
              {filteredCombinations.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredCombinations.map((combo) => {
                    const readerPersona = state.readerPersonas.find(p => p.id === combo.readerPersonaId);
                    const writerPersona = state.writerPersonas.find(p => p.id === combo.writerPersonaId);
                    
                    return (
                      <motion.div
                        key={combo.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-800">{combo.name}</h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <SafeIcon icon={FiClock} className="mr-1" />
                            <span>{formatDate(combo.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <SafeIcon icon={FiUsers} className="text-blue-600 text-xs" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">読者: {readerPersona?.name || '未設定'}</p>
                              <p className="text-xs text-gray-500">{readerPersona?.description || ''}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <SafeIcon icon={FiUser} className="text-green-600 text-xs" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">書き手: {writerPersona?.name || '未設定'}</p>
                              <p className="text-xs text-gray-500">{writerPersona?.description || ''}</p>
                            </div>
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleApplyCombination(combo.id)}
                          className="w-full mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm flex items-center justify-center space-x-1"
                        >
                          <SafeIcon icon={FiCheck} className="text-xs" />
                          <span>この組み合わせを適用</span>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                    <SafeIcon icon={FiSave} className="text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">組み合わせがありません</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? '検索条件に一致する組み合わせがありません。' : 'ペルソナの組み合わせを作成してここに保存しましょう。'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    新規作成
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CombinationModal;