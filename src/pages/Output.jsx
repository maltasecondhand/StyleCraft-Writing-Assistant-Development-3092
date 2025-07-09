import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSteps } from '../context/StepsContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiCopy, FiDownload, FiRefreshCw, FiClock, FiImage, FiEdit } = FiIcons;

function Output() {
  const navigate = useNavigate();
  const { state } = useSteps();
  const [generatedContent, setGeneratedContent] = useState('');
  const [diagramSuggestions, setDiagramSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    generateContent();
  }, []);

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate enhanced content based on user inputs
    const mockContent = generateEnhancedContent();
    setGeneratedContent(mockContent);
    
    // Mock diagram suggestions
    const mockDiagrams = [
      {
        position: 'intro',
        type: 'infographic',
        description: 'キーワードの関連性を示す図解',
        suggestion: `「${state.data.keywords.join('」「')}」の関係性を視覚的に表現`
      },
      {
        position: 'middle',
        type: 'flowchart',
        description: '解決プロセスのフロー図',
        suggestion: '読者が抱える課題から解決までのステップを図解'
      },
      {
        position: 'conclusion',
        type: 'summary',
        description: '要点まとめ図',
        suggestion: '記事の要点を3つのポイントにまとめた図解'
      }
    ];
    setDiagramSuggestions(mockDiagrams);
    
    // Calculate reading time (approximately 400 characters per minute in Japanese)
    const estimatedTime = Math.ceil(mockContent.length / 400);
    setReadingTime(estimatedTime);
    
    setIsGenerating(false);
  };

  const generateEnhancedContent = () => {
    const { keywords, readerPersona, writerCharacter, primaryInfo, wordCount, fromDraft, draftText } = state.data;
    
    // Base content structure
    let content = '';
    
    // Title
    content += `# ${keywords[0] || 'テーマ'}について、${writerCharacter.age}歳の${writerCharacter.occupation}が語る\n\n`;
    
    // Introduction
    content += `## はじめに\n\n`;
    content += `こんにちは！${writerCharacter.age}歳の${writerCharacter.occupation}をしている私です。\n\n`;
    
    if (writerCharacter.personalities?.length > 0) {
      content += `${writerCharacter.personalities.join('で')}な性格の私が、`;
    }
    
    content += `${readerPersona.age}代の${readerPersona.occupation}の方々に向けて、${keywords.join('、')}について私の経験をもとにお話しします。\n\n`;
    
    if (readerPersona.challenges?.length > 0) {
      content += `「${readerPersona.challenges[0]}」という悩みを抱えている方も多いのではないでしょうか？\n\n`;
    }
    
    // Main content sections
    content += `## 私が実際に体験したこと（事実）\n\n`;
    if (primaryInfo.facts) {
      content += `${primaryInfo.facts}\n\n`;
    } else {
      content += `具体的な体験談として、以下のようなことがありました：\n\n`;
      content += `- ${keywords[0]}に関する学習を3ヶ月間継続しました\n`;
      content += `- 最初の1ヶ月は基礎的な内容を重点的に学習\n`;
      content += `- 2ヶ月目からは実践的な内容にチャレンジ\n`;
      content += `- 最終的に自分なりの成果を得ることができました\n\n`;
    }
    
    content += `## そのとき感じたこと（感想・気持ち）\n\n`;
    if (primaryInfo.feelings) {
      content += `${primaryInfo.feelings}\n\n`;
    } else {
      content += `この経験を通して、様々な気持ちの変化がありました：\n\n`;
      content += `- 最初は不安で、本当にできるのか心配でした\n`;
      content += `- 少しずつ理解が深まってくると、楽しさを感じるように\n`;
      content += `- 成果が見えてきたときは、本当に嬉しかったです\n`;
      content += `- 継続することの大切さを実感しました\n\n`;
    }
    
    // Detailed explanation section
    content += `## ${keywords[0]}について詳しく解説\n\n`;
    content += `私の経験を踏まえて、${keywords[0]}について詳しくお話しします。\n\n`;
    
    if (keywords.length > 1) {
      content += `### ${keywords[1]}との関係性\n\n`;
      content += `${keywords[0]}を理解する上で、${keywords[1]}との関係性を把握することが重要です。私の経験では、この2つは密接に関連していることがわかりました。\n\n`;
    }
    
    // Practical advice section
    content += `## 読者の皆さんへの具体的なアドバイス\n\n`;
    
    if (writerCharacter.motivations?.includes('体験を伝えたい')) {
      content += `同じような経験をした者として、以下のアドバイスをお伝えします：\n\n`;
    }
    
    content += `### 1. まずは小さな一歩から\n`;
    content += `${keywords[0]}に取り組む際は、いきなり大きな目標を設定せず、小さな一歩から始めることをお勧めします。\n\n`;
    
    content += `### 2. 継続することの重要性\n`;
    content += `私の経験上、${keywords[0]}においては継続することが最も重要です。毎日少しずつでも続けることで、必ず成果が現れます。\n\n`;
    
    content += `### 3. 挫折したときの対処法\n`;
    content += `${readerPersona.challenges?.length > 0 ? readerPersona.challenges[0] : '困難'}に直面したときは、一度立ち止まって振り返ることが大切です。\n\n`;
    
    // Psychology effects integration
    if (state.data.psychologyEffects.empathy) {
      content += `皆さんの気持ち、本当によくわかります。私も同じような経験をしてきました。\n\n`;
    }
    
    if (state.data.psychologyEffects.urgency) {
      content += `今このタイミングで${keywords[0]}に取り組むことで、将来の自分に大きな変化をもたらすことができます。\n\n`;
    }
    
    // Conclusion
    content += `## まとめ\n\n`;
    content += `今回は${keywords.join('、')}について、私の体験をもとにお話しました。\n\n`;
    
    if (writerCharacter.personalities?.includes('親しみやすい')) {
      content += `同じような境遇の方々に、少しでも参考になれば嬉しいです。\n\n`;
    }
    
    // Goal-oriented conclusion
    const goalTexts = {
      'learn': '皆さんもぜひ、今回の内容を参考に学習を進めてみてください。',
      'buy': '興味を持たれた方は、ぜひ検討してみてください。',
      'think': '今回の内容をきっかけに、新しい視点で考えてみてください。',
      'action': '読むだけでなく、実際に行動に移してみることをお勧めします。',
      'share': 'この記事が役に立ったと思われたら、ぜひシェアしてください。',
      'contact': 'ご質問やご相談がありましたら、お気軽にお声かけください。'
    };
    
    if (state.data.goal && goalTexts[state.data.goal]) {
      content += `${goalTexts[state.data.goal]}\n\n`;
    }
    
    content += `最後まで読んでいただき、ありがとうございました✨\n\n`;
    
    if (writerCharacter.motivations?.includes('仲間を見つけたい')) {
      content += `同じような経験をされた方や、これから始める方とのつながりを大切にしていきたいと思います。\n\n`;
    }
    
    content += `---\n\n`;
    content += `この記事が皆さんの${keywords[0]}に関する理解を深めるお手伝いができれば幸いです。\n`;
    
    // Adjust content length to target word count
    const targetLength = wordCount || 1500;
    const currentLength = content.length;
    
    if (currentLength < targetLength) {
      // Add more detailed sections if content is too short
      const additionalContent = `\n## 補足：${keywords[0]}を深く理解するために\n\n`;
      const expandedContent = additionalContent + 
        `私の経験をより詳しくお話しすると、${keywords[0]}に取り組む過程で様々な発見がありました。\n\n` +
        `特に印象的だったのは、最初に思い描いていたイメージと実際の体験とのギャップでした。\n\n` +
        `${keywords[0]}について学べば学ぶほど、その奥深さを実感することができました。\n\n` +
        `皆さんにも、ぜひこの素晴らしい体験を味わっていただきたいと思います。\n\n`;
      
      content = content.replace('---', expandedContent + '---');
    }
    
    return content;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    // You could add a toast notification here
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'moanote_ai_article.txt';
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
          <h2 className="text-2xl font-bold mb-4 text-gray-800">記事を生成中...</h2>
          <p className="text-gray-600 mb-4">
            あなたの設定に基づいて、心に届く記事を作成しています
          </p>
          <div className="text-sm text-gray-500">
            <p>目標文字数: {state.data.wordCount}文字</p>
            <p>選択されたゴール: {state.data.goal}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-800">生成された記事</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <SafeIcon icon={FiEdit} />
            <span>{generatedContent.length}文字</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <SafeIcon icon={FiClock} />
            <span>読了時間: {readingTime}分</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <SafeIcon icon={FiCopy} />
            <span>コピー</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadAsText}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
          >
            <SafeIcon icon={FiDownload} />
            <span>ダウンロード</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg">
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-japanese leading-relaxed text-gray-800">
                {generatedContent}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Article Stats */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">記事統計</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">文字数:</span>
                <span className="font-medium">{generatedContent.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">目標:</span>
                <span className="font-medium">{state.data.wordCount}文字</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">読了時間:</span>
                <span className="font-medium">{readingTime}分</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">段落数:</span>
                <span className="font-medium">{generatedContent.split('\n\n').length}</span>
              </div>
            </div>
          </div>

          {/* Diagram Suggestions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiImage} className="text-primary-500" />
              <h3 className="text-xl font-semibold text-gray-800">図解提案</h3>
            </div>
            <div className="space-y-4">
              {diagramSuggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-600 uppercase">
                      {suggestion.position}
                    </span>
                    <span className="text-xs text-gray-500">
                      {suggestion.type}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {suggestion.description}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {suggestion.suggestion}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Settings Summary */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">設定サマリー</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">キーワード:</span>
                <p className="text-gray-600">{state.data.keywords.join(', ')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">読者:</span>
                <p className="text-gray-600">
                  {state.data.readerPersona.age}代の{state.data.readerPersona.occupation}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">書き手:</span>
                <p className="text-gray-600">
                  {state.data.writerCharacter.age}歳の{state.data.writerCharacter.occupation}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">性格:</span>
                <p className="text-gray-600">{state.data.writerCharacter.personalities?.join(', ')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">ゴール:</span>
                <p className="text-gray-600">{state.data.goal}</p>
              </div>
              {state.data.fromDraft && (
                <div>
                  <span className="font-medium text-gray-700">作成元:</span>
                  <p className="text-gray-600">下書きから作成</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">アクション</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateContent}
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

export default Output;