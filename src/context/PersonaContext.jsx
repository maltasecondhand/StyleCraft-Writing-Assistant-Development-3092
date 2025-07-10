import React, { createContext, useContext, useReducer, useEffect } from 'react';

const PersonaContext = createContext();

// 初期状態
const initialState = {
  readerPersonas: [],
  writerPersonas: [],
  preferences: {},
  selectedReaderPersona: null,
  selectedWriterPersona: null,
  isPersonaModalOpen: false,
  personaType: 'reader' // 'reader' or 'writer'
};

// リデューサー
function personaReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PERSONAS':
      return {
        ...state,
        readerPersonas: action.payload.reader || [],
        writerPersonas: action.payload.writer || [],
        preferences: action.payload.preferences || {}
      };
    case 'ADD_READER_PERSONA':
      return {
        ...state,
        readerPersonas: [...state.readerPersonas, action.payload]
      };
    case 'ADD_WRITER_PERSONA':
      return {
        ...state,
        writerPersonas: [...state.writerPersonas, action.payload]
      };
    case 'UPDATE_READER_PERSONA':
      return {
        ...state,
        readerPersonas: state.readerPersonas.map(persona =>
          persona.id === action.payload.id ? action.payload : persona
        )
      };
    case 'UPDATE_WRITER_PERSONA':
      return {
        ...state,
        writerPersonas: state.writerPersonas.map(persona =>
          persona.id === action.payload.id ? action.payload : persona
        )
      };
    case 'DELETE_READER_PERSONA':
      return {
        ...state,
        readerPersonas: state.readerPersonas.filter(persona => persona.id !== action.payload)
      };
    case 'DELETE_WRITER_PERSONA':
      return {
        ...state,
        writerPersonas: state.writerPersonas.filter(persona => persona.id !== action.payload)
      };
    case 'SELECT_READER_PERSONA':
      return {
        ...state,
        selectedReaderPersona: action.payload
      };
    case 'SELECT_WRITER_PERSONA':
      return {
        ...state,
        selectedWriterPersona: action.payload
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    case 'TOGGLE_PERSONA_MODAL':
      return {
        ...state,
        isPersonaModalOpen: !state.isPersonaModalOpen,
        personaType: action.payload || state.personaType
      };
    default:
      return state;
  }
}

export function PersonaProvider({ children }) {
  const [state, dispatch] = useReducer(personaReducer, initialState);

  // ローカルストレージからペルソナを読み込む
  useEffect(() => {
    const loadPersonas = () => {
      try {
        const savedData = localStorage.getItem('moanote_personas');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          dispatch({ type: 'LOAD_PERSONAS', payload: parsedData });
        }
      } catch (error) {
        console.error('Failed to load personas:', error);
      }
    };
    loadPersonas();
  }, []);

  // ペルソナが変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      const dataToSave = {
        reader: state.readerPersonas,
        writer: state.writerPersonas,
        preferences: state.preferences
      };
      localStorage.setItem('moanote_personas', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save personas:', error);
    }
  }, [state.readerPersonas, state.writerPersonas, state.preferences]);

  // 読者ペルソナを保存
  const saveReaderPersona = (personaData, personaId = null) => {
    const now = new Date();
    if (personaId) {
      const updatedPersona = {
        ...personaData,
        id: personaId,
        updatedAt: now.toISOString()
      };
      dispatch({ type: 'UPDATE_READER_PERSONA', payload: updatedPersona });
      return updatedPersona;
    } else {
      const newPersona = {
        ...personaData,
        id: `reader_${Date.now()}`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      dispatch({ type: 'ADD_READER_PERSONA', payload: newPersona });
      return newPersona;
    }
  };

  // 書き手ペルソナを保存
  const saveWriterPersona = (personaData, personaId = null) => {
    const now = new Date();
    if (personaId) {
      const updatedPersona = {
        ...personaData,
        id: personaId,
        updatedAt: now.toISOString()
      };
      dispatch({ type: 'UPDATE_WRITER_PERSONA', payload: updatedPersona });
      return updatedPersona;
    } else {
      const newPersona = {
        ...personaData,
        id: `writer_${Date.now()}`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      dispatch({ type: 'ADD_WRITER_PERSONA', payload: newPersona });
      return newPersona;
    }
  };

  // ペルソナを削除
  const deletePersona = (personaId, type) => {
    if (type === 'reader') {
      dispatch({ type: 'DELETE_READER_PERSONA', payload: personaId });
    } else {
      dispatch({ type: 'DELETE_WRITER_PERSONA', payload: personaId });
    }
  };

  // ペルソナを選択
  const selectPersona = (persona, type) => {
    if (type === 'reader') {
      dispatch({ type: 'SELECT_READER_PERSONA', payload: persona });
    } else {
      dispatch({ type: 'SELECT_WRITER_PERSONA', payload: persona });
    }
  };

  // 設定を更新
  const updatePreferences = (newPreferences) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: newPreferences });
  };

  // ペルソナモーダルの表示切り替え
  const togglePersonaModal = (type = 'reader') => {
    dispatch({ type: 'TOGGLE_PERSONA_MODAL', payload: type });
  };

  // 組み合わせ設定を保存
  const saveCombination = (name, readerPersonaId, writerPersonaId, additionalSettings = {}) => {
    const combination = {
      id: `combo_${Date.now()}`,
      name,
      readerPersonaId,
      writerPersonaId,
      additionalSettings,
      createdAt: new Date().toISOString()
    };

    const currentPreferences = state.preferences.combinations || [];
    updatePreferences({
      combinations: [...currentPreferences, combination]
    });

    return combination;
  };

  // 組み合わせを適用
  const applyCombination = (combinationId) => {
    const combination = state.preferences.combinations?.find(c => c.id === combinationId);
    if (combination) {
      const readerPersona = state.readerPersonas.find(p => p.id === combination.readerPersonaId);
      const writerPersona = state.writerPersonas.find(p => p.id === combination.writerPersonaId);
      
      return {
        readerPersona,
        writerPersona,
        additionalSettings: combination.additionalSettings
      };
    }
    return null;
  };

  return (
    <PersonaContext.Provider
      value={{
        state,
        saveReaderPersona,
        saveWriterPersona,
        deletePersona,
        selectPersona,
        updatePreferences,
        togglePersonaModal,
        saveCombination,
        applyCombination
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersonas() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersonas must be used within a PersonaProvider');
  }
  return context;
}