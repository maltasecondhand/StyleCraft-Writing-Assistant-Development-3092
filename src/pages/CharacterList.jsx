import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { 
  getUserCharacters, 
  deleteCharacter, 
  toggleFavorite 
} from '../utils/characterStorage';

const { 
  FiPlus, FiUser, FiUsers, FiStar, FiEdit2, FiTrash2, 
  FiCheck, FiX, FiHeart, FiSearch, FiFilter 
} = FiIcons;

function CharacterList() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    filterCharacters();
  }, [characters, activeTab, searchTerm, showFavoritesOnly]);

  const loadCharacters = async () => {
    try {
      const data = await getUserCharacters();
      setCharacters(data);
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCharacters = () => {
    let filtered = characters;

    // タブフィルター
    if (activeTab !== 'all') {
      filtered = filtered.filter(char => char.type === activeTab);
    }

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // お気に入りフィルター
    if (showFavoritesOnly) {
      filtered = filtered.filter(char => char.is_favorite);
    }

    setFilteredCharacters(filtered);
  };

  const handleToggleFavorite = async (id, currentFavorite) => {
    try {
      await toggleFavorite(id, !currentFavorite);
      setCharacters(prev =>
        prev.map(char =>
          char.id === id ? { ...char, is_favorite: !currentFavorite } : char
        )
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCharacter(id);
      setCharacters(prev => prev.filter(char => char.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete character:', error);
    }
  };

  const tabs = [
    { id: 'all', label: 'すべて', count: characters.length },
    { id: 'reader', label: '読者ペルソナ', count: characters.filter(c => c.type === 'reader').length },
    { id: 'writer', label: '書き手キャラクター', count: characters.filter(c => c.type === 'writer').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">キャラクターを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">キャラクター管理</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/characters/new')}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            <SafeIcon icon={FiPlus} />
            <span>新規作成</span>
          </motion.button>
        </motion.div>

        {/* 検索・フィルター */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* 検索 */}
            <div className="relative flex-1">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="キャラクター名やタイトルで検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* お気に入りフィルター */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFavoritesOnly
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <SafeIcon icon={FiHeart} />
              <span>お気に入りのみ</span>
            </motion.button>
          </div>
        </motion.div>

        {/* タブ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20'
                    : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* キャラクター一覧 */}
        {filteredCharacters.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCharacters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
                confirmDelete={confirmDelete}
                setConfirmDelete={setConfirmDelete}
                onEdit={(id) => navigate(`/characters/edit/${id}`)}
                onSelect={(character) => {
                  // ここでプロンプト生成に反映する処理を追加
                  console.log('Selected character:', character);
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl shadow-lg"
          >
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
              <SafeIcon icon={FiUser} className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {searchTerm || showFavoritesOnly 
                ? 'キャラクターが見つかりません' 
                : 'キャラクターがありません'
              }
            </h3>
            <p className="text-gray-600 mb-8">
              {searchTerm || showFavoritesOnly
                ? '検索条件を変更してお試しください。'
                : '最初のキャラクターを作成して始めましょう。'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/characters/new')}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              新規作成
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// キャラクターカードコンポーネント
function CharacterCard({ 
  character, 
  index, 
  onToggleFavorite, 
  onDelete, 
  confirmDelete, 
  setConfirmDelete, 
  onEdit, 
  onSelect 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div 
        className="relative p-6 rounded-xl border-4 transition-transform hover:scale-105 cursor-pointer"
        style={{ 
          backgroundColor: character.bg_color,
          borderColor: character.border_color 
        }}
        onClick={() => onSelect(character)}
      >
        {/* お気に入りアイコン */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(character.id, character.is_favorite);
          }}
          className="absolute -top-2 -right-2 z-10"
        >
          <SafeIcon 
            icon={FiStar} 
            className={`text-2xl ${
              character.is_favorite ? 'text-yellow-500' : 'text-gray-300'
            }`} 
          />
        </motion.button>

        {/* 編集・削除ボタン */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            {confirmDelete === character.id ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(character.id);
                  }}
                  className="p-1 bg-red-500 text-white rounded-full"
                >
                  <SafeIcon icon={FiCheck} className="text-xs" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(null);
                  }}
                  className="p-1 bg-gray-500 text-white rounded-full"
                >
                  <SafeIcon icon={FiX} className="text-xs" />
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(character.id);
                  }}
                  className="p-1 bg-blue-500 text-white rounded-full"
                >
                  <SafeIcon icon={FiEdit2} className="text-xs" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(character.id);
                  }}
                  className="p-1 bg-red-500 text-white rounded-full"
                >
                  <SafeIcon icon={FiTrash2} className="text-xs" />
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* キャラクター画像 */}
        <div className="flex justify-center mb-4">
          <div 
            className="w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden"
            style={{ borderColor: character.border_color }}
          >
            {character.image_url ? (
              <img 
                src={character.image_url} 
                alt="Character" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
        </div>

        {/* キャラクター情報 */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {character.name}
          </h3>
          {character.title && (
            <p className="text-sm text-gray-600 mb-3">{character.title}</p>
          )}

          {/* タイプバッジ */}
          <div className="flex justify-center mb-3">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              character.type === 'reader' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              <SafeIcon icon={character.type === 'reader' ? FiUsers : FiUser} />
              <span>{character.type === 'reader' ? '読者' : '書き手'}</span>
            </div>
          </div>

          {/* 使用ボタン */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(character);
            }}
            className="w-full px-4 py-2 bg-white/80 text-gray-800 rounded-lg hover:bg-white transition-colors text-sm font-medium"
          >
            このキャラを使う
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default CharacterList;