import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTemplates } from '../../context/TemplateContext';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiTag, FiInfo } = FiIcons;

function SaveTemplateModal() {
  const { state, toggleSaveModal, saveTemplate } = useTemplates();
  const { state: stepsState } = useSteps();
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [templateData, setTemplateData] = useState(null);

  useEffect(() => {
    // 既存のテンプレートを編集する場合
    if (state.selectedTemplate) {
      setTemplateName(state.selectedTemplate.name || '');
      setDescription(state.selectedTemplate.description || '');
      setTags(state.selectedTemplate.tags || []);
      setIsEditing(true);
    }
    
    // 現在の設定データを取得
    setTemplateData(stepsState.data);
  }, [state.selectedTemplate, stepsState.data]);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) return;
    if (tags.length >= 5) {
      setError('タグは最大5個までです');
      return;
    }
    
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
    setError('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      setError('テンプレート名を入力してください');
      return;
    }

    try {
      const templateToSave = {
        name: templateName.trim(),
        description: description.trim(),
        tags: tags,
        data: templateData,
        keywords: templateData.keywords || []
      };
      
      if (isEditing && state.selectedTemplate) {
        saveTemplate(templateToSave, state.selectedTemplate.id);
      } else {
        saveTemplate(templateToSave);
      }
      
      toggleSaveModal();
    } catch (error) {
      console.error('Failed to save template:', error);
      setError('テンプレートの保存に失敗しました');
    }
  };

  // テンプレートのプレビューデータを生成
  const getPreviewData = () => {
    const { keywords, goal, readerPersona, writerCharacter, writingStyle } = templateData || {};
    
    return [
      { label: 'キーワード', value: keywords?.length ? keywords.join(', ') : '未設定' },
      { label: 'ゴール', value: goal || '未設定' },
      { label: '読者', value: readerPersona?.age || '未設定' },
      { label: '書き手', value: writerCharacter?.occupation || '未設定' },
      { label: '文体', value: writingStyle?.conversational ? '会話風' : '解説風' }
    ];
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
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiSave} className="text-primary-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'テンプレートを更新' : 'テンプレートを保存'}
            </h2>
          </div>
          <button
            onClick={toggleSaveModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                テンプレート名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="例: note向け共感型テンプレート"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明（任意）
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="このテンプレートの用途や特徴を記入してください"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ（任意）
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="タグを入力（最大5個）"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiTag} />
                </motion.button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <SafeIcon icon={FiX} className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-2 mb-3">
                <SafeIcon icon={FiInfo} className="text-primary-600 mt-1" />
                <h3 className="font-medium text-gray-800">テンプレート内容プレビュー</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {getPreviewData().map((item, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-gray-600">{item.label}: </span>
                    <span className="text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={toggleSaveModal}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveTemplate}
            className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {isEditing ? '更新する' : '保存する'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SaveTemplateModal;