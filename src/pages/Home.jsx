import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiUsers, FiTrendingUp, FiTarget, FiHeart, FiZap, FiFileText } = FiIcons;

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FiEdit3,
      title: '自分らしい文体',
      description: 'あなたの個性を反映した、機械的でない温かみのある文章を生成'
    },
    {
      icon: FiUsers,
      title: '読者に届く構成',
      description: '心理効果を活用した、読者の心に響く記事構成を自動提案'
    },
    {
      icon: FiTrendingUp,
      title: '図解まで一括提案',
      description: 'どこにどんな図解を入れるべきかまで、まとめて提案'
    },
    {
      icon: FiTarget,
      title: 'ゴール設定',
      description: '読者にしてほしい行動を明確にして、効果的な記事を作成'
    },
    {
      icon: FiHeart,
      title: '一次情報重視',
      description: '事実と感想を分けて入力することで、リアルな温度感を演出'
    },
    {
      icon: FiZap,
      title: 'BYO-API対応',
      description: 'あなたのAPIキーを使用して、プライベートで安全に利用'
    }
  ];

  const steps = [
    'キーワード＆目的の入力',
    '読者ペルソナの設定',
    '書き手キャラの設定',
    '文体＆構成テンプレ選択',
    '一次情報入力（事実と感想）',
    '心理効果ON/OFF',
    '参考文体アップロード（任意）',
    'ゴール設定'
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <SafeIcon icon={FiEdit3} className="text-white text-3xl" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            moanote AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            「誰かの心に届くnote」を、AIと一緒に<br />
            <span className="font-semibold text-primary-600">自分らしい言葉</span>で紡ぎましょう
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/steps')}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            新規で記事作成
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/draft')}
            className="bg-white border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            下書きから作成
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          moanote AIの特徴
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <SafeIcon icon={feature.icon} className="text-primary-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Steps Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          簡単8ステップで完成
        </h2>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-12 border border-primary-200"
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          今すぐ始めて、心に届く記事を作成しよう
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          あなたの想いを、読者に確実に届ける記事を一緒に作りましょう
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/steps')}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            新規で記事作成
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/draft')}
            className="bg-white border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            下書きから作成
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;