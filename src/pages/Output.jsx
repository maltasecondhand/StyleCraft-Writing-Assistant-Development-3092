import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSteps } from '../context/StepsContext';
import { usePersonas } from '../context/PersonaContext';
import { PromptGenerator } from '../utils/promptGenerator';
import { optimizePrompt } from '../utils/promptOptimizer';
import SafeIcon from '../common/SafeIcon';
import TemplateButton from '../components/templates/TemplateButton';
import CharacterSelector from '../components/personas/CharacterSelector';
import * as FiIcons from 'react-icons/fi';

const { 
  FiArrowLeft, FiCopy, FiDownload, FiRefreshCw, FiCode, 
  FiCheck, FiAlertCircle, FiZap, FiEye, FiEyeOff, FiUser, FiUsers
} = FiIcons;

function Output() {
  const navigate = useNavigate();
  const { state } = useSteps();
  const { state: personaState } = usePersonas();
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [optimizationData, setOptimizationData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState({ original: false, optimized: false });
  const [promptValidation, setPromptValidation] = useState(null);
  const [activeView, setActiveView] = useState('both'); // 'original', 'optimized', 'both'
  const [selectedReaderPersona, setSelectedReaderPersona] = useState(null);
  const [selectedWriterPersona, setSelectedWriterPersona] = useState(null);

  // ページロード時にペルソナの初期状態を設定
  useEffect(() => {
    // 現在のステップデータからペルソナIDがあればそれを使用
    const readerPersonaId = state.data.readerPersona?.id;
    const writerPersonaId = state.data.writerCharacter?.id;

    // 保存されたペルソナから対応するものを検索
    if (readerPersonaId) {
      const persona = personaState.readerPersonas.find(p => p.id === readerPersonaId);
      if (persona) setSelectedReaderPersona(persona);
    }

    if (writerPersonaId) {
      const persona = personaState.writerPersonas.find(p => p.id === writerPersonaId);
      if (persona) setSelectedWriterPersona(persona);
    }

    generatePrompts();
  }, []);

  // ペルソナが変更された時にプロンプトを再生成
  useEffect(() => {
    if (selectedReaderPersona || selectedWriterPersona) {
      generatePrompts();
    }
  }, [selectedReaderPersona, selectedWriterPersona]);

  // 読者ペルソナが選択された時の処理
  const handleReaderPersonaSelect = (persona) => {
    setSelectedReaderPersona(persona);
    // 選択されたペルソナのデータをステップのstate.dataに統合
    const updatedData = {
      ...state.data,
      readerPersona: {
        ...persona.data,
        id: persona.id,
        name: persona.name
      }
    };
    // このデータを使ってプロンプトを再生成するか、state.dataを更新する処理を追加
  };

  // 書き手ペルソナが選択された時の処理
  const handleWriterPersonaSelect = (persona) => {
    setSelectedWriterPersona(persona);
    // 選択されたペルソナのデータをステップのstate.dataに統合
    const updatedData = {
      ...state.data,
      writerCharacter: {
        ...persona.data,
        id: persona.id,
        name: persona.name
      }
    };
    // このデータを使ってプロンプトを再生成するか、state.dataを更新する処理を追加
  };

  const generatePrompts = async () => {
    setIsGenerating(true);
    try {
      // 現在のステップデータをクローン
      let promptData = {...state.data};
      
      // 選択されたペルソナデータがあれば上書き
      if (selectedReaderPersona) {
        promptData.readerPersona = {
          ...selectedReaderPersona.data,
          id: selectedReaderPersona.id,
          name: selectedReaderPersona.name
        };
      }
      
      if (selectedWriterPersona) {
        promptData.writerCharacter = {
          ...selectedWriterPersona.data,
          id: selectedWriterPersona.id,
          name: selectedWriterPersona.name
        };
      }
      
      // オリジナルプロンプト生成
      const generator = new PromptGenerator(promptData);
      const mainPrompt = generator.generateMainPrompt();
      
      // プロンプトの妥当性を検証
      const isValid = generator.validatePrompt();
      setPromptValidation(isValid);
      setGeneratedPrompt(mainPrompt);

      // Lyra最適化プロンプト生成
      const optimization = optimizePrompt(mainPrompt, promptData);
      setOptimizedPrompt(optimization.optimizedPrompt);
      setOptimizationData(optimization);

    } catch (err) {
      console.error('Prompt generation error:', err);
      // エラー時はデフォルトプロンプトを生成
      setGeneratedPrompt(generateDefaultPrompt());
      setPromptValidation(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDefaultPrompt = () => {
    const { keywords, readerPersona, writerCharacter, writingStyle, purpose } = state.data;
    
    return `# AIライティング用プロンプト

## 記事のキーワードと目的（必須）

### 対象キーワード:
${keywords?.length > 0 ? keywords.map((kw, idx) => `${idx + 1}. ${kw}`).join('\n') : '1. テーマ'}

### 記事の目的:
「${purpose || '読者に価値ある情報を提供し、具体的な行動につなげる'}」

## 書き手の設定
- 年齢: ${writerCharacter?.age || '30代'}
- 職業: ${writerCharacter?.occupation || 'ライター'}
- 性格: ${writerCharacter?.personalities?.join('、') || '親しみやすい'}
- 口調: ${writerCharacter?.tone || 'です・ます調'}

## 読者の設定
- 年齢層: ${readerPersona?.age || '30代'}
- 職業: ${readerPersona?.occupation || '会社員'}
- 関心事: ${readerPersona?.interests?.join('、') || '自己成長'}
- 悩み: ${readerPersona?.challenges?.join('、') || '時間がない'}

## 文体・構成の設定
- 文体: ${writingStyle?.conversational ? '会話的で親しみやすい' : '丁寧で解説的な'}
- 構成: ${writingStyle?.template || 'PREP法'}
- 絵文字: ${writingStyle?.emojiFrequency || '適度に'}使用

## 必須要件
1. 指定されたキーワードを記事タイトルと本文に自然に含めてください
2. 記事の目的を達成する内容にしてください
3. 書き手のキャラクターを文章に反映させてください
4. 読者のペルソナに合わせた内容にしてください

上記の設定に基づいて、読者に響く魅力的な文章を作成してください。`;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopySuccess(prev => ({ ...prev, [type]: false })), 2000);
  };

  const downloadPrompt = (text, filename) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-12 border border-gray-200 shadow-lg text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <SafeIcon icon={FiRefreshCw} className="text-primary-500 text-4xl" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            プロンプトを生成中...
          </h2>
          <p className="text-gray-600">
            オリジナル版とLyra最適化版の2つのプロンプトを作成しています
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/steps')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>設定に戻る</span>
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-800">生成されたAIプロンプト</h1>
          {(copySuccess.original || copySuccess.optimized) && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg">
              <SafeIcon icon={FiCheck} className="text-sm" />
              <span className="text-sm">コピーしました</span>
            </div>
          )}
          {promptValidation === false && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg">
              <SafeIcon icon={FiAlertCircle} className="text-sm" />
              <span className="text-sm">設定確認推奨</span>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('original')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                activeView === 'original' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
              }`}
            >
              <SafeIcon icon={FiCode} className="mr-1" />
              オリジナル
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('optimized')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                activeView === 'optimized' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
              }`}
            >
              <SafeIcon icon={FiZap} className="mr-1" />
              Lyra最適化
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('both')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                activeView === 'both' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
              }`}
            >
              <SafeIcon icon={FiEye} className="mr-1" />
              両方
            </motion.button>
          </div>
          <TemplateButton type="save" />
        </div>
      </motion.div>

      {/* Character Selection */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUsers} className="text-blue-600" />
              <h3 className="font-semibold text-blue-800">読者ペルソナ</h3>
            </div>
            {selectedReaderPersona && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {selectedReaderPersona.name}
              </span>
            )}
          </div>
          <CharacterSelector 
            type="reader" 
            selectedPersona={selectedReaderPersona} 
            onSelect={handleReaderPersonaSelect} 
          />
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUser} className="text-green-600" />
              <h3 className="font-semibold text-green-800">書き手キャラクター</h3>
            </div>
            {selectedWriterPersona && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {selectedWriterPersona.name}
              </span>
            )}
          </div>
          <CharacterSelector 
            type="writer" 
            selectedPersona={selectedWriterPersona} 
            onSelect={handleWriterPersonaSelect} 
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={activeView === 'both' ? 'lg:col-span-3' : 'lg:col-span-3'}
        >
          {activeView === 'both' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Prompt */}
              <PromptDisplay
                title="オリジナルプロンプト"
                prompt={generatedPrompt}
                onCopy={() => copyToClipboard(generatedPrompt, 'original')}
                onDownload={() => downloadPrompt(generatedPrompt, 'moanote_original_prompt.txt')}
                icon={FiCode}
                color="blue"
              />

              {/* Optimized Prompt */}
              <PromptDisplay
                title="Lyra最適化プロンプト"
                prompt={optimizedPrompt}
                onCopy={() => copyToClipboard(optimizedPrompt, 'optimized')}
                onDownload={() => downloadPrompt(optimizedPrompt, 'moanote_lyra_optimized_prompt.txt')}
                icon={FiZap}
                color="purple"
                badge="OPTIMIZED"
              />
            </div>
          )}

          {activeView === 'original' && (
            <PromptDisplay
              title="オリジナルプロンプト"
              prompt={generatedPrompt}
              onCopy={() => copyToClipboard(generatedPrompt, 'original')}
              onDownload={() => downloadPrompt(generatedPrompt, 'moanote_original_prompt.txt')}
              icon={FiCode}
              color="blue"
              fullWidth
            />
          )}

          {activeView === 'optimized' && (
            <div className="space-y-6">
              <PromptDisplay
                title="Lyra最適化プロンプト"
                prompt={optimizedPrompt}
                onCopy={() => copyToClipboard(optimizedPrompt, 'optimized')}
                onDownload={() => downloadPrompt(optimizedPrompt, 'moanote_lyra_optimized_prompt.txt')}
                icon={FiZap}
                color="purple"
                badge="OPTIMIZED"
                fullWidth
              />

              {/* Optimization Details */}
              {optimizationData && (
                <OptimizationDetails data={optimizationData} />
              )}
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Usage Instructions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">使用方法</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800">プロンプトを選択</p>
                  <p className="text-gray-600">オリジナル版またはLyra最適化版を選択</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800">AIツールに貼り付け</p>
                  <p className="text-gray-600">ChatGPT、Claude、Geminiなどに貼り付け</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800">記事テーマを追加</p>
                  <p className="text-gray-600">具体的な記事テーマや内容を追加で指示</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison */}
          {activeView === 'both' && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">プロンプト比較</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">オリジナル版</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• シンプルで理解しやすい構成</li>
                    <li>• 基本的な設定を網羅</li>
                    <li>• 汎用的なプロンプト</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">Lyra最適化版</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 専門性を強化した役割定義</li>
                    <li>• 詳細な読者プロファイル</li>
                    <li>• 品質保証プロトコル搭載</li>
                    <li>• 競合優位性の確立</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Settings Summary */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">設定サマリー</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-700">キーワード</p>
                <p className="text-gray-600">{state.data.keywords?.join('、') || '未設定'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">記事の目的</p>
                <p className="text-gray-600">{state.data.purpose || '未設定'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">読者</p>
                <p className="text-gray-600">
                  {selectedReaderPersona?.name || state.data.readerPersona?.age || '未設定'} 
                  {selectedReaderPersona ? '' : ` / ${state.data.readerPersona?.occupation || '未設定'}`}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">書き手</p>
                <p className="text-gray-600">
                  {selectedWriterPersona?.name || state.data.writerCharacter?.occupation || '未設定'} 
                  {selectedWriterPersona ? '' : ` / ${state.data.writerCharacter?.tone || '未設定'}`}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">文体</p>
                <p className="text-gray-600">
                  {state.data.writingStyle?.conversational ? '会話風' : '解説風'} / {state.data.writingStyle?.template || 'PREP法'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">アクション</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generatePrompts}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} />
                <span>再生成</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/steps')}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                設定を変更
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Prompt Display Component
function PromptDisplay({ title, prompt, onCopy, onDownload, icon, color, badge, fullWidth }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50'
  };

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg ${fullWidth ? 'w-full' : ''}`}>
      <div className={`px-6 py-4 ${colorClasses[color]} border-b border-gray-200 rounded-t-xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={icon} className={`text-${color}-600 text-xl`} />
            <h3 className={`text-lg font-semibold text-${color}-800`}>{title}</h3>
            {badge && (
              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                {badge}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCopy}
              className={`flex items-center space-x-1 px-4 py-2 bg-${color}-600 text-white rounded-lg text-sm shadow-md hover:shadow-lg transition-all`}
            >
              <SafeIcon icon={FiCopy} />
              <span>コピー</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className={`flex items-center space-x-1 px-3 py-2 bg-${color}-700 text-white rounded-lg text-sm shadow-md hover:shadow-lg transition-all`}
            >
              <SafeIcon icon={FiDownload} />
              <span>DL</span>
            </motion.button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {prompt}
          </pre>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-600">
            文字数: {prompt.length}文字
          </p>
          <p className="text-xs text-gray-500">
            ChatGPT、Claude、Geminiで使用可能
          </p>
        </div>
      </div>
    </div>
  );
}

// Optimization Details Component
function OptimizationDetails({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        <SafeIcon icon={FiZap} className="inline mr-2 text-purple-600" />
        Lyra最適化レポート
      </h3>
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.specificityScore}%</div>
          <div className="text-sm text-blue-700">具体性スコア</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data.completenessScore}%</div>
          <div className="text-sm text-green-700">完全性スコア</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 capitalize">{data.complexity}</div>
          <div className="text-sm text-purple-700">複雑度レベル</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">主な改善点</h4>
          <ul className="space-y-1">
            {data.improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                <SafeIcon icon={FiCheck} className="text-green-500 mt-1 flex-shrink-0" />
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">適用された技術</h4>
          <div className="flex flex-wrap gap-2">
            {data.techniques.map((technique, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {technique}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">プロのヒント</h4>
          <ul className="space-y-2">
            {data.proTips.map((tip, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                <span className="text-yellow-500">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default Output;