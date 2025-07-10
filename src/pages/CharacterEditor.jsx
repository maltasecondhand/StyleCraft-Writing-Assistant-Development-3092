import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import {
  createCharacter,
  updateCharacter,
  uploadCharacterImage,
  getUserCharacters,
  defaultColors
} from '../utils/characterStorage';

const { FiArrowLeft, FiUpload, FiStar, FiSave, FiEye, FiUser, FiUsers, FiPalette } = FiIcons;

function CharacterEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // フォームデータ
  const [formData, setFormData] = useState({
    type: 'reader',
    name: '',
    title: '',
    image_url: '',
    bg_color: '#F7F7F7',
    border_color: '#E0E0E0',
    is_favorite: false,
    is_public: false,
    persona_data: {},
    author_profile: {},
    sample_text: ''
  });

  // UI状態
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState({ bg: false, border: false });
  const [previewMode, setPreviewMode] = useState(false);

  // 編集時の初期データ読み込み
  useEffect(() => {
    if (isEditing) {
      loadCharacterData();
    }
  }, [id]);

  const loadCharacterData = async () => {
    try {
      const characters = await getUserCharacters();
      const character = characters.find(c => c.id === id);
      
      if (character) {
        setFormData(character);
      } else {
        navigate('/characters');
      }
    } catch (error) {
      console.error('Failed to load character:', error);
      navigate('/characters');
    }
  };

  // 画像アップロード処理
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ファイルサイズチェック (1MB)
    if (file.size > 1024 * 1024) {
      alert('ファイルサイズは1MB以下にしてください');
      return;
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('JPG、PNG、WebP形式の画像をアップロードしてください');
      return;
    }

    setUploading(true);
    try {
      const tempId = id || `temp_${Date.now()}`;
      const imageUrl = await uploadCharacterImage(file, tempId);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('画像のアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  // フォーム保存
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('キャラクター名を入力してください');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateCharacter(id, formData);
      } else {
        await createCharacter(formData);
      }
      navigate('/characters');
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // タイプ切り替え
  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      persona_data: newType === 'reader' ? prev.persona_data : {},
      author_profile: newType === 'writer' ? prev.author_profile : {}
    }));
  };

  // カラー選択
  const handleColorChange = (colorType, color) => {
    setFormData(prev => ({ ...prev, [`${colorType}_color`]: color }));
    setShowColorPicker(prev => ({ ...prev, [colorType]: false }));
  };

  // ペルソナデータ更新
  const updatePersonaData = (field, value) => {
    if (formData.type === 'reader') {
      setFormData(prev => ({
        ...prev,
        persona_data: { ...prev.persona_data, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        author_profile: { ...prev.author_profile, [field]: value }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/characters')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} />
              <span>キャラクター一覧に戻る</span>
            </motion.button>
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditing ? 'キャラクター編集' : '新しいキャラクター作成'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <SafeIcon icon={FiEye} />
              <span>{previewMode ? '編集モード' : 'プレビュー'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              <SafeIcon icon={FiSave} />
              <span>{loading ? '保存中...' : '保存'}</span>
            </motion.button>
          </div>
        </motion.div>

        {previewMode ? (
          <CharacterPreview character={formData} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {/* タイプ選択 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">キャラクタータイプ</h2>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeChange('reader')}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-colors ${
                    formData.type === 'reader'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <SafeIcon icon={FiUsers} className="text-2xl" />
                  <div className="text-left">
                    <div className="font-semibold">読者ペルソナ</div>
                    <div className="text-sm opacity-75">記事を読む人の設定</div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeChange('writer')}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-colors ${
                    formData.type === 'writer'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <SafeIcon icon={FiUser} className="text-2xl" />
                  <div className="text-left">
                    <div className="font-semibold">書き手キャラクター</div>
                    <div className="text-sm opacity-75">記事を書く人の設定</div>
                  </div>
                </motion.button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 左側：基本情報 */}
              <div className="space-y-6">
                {/* 画像アップロード */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">アイコン画像</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div 
                        className="w-24 h-24 rounded-full border-4 flex items-center justify-center overflow-hidden"
                        style={{ borderColor: formData.border_color, backgroundColor: formData.bg_color }}
                      >
                        {formData.image_url ? (
                          <img 
                            src={formData.image_url} 
                            alt="Character" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl">👤</span>
                        )}
                      </div>
                      {formData.is_favorite && (
                        <div className="absolute -top-1 -right-1">
                          <SafeIcon icon={FiStar} className="text-yellow-500 text-lg" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <SafeIcon icon={FiUpload} />
                        <span>{uploading ? 'アップロード中...' : '画像を選択'}</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (1MB以下)</p>
                    </div>
                  </div>
                </div>

                {/* カラー設定 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">カラー設定</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* 背景色 */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">背景色</label>
                      <div className="relative">
                        <button
                          onClick={() => setShowColorPicker(prev => ({ ...prev, bg: !prev.bg }))}
                          className="w-full h-10 rounded-lg border-2 border-gray-300 flex items-center space-x-2 px-3"
                          style={{ backgroundColor: formData.bg_color }}
                        >
                          <SafeIcon icon={FiPalette} className="text-gray-600" />
                          <span className="text-sm text-gray-700">{formData.bg_color}</span>
                        </button>
                        
                        {showColorPicker.bg && (
                          <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <div className="grid grid-cols-5 gap-2">
                              {defaultColors.backgrounds.map(color => (
                                <button
                                  key={color}
                                  onClick={() => handleColorChange('bg', color)}
                                  className="w-8 h-8 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 枠色 */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">枠色</label>
                      <div className="relative">
                        <button
                          onClick={() => setShowColorPicker(prev => ({ ...prev, border: !prev.border }))}
                          className="w-full h-10 rounded-lg border-2 border-gray-300 flex items-center space-x-2 px-3"
                          style={{ borderColor: formData.border_color }}
                        >
                          <SafeIcon icon={FiPalette} className="text-gray-600" />
                          <span className="text-sm text-gray-700">{formData.border_color}</span>
                        </button>
                        
                        {showColorPicker.border && (
                          <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <div className="grid grid-cols-5 gap-2">
                              {defaultColors.borders.map(color => (
                                <button
                                  key={color}
                                  onClick={() => handleColorChange('border', color)}
                                  className="w-8 h-8 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 基本情報 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      キャラクター名 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="例: さくら"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タイトル・肩書き
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="例: 恋バナ好きのOL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_favorite}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_favorite: e.target.checked }))}
                        className="w-4 h-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500"
                      />
                      <SafeIcon icon={FiStar} className="text-yellow-500" />
                      <span className="text-sm text-gray-700">お気に入り</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 右側：詳細設定 */}
              <div className="space-y-6">
                {formData.type === 'reader' ? (
                  <ReaderPersonaForm 
                    data={formData.persona_data} 
                    onChange={updatePersonaData}
                  />
                ) : (
                  <WriterProfileForm 
                    data={formData.author_profile}
                    sampleText={formData.sample_text}
                    onChange={updatePersonaData}
                    onSampleTextChange={(value) => setFormData(prev => ({ ...prev, sample_text: value }))}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 読者ペルソナフォーム
function ReaderPersonaForm({ data, onChange }) {
  const handleArrayToggle = (field, item) => {
    const currentArray = data[field] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    onChange(field, newArray);
  };

  const interestOptions = [
    'プログラミング', 'デザイン', 'マーケティング', 'ビジネス', 'キャリア',
    'フリーランス', '副業', '投資', 'ライフハック', '健康', '料理',
    'ファッション', '旅行', '映画', '音楽', 'ゲーム'
  ];

  const challengeOptions = [
    '時間がない', 'スキル不足', '情報過多', '継続できない', '成果が出ない',
    'モチベーション維持', '専門用語が難しい', '費用がかかる', '失敗が怖い'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">読者ペルソナ詳細</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">年齢層</label>
          <select
            value={data.age || ''}
            onChange={(e) => onChange('age', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            value={data.occupation || ''}
            onChange={(e) => onChange('occupation', e.target.value)}
            placeholder="例: エンジニア"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">興味・関心</label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => handleArrayToggle('interests', interest)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                data.interests?.includes(interest)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">抱えている課題・悩み</label>
        <div className="flex flex-wrap gap-2">
          {challengeOptions.map(challenge => (
            <button
              key={challenge}
              type="button"
              onClick={() => handleArrayToggle('challenges', challenge)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                data.challenges?.includes(challenge)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 書き手プロフィールフォーム
function WriterProfileForm({ data, sampleText, onChange, onSampleTextChange }) {
  const handleArrayToggle = (field, item) => {
    const currentArray = data[field] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    onChange(field, newArray);
  };

  const personalityOptions = [
    '親しみやすい', '真面目', '情熱的', '冷静', '優しい', 'ユーモアがある',
    '論理的', '感情的', '実用的', '創造的', '積極的', '慎重'
  ];

  const toneOptions = [
    'です・ます調', 'だ・である調', 'カジュアル', 'フォーマル', 
    '関西弁', '敬語多め', 'タメ口', '丁寧語'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">書き手キャラクター詳細</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">年齢</label>
          <input
            type="text"
            value={data.age || ''}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder="例: 28"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">職業</label>
          <input
            type="text"
            value={data.occupation || ''}
            onChange={(e) => onChange('occupation', e.target.value)}
            placeholder="例: ライター"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">性格・キャラクター</label>
        <div className="flex flex-wrap gap-2">
          {personalityOptions.map(personality => (
            <button
              key={personality}
              type="button"
              onClick={() => handleArrayToggle('personalities', personality)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                data.personalities?.includes(personality)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {personality}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">口調・話し方</label>
        <select
          value={data.tone || ''}
          onChange={(e) => onChange('tone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">選択してください</option>
          {toneOptions.map(tone => (
            <option key={tone} value={tone}>{tone}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">語りサンプル（任意）</label>
        <textarea
          value={sampleText || ''}
          onChange={(e) => onSampleTextChange(e.target.value)}
          placeholder="このキャラクターらしい文章の例を入力してください"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
        />
      </div>
    </div>
  );
}

// キャラクタープレビュー
function CharacterPreview({ character }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">プレビュー</h2>
      
      <div className="flex justify-center">
        <div 
          className="relative p-6 rounded-xl border-4 max-w-sm"
          style={{ 
            backgroundColor: character.bg_color,
            borderColor: character.border_color 
          }}
        >
          {/* お気に入りアイコン */}
          {character.is_favorite && (
            <div className="absolute -top-2 -right-2">
              <SafeIcon icon={FiStar} className="text-yellow-500 text-2xl" />
            </div>
          )}

          {/* キャラクター画像 */}
          <div className="flex justify-center mb-4">
            <div 
              className="w-24 h-24 rounded-full border-4 flex items-center justify-center overflow-hidden"
              style={{ borderColor: character.border_color }}
            >
              {character.image_url ? (
                <img 
                  src={character.image_url} 
                  alt="Character" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
          </div>

          {/* キャラクター情報 */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {character.name || 'キャラクター名'}
            </h3>
            {character.title && (
              <p className="text-sm text-gray-600 mb-3">{character.title}</p>
            )}

            {/* タイプアイコン */}
            <div className="flex justify-center mb-3">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
                character.type === 'reader' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                <SafeIcon icon={character.type === 'reader' ? FiUsers : FiUser} />
                <span>{character.type === 'reader' ? '読者ペルソナ' : '書き手キャラクター'}</span>
              </div>
            </div>

            {/* サンプルテキスト */}
            {character.sample_text && (
              <div className="text-xs text-gray-600 italic border-t border-gray-200 pt-3">
                "{character.sample_text}"
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CharacterEditor;