import React, { createContext, useContext, useReducer, useEffect } from 'react';

const PromptsContext = createContext();

// 初期状態
const initialState = {
  prompts: [],
  selectedPrompt: null,
  isPromptModalOpen: false,
};

// リデューサー
function promptsReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PROMPTS':
      return {
        ...state,
        prompts: action.payload,
      };
    case 'ADD_PROMPT':
      return {
        ...state,
        prompts: [...state.prompts, action.payload],
      };
    case 'UPDATE_PROMPT':
      return {
        ...state,
        prompts: state.prompts.map(prompt =>
          prompt.id === action.payload.id ? action.payload : prompt
        ),
      };
    case 'DELETE_PROMPT':
      return {
        ...state,
        prompts: state.prompts.filter(prompt => prompt.id !== action.payload),
        selectedPrompt: state.selectedPrompt?.id === action.payload ? null : state.selectedPrompt,
      };
    case 'SELECT_PROMPT':
      return {
        ...state,
        selectedPrompt: action.payload,
      };
    case 'TOGGLE_PROMPT_MODAL':
      return {
        ...state,
        isPromptModalOpen: !state.isPromptModalOpen,
      };
    default:
      return state;
  }
}

export function PromptsProvider({ children }) {
  const [state, dispatch] = useReducer(promptsReducer, initialState);

  // ローカルストレージからプロンプトを読み込む
  useEffect(() => {
    const loadPrompts = () => {
      try {
        const savedPrompts = localStorage.getItem('moanote_prompts');
        if (savedPrompts) {
          dispatch({ type: 'LOAD_PROMPTS', payload: JSON.parse(savedPrompts) });
        }
      } catch (error) {
        console.error('Failed to load prompts:', error);
      }
    };
    loadPrompts();
  }, []);

  // プロンプトが変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem('moanote_prompts', JSON.stringify(state.prompts));
    } catch (error) {
      console.error('Failed to save prompts:', error);
    }
  }, [state.prompts]);

  // プロンプトを保存
  const savePrompt = (promptData, promptId = null) => {
    const now = new Date();
    if (promptId) {
      const updatedPrompt = {
        ...promptData,
        id: promptId,
        updatedAt: now.toISOString(),
      };
      dispatch({ type: 'UPDATE_PROMPT', payload: updatedPrompt });
      return updatedPrompt;
    } else {
      const newPrompt = {
        ...promptData,
        id: `prompt_${Date.now()}`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      dispatch({ type: 'ADD_PROMPT', payload: newPrompt });
      return newPrompt;
    }
  };

  // プロンプトを削除
  const deletePrompt = (promptId) => {
    dispatch({ type: 'DELETE_PROMPT', payload: promptId });
  };

  // プロンプトを選択
  const selectPrompt = (prompt) => {
    dispatch({ type: 'SELECT_PROMPT', payload: prompt });
  };

  // プロンプトモーダルの表示切り替え
  const togglePromptModal = () => {
    dispatch({ type: 'TOGGLE_PROMPT_MODAL' });
  };

  return (
    <PromptsContext.Provider
      value={{
        state,
        savePrompt,
        deletePrompt,
        selectPrompt,
        togglePromptModal,
      }}
    >
      {children}
    </PromptsContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptsContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptsProvider');
  }
  return context;
}