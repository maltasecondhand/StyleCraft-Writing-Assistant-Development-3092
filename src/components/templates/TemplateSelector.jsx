import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTemplates } from '../../context/TemplateContext';
import { useSteps } from '../../context/StepsContext';
import { usePersonas } from '../../context/PersonaContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSettings, FiUser, FiUsers, FiEdit, FiCheck } = FiIcons;

function TemplateSelector() {
  const { state: templateState, toggleTemplateSelectorModal } = useTemplates();
  const { dispatch: stepsDispatch, state: stepsState } = useSteps();
  const { saveReaderPersona, saveWriterPersona } = usePersonas();
  
  const [selectedReaderTemplate, setSelectedReaderTemplate] = useState(null);
  const [selectedWriterTemplate, setSelectedWriterTemplate] = useState(null);
  const [selectedSettingsTemplate, setSelectedSettingsTemplate] = useState(null);
  const [combinedPrompt, setCombinedPrompt] = useState('');
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [saveAsPersona, setSaveAsPersona] = useState(false);

  // テンプレートをタイプ別に分類
  const readerTemplates = templateState.templates.filter(t => t.type === 'reader');
  const writerTemplates = templateState.templates.filter(t => t.type === 'writer');
  const settingsTemplates = templateState.templates.filter(t => t.type === 'settings');

  // プロンプト生成
  const generateCombinedPrompt = () => {
    if (!selectedReaderTemplate || !selectedWriterTemplate) {
      return;
    }

    let prompt = `# 記事作成プロンプト\n\n`;

    // 読者設定
    prompt += `## ターゲット読者設定\n`;
    prompt += `${selectedReaderTemplate.promptText}\n\n`;

    // 書き手設定
    prompt += `## 書き手キャラクター設定\n`;
    prompt += `${selectedWriterTemplate.promptText}\n\n`;

    // 追加設定（選択されている場合）
    if (selectedSettingsTemplate) {
      prompt += `## 追加設定\n`;
      prompt += `${selectedSettingsTemplate.promptText}\n\n`;
    }
    
    // キーワードと目的（STEP1からの引継ぎ）
    if (stepsState.data.keywords && stepsState.data.keywords.length > 0) {
      prompt += `## キーワード\n`;
      prompt += `${stepsState.data.keywords.join('、')}\n\n`;
    }
    
    if (stepsState.data.purpose) {
      prompt += `## 記事の目的\n`;
      prompt += `${stepsState.data.purpose}\n\n`;
    }

    // 記事作成指示
    prompt += `## 記事作成指示\n`;
    prompt += `上記の設定に基づいて、以下の要件で記事を作成してください：\n`;
    prompt += `- 読者の心に響く個性的な文章\n`;
    prompt += `- 設定されたキャラクターの特徴を反映\n`;
    prompt += `- 具体的で実用的な内容\n`;
    prompt += `- 読みやすい構成と文体\n\n`;

    setCombinedPrompt(prompt);
    setShowPromptPreview(true);
  };

  // プロンプトをステップに適用
  const applyPromptToSteps = () => {
    if (!selectedReaderTemplate || !selectedWriterTemplate) return;

    // ペルソナとして保存する場合
    if (saveAsPersona) {
      // 読者ペルソナを保存
      const readerPersonaData = {
        name: selectedReaderTemplate.name,
        description: selectedReaderTemplate.description || '',
        data: selectedReaderTemplate.data,
        tags: selectedReaderTemplate.tags || []
      };
      saveReaderPersona(readerPersonaData);

      // 書き手ペルソナを保存
      const writerPersonaData = {
        name: selectedWriterTemplate.name,
        description: selectedWriterTemplate.description || '',
        data: selectedWriterTemplate.data,
        tags: selectedWriterTemplate.tags || []
      };
      saveWriterPersona(writerPersonaData);
    }

    // ステップデータに適用
    stepsDispatch({
      type: 'UPDATE_DATA',
      payload: {
        readerPersona: selectedReaderTemplate.data,
        writerCharacter: selectedWriterTemplate.data,
        customPrompt: combinedPrompt,
        useCustomPrompt: true,
        ...(selectedSettingsTemplate ? selectedSettingsTemplate.data : {})
      }
    });

    toggleTemplateSelectorModal();
  };

  if (!templateState.isTemplateSelectorModalOpen) return null;

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
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiSettings} className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              テンプレート組み合わせ
            </h2>
          </div>
          <button
            onClick={toggleTemplateSelectorModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid md:grid-cols-3 gap-6">
            {/* 読者テンプレート */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiUsers} className="text-blue-600" />
                <span>読者ペルソナ</span>
              </h3>
              <div className="space-y-3">
                {readerTemplates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedReaderTemplate(template)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      selectedReaderTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-800 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 書き手テンプレート */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="text-green-600" />
                <span>書き手キャラクター</span>
              </h3>
              <div className="space-y-3">
                {writerTemplates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedWriterTemplate(template)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      selectedWriterTemplate?.id === template.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-800 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 追加設定テンプレート */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiEdit} className="text-purple-600" />
                <span>追加設定（任意）</span>
              </h3>
              <div className="space-y-3">
                {settingsTemplates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSettingsTemplate(template)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      selectedSettingsTemplate?.id === template.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-800 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* ペルソナとして保存するオプション */}
          {selectedReaderTemplate && selectedWriterTemplate && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={saveAsPersona}
                  onChange={() => setSaveAsPersona(!saveAsPersona)}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-gray-700">選択したテンプレートをペルソナとしても保存する</span>
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-6">
                有効にすると、選択したテンプレートが読者・書き手ペルソナとしても保存され、後で編集できるようになります
              </p>
            </div>
          )}

          {/* プロンプトプレビュー */}
          {showPromptPreview && combinedPrompt && (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                生成されたプロンプト
              </h3>
              <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {combinedPrompt}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={toggleTemplateSelectorModal}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateCombinedPrompt}
              disabled={!selectedReaderTemplate || !selectedWriterTemplate}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              プロンプト生成
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={applyPromptToSteps}
              disabled={!combinedPrompt}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiCheck} />
              <span>設定を適用</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TemplateSelector;