import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiX, FiArrowRight } = FiIcons;

function StepKeywords() {
  const { state, dispatch } = useSteps();
  const [keyword, setKeyword] = useState('');

  const addKeyword = () => {
    if (keyword.trim() && state.data.keywords.length < 10) {
      dispatch({
        type: 'UPDATE_DATA',
        payload: {
          keywords: [...state.data.keywords, keyword.trim()]
        }
      });
      setKeyword('');
    }
  };

  const removeKeyword = (index) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        keywords: state.data.keywords.filter((_, i) => i !== index)
      }
    });
  };

  const updatePurpose = (purpose) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { purpose }
    });
  };

  const nextStep = () => {
    if (state.data.keywords.length > 0) {
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          記事のキーワードを設定しましょう
        </h3>
        <p className="text-gray-600">
          記事で扱いたいテーマやキーワードを最大10個まで入力してください
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            キーワード追加
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="例: React、プログラミング、学習方法"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addKeyword}
              disabled={!keyword.trim() || state.data.keywords.length >= 10}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SafeIcon icon={FiPlus} />
            </motion.button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {state.data.keywords.length} / 10個
          </p>
        </div>

        {state.data.keywords.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              追加されたキーワード
            </label>
            <div className="flex flex-wrap gap-2">
              {state.data.keywords.map((kw, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => removeKeyword(index)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <SafeIcon icon={FiX} className="text-sm" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            記事の目的（任意）
          </label>
          <textarea
            value={state.data.purpose}
            onChange={(e) => updatePurpose(e.target.value)}
            placeholder="例: 初心者にReactの基本を分かりやすく伝えたい"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          disabled={state.data.keywords.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>次へ</span>
          <SafeIcon icon={FiArrowRight} />
        </motion.button>
      </div>
    </div>
  );
}

export default StepKeywords;