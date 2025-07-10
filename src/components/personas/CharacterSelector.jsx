import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePersonas } from '../../context/PersonaContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiCheck, FiPlus, FiUser, FiUsers } = FiIcons;

function CharacterSelector({ type, selectedPersona, onSelect }) {
  const { state, togglePersonaModal } = usePersonas();
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const personas = type === 'reader' ? state.readerPersonas : state.writerPersonas;
  
  useEffect(() => {
    // 検索フィルタリング
    const filtered = personas.filter(persona => 
      persona.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      persona.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersonas(filtered);
  }, [searchTerm, personas, type]);
  
  const handleSelect = (persona) => {
    onSelect(persona);
  };
  
  const handleCreateNew = () => {
    togglePersonaModal(type);
  };

  return (
    <div>
      <div className="flex space-x-2 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${type === 'reader' ? '読者' : '書き手'}ペルソナを検索...`}
            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <SafeIcon 
            icon={FiSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNew}
          className={`px-3 py-2 rounded-lg text-sm ${
            type === 'reader' 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <SafeIcon icon={FiPlus} />
        </motion.button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filteredPersonas.map((persona) => (
          <motion.button
            key={persona.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(persona)}
            className={`p-3 rounded-lg text-sm text-left ${
              selectedPersona?.id === persona.id
                ? type === 'reader'
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-green-100 border-2 border-green-500'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 font-medium truncate" title={persona.name}>
                {persona.name}
              </div>
              {selectedPersona?.id === persona.id && (
                <SafeIcon 
                  icon={FiCheck} 
                  className={`text-${type === 'reader' ? 'blue' : 'green'}-500 ml-1`}
                />
              )}
            </div>
            {persona.description && (
              <p className="text-xs text-gray-500 truncate" title={persona.description}>
                {persona.description}
              </p>
            )}
          </motion.button>
        ))}
        
        {filteredPersonas.length === 0 && (
          <div className="col-span-full p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
            <SafeIcon 
              icon={type === 'reader' ? FiUsers : FiUser} 
              className="mx-auto mb-2 text-gray-400"
            />
            <p className="text-sm">
              {searchTerm 
                ? '検索結果が見つかりません' 
                : `${type === 'reader' ? '読者' : '書き手'}ペルソナを作成してください`}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className={`mt-2 px-3 py-1 rounded-lg text-xs ${
                type === 'reader' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <SafeIcon icon={FiPlus} className="mr-1" />
              新規作成
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterSelector;