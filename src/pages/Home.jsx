import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePersonas } from '../context/PersonaContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiUsers, FiSettings, FiCopy, FiHeart, FiZap, FiFileText, FiUser } = FiIcons;

function Home() {
  const navigate = useNavigate();
  const { togglePersonaModal } = usePersonas();

  const features = [
    {
      icon: FiEdit3,
      title: '書き手と読み手を明確に設定',
      description: 'ぽちぽち選ぶだけで、年齢・職業・性格・悩みなど、書く人＆読む人のペルソナを言語化して保存'
    },
    {
      icon: FiSettings,
      title: '目的・トーン・文体・構成をカスタム',
      description: '文章構成・語尾・トーン・絵文字の頻度など、あなただけの文体レシピを細かく指定可能'
    },
    {
      icon: FiCopy,
      title: 'プロンプトを生成して終わり',
      description: 'ChatGPTや他のAIに使える、精密に調整されたプロンプトを生成。コピペで使える設計'
    },
    {
      icon: FiFileText,
      title: 'テンプレ保存＆呼び出し',
      description: '書き手・読み手の設定をテンプレートとして保存。組み合わせてプロンプトを何度でも生成'
    }
  ];

  const steps = [
    'キーワード設定（記事のテーマを入力）',
    '読み手のペルソナ設定（悩み・関心など）',
    '書き手のキャラ設定（年齢・性格・語尾など）',
    '文体・構成・文字数の調整（テンプレ・語尾・絵文字など）',
    '一次情報の追加（体験談・事実・感想など）'
  ];

  const handlePersonaOpen = (type) => {
    togglePersonaModal(type);
  };

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
            あなたの「書き手の個性」と「読者像」に合わせて、<br />
            <span className="font-semibold text-primary-600">AIプロンプトを生成</span>するツールです
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-3xl mx-auto mb-8">
            <p className="text-blue-800 text-lg">
              🪄 もう迷わない、ブレない。自分らしいトーンで文章を整えるための<br />
              <strong>「下書き前の土台」</strong>をつくります。
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/steps')}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            プロンプト生成を開始
          </motion.button>
        </div>
      </motion.section>

      {/* Quick Actions Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          クイックアクション
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiUsers} className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">読者ペルソナ管理</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePersonaOpen('reader')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                管理・編集
              </motion.button>
            </div>
            <p className="text-gray-600 text-sm">
              保存した読者ペルソナの確認、編集、削除を行います。年齢、職業、興味関心、課題などを管理できます。
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="text-green-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">書き手キャラクター管理</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePersonaOpen('writer')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                管理・編集
              </motion.button>
            </div>
            <p className="text-gray-600 text-sm">
              保存した書き手キャラクターの確認、編集、削除を行います。年齢、職業、性格、口調、動機などを管理できます。
            </p>
          </motion.div>
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
          moanote AIの機能特徴
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
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
          簡単5ステップでプロンプト生成
        </h2>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={FiZap} className="text-green-600 text-xl" />
              <h3 className="text-lg font-semibold text-green-800">完成！</h3>
            </div>
            <p className="text-green-700">
              ChatGPTなどのAIに貼って、あなたらしい文章を作れます！
            </p>
          </div>
        </div>
      </motion.section>

      {/* Target Users */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mb-16"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">🎯 こんな人におすすめ</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• ChatGPTの出力が「なんか他人っぽい」と感じる人</li>
              <li>• 自分らしい文章にこだわりたいクリエイター・ライター</li>
              <li>• noteやブログ、Xポストを"文体から整えたい"人</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-red-800 mb-4">🚫 こんなことはしません</h3>
            <ul className="space-y-2 text-red-700">
              <li>• 下書きのリライト処理は行いません</li>
              <li>• 出力されるのは「AIに貼り付けるプロンプト文」のみです</li>
              <li>• 直接的な記事生成機能はありません</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="text-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-12 border border-primary-200"
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          今すぐ始めて、あなたらしいプロンプトを作成しよう
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          あなただけの文体レシピで、AIとの対話をもっと自分らしく
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/steps')}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          プロンプト生成を開始
        </motion.button>
      </motion.section>
    </div>
  );
}

export default Home;