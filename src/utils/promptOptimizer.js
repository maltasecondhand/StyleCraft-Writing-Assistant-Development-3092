// Lyra AI プロンプト最適化システム
export class LyraOptimizer {
  constructor() {
    this.name = "Lyra";
    this.role = "AIプロンプト最適化のマスターレベルのスペシャリスト";
  }

  // 4-D方法論での最適化
  optimize(originalPrompt, userInputs = {}) {
    // 1. 解体する (Deconstruct)
    const analysis = this.deconstructPrompt(originalPrompt, userInputs);
    
    // 2. 診断 (Diagnose)
    const diagnosis = this.diagnosePrompt(analysis);
    
    // 3. 開発 (Develop)
    const optimizedPrompt = this.developOptimizedPrompt(analysis, diagnosis);
    
    // 4. 配信 (Deliver)
    return this.deliverOptimization(originalPrompt, optimizedPrompt, diagnosis);
  }

  // 1. 解体する - コアインテント、キーエンティティ、コンテキストを抽出
  deconstructPrompt(prompt, userInputs) {
    const analysis = {
      coreIntent: this.extractCoreIntent(prompt, userInputs),
      keyEntities: this.extractKeyEntities(prompt, userInputs),
      context: this.extractContext(userInputs),
      outputRequirements: this.extractOutputRequirements(prompt, userInputs),
      constraints: this.extractConstraints(userInputs),
      providedElements: this.mapProvidedElements(userInputs),
      missingElements: this.identifyMissingElements(userInputs)
    };
    
    return analysis;
  }

  extractCoreIntent(prompt, userInputs) {
    const { keywords, purpose, goal } = userInputs;
    
    if (purpose && purpose.trim()) {
      return `記事作成: ${purpose}`;
    }
    
    if (goal) {
      const goalMap = {
        'learn': '読者の学習・知識習得を促進',
        'buy': '読者の購買行動を促進',
        'think': '読者の思考・視点の変化を促進',
        'action': '読者の具体的行動を促進',
        'share': '読者のシェア・拡散を促進',
        'contact': '読者の問い合わせ・相談を促進'
      };
      return goalMap[goal] || '読者との価値ある関係構築';
    }
    
    if (keywords && keywords.length > 0) {
      return `「${keywords[0]}」に関する価値ある情報提供`;
    }
    
    return '読者に響く魅力的なコンテンツ作成';
  }

  extractKeyEntities(prompt, userInputs) {
    const entities = [];
    
    if (userInputs.keywords) {
      entities.push(...userInputs.keywords.map(kw => ({ type: 'keyword', value: kw })));
    }
    
    if (userInputs.readerPersona) {
      entities.push({ 
        type: 'target_audience', 
        value: `${userInputs.readerPersona.age || ''}${userInputs.readerPersona.occupation || ''}` 
      });
    }
    
    if (userInputs.writerCharacter) {
      entities.push({ 
        type: 'writer_persona', 
        value: `${userInputs.writerCharacter.occupation || ''} (${userInputs.writerCharacter.tone || ''})` 
      });
    }
    
    return entities;
  }

  extractContext(userInputs) {
    return {
      platform: 'note/ブログ',
      contentType: '記事',
      wordCount: userInputs.wordCount || 3000,
      writingStyle: userInputs.writingStyle?.template || 'PREP',
      tone: userInputs.writerCharacter?.tone || 'です・ます調',
      audience: userInputs.readerPersona || {},
      primaryInfo: userInputs.primaryInfo || {}
    };
  }

  extractOutputRequirements(prompt, userInputs) {
    return {
      format: '記事形式',
      length: `${userInputs.wordCount || 3000}文字`,
      structure: userInputs.writingStyle?.template || 'PREP法',
      tone: userInputs.writerCharacter?.tone || 'です・ます調',
      keywordIntegration: userInputs.keywords?.length || 0,
      callToAction: userInputs.goal || 'engagement'
    };
  }

  extractConstraints(userInputs) {
    const constraints = [];
    
    if (userInputs.wordCount) {
      constraints.push(`文字数: ${userInputs.wordCount}文字以内`);
    }
    
    if (userInputs.keywords?.length > 0) {
      constraints.push(`必須キーワード: ${userInputs.keywords.join(', ')}`);
    }
    
    if (userInputs.writingStyle?.emojiFrequency) {
      constraints.push(`絵文字使用: ${userInputs.writingStyle.emojiFrequency}`);
    }
    
    return constraints;
  }

