// 強化されたプロンプト生成システム
export class PromptGenerator {
  constructor(userInputs) {
    this.userInputs = userInputs || {};
    this.validateInputs();
  }

  validateInputs() {
    const required = ['keywords', 'readerPersona', 'writerCharacter'];
    const missing = required.filter(key => !this.userInputs[key]);
    
    if (missing.length > 0) {
      console.warn(`Missing required inputs: ${missing.join(', ')}`);
      // 不足している項目を初期化
      if (!this.userInputs.keywords) this.userInputs.keywords = [];
      if (!this.userInputs.readerPersona) this.userInputs.readerPersona = {};
      if (!this.userInputs.writerCharacter) this.userInputs.writerCharacter = {};
    }
    
    // その他のプロパティも初期化
    if (!this.userInputs.primaryInfo) this.userInputs.primaryInfo = {};
    if (!this.userInputs.writingStyle) this.userInputs.writingStyle = {};
    if (!this.userInputs.wordCount) this.userInputs.wordCount = 3000;
  }

  // 強化されたメインプロンプト生成
  generateMainPrompt() {
    const { keywords, readerPersona, writerCharacter, primaryInfo, writingStyle, wordCount, purpose } = this.userInputs;

    // プロンプトの構成要素を詳細に組み立て
    const sections = [];

    // 1. 役割とキャラクター設定（詳細化）
    sections.push(this.buildDetailedRoleSection());

    // 2. 具体的なターゲット読者設定
    sections.push(this.buildDetailedTargetSection());

    // 3. 文体・口調の詳細指定
    sections.push(this.buildDetailedToneSection());

    // 4. 一次情報の活用指示
    sections.push(this.buildPrimaryInfoSection());

    // 5. キーワード統合指示と目的（必須セクション）
    sections.push(this.buildKeywordAndPurposeSection());

    // 6. 構成と文字数の明確化
    sections.push(this.buildStructureAndWordCountSection());
    
    // 7. 出力品質の要求
    sections.push(this.buildQualityRequirementsSection());
    
    // 8. 具体的な執筆指示
    sections.push(this.buildConcreteWritingInstructions());

    return sections.filter(Boolean).join('\n\n');
  }

  // 詳細な役割設定
  buildDetailedRoleSection() {
    const { writerCharacter } = this.userInputs;
    
    let roleSection = `# あなたの役割とキャラクター設定\n\n`;
    
    // 基本情報
    roleSection += `## 基本プロフィール\n`;
    roleSection += `- 年齢: ${writerCharacter?.age || '30'}歳\n`;
    roleSection += `- 職業: ${writerCharacter?.occupation || 'ライター'}\n`;
    
    // 性格特性（具体的な行動指示付き）
    if (writerCharacter?.personalities?.length > 0) {
      roleSection += `- 性格: ${writerCharacter.personalities.join('、')}\n`;
      roleSection += `\n## 性格の文章への反映方法:\n`;
      
      writerCharacter.personalities.forEach(personality => {
        const behaviorGuide = this.getPersonalityBehaviorGuide(personality);
        roleSection += `- ${personality}: ${behaviorGuide}\n`;
      });
    }
    
    // 書く動機と情熱
    if (writerCharacter?.motivations?.length > 0) {
      roleSection += `\n## 執筆動機:\n`;
      roleSection += `${writerCharacter.motivations.join('、')}という強い想いで記事を書いています。\n`;
      roleSection += `この動機を文章の端々に感じられるような温度感で執筆してください。\n`;
    }
    
    roleSection += `\n**重要**: 上記のキャラクター設定を単なる情報として扱わず、文章の一つ一つの表現に反映させてください。`;
    
    return roleSection;
  }

