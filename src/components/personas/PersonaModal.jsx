import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePersonas } from '../../context/PersonaContext';
import { useSteps } from '../../context/StepsContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiUser, FiEdit, FiTrash2, FiCheck, FiPlus, FiUsers, FiHeart } = FiIcons;

function PersonaModal() {
  const { state, togglePersonaModal, selectPersona, deletePersona, saveReaderPersona, saveWriterPersona } = usePersonas();
  const { dispatch: stepsDispatch, state: stepsState } = useSteps();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [formData, setFormData] = useState({});

  const personas = state.personaType === 'reader' ? state.readerPersonas : state.writerPersonas;
  const filteredPersonas = personas.filter(persona =>
    persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPersona = (persona) => {
    selectPersona(persona, state.personaType);
    
    // ステップコンテキストにも反映
    if (state.personaType === 'reader') {
      stepsDispatch({ type: 'UPDATE_DATA', payload: { readerPersona: persona.data } });
    } else {
      stepsDispatch({ type: 'UPDATE_DATA', payload: { writerCharacter: persona.data } });
    }
    
    togglePersonaModal();
  };

  const handleSavePersona = () => {
    // キーワードや目的は含めない
    const personaData = {
      name: formData.name,
      description: formData.description,
      data: formData.data,
      tags: formData.tags || []
    };

    if (state.personaType === 'reader') {
      saveReaderPersona(personaData, editingPersona?.id);
    } else {
      saveWriterPersona(personaData, editingPersona?.id);
    }

    setShowForm(false);
    setEditingPersona(null);
    setFormData({});
  };

  const handleEditPersona = (persona) => {
    setEditingPersona(persona);
    setFormData(persona);
    setShowForm(true);
  };

  const handleDeletePersona = (personaId) => {
    deletePersona(personaId, state.personaType);
  };

  const initializeFormData = () => {
    if (state.personaType === 'reader') {
      return {
        name: '',
        description: '',
        data: {
          age: '',
          occupation: '',
          readingStyle: '',
          interests: [],
          challenges: []
        },
        tags: []
      };
    } else {
      return {
        name: '',
        description: '',
        data: {
          age: '',
          occupation: '',
          personalities: [],
          tone: '',
          motivations: []
        },
        tags: []
      };
    }
  };

  useEffect(() => {
    if (showForm && !editingPersona) {
      setFormData(initializeFormData());
    }
  }, [showForm, editingPersona, state.personaType]);

  // モーダルが開いていない場合は何も表示しない
  if (!state.isPersonaModalOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={state.personaType === 'reader' ? FiUsers : FiUser} className="text-primary-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {state.personaType === 'reader' ? '読者ペルソナ' : '書き手キャラクター'}を選択
            </h2>
          </div>
          <button
            onClick={() => togglePersonaModal()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 mr-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ペルソナを検索..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SafeIcon icon={FiUsers} className="text-lg" />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} />
              <span>新規作成</span>
            </motion.button>
          </div>

          {showForm ? (
            <PersonaForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleSavePersona}
              onCancel={() => {
                setShowForm(false);
                setEditingPersona(null);
                setFormData({});
              }}
              personaType={state.personaType}
              isEditing={!!editingPersona}
            />
          ) : (
            <div className="min-h-0">
              {filteredPersonas.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredPersonas.map((persona) => (
                    <PersonaCard
                      key={persona.id}
                      persona={persona}
                      onSelect={handleSelectPersona}
                      onEdit={handleEditPersona}
                      onDelete={handleDeletePersona}
                      personaType={state.personaType}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                    <SafeIcon icon={FiUser} className="text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">ペルソナがありません</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? '検索条件に一致するペルソナがありません。'
                      : 'ペルソナを作成してここに保存しましょう。'
                    }
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    新規作成
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ペルソナカードコンポーネント
function PersonaCard({ persona, onSelect, onEdit, onDelete, personaType }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{persona.name}</h3>
        <div className="flex space-x-1">
          {confirmDelete ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(persona.id);
                }}
                className="p-1 rounded-full hover:bg-red-100 text-red-500"
              >
                <SafeIcon icon={FiCheck} className="text-sm" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(false);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <SafeIcon icon={FiX} className="text-sm" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(persona);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <SafeIcon icon={FiEdit} className="text-gray-500 text-sm" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <SafeIcon icon={FiTrash2} className="text-gray-500 text-sm" />
              </button>
            </>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {persona.description || '説明なし'}
      </p>
      <div className="space-y-2">
        {personaType === 'reader' ? (
          <>
            <div className="text-xs text-gray-500">
              年齢: {persona.data.age || '未設定'} / 職業: {persona.data.occupation || '未設定'}
            </div>
            {persona.data.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {persona.data.interests.slice(0, 3).map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-xs text-gray-500">
              年齢: {persona.data.age || '未設定'} / 職業: {persona.data.occupation || '未設定'}
            </div>
            {persona.data.personalities?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {persona.data.personalities.slice(0, 3).map((personality, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
                  >
                    {personality}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(persona)}
        className="w-full mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
      >
        このペルソナを選択
      </motion.button>
    </motion.div>
  );
}

// ペルソナフォームコンポーネント
function PersonaForm({ formData, setFormData, onSave, onCancel, personaType, isEditing }) {
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDataField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? 'ペルソナを編集' : '新しいペルソナを作成'}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ペルソナ名 *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="例: IT系20代女性"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            説明
          </label>
          <input
            type="text"
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="このペルソナの特徴を簡潔に"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {personaType === 'reader' ? (
        <ReaderPersonaFields formData={formData} updateDataField={updateDataField} />
      ) : (
        <WriterPersonaFields formData={formData} updateDataField={updateDataField} />
      )}

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          disabled={!formData.name}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isEditing ? '更新' : '保存'}
        </motion.button>
      </div>
    </div>
  );
}

// 読者ペルソナフィールド
function ReaderPersonaFields({ formData, updateDataField }) {
  const [customInterest, setCustomInterest] = useState('');
  const [customChallenge, setCustomChallenge] = useState('');

  const interestOptions = [
    'プログラミング', 'デザイン', 'マーケティング', 'ビジネス', 'キャリア',
    'スタートアップ', 'フリーランス', '副業', '投資', 'ライフハック',
    'テクノロジー', 'AI・機械学習', 'データ分析', 'SEO', 'SNS運用',
    '起業', '転職', '資格取得', '語学', '読書', '健康', '料理',
    'ファッション', '旅行', '映画', '音楽', 'ゲーム', 'アニメ',
    'スポーツ', 'アウトドア', '写真', 'イラスト', '手芸', 'DIY'
  ];

  const challengeOptions = [
    '時間がない', 'スキル不足', '情報過多', '継続できない', '成果が出ない',
    '何から始めればいいかわからない', 'モチベーション維持', '専門用語が難しい',
    '費用がかかる', '失敗が怖い', '周りに相談できる人がいない', '忙しすぎる',
    '集中力が続かない', '完璧主義で進まない', '優先順位がつけられない',
    '自信がない', '年齢的に遅いと感じる', '家族の理解が得られない',
    '職場環境が良くない', '将来が不安', '収入が不安定', '健康面の不安'
  ];

  const toggleArrayItem = (field, item) => {
    const currentArray = formData.data?.[field] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateDataField(field, newArray);
  };

  const addCustomInterest = () => {
    if (!customInterest.trim()) return;
    const currentInterests = formData.data?.interests || [];
    if (currentInterests.includes(customInterest.trim())) return;
    
    updateDataField('interests', [...currentInterests, customInterest.trim()]);
    setCustomInterest('');
  };

  const addCustomChallenge = () => {
    if (!customChallenge.trim()) return;
    const currentChallenges = formData.data?.challenges || [];
    if (currentChallenges.includes(customChallenge.trim())) return;
    
    updateDataField('challenges', [...currentChallenges, customChallenge.trim()]);
    setCustomChallenge('');
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">年齢層</label>
          <select
            value={formData.data?.age || ''}
            onChange={(e) => updateDataField('age', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">選択してください</option>
            <option value="10代">10代</option>
            <option value="20代">20代</option>
            <option value="30代">30代</option>
            <option value="40代">40代</option>
            <option value="50代以上">50代以上</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">職業</label>
          <input
            type="text"
            value={formData.data?.occupation || ''}
            onChange={(e) => updateDataField('occupation', e.target.value)}
            placeholder="例: エンジニア"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">興味・関心</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {interestOptions.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleArrayItem('interests', interest)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.data?.interests?.includes(interest)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        
        {/* カスタム興味追加 */}
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
            placeholder="カスタム興味を追加"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addCustomInterest}
            className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
          >
            追加
          </button>
        </div>

        {formData.data?.interests?.length > 0 && (
          <div className="text-sm text-gray-600">
            選択中: {formData.data.interests.join('、')}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">抱えている課題・悩み</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {challengeOptions.map(challenge => (
            <button
              key={challenge}
              type="button"
              onClick={() => toggleArrayItem('challenges', challenge)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.data?.challenges?.includes(challenge)
                  ? 'bg-secondary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>

        {/* カスタム課題追加 */}
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={customChallenge}
            onChange={(e) => setCustomChallenge(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomChallenge()}
            placeholder="カスタム課題を追加"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addCustomChallenge}
            className="px-3 py-1 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600 transition-colors"
          >
            追加
          </button>
        </div>

        {formData.data?.challenges?.length > 0 && (
          <div className="text-sm text-gray-600">
            選択中: {formData.data.challenges.join('、')}
          </div>
        )}
      </div>
    </div>
  );
}

// 書き手ペルソナフィールド
function WriterPersonaFields({ formData, updateDataField }) {
  const [customPersonality, setCustomPersonality] = useState('');
  const [customMotivation, setCustomMotivation] = useState('');

  const personalityOptions = [
    '親しみやすい', '真面目', '情熱的', '冷静', '優しい', 'ユーモアがある',
    '論理的', '感情的', '実用的', '創造的', '積極的', '慎重', 
    'ポジティブ', '分析的', '共感力が高い', 'リーダーシップがある',
    '細かい', '大胆', '忍耐強い', '好奇心旺盛', '責任感が強い', '柔軟',
    '完璧主義', 'のんびり', 'エネルギッシュ', '落ち着いている'
  ];

  const motivationOptions = [
    '知識を共有したい', '体験を伝えたい', '問題を解決したい', '共感してもらいたい',
    '影響力を持ちたい', '成長したい', '仲間を見つけたい', '専門性を示したい',
    '社会貢献したい', '収益を得たい', '自己表現したい', '学習したい',
    '議論を促したい', 'コミュニティを作りたい', 'ブランディングしたい',
    'ネットワークを広げたい', '後輩を育てたい', '業界を変えたい'
  ];

  const toggleArrayItem = (field, item) => {
    const currentArray = formData.data?.[field] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateDataField(field, newArray);
  };

  const addCustomPersonality = () => {
    if (!customPersonality.trim()) return;
    const currentPersonalities = formData.data?.personalities || [];
    if (currentPersonalities.includes(customPersonality.trim())) return;
    
    updateDataField('personalities', [...currentPersonalities, customPersonality.trim()]);
    setCustomPersonality('');
  };

  const addCustomMotivation = () => {
    if (!customMotivation.trim()) return;
    const currentMotivations = formData.data?.motivations || [];
    if (currentMotivations.includes(customMotivation.trim())) return;
    
    updateDataField('motivations', [...currentMotivations, customMotivation.trim()]);
    setCustomMotivation('');
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">年齢</label>
          <input
            type="text"
            value={formData.data?.age || ''}
            onChange={(e) => updateDataField('age', e.target.value)}
            placeholder="例: 28"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">職業</label>
          <input
            type="text"
            value={formData.data?.occupation || ''}
            onChange={(e) => updateDataField('occupation', e.target.value)}
            placeholder="例: フロントエンドエンジニア"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">性格・キャラクター</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {personalityOptions.map(personality => (
            <button
              key={personality}
              type="button"
              onClick={() => toggleArrayItem('personalities', personality)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.data?.personalities?.includes(personality)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {personality}
            </button>
          ))}
        </div>

        {/* カスタム性格追加 */}
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={customPersonality}
            onChange={(e) => setCustomPersonality(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomPersonality()}
            placeholder="カスタム性格を追加"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addCustomPersonality}
            className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
          >
            追加
          </button>
        </div>

        {formData.data?.personalities?.length > 0 && (
          <div className="text-sm text-gray-600">
            選択中: {formData.data.personalities.join('、')}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">口調・話し方</label>
        <select
          value={formData.data?.tone || ''}
          onChange={(e) => updateDataField('tone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">選択してください</option>
          <option value="です・ます調">です・ます調</option>
          <option value="だ・である調">だ・である調</option>
          <option value="カジュアル">カジュアル</option>
          <option value="フォーマル">フォーマル</option>
          <option value="関西弁">関西弁</option>
          <option value="敬語多め">敬語多め</option>
          <option value="タメ口">タメ口</option>
          <option value="丁寧語">丁寧語</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">書く動機・理由</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {motivationOptions.map(motivation => (
            <button
              key={motivation}
              type="button"
              onClick={() => toggleArrayItem('motivations', motivation)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.data?.motivations?.includes(motivation)
                  ? 'bg-accent-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {motivation}
            </button>
          ))}
        </div>

        {/* カスタム動機追加 */}
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={customMotivation}
            onChange={(e) => setCustomMotivation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomMotivation()}
            placeholder="カスタム動機を追加"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addCustomMotivation}
            className="px-3 py-1 bg-accent-500 text-white rounded-lg text-sm hover:bg-accent-600 transition-colors"
          >
            追加
          </button>
        </div>

        {formData.data?.motivations?.length > 0 && (
          <div className="text-sm text-gray-600">
            選択中: {formData.data.motivations.join('、')}
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonaModal;