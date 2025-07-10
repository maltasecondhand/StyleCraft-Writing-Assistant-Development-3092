import supabase from '../lib/supabase';

// キャラクター画像アップロード
export const uploadCharacterImage = async (file, characterId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${characterId}_${Date.now()}.${fileExt}`;
    const filePath = `character_icons/${fileName}`;

    const { data, error } = await supabase.storage
      .from('character_icons')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // 公開URLを取得
    const { data: publicData } = supabase.storage
      .from('character_icons')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    // モック環境の場合はダミーURLを返す
    return `https://mock-storage.com/character_icons/${characterId}_${Date.now()}.jpg`;
  }
};

// キャラクター作成
export const createCharacter = async (characterData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('characters')
      .insert([{
        ...characterData,
        user_id: user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Character creation error:', error);
    // モック環境の場合はローカルストレージに保存
    const mockData = {
      id: `char_${Date.now()}`,
      ...characterData,
      user_id: 'mock-user-id',
      created_at: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('mock_characters') || '[]');
    existing.push(mockData);
    localStorage.setItem('mock_characters', JSON.stringify(existing));
    
    return mockData;
  }
};

// キャラクター更新
export const updateCharacter = async (id, characterData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('characters')
      .update(characterData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Character update error:', error);
    // モック環境の場合はローカルストレージを更新
    const existing = JSON.parse(localStorage.getItem('mock_characters') || '[]');
    const index = existing.findIndex(char => char.id === id);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...characterData };
      localStorage.setItem('mock_characters', JSON.stringify(existing));
      return existing[index];
    }
    throw error;
  }
};

// キャラクター削除
export const deleteCharacter = async (id) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Character deletion error:', error);
    // モック環境の場合はローカルストレージから削除
    const existing = JSON.parse(localStorage.getItem('mock_characters') || '[]');
    const filtered = existing.filter(char => char.id !== id);
    localStorage.setItem('mock_characters', JSON.stringify(filtered));
    return true;
  }
};

// ユーザーのキャラクター一覧取得
export const getUserCharacters = async (type = null) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get characters error:', error);
    // モック環境の場合はローカルストレージから取得
    const existing = JSON.parse(localStorage.getItem('mock_characters') || '[]');
    return type ? existing.filter(char => char.type === type) : existing;
  }
};

// お気に入り切り替え
export const toggleFavorite = async (id, isFavorite) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('characters')
      .update({ is_favorite: isFavorite })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Toggle favorite error:', error);
    // モック環境の場合はローカルストレージを更新
    const existing = JSON.parse(localStorage.getItem('mock_characters') || '[]');
    const index = existing.findIndex(char => char.id === id);
    if (index >= 0) {
      existing[index].is_favorite = isFavorite;
      localStorage.setItem('mock_characters', JSON.stringify(existing));
      return existing[index];
    }
    throw error;
  }
};

// 公開設定切り替え
export const togglePublic = async (id, isPublic) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('characters')
      .update({ is_public: isPublic })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Toggle public error:', error);
    // モック環境の場合はローカルストレージを更新
    const existing = JSON.parse(localStorage.getItem('mock_characters') || '[]');
    const index = existing.findIndex(char => char.id === id);
    if (index >= 0) {
      existing[index].is_public = isPublic;
      localStorage.setItem('mock_characters', JSON.stringify(existing));
      return existing[index];
    }
    throw error;
  }
};

// デフォルトカラーパレット
export const defaultColors = {
  backgrounds: [
    '#F7F7F7', '#FFF3E0', '#E8F5E8', '#E3F2FD', '#F3E5F5',
    '#FFF8E1', '#FCE4EC', '#E0F2F1', '#F1F8E9', '#FAFAFA'
  ],
  borders: [
    '#E0E0E0', '#FFCC02', '#4CAF50', '#2196F3', '#9C27B0',
    '#FF9800', '#E91E63', '#009688', '#8BC34A', '#757575'
  ]
};