  // 性格特性の具体的な行動指示
  getPersonalityBehaviorGuide(personality) {
    const guides = {
      '親しみやすい': '読者を「あなた」と呼び、共感的な表現を多用し、体験談を交えて距離感を縮める。例：「私も同じ経験があります」「あなたならどう思いますか？」',
      '真面目': '論理的で構造化された説明を心がけ、根拠を明確に示し、責任感のある言葉遣いを使う。例：「データによると」「研究結果から」',
      '情熱的': '感嘆符や強調表現を適度に使い、熱い想いが伝わる力強い文章を書く。例：「本当に素晴らしいんです！」「絶対に知っておくべき」',
      '冷静': '客観的な分析を重視し、感情的な表現を控えめにし、データや事実を基に論述する。例：「客観的に見ると」「事実として」',
      '優しい': '読者の気持ちに寄り添う表現を使い、批判的な言葉を避け、励ましの言葉を含める。例：「大丈夫ですよ」「一緒に頑張りましょう」',
      'ユーモアがある': '適度な軽快さを保ち、親しみやすい例えや比喩を使い、読者を楽しませる要素を入れる。例：「まるで〜のような」「実は私も最初は〜でした」'
    };
    
    return guides[personality] || '個性を文章に反映させる';
  }

  // 詳細なターゲット読者設定
  buildDetailedTargetSection() {
    const { readerPersona } = this.userInputs;
    
    let targetSection = `# ターゲット読者の詳細設定\n\n`;
    
    // 基本属性から具体的な読者像へ変換
    targetSection += `## 読者プロフィールと心理特性\n`;
    targetSection += `**あなたが話しかけている読者は以下のような人です：**\n`;
    
    // 年齢や職業から推測される特性
    if (readerPersona?.age || readerPersona?.occupation) {
      targetSection += `- ${this.getReaderLifestageDescription(readerPersona?.age, readerPersona?.occupation)}\n`;
    } else {
      targetSection += `- 日々の忙しさの中でも自己成長を求めている人\n`;
    }
    
    // 読書スタイルに応じた文章構成
    if (readerPersona?.readingStyle) {
      targetSection += `- ${this.getReadingStyleApproach(readerPersona.readingStyle)}\n`;
    }
    
    // 興味関心への具体的アプローチ
    if (readerPersona?.interests?.length > 0) {
      targetSection += `\n## 読者の関心事と訴求ポイント:\n`;
      readerPersona.interests.forEach(interest => {
        targetSection += `- ${interest}に関心がある → ${this.getInterestAppeal(interest)}\n`;
      });
    }
    
    // 課題への共感的アプローチ
    if (readerPersona?.challenges?.length > 0) {
      targetSection += `\n## 読者の課題への共感と解決アプローチ:\n`;
      readerPersona.challenges.forEach(challenge => {
        targetSection += `- ${challenge}という悩みを持つ → ${this.getChallengeApproach(challenge)}\n`;
      });
    }
    
    targetSection += `\n**重要**: 読者の属性情報を単に説明するのではなく、上記の特性を持つ具体的な人物に直接語りかけるように文章を構成してください。読者がまさに「自分のことを理解してくれている」と感じる内容にしましょう。`;
    
    return targetSection;
  }

  // 年齢と職業から読者の生活状況を推測
  getReaderLifestageDescription(age, occupation) {
    if (!age && !occupation) return '多様な背景を持つ読者';
    
    let description = '';
    
    // 年齢による特性
    if (age) {
      switch (age) {
        case '10代':
          description = '将来への不安と可能性を持ち、自分の進路を模索している';
          break;
        case '20代':
          description = 'キャリア形成の初期段階で、スキルアップと経験を求めている';
          break;
        case '30代':
          description = 'キャリアと私生活のバランスを模索し、専門性を深めたい';
          break;
        case '40代':
          description = '責任あるポジションでありながら、次のステップや変化も考えている';
          break;
        case '50代以上':
          description = '豊富な経験を持ちながらも、新しい時代への適応を意識している';
          break;
        default:
          description = '自己成長を求めている';
      }
    }
    
    // 職業による特性の追加
    if (occupation) {
      if (occupation.includes('エンジニア') || occupation.includes('開発')) {
        description += '、技術的な詳細と実践的な応用を重視する';
      } else if (occupation.includes('マーケ') || occupation.includes('広報')) {
        description += '、トレンドやデータに基づいた戦略的視点を持つ';
      } else if (occupation.includes('営業') || occupation.includes('セールス')) {
        description += '、実用的で成果に直結する内容を求める';
      } else if (occupation.includes('経営') || occupation.includes('管理職')) {
        description += '、組織全体を見渡す視点と効率化を重視する';
      } else if (occupation.includes('デザイナー') || occupation.includes('クリエイター')) {
        description += '、創造性と表現力を大切にしている';
      } else if (occupation.includes('学生')) {
        description += '、将来のキャリアに役立つ知識やスキルを吸収したい';
      } else {
        description += `、${occupation}としての専門性と日常の課題解決を両立したい`;
      }
    }
    
    return description;
  }

