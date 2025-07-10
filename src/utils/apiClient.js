// 強化されたAPI通信クライアント
export class APIClient {
  constructor(apiKey, provider = 'openai') {
    this.apiKey = apiKey;
    this.provider = provider;
    this.baseURL = this.getBaseURL(provider);
  }

  getBaseURL(provider) {
    switch (provider) {
      case 'openai': return 'https://api.openai.com/v1';
      case 'gemini': case 'gemini-pro': return 'https://generativelanguage.googleapis.com/v1beta';
      default: throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  getModel(provider) {
    switch (provider) {
      case 'openai': return 'gpt-4o';
      case 'gemini': return 'gemini-2.0-flash-exp';
      case 'gemini-pro': return 'gemini-1.5-pro-latest';
      default: return 'gpt-4o';
    }
  }

  // 記事生成API呼び出し（OpenAI & Gemini対応）
  async generateArticle(promptData) {
    try {
      console.log(`Sending to ${this.provider.toUpperCase()} API:`, promptData);
      if (this.provider === 'openai') {
        return await this.callOpenAI(promptData);
      } else if (this.provider === 'gemini' || this.provider === 'gemini-pro') {
        return await this.callGemini(promptData);
      } else {
        throw new Error(`Unsupported provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // 記事リライト機能
  async rewriteArticle(originalArticle, rewritePrompt, additionalInstructions = '') {
    const prompt = `以下の記事を、指定された方針に従ってリライトしてください。
原文: ${originalArticle}

リライト方針: ${rewritePrompt}
${additionalInstructions ? `追加指示:\n${additionalInstructions}` : ''}

リライト時の注意点:
- 元の記事の核となるメッセージは保持する
- 指定された方針に従って文体や内容を調整する
- 読みやすさと一貫性を保つ
- 文字数は元の記事と同程度に保つ

リライトした記事:`;
    
    const promptData = {
      system: "あなたは経験豊富な編集者です。与えられた記事を指定された方針に従って適切にリライトしてください。",
      user: prompt,
      temperature: 0.7,
      max_tokens: 4000
    };
    
    return await this.generateArticle(promptData);
  }

  // OpenAI API呼び出し（強化版）
  async callOpenAI(promptData) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.getModel('openai'),
        messages: [
          {role: 'system', content: promptData.system},
          {role: 'user', content: promptData.user}
        ],
        temperature: promptData.temperature || 0.7,
        max_tokens: promptData.max_tokens || 4000,
        top_p: promptData.top_p || 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        stop: null
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error Response:', errorData);
      throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response:', data);
    return data.choices[0].message.content;
  }

  // Gemini API呼び出し（2.0 Flash & 1.5 Pro対応）
  async callGemini(promptData) {
    const fullPrompt = `${promptData.system}\n\n${promptData.user}`;
    const model = this.getModel(this.provider);
    
    const response = await fetch(`${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{parts: [{text: fullPrompt}]}],
        generationConfig: {
          temperature: promptData.temperature || 0.7,
          maxOutputTokens: promptData.max_tokens || 4000,
          topP: promptData.top_p || 0.9,
          topK: 40
        },
        safetySettings: [
          {category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE"},
          {category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE"}
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error Response:', errorData);
      throw new Error(`Gemini API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected Gemini API response format');
    }
  }

  // API接続テスト
  async testConnection() {
    try {
      const testPrompt = {
        system: "簡潔に応答してください。",
        user: "「テスト」と返してください。",
        temperature: 0.1,
        max_tokens: 10
      };
      const result = await this.generateArticle(testPrompt);
      return {success: true, provider: this.provider, response: result};
    } catch (error) {
      return {success: false, provider: this.provider, error: error.message};
    }
  }
}

// API呼び出しのラッパー関数（強化版）
export const callOpenAI = async (apiKey, userInputs, provider = 'openai') => {
  try {
    console.log(`Starting ${provider.toUpperCase()} API call with inputs:`, userInputs);
    const client = new APIClient(apiKey, provider);
    
    // 接続テスト
    const connectionTest = await client.testConnection();
    if (!connectionTest.success) {
      console.warn('API connection test failed:', connectionTest.error);
      throw new Error('API接続に失敗しました。APIキーとプロバイダーを確認してください。');
    }

    const {PromptGenerator} = await import('./promptGenerator.js');
    
    // プロンプト生成の強化
    const generator = new PromptGenerator(userInputs);
    const promptData = generator.generateAPIPrompt();
    console.log('Generated prompt data:', promptData);
    console.log('Prompt validation:', generator.validatePrompt());
    
    // 記事生成
    const article = await client.generateArticle(promptData);
    console.log('Generated article length:', article.length);
    
    // 記事の品質チェック
    if (!article || article.length < 500) {
      throw new Error('生成された記事が短すぎます。設定を確認してください。');
    }

    return {
      article,
      provider,
      promptUsed: promptData.user
    };
  } catch (error) {
    console.error(`Error in ${provider} API call:`, error);
    throw error;
  }
};

// 記事リライト機能
export const rewriteArticle = async (apiKey, originalArticle, rewritePrompt, provider = 'openai', additionalInstructions = '') => {
  try {
    const client = new APIClient(apiKey, provider);
    return await client.rewriteArticle(originalArticle, rewritePrompt, additionalInstructions);
  } catch (error) {
    console.error('Rewrite error:', error);
    throw error;
  }
};

// プロバイダー選択のヘルパー
export const getAvailableProviders = () => {
  return [
    {value: 'openai', label: 'OpenAI GPT-4', models: ['gpt-4o'], description: '高品質で安定した出力'},
    {value: 'gemini', label: 'Google Gemini 2.0 Flash', models: ['gemini-2.0-flash-exp'], description: '高速で創造性豊かな文章生成'},
    {value: 'gemini-pro', label: 'Google Gemini 1.5 Pro', models: ['gemini-1.5-pro-latest'], description: '最新の高性能モデル'}
  ];
};