  mapProvidedElements(userInputs) {
    const provided = [];
    
    if (userInputs.keywords?.length > 0) provided.push('キーワード');
    if (userInputs.readerPersona?.age) provided.push('読者ペルソナ');
    if (userInputs.writerCharacter?.occupation) provided.push('書き手キャラクター');
    if (userInputs.primaryInfo?.facts || userInputs.primaryInfo?.feelings) provided.push('一次情報');
    if (userInputs.purpose) provided.push('記事の目的');
    if (userInputs.writingStyle?.template) provided.push('構成テンプレート');
    
    return provided;
  }

  identifyMissingElements(userInputs) {
    const missing = [];
    
    if (!userInputs.keywords?.length) missing.push('具体的なキーワード');
    if (!userInputs.purpose?.trim()) missing.push('明確な記事の目的');
    if (!userInputs.readerPersona?.challenges?.length) missing.push('読者の具体的な課題');
    if (!userInputs.primaryInfo?.facts && !userInputs.primaryInfo?.feelings) missing.push('実体験・一次情報');
    if (!userInputs.psychologyEffects || !Object.values(userInputs.psychologyEffects).some(Boolean)) {
      missing.push('心理効果の活用');
    }
    
    return missing;
  }

  // 2. 診断 - 明確性のギャップと曖昧さを監査
  diagnosePrompt(analysis) {
    const diagnosis = {
      clarityGaps: this.identifyClarityGaps(analysis),
      ambiguities: this.identifyAmbiguities(analysis),
      specificityLevel: this.assessSpecificity(analysis),
      completenessLevel: this.assessCompleteness(analysis),
      structureNeeds: this.assessStructureNeeds(analysis),
      complexityLevel: this.assessComplexity(analysis),
      optimizationPriority: this.determineOptimizationPriority(analysis)
    };
    
    return diagnosis;
  }

  identifyClarityGaps(analysis) {
    const gaps = [];
    
    if (!analysis.coreIntent.includes('具体的')) {
      gaps.push('コアインテントの具体性不足');
    }
    
    if (analysis.keyEntities.length < 3) {
      gaps.push('キーエンティティの不足');
    }
    
    if (analysis.missingElements.length > 2) {
      gaps.push('必要要素の欠如');
    }
    
    return gaps;
  }

  identifyAmbiguities(analysis) {
    const ambiguities = [];
    
    if (!analysis.context.audience.age && !analysis.context.audience.occupation) {
      ambiguities.push('ターゲット読者の曖昧さ');
    }
    
    if (analysis.outputRequirements.keywordIntegration === 0) {
      ambiguities.push('キーワード活用方針の不明確さ');
    }
    
    return ambiguities;
  }

  assessSpecificity(analysis) {
    let score = 0;
    
    if (analysis.keyEntities.length >= 3) score += 25;
    if (analysis.context.audience.age) score += 25;
    if (analysis.context.primaryInfo.facts || analysis.context.primaryInfo.feelings) score += 25;
    if (analysis.providedElements.length >= 4) score += 25;
    
    return score;
  }

  assessCompleteness(analysis) {
    const totalElements = 6; // キーワード、読者、書き手、構成、目的、一次情報
    const providedElements = analysis.providedElements.length;
    
    return Math.round((providedElements / totalElements) * 100);
  }

  assessStructureNeeds(analysis) {
    if (analysis.context.wordCount >= 5000) return 'complex';
    if (analysis.context.wordCount >= 2000) return 'structured';
    if (analysis.context.wordCount <= 500) return 'concise';
    return 'standard';
  }

  assessComplexity(analysis) {
    let complexity = 0;
    
    if (analysis.keyEntities.length > 5) complexity++;
    if (analysis.context.wordCount > 3000) complexity++;
    if (analysis.constraints.length > 3) complexity++;
    if (analysis.missingElements.length < 2) complexity++;
    
    if (complexity >= 3) return 'complex';
    if (complexity >= 2) return 'moderate';
    return 'simple';
  }

  determineOptimizationPriority(analysis) {
    const priorities = [];
    
    if (analysis.missingElements.includes('明確な記事の目的')) {
      priorities.push('目的の明確化');
    }
    
    if (analysis.missingElements.includes('読者の具体的な課題')) {
      priorities.push('読者ペルソナの深化');
    }
    
    if (analysis.missingElements.includes('実体験・一次情報')) {
      priorities.push('具体性・信頼性の向上');
    }
    
    return priorities;
  }

