import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiTarget, FiBook, FiShoppingCart, FiThumbsUp, FiShare2, FiMail, FiCheck, FiEdit } = FiIcons;

function StepGoal() {
  const { state, dispatch } = useSteps();
  const navigate = useNavigate();

  const updateGoal = (value) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { goal: value }
    });
  };

  const updateApiKey = (value) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { apiKey: value }
    });
  };

  const updateWordCount = (value) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { wordCount: parseInt(value) }
    });
  };

  const generateArticle = () => {
    navigate('/output');
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: 7 });
  };

  const goals = [
    {
      value: 'learn',
      title: '学ぶ',
      description: '新しい知識やスキルを身につけてもらう',
      icon: FiBook,
      color: 'text-blue-600'
    },
    {
      value: 'buy',
      title: '購入する',
      description: '商品やサービスを購入してもらう',
      icon: FiShoppingCart,
      color: 'text-green-600'
    },
    {
      value: 'think',
      title: '考える',
      description: '新しい視点で物事を考えてもらう',
      icon: FiTarget,
      color: 'text-purple-600'
    },
    {
      value: 'action',
      title: '行動する',
      description: '具体的な行動を起こしてもらう',
      icon: FiCheck,
      color: 'text-orange-600'
    },
    {
      value: 'share',
      title: '共有する',
      description: '記事を他の人にシェアしてもらう',
      icon: FiShare2,
      color: 'text-pink-600'
    },
    {
      value: 'contact',
      title: '連絡する',
      description: 'お問い合わせや相談をしてもらう',
      icon: FiMail,
      color: 'text-indigo-600'
    }
  ];

  const wordCountOptions = [
    { value: 800, label: '800文字（短め）', description: '要点を簡潔に' },
    { value: 1200, label: '1,200文字（標準）', description: '読みやすいボリューム' },
    { value: 1500, label: '1,500文字（推奨）', description: 'noteに最適' },
    { value: 2000, label: '2,000文字（長め）', description: '詳しく解説' },
    { value: 2500, label: '2,500文字（詳細）', description: '専門的な内容' },
    { value: 3000, label: '3,000文字（超詳細）', description: '完全ガイド' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          ゴール設定と記事設定
        </h3>
        <p className="text-gray-600">
          読者にしてほしい行動と文字数を設定し、APIキーを入力して記事を生成しましょう
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          読者にしてほしい行動
        </label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <motion.button
              key={goal.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateGoal(goal.value)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                state.data.goal === goal.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${goal.color}`}>
                  <SafeIcon icon={goal.icon} className="text-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{goal.title}</h4>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          目標文字数
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {wordCountOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateWordCount(option.value)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                state.data.wordCount === option.value
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

      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
        <h4 className="font-semibold text-primary-800 mb-3">APIキー設定（BYO-API）</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              OpenAI APIキー
            </label>
            <input
              type="password"
              value={state.data.apiKey}
              onChange={(e) => updateApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
          <div className="text-sm text-primary-600">
            <p>• あなたのAPIキーは安全に保存され、記事生成にのみ使用されます</p>
            <p>• APIキーはセッション終了時に自動的に削除されます</p>
            <p>• OpenAIのAPIキーは<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">こちら</a>で取得できます</p>
          </div>
        </div>
      </div>

      {(state.data.goal || state.data.wordCount) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">設定サマリー</h4>
          <div className="space-y-2">
            {state.data.goal && (
              <div className="flex items-center space-x-3">
                <SafeIcon 
                  icon={goals.find(g => g.value === state.data.goal)?.icon} 
                  className={goals.find(g => g.value === state.data.goal)?.color} 
                />
                <div>
                  <p className="font-medium text-gray-800">
                    ゴール: {goals.find(g => g.value === state.data.goal)?.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {goals.find(g => g.value === state.data.goal)?.description}
                  </p>
                </div>
              </div>
            )}
            {state.data.wordCount && (
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiEdit} className="text-secondary-600" />
                <div>
                  <p className="font-medium text-gray-800">
                    目標文字数: {state.data.wordCount}文字
                  </p>
                  <p className="text-sm text-gray-600">
                    {wordCountOptions.find(w => w.value === state.data.wordCount)?.description}
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
          onClick={generateArticle}
          disabled={!state.data.goal || !state.data.apiKey || !state.data.wordCount}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          <SafeIcon icon={FiTarget} />
          <span>記事を生成する</span>
        </motion.button>
      </div>
    </div>
  );
}

export default StepGoal;