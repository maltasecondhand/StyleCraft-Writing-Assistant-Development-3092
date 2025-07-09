import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft, FiInfo } = FiIcons;

function StepPrimaryInfo() {
  const { state, dispatch } = useSteps();

  const updateInfo = (field, value) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        primaryInfo: {
          ...state.data.primaryInfo,
          [field]: value
        }
      }
    });
  };

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: 6 });
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          一次情報を入力しましょう
        </h3>
        <p className="text-gray-600">
          実際の体験や事実を「事実」と「感想」に分けて入力することで、リアルで温かみのある記事になります
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">重要なポイント</h4>
            <p className="text-blue-700 text-sm">
              「事実」と「感想」を明確に分けることで、読者に信頼性と共感の両方を提供できます。
              事実は客観的な情報、感想は主観的な体験や気持ちを書きましょう。
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            事実（客観的な情報）
          </label>
          <textarea
            value={state.data.primaryInfo.facts}
            onChange={(e) => updateInfo('facts', e.target.value)}
            placeholder="例：
- 3ヶ月間、毎日2時間Reactの学習をした
- 最初の1ヶ月は基礎文法を学んだ
- 2ヶ月目からは実際にアプリを作り始めた
- 最終的に3つのWebアプリを完成させた"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-40 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            起こったこと、数値、期間など客観的な事実を書いてください
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            感想（主観的な体験・気持ち）
          </label>
          <textarea
            value={state.data.primaryInfo.feelings}
            onChange={(e) => updateInfo('feelings', e.target.value)}
            placeholder="例：
- 最初は難しくて挫折しそうになった
- 基礎が身についてくると楽しくなった
- 初めてアプリが動いたときは感動した
- 継続することの大切さを実感した
- 今では自信を持ってReactを使える"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 h-40 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            感じたこと、思ったこと、気持ちの変化を書いてください
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">記入例</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-yellow-700">事実の例：</p>
            <ul className="text-yellow-700 space-y-1">
              <li>• 売上が前年比120%増加した</li>
              <li>• 3つのツールを導入した</li>
              <li>• 会議時間を30分短縮した</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-yellow-700">感想の例：</p>
            <ul className="text-yellow-700 space-y-1">
              <li>• 最初は不安だった</li>
              <li>• 効果を実感できて嬉しかった</li>
              <li>• チームの雰囲気が良くなった</li>
            </ul>
          </div>
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

export default StepPrimaryInfo;