  // 3. 開発 - 最適化されたプロンプトを開発
  developOptimizedPrompt(analysis, diagnosis) {
    const requestType = this.determineRequestType(analysis);
    const technique = this.selectOptimalTechnique(requestType, diagnosis);
    
    let optimizedPrompt = '';
    
    // AIの役割と専門知識の強化
    optimizedPrompt += this.buildEnhancedRole(analysis);
    optimizedPrompt += '\n\n';
    
    // コンテキストの強化
    optimizedPrompt += this.buildEnhancedContext(analysis, diagnosis);
    optimizedPrompt += '\n\n';
    
    // 論理構造の実装
    optimizedPrompt += this.buildLogicalStructure(analysis, technique);
    optimizedPrompt += '\n\n';
    
    // 出力仕様の精密化
    optimizedPrompt += this.buildPreciseOutputSpec(analysis, diagnosis);
    optimizedPrompt += '\n\n';
    
    // 品質保証の実装
    optimizedPrompt += this.buildQualityAssurance(analysis, diagnosis);
    
    return optimizedPrompt;
  }

  determineRequestType(analysis) {
    if (analysis.context.primaryInfo.facts || analysis.context.primaryInfo.feelings) {
      return 'creative'; // 体験談ベース
    }
    
    if (analysis.keyEntities.some(e => e.type === 'keyword' && 
        (e.value.includes('プログラミング') || e.value.includes('技術') || e.value.includes('開発')))) {
      return 'technical';
    }
    
    if (analysis.coreIntent.includes('学習') || analysis.coreIntent.includes('教育')) {
      return 'educational';
    }
    
    if (analysis.missingElements.length > 2 || analysis.context.wordCount > 5000) {
      return 'complex';
    }
    
    return 'creative';
  }

  selectOptimalTechnique(requestType, diagnosis) {
    switch (requestType) {
      case 'creative':
        return '多角的視点 + トーン強調 + 感情的共感';
      case 'technical':
        return '制約ベース + 精密フォーカス + ステップバイステップ';
      case 'educational':
        return '少数ショット例 + 明確構造 + 段階的学習';
      case 'complex':
        return '思考連鎖 + 体系的枠組み + 多層分析';
      default:
        return '会話的アプローチ + 具体例重視';
    }
  }

  buildEnhancedRole(analysis) {
    const writerChar = analysis.context.audience;
    
    return `# あなたの強化された役割定義

あなたは以下の3つの専門性を併せ持つエキスパートライターです：

## 1. コンテンツ戦略マスター
- ${analysis.coreIntent}に特化した戦略的思考
- 読者の行動心理を深く理解し、適切なタイミングで行動を促す能力
- ${analysis.keyEntities.map(e => e.value).join('、')}の分野における豊富な知見

## 2. ペルソナ・コミュニケーター  
- ${analysis.context.audience.age || '多世代'}の${analysis.context.audience.occupation || '多様な職業'}読者との深い共感能力
- ${analysis.context.tone}での自然で魅力的な表現力
- 読者の潜在ニーズを言語化し、解決策を提示する能力

## 3. 構造化ライティングの達人
- ${analysis.context.writingStyle}による論理的で読みやすい構成力
- ${analysis.context.wordCount}文字での最適な情報密度の調整
- SEOと読者体験を両立させる高度なバランス感覚

**重要：** これらの専門性を統合し、読者にとって「この人にしか書けない」と感じられる独自性のある記事を作成してください。`;
  }

  buildEnhancedContext(analysis, diagnosis) {
    let context = `# 強化されたコンテキスト設定\n\n`;
    
    // 読者の詳細プロファイル
    context += `## ターゲット読者の詳細プロファイル\n`;
    context += this.buildDetailedReaderProfile(analysis);
    
    // コンテンツ戦略
    context += `\n## コンテンツ戦略\n`;
    context += this.buildContentStrategy(analysis, diagnosis);
    
    // 競合優位性
    context += `\n## 競合優位性の確立\n`;
    context += this.buildCompetitiveAdvantage(analysis);
    
    return context;
  }

  buildDetailedReaderProfile(analysis) {
    const reader = analysis.context.audience;
    
    return `**基本属性：**
- 年齢層: ${reader.age || '20-40代中心'}
- 職業: ${reader.occupation || '多様な職業（会社員、フリーランス、起業家など）'}
- 読書環境: ${reader.readingStyle || 'スマートフォンでの隙間時間読書が中心'}

**心理的特性：**
- 関心事: ${reader.interests?.join('、') || '自己成長、効率化、新しい知識習得'}
- 課題: ${reader.challenges?.join('、') || '時間不足、情報過多、実践方法の不明確さ'}
- 動機: 具体的な解決策と実践可能なアクションを求めている

**コミュニケーション嗜好：**
- 専門用語よりも分かりやすい説明を好む
- 具体例や体験談による説明を重視
- 結論を先に知りたがる傾向（忙しい日常のため）`;
  }