  // 読書スタイルに合わせたアプローチ
  getReadingStyleApproach(style) {
    switch (style) {
      case 'じっくり読む':
        return '深い洞察と詳細な説明を評価する読者なので、丁寧な解説と豊富な例を提供する';
      case '流し読み':
        return '要点を素早く把握したい読者なので、見出しと箇条書きで重要ポイントを明確にする';
      case '重要部分だけ':
        return '必要な情報だけを効率的に得たい読者なので、ハイライトと簡潔な要約を随所に入れる';
      case 'スマホで隙間時間':
        return '短い時間で価値ある情報を得たい読者なので、簡潔な段落と視覚的な区切りを多用する';
      default:
        return '効率的に価値ある情報を得たい読者';
    }
  }

  // 興味関心に基づいた訴求ポイント
  getInterestAppeal(interest) {
    const appeals = {
      'プログラミング': 'コードの実例や実践的なテクニックを交えて解説し、スキル向上につながる内容を提供',
      'デザイン': '視覚的な例と創造的なアプローチを重視し、美的センスと実用性のバランスを意識',
      'マーケティング': 'データと成功事例を基に戦略的思考を促し、具体的な成果につながる方法論を提示',
      'ビジネス': '実務に直結する知見と効率化のポイントを提供し、ビジネスインパクトを強調',
      'キャリア': '長期的な成長視点とスキル活用の具体例を示し、キャリアパスの選択肢を広げる内容に',
      'スタートアップ': '挑戦と創造の価値を強調し、リスクと機会のバランスを実例で示す',
      'フリーランス': '自律と自由の実現方法と、安定性を確保するための具体的なテクニックを提案',
      '副業': '本業とのバランスや時間管理の工夫を重視し、持続可能な取り組み方を提案',
      '投資': 'リスク管理と長期的視点を強調し、感情に左右されない合理的判断を促す',
      'ライフハック': '日常の小さな工夫が積み重なる大きな効果を示し、すぐに実践できる具体例を多数提供'
    };
    
    return appeals[interest] || `${interest}に関する具体的で実用的な情報を提供`;
  }

  // 課題に対する共感と解決アプローチ
  getChallengeApproach(challenge) {
    const approaches = {
      '時間がない': '「私も常に時間との戦いです」と共感しつつ、5分でも効果的に実践できる方法を優先的に紹介',
      'スキル不足': '「誰もが最初は初心者です」と安心感を与え、スモールステップでの上達方法を具体的に提示',
      '情報過多': '「情報の海に溺れそうですよね」と共感し、厳選された本質的な情報と優先順位付けの方法を提供',
      '継続できない': '「私も何度も挫折しました」と正直に伝え、心理的ハードルを下げる小さな習慣化の技術を紹介',
      '成果が出ない': '「目に見える成果がないとつらいですよね」と理解を示し、小さな成功体験を積み重ねる方法を提案',
      '何から始めればいいかわからない': '「最初の一歩が最も難しいですよね」と共感し、明確な初心者向けロードマップを提示',
      'モチベーション維持': '「誰でもモチベーションは波があります」と正常化し、内発的動機付けを高める具体的な方法を提案',
      '専門用語が難しい': '「私も最初は専門用語の壁に苦労しました」と共有し、平易な言葉での説明と徐々に慣れるアプローチを提供'
    };
    
    return approaches[challenge] || `「${challenge}は本当に大変ですよね」と共感しつつ、段階的に克服するための具体的方法を提案`;
  }

