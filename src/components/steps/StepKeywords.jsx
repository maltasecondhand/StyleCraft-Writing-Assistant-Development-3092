import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiX, FiArrowRight, FiSearch, FiTrendingUp, FiBarChart } = FiIcons;

function StepKeywords() {
  const { state, dispatch } = useSteps();
  const [keyword, setKeyword] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addKeyword = async () => {
    if (keyword.trim() && state.data.keywords.length < 10) {
      const newKeyword = keyword.trim();
      dispatch({
        type: 'UPDATE_DATA',
        payload: { keywords: [...state.data.keywords, newKeyword] }
      });
      
      // SEO分析を実行
      await analyzeSEO(newKeyword);
      setKeyword('');
    }
  };

  const removeKeyword = (index) => {
    const removedKeyword = state.data.keywords[index];
    dispatch({
      type: 'UPDATE_DATA',
      payload: { keywords: state.data.keywords.filter((_, i) => i !== index) }
    });
    
    // SEO分析からも削除
    const newAnalysis = { ...seoAnalysis };
    delete newAnalysis[removedKeyword];
    setSeoAnalysis(newAnalysis);
  };

  const analyzeSEO = async (keywordToAnalyze) => {
    setIsAnalyzing(true);
    try {
      // モックSEO分析（実際の実装では外部APIを使用）
      const mockAnalysis = generateMockSEOData(keywordToAnalyze);
      setSeoAnalysis(prev => ({
        ...prev,
        [keywordToAnalyze]: mockAnalysis
      }));
    } catch (error) {
      console.error('SEO analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockSEOData = (keyword) => {
    // 実際の実装では、Google Keyword Planner API や他のSEOツールを使用
    const searchVolumes = [100, 500, 1000, 2900, 5400, 8100, 12100, 18100, 27100, 40500];
    const difficulties = ['低', '中', '高'];
    const trends = ['上昇', '安定', '下降'];
    
    return {
      searchVolume: searchVolumes[Math.floor(Math.random() * searchVolumes.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      trend: trends[Math.floor(Math.random() * trends.length)],
      relatedKeywords: [
        `${keyword} 方法`,
        `${keyword} コツ`,
        `${keyword} 初心者`,
        `${keyword} おすすめ`
      ],
      competitorScore: Math.floor(Math.random() * 100)
    };
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

  const getSEORecommendation = (analysis) => {
    if (!analysis) return '';
    
    const { searchVolume, difficulty } = analysis;
    
    if (searchVolume > 10000 && difficulty === '高') {
      return '🔥 高ボリュームですが競合多数。ロングテールキーワードとの組み合わせを推奨';
    } else if (searchVolume > 5000 && difficulty === '中') {
      return '✨ バランスの良いキーワード。SEO効果が期待できます';
    } else if (searchVolume < 1000 && difficulty === '低') {
      return '🎯 ニッチなキーワード。専門性をアピールできます';
    } else {
      return '📈 検索需要があり、取り組みやすいキーワードです';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          記事のキーワードを設定しましょう
        </h3>
        <p className="text-gray-600">
          記事で扱いたいテーマやキーワードを最大10個まで入力してください。SEO分析も自動で実行されます。
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
              disabled={!keyword.trim() || state.data.keywords.length >= 10 || isAnalyzing}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <SafeIcon icon={FiSearch} />
                </motion.div>
              ) : (
                <SafeIcon icon={FiPlus} />
              )}
              <span>{isAnalyzing ? '分析中' : '追加'}</span>
            </motion.button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {state.data.keywords.length} / 10個
          </p>
        </div>

        {state.data.keywords.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              追加されたキーワードとSEO分析
            </label>
            <div className="space-y-3">
              {state.data.keywords.map((kw, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-medium text-gray-800">{kw}</span>
                      <button
                        onClick={() => removeKeyword(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <SafeIcon icon={FiX} className="text-sm" />
                      </button>
                    </div>
                  </div>
                  
                  {seoAnalysis[kw] && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                            <SafeIcon icon={FiSearch} className="text-sm" />
                            <span className="text-xs font-medium">検索ボリューム</span>
                          </div>
                          <span className="text-lg font-bold">{seoAnalysis[kw].searchVolume.toLocaleString()}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-orange-600 mb-1">
                            <SafeIcon icon={FiBarChart} className="text-sm" />
                            <span className="text-xs font-medium">競合度</span>
                          </div>
                          <span className={`text-lg font-bold ${
                            seoAnalysis[kw].difficulty === '低' ? 'text-green-600' :
                            seoAnalysis[kw].difficulty === '中' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {seoAnalysis[kw].difficulty}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                            <SafeIcon icon={FiTrendingUp} className="text-sm" />
                            <span className="text-xs font-medium">トレンド</span>
                          </div>
                          <span className="text-lg font-bold">{seoAnalysis[kw].trend}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
                            <SafeIcon icon={FiTrendingUp} className="text-sm" />
                            <span className="text-xs font-medium">スコア</span>
                          </div>
                          <span className="text-lg font-bold">{seoAnalysis[kw].competitorScore}</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                        <p className="text-sm text-blue-800">
                          {getSEORecommendation(seoAnalysis[kw])}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">関連キーワード:</p>
                        <div className="flex flex-wrap gap-1">
                          {seoAnalysis[kw].relatedKeywords.map((related, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs cursor-pointer hover:bg-primary-100 transition-colors"
                              onClick={() => setKeyword(related)}
                            >
                              {related}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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