import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSteps } from '../context/StepsContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiEdit3, FiUpload, FiFileText, FiTarget, FiUsers, FiHeart, FiZap } = FiIcons;

function DraftMode() {
  const navigate = useNavigate();
  const { dispatch } = useSteps();
  const [draftText, setDraftText] = useState('');
  const [wordCount, setWordCount] = useState(1500);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDraftChange = (e) => {
    setDraftText(e.target.value);
  };

  const analyzeDraft = async () => {
    if (!draftText.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate draft analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract information from draft and populate context
    const extractedData = {
      keywords: extractKeywords(draftText),
      purpose: extractPurpose(draftText),
      primaryInfo: {
        facts: extractFacts(draftText),
        feelings: extractFeelings(draftText)
      },
      draftText: draftText,
      wordCount: wordCount,
      fromDraft: true
    };

    // Update context with extracted data
    dispatch({
      type: 'UPDATE_DATA',
      payload: extractedData
    });

    setIsAnalyzing(false);
    navigate('/steps');
  };

  const extractKeywords = (text) => {
    // Simple keyword extraction logic
    const words = text.split(/\s+/).filter(word => word.length > 3);
    return words.slice(0, 5).map(word => word.replace(/[^\w\s]/gi, ''));
  };

  const extractPurpose = (text) => {
    // Extract purpose from first paragraph
    const firstParagraph = text.split('\n')[0];
    return firstParagraph.length > 100 ? firstParagraph.substring(0, 100) + '...' : firstParagraph;
  };

  const extractFacts = (text) => {
    // Extract fact-like sentences
    const sentences = text.split(/[.。]/);
    const facts = sentences.filter(sentence => 
      sentence.includes('年') || 
      sentence.includes('月') || 
      sentence.includes('日') ||
      sentence.includes('時間') ||
      sentence.includes('回') ||
      /\d/.test(sentence)
    );
    return facts.slice(0, 3).join('。');
  };

  const extractFeelings = (text) => {
    // Extract feeling-like sentences
    const sentences = text.split(/[.。]/);
    const feelings = sentences.filter(sentence => 
      sentence.includes('思い') || 
      sentence.includes('感じ') || 
      sentence.includes('嬉しい') ||
      sentence.includes('悲しい') ||
      sentence.includes('楽しい') ||
      sentence.includes('不安')
    );
    return feelings.slice(0, 3).join('。');
  };

  const features = [
    {
      icon: FiEdit3,
      title: '自動分析',
      description: '下書きから自動でキーワードと構成を抽出'
    },
    {
      icon: FiTarget,
      title: '構成最適化',
      description: '既存の文章を読みやすい構成に再編成'
    },
    {
      icon: FiUsers,
      title: 'ペルソナ推定',
      description: '文章から想定読者を自動で推定'
    },
    {
      icon: FiHeart,
      title: '感情分析',
      description: '事実と感想を自動で分類・整理'
    }
  ];

  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-12 border border-gray-200 shadow-lg text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <SafeIcon icon={FiZap} className="text-primary-500 text-4xl" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">下書きを分析中...</h2>
          <p className="text-gray-600">
            文章の内容を解析して、最適な設定を準備しています
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>ホームに戻る</span>
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-800">下書きから作成</h1>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                下書きテキストを入力
              </h3>
              <p className="text-gray-600">
                既存の文章や下書きを貼り付けて、AIが自動で分析・最適化します
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  下書きテキスト
                </label>
                <textarea
                  value={draftText}
                  onChange={handleDraftChange}
                  placeholder="ここに下書きや既存の文章を貼り付けてください。

例：
今日はReactについて書きたいと思います。
最近3ヶ月間、毎日2時間勉強していました。
最初は難しくて挫折しそうになりましたが、
基礎が身についてくると楽しくなりました。
初めてアプリが動いたときは本当に感動しました。

プログラミング初心者の方にも、
継続することの大切さを伝えたいです。"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-64 resize-none font-japanese"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    文字数: {draftText.length}文字
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDraftText('')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    クリア
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目標文字数
                </label>
                <select
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={800}>800文字（短め）</option>
                  <option value={1200}>1,200文字（標準）</option>
                  <option value={1500}>1,500文字（推奨）</option>
                  <option value={2000}>2,000文字（長め）</option>
                  <option value={2500}>2,500文字（詳細）</option>
                  <option value={3000}>3,000文字（超詳細）</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  noteの読みやすさを考慮した文字数設定
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiFileText} className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">分析される内容</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• キーワードの自動抽出</li>
                      <li>• 事実と感想の自動分類</li>
                      <li>• 想定読者の推定</li>
                      <li>• 文体の分析</li>
                      <li>• 構成の最適化提案</li>
                    </ul>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={analyzeDraft}
                disabled={!draftText.trim()}
                className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <SafeIcon icon={FiZap} />
                <span>下書きを分析して設定を開始</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Features */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">下書きモードの特徴</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={feature.icon} className="text-primary-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">効果的な使い方</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-primary-500 font-bold">1.</span>
                <span>完成された文章でなくても、メモ程度の内容でOK</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-primary-500 font-bold">2.</span>
                <span>体験談や具体的なエピソードがあると効果的</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-primary-500 font-bold">3.</span>
                <span>感情や気持ちも含めて書くと、より人間味のある記事に</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-primary-500 font-bold">4.</span>
                <span>文字数は後から調整できるので、まずは内容重視で</span>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary-800 mb-3">新規作成も可能</h3>
            <p className="text-sm text-primary-700 mb-4">
              下書きがない場合は、ゼロから作成することもできます
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/steps')}
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              新規作成モードに切り替え
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DraftMode;