  // 詳細な文体・口調設定
  buildDetailedToneSection() {
    const { writerCharacter, writingStyle } = this.userInputs;
    
    let toneSection = `# 文体・口調の詳細設定\n\n`;
    
    // 基本口調
    toneSection += `## 基本的な口調\n`;
    toneSection += `- 語尾: ${writerCharacter?.tone || 'です・ます調'}\n`;
    toneSection += `- 文体: ${writingStyle?.conversational ? '会話的で親しみやすい' : '丁寧で解説的な'}文体\n`;
    
    // 具体的な文体指示
    if (writingStyle?.conversational) {
      toneSection += `\n## 会話的文体の具体例:\n`;
      toneSection += `- 「〜ですよね」「〜だと思うんです」などの共感表現を使用\n`;
      toneSection += `- 「実は」「ちなみに」などの接続表現で親近感を演出\n`;
      toneSection += `- 読者への直接的な問いかけを適度に含める\n`;
    } else {
      toneSection += `\n## 解説的文体の具体例:\n`;
      toneSection += `- 「〜について説明します」「〜を解説いたします」などの丁寧な表現\n`;
      toneSection += `- 論理的な展開と明確な構造を重視\n`;
      toneSection += `- 専門用語は必ず分かりやすく説明\n`;
    }
    
    // 絵文字使用ガイド
    const emojiGuide = this.getEmojiGuide(writingStyle?.emojiFrequency);
    toneSection += `\n## 絵文字使用方針:\n${emojiGuide}\n`;
    
    toneSection += `\n**重要**: 設定された口調を一貫して保ち、読者が「この人らしい」と感じる文章を書いてください。`;
    
    return toneSection;
  }

  // 絵文字使用ガイド
  getEmojiGuide(frequency) {
    const guides = {
      'none': '絵文字は一切使用しない',
      'minimal': '記事の終わりや重要なポイントでのみ1-2個使用（例：✨、💡）',
      'moderate': '各セクションに1-2個程度、読みやすさを向上させる目的で使用',
      'frequent': '親しみやすさを重視し、段落ごとに適切な絵文字を使用（過度にならない範囲で）'
    };
    
    return guides[frequency] || guides.moderate;
  }

  // 一次情報の活用指示
  buildPrimaryInfoSection() {
    const { primaryInfo } = this.userInputs;
    
    if (!primaryInfo?.facts && !primaryInfo?.feelings) {
      return null;
    }
    
    let primarySection = `# 一次情報の活用指示\n\n`;
    
    if (primaryInfo.facts) {
      primarySection += `## 事実・体験談の活用:\n`;
      primarySection += `以下の事実を記事の信頼性を高める具体例として使用してください：\n`;
      primarySection += `「${primaryInfo.facts}」\n\n`;
      primarySection += `**活用方法**: 抽象的な説明ではなく、この具体的な体験を元に説得力のある文章を構築\n\n`;
    }
    
    if (primaryInfo.feelings) {
      primarySection += `## 感情・感想の活用:\n`;
      primarySection += `以下の感情体験を読者との共感ポイントとして使用してください：\n`;
      primarySection += `「${primaryInfo.feelings}」\n\n`;
      primarySection += `**活用方法**: 読者が「この人の気持ち分かる」と感じるような温度感で表現\n\n`;
    }
    
    primarySection += `**重要**: 事実と感情を適切に組み合わせ、読者にリアルな体験として伝わる文章を作成してください。`;
    
    return primarySection;
  }

