import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft } = FiIcons;

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

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: 5 });
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const templates = [
    {
      value: 'prep',
      title: 'PREP法',
      description: '結論→理由→具体例→結論の順で構成'
    },
    {
      value: 'story',
      title: 'ストーリーテリング',
      description: '物語形式で読者を引き込む構成'
    },
    {
      value: 'problem-solution',
      title: '問題解決型',
      description: '課題提起→解決策→実行方法の順で構成'
    },
    {
      value: 'how-to',
      title: 'ハウツー型',
      description: '手順を分かりやすく説明する構成'
    },
    {
      value: 'comparison',
      title: '比較検討型',
      description: '複数の選択肢を比較して結論を導く構成'
    }
  ];

  const emojiOptions = [
    { value: 'none', label: '使わない' },
    { value: 'minimal', label: '最小限' },
    { value: 'moderate', label: '適度に' },
    { value: 'frequent', label: '頻繁に' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          文体と構成テンプレートを選択しましょう
        </h3>
        <p className="text-gray-600">
          記事の文体と構成を設定して、読みやすい記事を作成しましょう
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