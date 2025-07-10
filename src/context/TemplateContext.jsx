import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TemplateContext = createContext();

// 初期状態
const initialState = {
  templates: [],
  selectedTemplate: null,
  isTemplateModalOpen: false,
  isSaveModalOpen: false,
  isTemplateSelectorModalOpen: false,
  isTemplateCreatorModalOpen: false
};

// テンプレート用のリデューサー
function templateReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.id === action.payload.id ? action.payload : template
        )
      };
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(template => template.id !== action.payload),
        selectedTemplate: state.selectedTemplate?.id === action.payload ? null : state.selectedTemplate
      };
    case 'SELECT_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    case 'TOGGLE_TEMPLATE_MODAL':
      return { ...state, isTemplateModalOpen: !state.isTemplateModalOpen };
    case 'TOGGLE_SAVE_MODAL':
      return { ...state, isSaveModalOpen: !state.isSaveModalOpen };
    case 'TOGGLE_TEMPLATE_SELECTOR_MODAL':
      return { ...state, isTemplateSelectorModalOpen: !state.isTemplateSelectorModalOpen };
    case 'TOGGLE_TEMPLATE_CREATOR_MODAL':
      return { ...state, isTemplateCreatorModalOpen: !state.isTemplateCreatorModalOpen };
    default:
      return state;
  }
}

export function TemplateProvider({ children }) {
  const [state, dispatch] = useReducer(templateReducer, initialState);

  // ローカルストレージからテンプレートを読み込む
  useEffect(() => {
    const loadTemplates = () => {
      try {
        const savedTemplates = localStorage.getItem('moanote_templates');
        if (savedTemplates) {
          const templates = JSON.parse(savedTemplates);
          dispatch({ type: 'LOAD_TEMPLATES', payload: templates });
        } else {
          // 初期テンプレートを作成
          const initialTemplates = createInitialTemplates();
          dispatch({ type: 'LOAD_TEMPLATES', payload: initialTemplates });
          localStorage.setItem('moanote_templates', JSON.stringify(initialTemplates));
        }
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    };
    loadTemplates();
  }, []);

  // テンプレートが変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem('moanote_templates', JSON.stringify(state.templates));
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  }, [state.templates]);

  // 初期テンプレートを作成
  const createInitialTemplates = () => {
    const now = new Date().toISOString();
    return [
      {
        id: 'reader_template_1',
        name: '20代IT系女性',
        description: 'IT企業で働く効率重視の女性向け',
        type: 'reader',
        promptText: `年齢: 20代後半
職業: IT企業のマーケター
性格: 効率重視、データ志向、新しい技術に興味
課題: 時間不足、情報過多、スキルアップの必要性
興味: SaaS、マーケティング自動化、キャリア形成
読み方: スキマ時間にスマホで流し読み`,
        tags: ['IT', '女性', '20代', 'マーケター'],
        data: { age: '20代', occupation: 'マーケター', interests: ['SaaS', 'マーケティング自動化'] },
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'writer_template_1',
        name: '親しみやすい先輩',
        description: '経験豊富で親しみやすいライター',
        type: 'writer',
        promptText: `年齢: 32歳
職業: フリーランスライター
性格: 親しみやすい、共感力が高い、経験豊富
口調: です・ます調、時々関西弁
動機: 読者の悩みを解決したい、自分の経験を共有したい
特徴: 失敗談も含めて正直に話す、読者を応援する姿勢`,
        tags: ['親しみやすい', 'ライター', '関西弁'],
        data: { age: '32', occupation: 'ライター', personalities: ['親しみやすい'] },
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'settings_template_1',
        name: 'SEO重視設定',
        description: '検索エンジン最適化を重視した設定',
        type: 'settings',
        promptText: `SEO要件:
- タイトルにメインキーワードを含める
- 見出しにサブキーワードを配置
- メタディスクリプション対応
- 内部リンクの提案を含める
- 検索意図に合った構成
- 適切な文字数での情報密度`,
        tags: ['SEO', '検索最適化'],
        data: { seoOptimized: true },
        createdAt: now,
        updatedAt: now
      }
    ];
  };

  // テンプレートを保存する関数
  const saveTemplate = (templateData, templateId = null) => {
    const now = new Date();
    if (templateId) {
      // 既存テンプレートの更新
      const updatedTemplate = {
        ...templateData,
        id: templateId,
        updatedAt: now.toISOString()
      };
      dispatch({ type: 'UPDATE_TEMPLATE', payload: updatedTemplate });
      return updatedTemplate;
    } else {
      // 新規テンプレートの追加
      const newTemplate = {
        ...templateData,
        id: `template_${Date.now()}`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      return newTemplate;
    }
  };

  // テンプレートを削除する関数
  const deleteTemplate = (templateId) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: templateId });
  };

  // テンプレートを選択する関数
  const selectTemplate = (template) => {
    dispatch({ type: 'SELECT_TEMPLATE', payload: template });
  };

  // テンプレートモーダルの表示切り替え
  const toggleTemplateModal = () => {
    dispatch({ type: 'TOGGLE_TEMPLATE_MODAL' });
  };

  // 保存モーダルの表示切り替え
  const toggleSaveModal = () => {
    dispatch({ type: 'TOGGLE_SAVE_MODAL' });
  };

  // テンプレートセレクターモーダルの表示切り替え
  const toggleTemplateSelectorModal = () => {
    dispatch({ type: 'TOGGLE_TEMPLATE_SELECTOR_MODAL' });
  };

  // テンプレート作成モーダルの表示切り替え
  const toggleTemplateCreatorModal = () => {
    dispatch({ type: 'TOGGLE_TEMPLATE_CREATOR_MODAL' });
  };

  return (
    <TemplateContext.Provider
      value={{
        state,
        saveTemplate,
        deleteTemplate,
        selectTemplate,
        toggleTemplateModal,
        toggleSaveModal,
        toggleTemplateSelectorModal,
        toggleTemplateCreatorModal
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
}