  // キーワード統合指示と目的（必須セクション）
  buildKeywordAndPurposeSection() {
    const { keywords, purpose } = this.userInputs;
    
    let section = `# 記事のキーワードと目的（必須）\n\n`;
    
    // キーワードセクション（必須）
    section += `## 対象キーワード:\n`;
    
    if (keywords && keywords.length > 0) {
      keywords.forEach((keyword, index) => {
        section += `${index + 1}. ${keyword}\n`;
      });
      
      section += `\n## キーワード活用の必須要件:\n`;
      section += `- メインキーワード「${keywords[0]}」: 記事タイトルに必ず含め、各見出しでも言及する\n`;
      
      if (keywords.length > 1) {
        section += `- サブキーワード: ${keywords.slice(1).join('、')}\n`;
        section += `  これらは自然な文脈で本文に織り込み、メインキーワードとの関連性を示す\n`;
      }
      
      section += `\n## キーワード使用の注意事項:\n`;
      section += `- 各キーワードは記事全体で最低2-3回は自然に言及すること\n`;
      section += `- キーワードの不自然な詰め込みは避け、読者にとって価値のある文脈でのみ使用\n`;
      section += `- SEOを意識しつつも、読みやすさを最優先とする\n\n`;
    } else {
      section += `1. テーマ（キーワードが指定されていません）\n\n`;
      section += `## キーワード設定の重要性:\n`;
      section += `- 記事の焦点を明確にするため、具体的なテーマやキーワードを意識して執筆してください\n\n`;
    }
    
    // 目的セクション（必須）
    section += `## 記事の目的:\n`;
    
    if (purpose && purpose.trim()) {
      section += `「${purpose}」\n\n`;
      section += `## 目的達成のための執筆方針:\n`;
      section += `- この目的を常に意識して、記事の各部分がこの目的に沿うように構成してください\n`;
      section += `- 読者がこの記事を読み終えた後、具体的に何を得られるか、どのような行動を取れるようになるかを明確にしてください\n`;
      section += `- 目的と関連しない余分な情報は省略し、目的達成に必要な情報に集中してください\n\n`;
    } else {
      section += `「読者に価値ある情報を提供し、具体的な行動につなげる」\n\n`;
      section += `## 目的設定の重要性:\n`;
      section += `- 明確な目的を持った記事は読者にとって価値が高くなります\n`;
      section += `- 読者の課題解決や知識向上に貢献する内容を心がけてください\n\n`;
    }
    
    section += `**最重要**: キーワードと目的は記事作成において最も重要な要素です。これらを無視した記事は作成しないでください。`;
    
    return section;
  }

  // 構成と文字数の明確化
  buildStructureAndWordCountSection() {
    const { writingStyle, wordCount } = this.userInputs;
    
    let structureSection = `# 構成と文字数の明確化\n\n`;
    
    // 構成テンプレート
    const template = this.getStructureTemplate(writingStyle?.template);
    structureSection += `## 記事構成（${writingStyle?.template || 'prep'}法）:\n`;
    structureSection += template;
    
    // 文字数指示
    structureSection += `\n## 文字数要件:\n`;
    structureSection += `- 目標文字数: ${wordCount || 3000}文字\n`;
    structureSection += `- 読了時間: 約${Math.ceil((wordCount || 3000) / 400)}分\n`;
    structureSection += `- 各セクションのバランスを考慮し、内容の濃い文章を作成\n`;
    
    // 長文記事向け追加指示
    if (wordCount >= 5000) {
      structureSection += `\n## 長文記事の構成ガイド:\n`;
      structureSection += `- 目次を最初に配置し、各セクションへのナビゲーションを提供\n`;
      structureSection += `- 各トピックを独立したセクションとして詳細に展開\n`;
      structureSection += `- セクション間の関連性と一貫性を保つ\n`;
      structureSection += `- 読者が途中で読むのをやめないよう、セクション間に小さな「フック」を入れる\n`;
      
      if (wordCount >= 8000) {
        structureSection += `- よくある質問（FAQ）セクションを追加し、読者の疑問に先回りして答える\n`;
        structureSection += `- 実践例や事例研究を含めて具体性を高める\n`;
      }
    }
    
    // 短文向け指示
    if (wordCount <= 1000) {
      structureSection += `\n## 短文記事の構成ガイド:\n`;
      structureSection += `- 冗長な表現を避け、簡潔で明瞭な文章を心がける\n`;
      structureSection += `- 最も重要なポイントを優先し、本質的でない情報は省略\n`;
      structureSection += `- 1つの段落は1つのアイデアに集中\n`;
      
      if (wordCount <= 140) {
        structureSection += `- SNS投稿向けの超簡潔な表現を使用\n`;
        structureSection += `- 核となるメッセージを最初に配置\n`;
        structureSection += `- 行動喚起フレーズを含める\n`;
      }
    }
    
    return structureSection;
  }

