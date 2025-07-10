import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSteps } from '../context/StepsContext';
import { usePersonas } from '../context/PersonaContext';
import { usePrompts } from '../context/PromptsContext';
import { useTemplates } from '../context/TemplateContext';
import StepProgress from '../components/StepProgress';
import StepKeywords from '../components/steps/StepKeywords';
import StepReaderPersona from '../components/steps/StepReaderPersona';
import StepWriterCharacter from '../components/steps/StepWriterCharacter';
import StepWritingStyle from '../components/steps/StepWritingStyle';
import StepPrimaryInfo from '../components/steps/StepPrimaryInfo';

// テンプレート関連
import TemplateButton from '../components/templates/TemplateButton';
import TemplateModal from '../components/templates/TemplateModal';
import SaveTemplateModal from '../components/templates/SaveTemplateModal';
import TemplateCombinationButton from '../components/templates/TemplateCombinationButton';
import TemplateSelector from '../components/templates/TemplateSelector';
import TemplateCreator from '../components/templates/TemplateCreator';

// ペルソナ関連
import PersonaButton from '../components/personas/PersonaButton';
import PersonaModal from '../components/personas/PersonaModal';
import CombinationButton from '../components/personas/CombinationButton';
import CombinationModal from '../components/personas/CombinationModal';

// プロンプト関連
import PromptButton from '../components/prompts/PromptButton';
import CustomPromptModal from '../components/prompts/CustomPromptModal';

function WritingSteps() {
  const { state, dispatch } = useSteps();
  const { state: personaState } = usePersonas();
  const { state: promptState } = usePrompts();
  const { state: templateState } = useTemplates();
  const [showCombinationModal, setShowCombinationModal] = useState(false);

  const renderStep = () => {
    switch (state.currentStep) {
      case 1: return <StepKeywords />;
      case 2: return <StepReaderPersona />;
      case 3: return <StepWriterCharacter />;
      case 4: return <StepWritingStyle />;
      case 5: return <StepPrimaryInfo />;
      default: return <StepKeywords />;
    }
  };

  const showPersonaButtons = () => {
    return state.currentStep === 2 || state.currentStep === 3;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <StepProgress />
        <div className="flex space-x-2 flex-wrap">
          {showPersonaButtons() && (
            <>
              {state.currentStep === 2 && <PersonaButton type="reader" />}
              {state.currentStep === 3 && <PersonaButton type="writer" />}
            </>
          )}
          <CombinationButton onClick={() => setShowCombinationModal(true)} />
          <PromptButton />
          <TemplateButton type="load" />
          <TemplateButton type="save" />
        </div>
      </div>

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

      {/* ペルソナモーダル */}
      {personaState.isPersonaModalOpen && <PersonaModal />}
      
      {/* 組み合わせモーダル */}
      <CombinationModal isOpen={showCombinationModal} onClose={() => setShowCombinationModal(false)} />
      
      {/* カスタムプロンプトモーダル */}
      {promptState.isPromptModalOpen && <CustomPromptModal />}
      
      {/* テンプレートモーダル */}
      {templateState.isTemplateModalOpen && <TemplateModal />}
      
      {/* テンプレート保存モーダル */}
      {templateState.isSaveModalOpen && <SaveTemplateModal />}

      {/* テンプレート組み合わせモーダル */}
      {templateState.isTemplateSelectorModalOpen && <TemplateSelector />}
      
      {/* テンプレート作成モーダル */}
      {templateState.isTemplateCreatorModalOpen && <TemplateCreator />}
    </div>
  );
}

export default WritingSteps;