import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../context/StepsContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck } = FiIcons;

function StepProgress() {
  const { state } = useSteps();

  const steps = [
    'キーワード',
    '読者設定',
    '書き手設定',
    '文体・構成',
    '一次情報',
    '心理効果',
    '参考文体',
    'ゴール'
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          STEP {state.currentStep}: {steps[state.currentStep - 1]}
        </h2>
        <div className="text-sm text-gray-600">
          {state.currentStep} / {state.totalSteps}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                index + 1 < state.currentStep
                  ? 'bg-primary-500 text-white'
                  : index + 1 === state.currentStep
                  ? 'bg-primary-100 text-primary-600 border-2 border-primary-500'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1 < state.currentStep ? (
                <SafeIcon icon={FiCheck} className="text-sm" />
              ) : (
                index + 1
              )}
            </motion.div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 transition-colors ${
                  index + 1 < state.currentStep ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default StepProgress;