  buildContentStrategy(analysis, diagnosis) {
    return `**コンテンツの差別化戦略：**
1. **独自の視点**: ${analysis.context.primaryInfo.facts ? '実体験に基づく' : '理論と実践を組み合わせた'}アプローチ
2. **価値提供**: ${analysis.coreIntent}を通じた読者の具体的な変化の創出
3. **エンゲージメント**: ${analysis.context.tone}による親しみやすさと専門性のバランス

**読者の行動変容設計：**
- 認知段階: 課題の明確化と共感の構築
- 理解段階: 解決策の論理的説明と具体例提示  
- 行動段階: 実践可能なステップと継続のモチベーション提供`;
  }

  buildCompetitiveAdvantage(analysis) {
    return `**他の記事との差別化ポイント：**
1. **具体性**: 抽象論ではなく、実践的で即効性のある内容
2. **共感性**: 読者の立場に立った温かみのある表現
3. **体系性**: ${analysis.context.writingStyle}による分かりやすい構成
4. **信頼性**: ${analysis.context.primaryInfo.facts ? '実体験' : '論理的根拠'}に基づく説得力

**避けるべき要素：**
- テンプレート的な表現や定型文
- 表面的なアドバイス
- 読者の課題に対する理解不足を感じさせる内容`;
  }

  buildLogicalStructure(analysis, technique) {
    return `# 論理構造とライティング技法

## 適用技法: ${technique}

### 構成フレームワーク（${analysis.context.writingStyle}）
${this.getStructureFramework(analysis.context.writingStyle, analysis.context.wordCount)}

### 説得力強化のテクニック
1. **権威性の確立**: ${analysis.context.primaryInfo.facts ? '実体験の具体的描写' : '専門知識の適切な引用'}
2. **社会証明の活用**: 読者と同じ立場の人の成功例や変化の事例
3. **希少性の演出**: 「多くの人が知らない」「実際に試した人だけが知る」視点
4. **緊急性の創出**: 「今すぐ始められる」「先延ばしのリスク」の言及

### 感情的共感の構築
- **痛みの共感**: 読者の課題に対する深い理解の表現
- **希望の提示**: 解決可能性と明るい未来の描写
- **達成感の演出**: 実践後の充実感や成長の実感`;
  }

  getStructureFramework(style, wordCount) {
    const frameworks = {
      'prep': `
**PREP法 強化版**
1. **結論 (Point)**: 核心的価値提案 + 読者への直接的メリット
2. **理由 (Reason)**: 論理的根拠 + 感情的共感 + 社会証明
3. **具体例 (Example)**: 実体験 + 成功事例 + 失敗から学んだ教訓
4. **結論 (Point)**: 行動促進 + 継続のモチベーション`,
      
      'story': `
**ストーリーテリング 強化版**
1. **状況設定**: 読者が共感できるリアルな状況描写
2. **問題発生**: 具体的な課題と感情的な葛藤
3. **解決過程**: 試行錯誤のプロセスと学びの瞬間
4. **結果と学び**: 変化の実感と読者への応用可能性`,
      
      'problem-solution': `
**問題解決型 強化版**
1. **問題の可視化**: データと体験談による課題の明確化
2. **根本原因**: 表面的でない真の原因の分析
3. **解決策**: 段階的で実践可能な具体的方法
4. **実装ガイド**: 継続のコツと障害の乗り越え方`
    };
    
    return frameworks[style] || frameworks['prep'];
  }

  buildPreciseOutputSpec(analysis, diagnosis) {
    return `# 精密な出力仕様

## 品質基準
- **具体性レベル**: 90%以上（抽象的表現は10%未満に制限）
- **独自性スコア**: 他の記事では得られない独自の視点や情報を含む
- **実用性指標**: 読者が即座に実践できる具体的アクションを含む
- **感情的共感度**: 読者が「自分のことを理解してくれている」と感じるレベル

## 文章品質要件
- **文字数**: ${analysis.context.wordCount}文字（±10%の範囲内）
- **可読性**: 中学生でも理解できる表現（専門用語使用時は必ず説明）
- **リズム**: 長短の文章を適切に組み合わせた読みやすいリズム
- **キーワード密度**: 自然な文脈での適切な頻度（不自然な詰め込み禁止）

## 必須要素チェックリスト
✓ メインキーワード「${analysis.keyEntities.find(e => e.type === 'keyword')?.value || 'テーマ'}」のタイトル含有
✓ ${analysis.coreIntent}の明確な達成
✓ 読者の${analysis.context.audience.challenges?.join('、') || '課題'}に対する具体的解決策
✓ ${analysis.context.tone}による一貫した文体
✓ 実践可能な行動指針の提示`;
  }

