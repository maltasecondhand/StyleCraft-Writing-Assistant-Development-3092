import React, { createContext, useContext, useReducer } from 'react';

const StepsContext = createContext();

const initialState = {
  currentStep: 1,
  totalSteps: 8,
  data: {
    keywords: [],
    purpose: '',
    readerPersona: {
      age: '',
      occupation: '',
      readingStyle: '',
      interests: [],
      challenges: []
    },
    writerCharacter: {
      age: '',
      occupation: '',
      personalities: [],
      tone: '',
      motivations: []
    },
    writingStyle: {
      conversational: false,
      template: 'prep',
      emojiFrequency: 'moderate'
    },
    primaryInfo: {
      facts: '',
      feelings: ''
    },
    psychologyEffects: {
      empathy: false,
      urgency: false,
      authority: false,
      scarcity: false
    },
    referenceStyle: '',
    goal: '',
    wordCount: 1500,
    apiKey: '',
    draftText: '',
    fromDraft: false
  }
};

function stepsReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload }
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function StepsProvider({ children }) {
  const [state, dispatch] = useReducer(stepsReducer, initialState);

  return (
    <StepsContext.Provider value={{ state, dispatch }}>
      {children}
    </StepsContext.Provider>
  );
}

export function useSteps() {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error('useSteps must be used within a StepsProvider');
  }
  return context;
}