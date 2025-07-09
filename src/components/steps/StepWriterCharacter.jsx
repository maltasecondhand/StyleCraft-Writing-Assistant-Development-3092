import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft, FiCheck } = FiIcons;

function StepWriterCharacter() {
  const { state, dispatch } = useSteps();

  const updateCharacter = (field, value) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        writerCharacter: {
          ...state.data.writerCharacter,
          [field]: value
        }
      }
    });
  };

  const togglePersonality = (personality) => {
    const currentPersonalities = state.data.writerCharacter.personalities || [];
    const newPersonalities = currentPersonalities.includes(personality)
      ? currentPersonalities.filter(p => p !== personality)
      : [...currentPersonalities, personality];
    
    updateCharacter('personalities', newPersonalities);
  };

  const toggleMotivation = (motivation) => {
    const currentMotivations = state.data.writerCharacter.motivations || [];
    const newMotivations = currentMotivations.includes(motivation)
      ? currentMotivations.filter(m => m !== motivation)
      : [...currentMotivations, motivation];
    
    updateCharacter('motivations', newMotivations);
  };

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  const personalityOptions = [
    '親しみやすい', '真面目', '情熱的', '冷静', '優しい',
    'ユーモアがある', '論理的', '感情的', '実用的', '創造的'
  ];

  const toneOptions = [
    'です・ます調', 'だ・である調', 'カジュアル', 'フォーマル',
    '関西弁', '敬語多め', 'タメ口', '丁寧語'
  ];

  const motivationOptions = [
    '知識を共有したい', '体験を伝えたい', '問題を解決したい',
    '共感してもらいたい', '影響力を持ちたい', '成長したい',
    '仲間を見つけたい', '専門性を示したい'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          書き手のキャラクターを設定しましょう
        </h3>
        <p className="text-gray-600">
          あなた自身のキャラクターを設定することで、読者に親近感を持ってもらえます
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            年齢
          </label>
          <input
            type="text"
            value={state.data.writerCharacter.age}
            onChange={(e) => updateCharacter('age', e.target.value)}
            placeholder="例: 28"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            職業・立場
          </label>
          <input
            type="text"
            value={state.data.writerCharacter.occupation}
            onChange={(e) => updateCharacter('occupation', e.target.value)}
            placeholder="例: フロントエンドエンジニア"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          性格・キャラクター（複数選択可）
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {personalityOptions.map((personality) => (
            <motion.button
              key={personality}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePersonality(personality)}
              className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center space-x-1 ${
                state.data.writerCharacter.personalities?.includes(personality)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {state.data.writerCharacter.personalities?.includes(personality) && (
                <SafeIcon icon={FiCheck} className="text-xs" />
              )}
              <span>{personality}</span>
            </motion.button>
          ))}
        </div>
        {state.data.writerCharacter.personalities?.length > 0 && (
          <div className="text-sm text-gray-600">
            選択中: {state.data.writerCharacter.personalities.join(', ')}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          口調・話し方
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {toneOptions.map((tone) => (
            <motion.button
              key={tone}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateCharacter('tone', tone)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                state.data.writerCharacter.tone === tone
                  ? 'bg-secondary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tone}
            </motion.button>
          ))}
        </div>
        {state.data.writerCharacter.tone && (
          <div className="text-sm text-gray-600">
            選択中: {state.data.writerCharacter.tone}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          書く動機・理由（複数選択可）
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {motivationOptions.map((motivation) => (
            <motion.button
              key={motivation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleMotivation(motivation)}
              className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center space-x-1 ${
                state.data.writerCharacter.motivations?.includes(motivation)
                  ? 'bg-accent-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {state.data.writerCharacter.motivations?.includes(motivation) && (
                <SafeIcon icon={FiCheck} className="text-xs" />
              )}
              <span>{motivation}</span>
            </motion.button>
          ))}
        </div>
        {state.data.writerCharacter.motivations?.length > 0 && (
          <div className="text-sm text-gray-600">
            選択中: {state.data.writerCharacter.motivations.join(', ')}
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

export default StepWriterCharacter;