  // 構成テンプレート
  getStructureTemplate(template) {
    const templates = {
      'prep': `1. **結論**: 記事の要点を最初に明確に提示\n2. **理由**: なぜその結論に至るのかの根拠を詳しく説明\n3. **具体例**: 実体験や事例を用いて説得力を高める\n4. **結論**: 要点を再度強調し、読者の行動を促す\n`,
      'story': `1. **状況設定**: 読者の関心を引く導入部\n2. **問題発生**: 課題や困難の発生\n3. **解決過程**: 取り組みや発見のプロセス\n4. **結果と学び**: 得られた成果と教訓\n`,
      'problem-solution': `1. **問題提起**: 読者が抱える具体的な課題\n2. **原因分析**: 問題の根本原因を探る\n3. **解決策提示**: 具体的で実践可能な解決方法\n4. **実行指南**: 実際の取り組み方法\n`,
      'how-to': `1. **概要説明**: 何を達成するのかの明確化\n2. **事前準備**: 必要な知識や準備事項\n3. **実行手順**: ステップバイステップの詳細説明\n4. **応用発展**: さらなる活用方法や発展可能性\n`,
      'comparison': `1. **選択肢提示**: 複数の方法や選択肢の概要\n2. **詳細比較**: 各選択肢のメリット・デメリット\n3. **評価基準**: 客観的な判断基準の提示\n4. **推奨提案**: 最適な選択肢とその理由\n`
    };
    
    return templates[template] || templates.prep;
  }

  // 出力品質の要求
  buildQualityRequirementsSection() {
    return `# 出力品質の要求

## 必須要件:
1. **具体性**: 抽象的な表現を避け、具体的な例や数字を多用
2. **独自性**: テンプレート的な表現を避け、個性的な文章を作成
3. **実用性**: 読者が実際に活用できる価値ある情報を提供
4. **読みやすさ**: 適切な改行と段落分けで読みやすい構成
5. **一貫性**: 設定されたキャラクターと文体を最後まで維持
6. **キーワード活用**: 指定されたキーワードを自然に文章に組み込む
7. **目的達成**: 設定された記事の目的を必ず達成する

## 避けるべき表現:
- 「〜について説明します」などの定型的な表現
- 「重要です」「大切です」などの曖昧な強調
- 同じパターンの繰り返し（「私の経験から〜」の多用など）
- 表面的で深みのない内容
- キーワードの無理な詰め込み

## 目指すべき品質:
- 読者が「この人にしか書けない」と感じる独自性
- 最後まで飽きずに読める構成と文体
- 読み終わった後に行動を起こしたくなる説得力
- 人間味と温かみが感じられる文章
- 自然でありながらSEOも意識した内容

**最重要**: 上記すべての設定を統合し、読者の心に響く高品質な記事を作成してください。`;
  }

  // 具体的な執筆指示
  buildConcreteWritingInstructions() {
    const { wordCount, keywords, purpose } = this.userInputs;
    
    let instructions = `# 具体的な執筆指示

## 記事作成の必須手順:

1. **導入部（${Math.floor((wordCount || 3000) * 0.15)}文字程度）**:
- 読者の関心を引く具体的なエピソードや事実から始める
- 設定されたキャラクターの個性を最初から表現する
- 読者の課題や興味に直接言及する`;

    // キーワードが指定されている場合は必須事項として追加
    if (keywords && keywords.length > 0) {
      instructions += `
- **必須**: メインキーワード「${keywords[0]}」を自然に導入部に含める`;
    }
    
    // 目的が指定されている場合は必須事項として追加
    if (purpose && purpose.trim()) {
      instructions += `
- **必須**: 記事の目的「${purpose}」を意識した導入にする`;
    }
    
    instructions += `

2. **本論（${Math.floor((wordCount || 3000) * 0.7)}文字程度）**:
- 各キーワードについて、具体的な体験談や事例を交えて説明
- 読者のペルソナに合わせた具体的なアドバイスを提供
- 一次情報を効果的に活用して説得力を高める`;

    // キーワードがある場合の本論での活用指示
    if (keywords && keywords.length > 1) {
      instructions += `
- **必須**: サブキーワード「${keywords.slice(1).join('、')}」を自然に本論に織り込む`;
    }
    
    instructions += `

3. **結論（${Math.floor((wordCount || 3000) * 0.15)}文字程度）**:
- 記事の要点を簡潔にまとめる
- 読者の行動を促す具体的な提案
- キャラクターらしい締めくくり`;

    // 目的がある場合の結論での言及指示
    if (purpose && purpose.trim()) {
      instructions += `
- **必須**: 記事の目的達成を確認できる結論にする`;
    }
    
    instructions += `

## 文章作成の必須チェックポイント:
- **キーワード確認**: 指定されたキーワードがすべて自然に含まれているか
- **目的達成確認**: 設定された記事の目的が達成されているか
- **文字数確認**: 目標文字数${wordCount || 3000}文字に達しているか
- **キャラクター反映**: 設定されたキャラクターの個性が文章に反映されているか
- **読者適合**: 読者のペルソナに適した内容になっているか
- **実用性確認**: 具体的で実用的な内容になっているか

## 品質保証のための最終確認:
1. 記事のタイトルにメインキーワードが含まれているか
2. 各見出しでキーワードが適切に使用されているか
3. 記事の目的が明確に読者に伝わるか
4. 読者が具体的な行動を取れる内容になっているか
5. 設定されたキャラクターらしさが一貫して表現されているか

**絶対厳守**: キーワードと目的は記事の核心部分です。これらを軽視したり省略したりすることは絶対に避けてください。`;

    return instructions;
  }

