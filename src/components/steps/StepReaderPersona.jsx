import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft } = FiIcons;

function StepReaderPersona() {
  const { state, dispatch } = useSteps();

  const updatePersona = (field, value) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        readerPersona: {
          ...state.data.readerPersona,
          [field]: value
        }
      }
    });
  };

  const addInterest = (interest) => {
    const interests = state.data.readerPersona.interests || [];
    if (!interests.includes(interest)) {
      updatePersona('interests', [...interests, interest]);
    }
  };

  const removeInterest = (interest) => {
    const interests = state.data.readerPersona.interests || [];
    updatePersona('interests', interests.filter(i => i !== interest));
  };

  const addChallenge = (challenge) => {
    const challenges = state.data.readerPersona.challenges || [];
    if (!challenges.includes(challenge)) {
      updatePersona('challenges', [...challenges, challenge]);
    }
  };

  const removeChallenge = (challenge) => {
    const challenges = state.data.readerPersona.challenges || [];
    updatePersona('challenges', challenges.filter(c => c !== challenge));
  };

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  const interestOptions = [
    'プログラミング', 'デザイン', 'マーケティング', 'ビジネス', 'キャリア',
    'スタートアップ', 'フリーランス', '副業', '投資', 'ライフハック'
  ];

  const challengeOptions = [
    '時間がない', 'スキル不足', '情報過多', '継続できない', '成果が出ない',
    '何から始めればいいかわからない', 'モチベーション維持', '専門用語が難しい'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          読者のペルソナを設定しましょう
        </h3>
        <p className="text-gray-600">
          記事を読む人のイメージを具体的に設定することで、より響く文章が書けます
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            年齢層
          </label>
          <select
            value={state.data.readerPersona.age}
            onChange={(e) => updatePersona('age', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">選択してください</option>
            <option value="10代">10代</option>
            <option value="20代">20代</option>
            <option value="30代">30代</option>
            <option value="40代">40代</option>
            <option value="50代以上">50代以上</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            職業・立場
          </label>
          <input
            type="text"
            value={state.data.readerPersona.occupation}
            onChange={(e) => updatePersona('occupation', e.target.value)}
            placeholder="例: エンジニア、学生、会社員"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          読むスタイル
        </label>
        <select
          value={state.data.readerPersona.readingStyle}
          onChange={(e) => updatePersona('readingStyle', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">選択してください</option>
          <option value="じっくり読む">じっくり読む</option>
          <option value="流し読み">流し読み</option>
          <option value="重要部分だけ">重要部分だけ</option>
          <option value="スマホで隙間時間">スマホで隙間時間</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          興味・関心のあること
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {interestOptions.map((interest) => (
            <motion.button
              key={interest}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => 
                state.data.readerPersona.interests?.includes(interest)
                  ? removeInterest(interest)
                  : addInterest(interest)
              }
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                state.data.readerPersona.interests?.includes(interest)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {interest}
            </motion.button>
          ))}
        </div>
        {state.data.readerPersona.interests?.length > 0 && (
          <div className="text-sm text-gray-600">
            選択中: {state.data.readerPersona.interests.join(', ')}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          抱えている課題・悩み
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {challengeOptions.map((challenge) => (
            <motion.button
              key={challenge}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => 
                state.data.readerPersona.challenges?.includes(challenge)
                  ? removeChallenge(challenge)
                  : addChallenge(challenge)
              }
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                state.data.readerPersona.challenges?.includes(challenge)
                  ? 'bg-secondary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {challenge}
            </motion.button>
          ))}
        </div>
        {state.data.readerPersona.challenges?.length > 0 && (
          <div className="text-sm text-gray-600">
            選択中: {state.data.readerPersona.challenges.join(', ')}
          </div>
        )}
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

export default StepReaderPersona;