import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft, FiUpload, FiLink } = FiIcons;

function StepReferenceStyle() {
  const { state, dispatch } = useSteps();

  const updateReferenceStyle = (value) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        referenceStyle: value
      }
    });
  };

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: 8 });
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: 6 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          参考文体をアップロード（任意）
        </h3>
        <p className="text-gray-600">
          参考にしたい文体のURLや文章を入力することで、より理想的な文体に近づけることができます
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiLink} className="text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">参考文体について</h4>
            <p className="text-blue-700 text-sm">
              好きな記事のURLや、理想的な文体のテキストを入力してください。
              AIがその文体を分析し、あなたの記事に反映させます。
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            参考文体の入力方法を選択
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiLink} className="text-primary-600" />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">URLで指定</h4>
                  <p className="text-sm text-gray-600">記事のURLを入力</p>
                </div>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiUpload} className="text-primary-600" />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">テキストで指定</h4>
                  <p className="text-sm text-gray-600">文章を直接入力</p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            参考文体（URLまたはテキスト）
          </label>
          <textarea
            value={state.data.referenceStyle}
            onChange={(e) => updateReferenceStyle(e.target.value)}
            placeholder="例：
https://note.com/example-article

または

参考にしたい文章をここに貼り付けてください。
この文章のトーンや表現方法を参考にして、
あなたの記事に反映させます。"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-32 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            このステップはスキップしても構いません
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">文体分析のポイント</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• 文章の長さとリズム</li>
          <li>• 語尾の特徴（です・ます調、だ・である調など）</li>
          <li>• 専門用語の使用頻度</li>
          <li>• 読者への語りかけ方</li>
          <li>• 感情表現の豊かさ</li>
        </ul>
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

export default StepReferenceStyle;