  // APIリクエスト用のプロンプト生成（強化版）
  generateAPIPrompt() {
    const mainPrompt = this.generateMainPrompt();
    
    return {
      system: `あなたは経験豊富で個性的なWebライターです。以下の詳細な設定に基づいて、読者の心に響く高品質な記事を作成してください。

重要な指針:
1. 設定されたキャラクターの個性を文章の隅々まで反映させる
2. 読者のペルソナを具体的にイメージし、その人に直接語りかける
3. 一次情報（体験談）を効果的に活用して説得力を高める
4. テンプレート的な表現を避け、独自性のある文章を作成
5. 指定された文字数を厳守する
6. キーワードと目的を最優先で記事に組み込む（必須）

品質基準:
- 具体的で実用的な内容
- 読者が最後まで飽きない構成
- 人間味と温かみのある文体
- 行動を起こしたくなる説得力
- キーワードの自然な活用
- 記事目的の確実な達成`,
      user: mainPrompt,
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 0.9
    };
  }

  // プロンプトの妥当性検証
  validatePrompt() {
    const prompt = this.generateMainPrompt();
    
    // 必須セクションの確認
    const requiredSections = [
      'あなたの役割とキャラクター設定',
      'ターゲット読者の詳細設定',
      '文体・口調の詳細設定',
      '記事のキーワードと目的（必須）',
      '構成と文字数の明確化'
    ];
    
    const missingSections = requiredSections.filter(section => !prompt.includes(section));
    
    if (missingSections.length > 0) {
      console.warn(`Missing sections: ${missingSections.join(', ')}`);
      return false;
    }
    
    // キーワードと目的の存在確認
    const hasKeywords = prompt.includes('対象キーワード:');
    const hasPurpose = prompt.includes('記事の目的:');
    
    if (!hasKeywords || !hasPurpose) {
      console.warn('Missing keywords or purpose section');
      return false;
    }
    
    // プロンプトの長さ確認
    if (prompt.length < 1500) {
      console.warn('Prompt might be too short for detailed generation');
      return false;
    }
    
    return true;
  }
}

// プロンプト生成のヘルパー関数
export const generateArticlePrompt = (userInputs) => {
  const generator = new PromptGenerator(userInputs);
  return generator.generateAPIPrompt();
};

// 空のプロパティ処理（デフォルト値の改善）
export const handleEmptyProperties = (userInputs) => {
  const defaults = {
    keywords: ['テーマ'],
    purpose: '読者に価値ある情報を提供する',
    readerPersona: {
      age: '30代',
      occupation: '会社員',
      readingStyle: 'じっくり読む',
      interests: ['自己成長'],
      challenges: ['時間がない']
    },
    writerCharacter: {
      age: '30',
      occupation: 'ライター',
      personalities: ['親しみやすい'],
      tone: 'です・ます調',
      motivations: ['知識を共有したい']
    },
    writingStyle: {
      conversational: true,
      template: 'prep',
      emojiFrequency: 'moderate'
    },
    primaryInfo: {
      facts: '',
      feelings: ''
    },
    wordCount: 3000
  };
  
  return { ...defaults, ...userInputs };
};