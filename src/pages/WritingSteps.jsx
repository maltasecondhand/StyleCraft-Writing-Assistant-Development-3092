import React from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../context/StepsContext';
import StepProgress from '../components/StepProgress';
import StepKeywords from '../components/steps/StepKeywords';
import StepReaderPersona from '../components/steps/StepReaderPersona';
import StepWriterCharacter from '../components/steps/StepWriterCharacter';
import StepWritingStyle from '../components/steps/StepWritingStyle';
import StepPrimaryInfo from '../components/steps/StepPrimaryInfo';
import StepPsychologyEffects from '../components/steps/StepPsychologyEffects';
import StepReferenceStyle from '../components/steps/StepReferenceStyle';
import StepGoal from '../components/steps/StepGoal';

function WritingSteps() {
  const { state } = useSteps();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <StepKeywords />;
      case 2:
        return <StepReaderPersona />;
      case 3:
        return <StepWriterCharacter />;
      case 4:
        return <StepWritingStyle />;
      case 5:
        return <StepPrimaryInfo />;
      case 6:
        return <StepPsychologyEffects />;
      case 7:
        return <StepReferenceStyle />;
      case 8:
        return <StepGoal />;
      default:
        return <StepKeywords />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <StepProgress />
      <motion.div
        key={state.currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg"
      >
        {renderStep()}
      </motion.div>
    </div>
  );
}

export default WritingSteps;