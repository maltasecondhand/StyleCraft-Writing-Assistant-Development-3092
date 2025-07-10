import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTemplates } from '../../context/TemplateContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiTag, FiInfo, FiUsers, FiUser, FiEdit } = FiIcons;

function TemplateCreator() {
  const { state, toggleTemplateCreatorModal, saveTemplate } = useTemplates();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateType, setTemplateType] = useState('reader');
  const [promptText, setPromptText] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  // テンプレートタイプの定義
  const templateTypes = [
    { value: 'reader', label: '読者ペルソナ', icon: FiUsers, color: 'blue' },
    { value: 'writer', label: '書き手キャラクター', icon: FiUser, color: 'green' },
    { value: 'settings', label: '追加設定', icon: FiEdit, color: 'purple' }
  ];

  // プリセットプロンプト
  const presetPrompts = {
    reader: {
      '20代IT系女性': `年齢: 20代後半
職業: IT企業のマーケター
性格: 効率重視、データ志向、新しい技術に興味
課題: 時間不足、情報過多、スキルアップの必要性
興味: SaaS、マーケティング自動化、キャリア形成`,
      '30代会社員男性': `年齢: 30代前半
職業: 一般企業の営業職
性格: 堅実、家族思い、安定志向
課題: 昇進への不安、ワークライフバランス
興味: 副業、投資、スキルアップ`,
      '40代管理職': `年齢: 40代中盤
職業: 中間管理職
性格: 責任感が強い、部下思い、経験豊富
課題: 部下のマネジメント、新技術への対応
興味: リーダーシップ、チームビルディング、効率化`
    },
    writer: {
      '親しみやすい先輩': `年齢: 32歳
職業: フリーランスライター
性格: 親しみやすい、共感力が高い、経験豊富
口調: です・ます調、時々関西弁
動機: 読者の悩みを解決したい、自分の経験を共有したい`,
      '専門的な講師': `年齢: 45歳
職業: 企業研修講師
性格: 真面目、論理的、権威性がある
口調: である調、専門用語を適度に使用
動機: 正確な情報を伝えたい、読者のスキル向上を支援`,
      '情熱的な起業家': `年齢: 28歳
職業: スタートアップ創業者
性格: 情熱的、行動力がある、ポジティブ
口調: です・ます調、感嘆符を多用
動機: 読者を行動に駆り立てたい、夢を実現してもらいたい`
    },
    settings: {
      'SEO重視': `SEO要件:
- タイトルにメインキーワードを含める
- 見出しにサブキーワードを配置
- メタディスクリプション対応
- 内部リンクの提案を含める`,
      '感情重視': `感情訴求要件:
- 読者の感情に訴える表現を使用
- ストーリーテリングを活用
- 共感を呼ぶ体験談を含める
- 行動を促す感情的な結論`,
      'データ重視': `データ重視要件:
- 統計データを多用
- 根拠となる調査結果を引用
- 客観的な分析を重視
- 数値で効果を示す`
    }
  };

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

  const handlePresetSelect = (presetKey) => {
    const preset = presetPrompts[templateType][presetKey];
    if (preset) {
      setPromptText(preset);
      if (!templateName) {
        setTemplateName(presetKey);
      }
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !promptText.trim()) {
      setError('テンプレート名とプロンプトテキストを入力してください');
      return;
    }

    try {
      const templateData = {
        name: templateName.trim(),
        description: templateDescription.trim(),
        type: templateType,
        promptText: promptText.trim(),
        tags: tags,
        data: generateDataFromPrompt()
      };

      saveTemplate(templateData);
      toggleTemplateCreatorModal();
      
      // フォームリセット
      setTemplateName('');
      setTemplateDescription('');
      setPromptText('');
      setTags([]);
      setError('');
    } catch (error) {
      console.error('Failed to save template:', error);
      setError('テンプレートの保存に失敗しました');
    }
  };

  // プロンプトからデータ構造を生成
  const generateDataFromPrompt = () => {
    const lines = promptText.split('\n');
    const data = {};
    
    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':').map(s => s.trim());
        data[key.toLowerCase()] = value;
      }
    });
    
    return data;
  };

  if (!state.isTemplateCreatorModalOpen) return null;

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
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiSave} className="text-primary-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              テンプレート作成
            </h2>
          </div>
          <button
            onClick={toggleTemplateCreatorModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* テンプレートタイプ選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                テンプレートタイプ <span className="text-red-500">*</span>
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {templateTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTemplateType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      templateType === type.value
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={type.icon} className={`text-${type.color}-600`} />
                      <span className="font-medium text-gray-800">{type.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    テンプレート名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="例: 20代IT系女性向け"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明（任意）
                  </label>
                  <textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="このテンプレートの用途や特徴を記入してください"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none"
                  />
                </div>

                {/* タグ */}
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
              </div>

              {/* プリセット選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  プリセットから選択（任意）
                </label>
                <div className="space-y-2">
                  {Object.keys(presetPrompts[templateType]).map((presetKey) => (
                    <motion.button
                      key={presetKey}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePresetSelect(presetKey)}
                      className="w-full p-3 text-left border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <span className="font-medium text-gray-800">{presetKey}</span>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {presetPrompts[templateType][presetKey].split('\n')[0]}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* プロンプトテキスト */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロンプトテキスト <span className="text-red-500">*</span>
              </label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="テンプレートの内容を入力してください"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-40 resize-none"
              />
            </div>

            {/* ヒント */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <SafeIcon icon={FiInfo} className="text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-800">テンプレート作成のヒント</h3>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• 具体的で詳細な設定を記載する</li>
                    <li>• 再利用しやすい汎用的な内容にする</li>
                    <li>• 他のテンプレートと組み合わせることを考慮する</li>
                    <li>• タグを活用して検索しやすくする</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={toggleTemplateCreatorModal}
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
            保存する
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TemplateCreator;