  buildQualityAssurance(analysis, diagnosis) {
    return `# 品質保証プロトコル

## 最終チェック項目

### コンテンツの価値性
1. **独自性**: 他では得られない情報や視点が含まれているか
2. **実用性**: 読者が実際に活用できる具体的な内容か
3. **完全性**: 読者の疑問に先回りして答えているか

### テクニカル要件
1. **キーワード統合**: 自然な文脈で適切に配置されているか
2. **構成の論理性**: ${analysis.context.writingStyle}による明確な流れか
3. **文字数の適正性**: ${analysis.context.wordCount}文字の範囲内か

### 読者体験
1. **共感性**: 読者が「自分のため」と感じられる内容か
2. **実践可能性**: 明日からでも始められる具体的アクションがあるか  
3. **継続動機**: 長期的な取り組みへのモチベーションが含まれているか

## 禁止事項
❌ 「重要です」「大切です」などの曖昧な強調
❌ 「〜について説明します」などの定型的表現
❌ 表面的で深みのないアドバイス
❌ 読者の立場を理解していない上から目線の表現

**最終確認**: 上記すべての要件を満たし、「${analysis.coreIntent}」を確実に達成する記事を作成してください。`;
  }

  // 4. 配信 - 最適化結果の配信
  deliverOptimization(originalPrompt, optimizedPrompt, diagnosis) {
    const improvements = this.identifyKeyImprovements(diagnosis);
    const techniques = this.getAppliedTechniques(diagnosis);
    const proTips = this.generateProTips(diagnosis);
    
    return {
      optimizedPrompt,
      improvements,
      techniques,
      proTips,
      complexity: diagnosis.complexityLevel,
      specificityScore: diagnosis.specificityLevel,
      completenessScore: diagnosis.completenessLevel
    };
  }

  identifyKeyImprovements(diagnosis) {
    const improvements = [];
    
    if (diagnosis.clarityGaps.includes('コアインテントの具体性不足')) {
      improvements.push('記事の目的と価値提案を明確化');
    }
    
    if (diagnosis.ambiguities.includes('ターゲット読者の曖昧さ')) {
      improvements.push('読者ペルソナの詳細化と心理的特性の追加');
    }
    
    if (diagnosis.specificityLevel < 70) {
      improvements.push('具体例と実践的要素の強化');
    }
    
    if (diagnosis.completenessLevel < 80) {
      improvements.push('不足要素の補完と構成の体系化');
    }
    
    improvements.push('AIの役割定義の専門性向上');
    improvements.push('品質保証プロトコルの実装');
    
    return improvements;
  }

  getAppliedTechniques(diagnosis) {
    const techniques = [
      '役割の専門性強化（3層の専門性定義）',
      'コンテキストの階層化（読者プロファイル + 戦略 + 差別化）',
      '出力仕様の精密化（品質基準 + チェックリスト）'
    ];
    
    if (diagnosis.complexityLevel === 'complex') {
      techniques.push('思考連鎖アプローチ');
      techniques.push('多層分析フレームワーク');
    }
    
    if (diagnosis.optimizationPriority.includes('具体性・信頼性の向上')) {
      techniques.push('制約ベース最適化');
      techniques.push('社会証明の統合');
    }
    
    return techniques;
  }

  generateProTips(diagnosis) {
    const tips = [];
    
    if (diagnosis.specificityLevel < 80) {
      tips.push('具体的な数字や事例を多用することで説得力を大幅に向上させられます');
    }
    
    if (diagnosis.completenessLevel < 90) {
      tips.push('一次情報（体験談）を追加することで、他の記事との差別化が図れます');
    }
    
    tips.push('このプロンプトをChatGPT/Claude/Geminiいずれでも使用可能です');
    tips.push('生成された記事の品質をさらに向上させるには、出力後に「読者の○○という課題への解決策をもう一つ追加して」などの追加指示が効果的です');
    
    return tips;
  }
}

// ユーティリティ関数
export const optimizePrompt = (originalPrompt, userInputs) => {
  const optimizer = new LyraOptimizer();
  return optimizer.optimize(originalPrompt, userInputs);
};