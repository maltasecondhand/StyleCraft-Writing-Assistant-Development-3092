import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft, FiEdit } = FiIcons;

function StepWritingStyle() {
  const { state, dispatch } = useSteps();

  const updateStyle = (field, value) => {
    dispatch({ 
      type: 'UPDATE_DATA', 
      payload: { 
        writingStyle: { 
          ...state.data.writingStyle, 
          [field]: value 
        } 
      } 
    });
  };

  const updateWordCount = (value) => {
    const wordCount = parseInt(value);
    if (!isNaN(wordCount) && wordCount > 0) {
      dispatch({ 
        type: 'UPDATE_DATA', 
        payload: { wordCount }
      });
    }
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: 5 });
  };

  const templates = [
    { value: 'prep', title: 'PREP法', description: '結論→理由→具体例→結論の順で構成' },
    { value: 'story', title: 'ストーリーテリング', description: '物語形式で読者を引き込む構成' },
    { value: 'problem-solution', title: '問題解決型', description: '課題提起→解決策→実行方法の順で構成' },
    { value: 'how-to', title: 'ハウツー型', description: '手順を分かりやすく説明する構成' },
    { value: 'comparison', title: '比較検討型', description: '複数の選択肢を比較して結論を導く構成' }
  ];

  const emojiOptions = [
    { value: 'none', label: '使わない' },
    { value: 'minimal', label: '最小限' },
    { value: 'moderate', label: '適度に' },
    { value: 'frequent', label: '頻繁に' }
  ];

  const wordCountOptions = [
    { value: 140, label: '140文字（X投稿）', description: 'SNS投稿用の短文' },
    { value: 1000, label: '1,000文字（短文）', description: '要点を簡潔に' },
    { value: 3000, label: '3,000文字（標準）', description: 'noteに最適' },
    { value: 5000, label: '5,000文字（長文）', description: '詳しく解説' },
    { value: 8000, label: '8,000文字（専門記事）', description: '専門書レベル' },
    { value: 10000, label: '10,000文字（完全版）', description: 'eBook形式の詳細解説' },
    { value: 20000, label: '20,000文字（超長文）', description: '書籍レベルの詳細解説' }
  ];

  // 現在の文字数設定を取得（デフォルト値を保証）
  const currentWordCount = state.data.wordCount || 3000;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          文体・構成・文字数を設定しましょう
        </h3>
        <p className="text-gray-600">
          記事の文体、構成、文字数を設定してプロンプトの詳細を決定します
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文体スタイル
        </label>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateStyle('conversational', true)}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              state.data.writingStyle.conversational
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-gray-800">会話風</h4>
              <p className="text-sm text-gray-600">
                親しみやすく、読者との距離を縮める文体
              </p>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateStyle('conversational', false)}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              !state.data.writingStyle.conversational
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-gray-800">解説風</h4>
              <p className="text-sm text-gray-600">
                丁寧で分かりやすい説明中心の文体
              </p>
            </div>
          </motion.button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          構成テンプレート
        </label>
        <div className="space-y-3">
          {templates.map((template) => (
            <motion.button
              key={template.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateStyle('template', template.value)}
              className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                state.data.writingStyle.template === template.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <h4 className="font-semibold text-gray-800 mb-1">{template.title}</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          絵文字の使用頻度
        </label>
        <div className="flex flex-wrap gap-2">
          {emojiOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateStyle('emojiFrequency', option.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                state.data.writingStyle.emojiFrequency === option.value
                  ? 'bg-secondary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          目標文字数
        </label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wordCountOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateWordCount(option.value)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                currentWordCount === option.value
                  ? 'border-secondary-500 bg-secondary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100 text-secondary-600`}>
                  <SafeIcon icon={FiEdit} className="text-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 設定サマリー */}
      {(state.data.writingStyle.template || currentWordCount) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">設定サマリー</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiEdit} className="text-secondary-600" />
              <div>
                <p className="font-medium text-gray-800">
                  文体: {state.data.writingStyle.conversational ? '会話風' : '解説風'}
                </p>
                <p className="text-sm text-gray-600">
                  {state.data.writingStyle.conversational ? '親しみやすく読者との距離を縮める' : '丁寧で分かりやすい説明中心'}
                </p>
              </div>
            </div>
            {state.data.writingStyle.template && (
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiEdit} className="text-primary-600" />
                <div>
                  <p className="font-medium text-gray-800">
                    構成: {templates.find(t => t.value === state.data.writingStyle.template)?.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {templates.find(t => t.value === state.data.writingStyle.template)?.description}
                  </p>
                </div>
              </div>
            )}
            {currentWordCount && (
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiEdit} className="text-secondary-600" />
                <div>
                  <p className="font-medium text-gray-800">
                    目標文字数: {currentWordCount.toLocaleString()}文字
                  </p>
                  <p className="text-sm text-gray-600">
                    {wordCountOptions.find(w => w.value === currentWordCount)?.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} />
          <span>戻る</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <span>次へ</span>
          <SafeIcon icon={FiArrowRight} />
        </motion.button>
      </div>
    </div>
  );
}

export default StepWritingStyle;