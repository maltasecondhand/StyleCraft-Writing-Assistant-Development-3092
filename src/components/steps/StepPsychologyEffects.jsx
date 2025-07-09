import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft, FiHeart, FiClock, FiAward, FiZap } = FiIcons;

function StepPsychologyEffects() {
  const { state, dispatch } = useSteps();

  const updateEffect = (field, value) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        psychologyEffects: {
          ...state.data.psychologyEffects,
          [field]: value
        }
      }
    });
  };

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: 7 });
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: 5 });
  };

  const effects = [
    {
      key: 'empathy',
      title: '共感効果',
      description: '読者の気持ちに寄り添い、共感を呼ぶ表現を使用',
      icon: FiHeart,
      color: 'text-pink-600'
    },
    {
      key: 'urgency',
      title: '緊急性',
      description: '今すぐ行動を促す表現で読者の行動を後押し',
      icon: FiClock,
      color: 'text-orange-600'
    },
    {
      key: 'authority',
      title: '権威性',
      description: '専門知識や実績を示して信頼性を高める',
      icon: FiAward,
      color: 'text-blue-600'
    },
    {
      key: 'scarcity',
      title: '希少性',
      description: '限定性や特別感を演出して価値を高める',
      icon: FiZap,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          心理効果を選択しましょう
        </h3>
        <p className="text-gray-600">
          読者の心に響く心理効果を選択して、より効果的な記事を作成しましょう
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {effects.map((effect) => (
          <motion.button
            key={effect.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateEffect(effect.key, !state.data.psychologyEffects[effect.key])}
            className={`p-6 rounded-lg border-2 transition-colors text-left ${
              state.data.psychologyEffects[effect.key]
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-gray-100 ${effect.color}`}>
                <SafeIcon icon={effect.icon} className="text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{effect.title}</h4>
                  <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    state.data.psychologyEffects[effect.key]
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {state.data.psychologyEffects[effect.key] && (
                      <div className="w-full h-full rounded-full bg-primary-500 flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{effect.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-800 mb-3">選択された効果の例</h4>
        <div className="space-y-3">
          {effects.map((effect) => (
            state.data.psychologyEffects[effect.key] && (
              <div key={effect.key} className="flex items-start space-x-3">
                <SafeIcon icon={effect.icon} className={`mt-1 ${effect.color}`} />
                <div>
                  <p className="font-medium text-gray-800">{effect.title}</p>
                  <p className="text-sm text-gray-600">
                    {effect.key === 'empathy' && '「私も同じような経験をしました」「きっと不安ですよね」'}
                    {effect.key === 'urgency' && '「今すぐ始めることで」「このチャンスを逃さないで」'}
                    {effect.key === 'authority' && '「5年間の経験から」「実際に売上が○○%アップした」'}
                    {effect.key === 'scarcity' && '「限定的な方法」「多くの人が知らない」'}
                  </p>
                </div>
              </div>
            )
          ))}
          {!Object.values(state.data.psychologyEffects).some(Boolean) && (
            <p className="text-gray-500 text-sm">心理効果が選択されていません</p>
          )}
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

export default StepPsychologyEffects;